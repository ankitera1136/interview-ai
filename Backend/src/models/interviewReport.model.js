const mongoose = require('mongoose');


const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    intention: { type: String, required: true },
    answer: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" }
}, { _id: false })

const skillGapSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    severity: { type: String, enum: ["low", "medium", "high"], required: true },
    resource: { type: String, default: "" }
}, { _id: false })

const preparationPlanSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    focus: { type: String, required: true },
    tasks: [{ type: String, required: true }]
}, { _id: false })

const caseStudySchema = new mongoose.Schema({
    scenario: { type: String, required: true },
    whatTheyEvaluate: { type: String, required: true },
    approach: { type: String, required: true }
}, { _id: false })

const interviewReportSchema = new mongoose.Schema({
    jobDescription: { type: String, required: true },
    resume: { type: String },
    selfDescription: { type: String },
    title: { type: String, required: true },
    company: { type: String, default: "the company" },
    matchScore: { type: Number, min: 0, max: 100 },

    strengths: [{ type: String }],
    weaknesses: [{ type: String }],

    technicalQuestions: [questionSchema],
    behavioralQuestions: [questionSchema],
    caseStudyQuestions: [caseStudySchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],

    interviewTips: [{ type: String }],

    salaryInsights: {
        expectedRange: { type: String, default: "" },
        negotiationTips: [{ type: String }]
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" }
}, {
    timestamps: true
})


const interviewReportModel = mongoose.model("InterviewReport", interviewReportSchema);

module.exports = interviewReportModel;