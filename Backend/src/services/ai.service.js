const Groq = require("groq-sdk")
const { zodToJsonSchema } = require("zod-to-json-schema")
const { z } = require("zod")
const puppeteer = require("puppeteer")

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
})

// llama-4-scout supports json_schema (best-effort) on Groq free tier
const REPORT_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"
const RESUME_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"


// ─── Expanded Interview Report Schema ────────────────────────────────────────

const questionSchema = z.object({
    question: z.string(),
    intention: z.string(),
    answer: z.string(),
    difficulty: z.enum(["easy", "medium", "hard"])
})

const interviewReportSchema = z.object({
    title: z.string(),
    company: z.string(),
    matchScore: z.number(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    skillGaps: z.array(z.object({
        skill: z.string(),
        severity: z.enum(["low", "medium", "high"]),
        resource: z.string()
    })),
    technicalQuestions: z.array(questionSchema),
    behavioralQuestions: z.array(questionSchema),
    caseStudyQuestions: z.array(z.object({
        scenario: z.string(),
        whatTheyEvaluate: z.string(),
        approach: z.string()
    })),
    preparationPlan: z.array(z.object({
        day: z.number(),
        focus: z.string(),
        tasks: z.array(z.string())
    })),
    interviewTips: z.array(z.string()),
    salaryInsights: z.object({
        expectedRange: z.string(),
        negotiationTips: z.array(z.string())
    })
})


// ─── Interview Report Generator ───────────────────────────────────────────────

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const systemPrompt = `You are an elite career coach and senior technical interviewer with 15+ years of experience at FAANG companies. You always respond with valid JSON matching the exact schema provided.`

    const userPrompt = `Generate a COMPREHENSIVE, DEEPLY DETAILED interview preparation report for the following candidate.

Job Description:
${jobDescription}

Candidate Background:
${resume ? `Resume:\n${resume}` : ""}
${selfDescription ? `Self Description:\n${selfDescription}` : ""}

REQUIREMENTS:
- title: exact job title
- company: company name from JD or "the company"
- matchScore: 0–100 integer
- strengths: 4–6 specific strengths relevant to this role
- weaknesses: 3–5 specific areas to improve
- skillGaps: 5–8 gaps, each with skill, severity (low/medium/high), and a specific resource (book title, course, website)
- technicalQuestions: EXACTLY 12 questions, mix of easy/medium/hard, each with question, intention, detailed answer (3+ sentences), difficulty
- behavioralQuestions: EXACTLY 10 questions using STAR method themes, each with question, intention, detailed answer, difficulty
- caseStudyQuestions: 3–5 role-specific scenarios, each with scenario, whatTheyEvaluate, approach
- preparationPlan: 14 days, each day with day number, focus theme, and 3–5 specific tasks
- interviewTips: 6–8 role-specific actionable tips
- salaryInsights: expectedRange in Indian Rupees INR (e.g. "₹12L–₹18L per annum for mid-level in Bangalore" or "₹8L–₹12L CTC for junior in Mumbai"), negotiationTips (3–4 tips)

Be specific to this exact role. No generic advice.`

    const response = await groq.chat.completions.create({
        model: REPORT_MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "interview_report",
                schema: zodToJsonSchema(interviewReportSchema, { target: "openApi3" })
            }
        },
        temperature: 0.7,
        max_completion_tokens: 8000
    })

    const text = response.choices[0].message.content
    return JSON.parse(text)
}


// ─── Puppeteer PDF Generation ─────────────────────────────────────────────────

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--single-process",
            "--no-zygote"
        ]
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" })
    await new Promise(resolve => setTimeout(resolve, 500))

    const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "15mm",
            bottom: "15mm",
            left: "15mm",
            right: "15mm"
        }
    })

    await browser.close()
    return pdfBuffer
}


// ─── Resume PDF Generator ─────────────────────────────────────────────────────

async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const systemPrompt = `You are an expert resume writer. You always respond with valid JSON containing a single "html" field with a complete, self-contained HTML resume document.`

    const userPrompt = `Generate a COMPLETE, BEAUTIFULLY FORMATTED, ATS-FRIENDLY resume as a self-contained HTML document.

Candidate Details:
${resume ? `Existing Resume Content:\n${resume}` : ""}
${selfDescription ? `Self Description:\n${selfDescription}` : ""}

Target Job Description:
${jobDescription}

STRICT REQUIREMENTS:
1. Return JSON with a single field: { "html": "..." }
2. The HTML must be 100% self-contained — ALL CSS inside a <style> tag in <head>
3. Do NOT use any external URLs, CDN links, Google Fonts, or @import rules
4. Use only web-safe fonts: Arial, Helvetica, Georgia, 'Times New Roman'
5. Clean, modern, professional design with subtle colors and clear hierarchy
6. ATS-friendly: standard section names (Summary, Experience, Education, Skills, Projects)
7. Tailor content to the job description — highlight the most relevant experience
8. Aim for 1–2 A4 pages when printed
9. Human-written tone, not AI-sounding
10. All text must be selectable plain text`

    const resumePdfSchema = z.object({
        html: z.string()
    })

    const response = await groq.chat.completions.create({
        model: RESUME_MODEL,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        response_format: {
            type: "json_schema",
            json_schema: {
                name: "resume_html",
                schema: zodToJsonSchema(resumePdfSchema, { target: "openApi3" })
            }
        },
        temperature: 0.6,
        max_completion_tokens: 6000
    })

    const text = response.choices[0].message.content
    const jsonContent = JSON.parse(text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)

    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }