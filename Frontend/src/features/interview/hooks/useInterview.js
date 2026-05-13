import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api"
import { useContext } from "react"
import { InterviewContext } from "../interview.context"
import { useToast } from "../../common/Toast"


export const useInterview = () => {

    const context = useContext(InterviewContext)

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider")
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context
    const { addToast } = useToast()

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true)
        let result = null
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile })
            if (response && response.interviewReport) {
                result = response.interviewReport
                setReport(result)
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to generate report. Please try again."
            addToast(msg, "error")
        } finally {
            setLoading(false)
        }
        return result
    }

    const getReportById = async (interviewId) => {
        setLoading(true)
        setReport(null) // clear stale report immediately (fix #15)
        let result = null
        try {
            const response = await getInterviewReportById(interviewId)
            if (response && response.interviewReport) {
                result = response.interviewReport
                setReport(result)
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to load interview report."
            addToast(msg, "error")
        } finally {
            setLoading(false)
        }
        return result
    }

    const getReports = async () => {
        setLoading(true)
        let result = null
        try {
            const response = await getAllInterviewReports()
            if (response && response.interviewReports) {
                result = response.interviewReports
                setReports(result)
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Failed to load your reports."
            addToast(msg, "error")
        } finally {
            setLoading(false)
        }
        return result
    }

    const getResumePdf = async (interviewReportId) => {
        setLoading(true)
        try {
            const response = await generateResumePdf({ interviewReportId })
            const url = window.URL.createObjectURL(new Blob([ response ], { type: "application/pdf" }))
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", `resume_${interviewReportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            addToast("Resume PDF downloaded!", "success")
        } catch (error) {
            addToast("Failed to generate resume PDF.", "error")
        } finally {
            setLoading(false)
        }
    }

    // NOTE: Data fetching useEffect has been REMOVED from this hook (#14).
    // Each page is responsible for fetching its own data to avoid double calls.

    return { loading, report, reports, generateReport, getReportById, getReports, getResumePdf }
}