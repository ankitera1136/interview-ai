const asyncHandler = require("../utils/asyncHandler")
const pdfParse = require("pdf-parse")
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service")
const interviewReportModel = require("../models/interviewReport.model")


/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
const generateInterViewReportController = asyncHandler(async (req, res) => {

    let resumeText = ""
    if (req.file && req.file.buffer) {
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
        resumeText = resumeContent.text
    }

    const { selfDescription, jobDescription } = req.body

    if (!jobDescription) {
        return res.status(400).json({ message: "Job description is required." })
    }

    if (!resumeText && !selfDescription) {
        return res.status(400).json({ message: "Please provide either a resume or a self description." })
    }

    const interViewReportByAi = await generateInterviewReport({
        resume: resumeText,
        selfDescription,
        jobDescription
    })

    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeText,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
    })

    res.status(201).json({
        message: "Interview report generated successfully.",
        interviewReport
    })
})

/**
 * @description Controller to get interview report by interviewId.
 */
const getInterviewReportByIdController = asyncHandler(async (req, res) => {

    const { interviewId } = req.params

    const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    res.status(200).json({
        message: "Interview report fetched successfully.",
        interviewReport
    })
})


/**
 * @description Controller to get all interview reports of logged in user.
 */
const getAllInterviewReportsController = asyncHandler(async (req, res) => {
    const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")

    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
})


/**
 * @description Controller to generate resume PDF based on user self description, resume content and job description.
 * Ownership check: only the report's owner can generate the PDF.
 */
const generateResumePdfController = asyncHandler(async (req, res) => {
    const { interviewReportId } = req.params

    // Fixed: check ownership (user: req.user.id) to prevent unauthorized access
    const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({
            message: "Interview report not found."
        })
    }

    const { resume, jobDescription, selfDescription } = interviewReport

    const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription })

    res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
    })

    res.send(pdfBuffer)
})

module.exports = { generateInterViewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController }