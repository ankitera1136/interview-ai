import React, { useState, useEffect } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useParams } from 'react-router'
import Header from '../../common/Header.jsx'

// ── Nav Items ──────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
    {
        id: 'overview', label: 'Overview', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
        )
    },
    {
        id: 'technical', label: 'Technical Questions', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
        )
    },
    {
        id: 'behavioral', label: 'Behavioral Questions', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        )
    },
    {
        id: 'casestudy', label: 'Case Studies', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
        )
    },
    {
        id: 'roadmap', label: 'Road Map', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
        )
    },
    {
        id: 'tips', label: 'Interview Tips', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
        )
    },
    {
        id: 'salary', label: 'Salary Insights', icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
        )
    },
]

// ── Sub-components ─────────────────────────────────────────────────────────────

const difficultyColor = { easy: 'diff--easy', medium: 'diff--medium', hard: 'diff--hard' }

const QuestionCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='q-card'>
            <div className='q-card__header' onClick={() => setOpen(o => !o)}>
                <span className='q-card__index'>Q{index + 1}</span>
                <p className='q-card__question'>{item.question}</p>
                <div className='q-card__meta'>
                    {item.difficulty && (
                        <span className={`diff-badge ${difficultyColor[item.difficulty] || 'diff--medium'}`}>
                            {item.difficulty}
                        </span>
                    )}
                    <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                    </span>
                </div>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Intention</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <div className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>
                    <span className='roadmap-day__bullet' />
                    {task}
                </li>
            ))}
        </ul>
    </div>
)

const CaseStudyCard = ({ item, index }) => {
    const [open, setOpen] = useState(false)
    return (
        <div className='case-card'>
            <div className='case-card__header' onClick={() => setOpen(o => !o)}>
                <span className='case-card__index'>Case {index + 1}</span>
                <p className='case-card__scenario'>{item.scenario}</p>
                <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </div>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>What They Evaluate</span>
                        <p>{item.whatTheyEvaluate}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>Recommended Approach</span>
                        <p>{item.approach}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────
const Interview = () => {
    const [activeNav, setActiveNav] = useState('overview')
    const { report, getReportById, loading, getResumePdf } = useInterview()
    const { interviewId } = useParams()

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId)
        }
    }, [interviewId])


    if (loading || !report) {
        return (
            <main className='loading-screen'>
                <div className='loader-spinner' />
                <h2>Loading your interview plan...</h2>
            </main>
        )
    }

    const scoreColor =
        report.matchScore >= 80 ? 'score--high' :
            report.matchScore >= 60 ? 'score--mid' : 'score--low'

    const scoreLabel =
        report.matchScore >= 80 ? 'Strong match for this role' :
            report.matchScore >= 60 ? 'Good potential — keep preparing' : 'Needs focused preparation'


    return (
        <div className='interview-page'>
            <Header />
            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav'>
                    <div className="nav-content">
                        <p className='interview-nav__label'>Sections</p>
                        {NAV_ITEMS.map(item => (
                            <button
                                key={item.id}
                                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                                onClick={() => setActiveNav(item.id)}
                            >
                                <span className='interview-nav__icon'>{item.icon}</span>
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { getResumePdf(interviewId) }}
                        className='button primary-button' >
                        <svg height={"0.8rem"} style={{ marginRight: "0.8rem" }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10.6144 17.7956 11.492 15.7854C12.2731 13.9966 13.6789 12.5726 15.4325 11.7942L17.8482 10.7219C18.6162 10.381 18.6162 9.26368 17.8482 8.92277L15.5079 7.88394C13.7092 7.08552 12.2782 5.60881 11.5105 3.75894L10.6215 1.61673C10.2916.821765 9.19319.821767 8.8633 1.61673L7.97427 3.75892C7.20657 5.60881 5.77553 7.08552 3.97685 7.88394L1.63658 8.92277C.868537 9.26368.868536 10.381 1.63658 10.7219L4.0523 11.7942C5.80589 12.5726 7.21171 13.9966 7.99275 15.7854L8.8704 17.7956C9.20776 18.5682 10.277 18.5682 10.6144 17.7956ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899Z"></path></svg>
                        Download Resume
                    </button>
                </nav>

                <div className='interview-divider' />

                {/* ── Center Content ── */}
                <main className='interview-content'>

                    {/* OVERVIEW */}
                    {activeNav === 'overview' && (
                        <section>
                            <div className='content-header'>
                                <h2>Overview</h2>
                                <span className='content-header__count'>{report.title}{report.company && report.company !== 'the company' ? ` at ${report.company}` : ''}</span>
                            </div>

                            {/* Strengths & Weaknesses */}
                            <div className='sw-grid'>
                                {report.strengths?.length > 0 && (
                                    <div className='sw-card sw-card--strength'>
                                        <h3 className='sw-card__title'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                                            Your Strengths
                                        </h3>
                                        <ul>
                                            {report.strengths.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {report.weaknesses?.length > 0 && (
                                    <div className='sw-card sw-card--weakness'>
                                        <h3 className='sw-card__title'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                            Areas to Improve
                                        </h3>
                                        <ul>
                                            {report.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Skill Gaps */}
                            {report.skillGaps?.length > 0 && (
                                <div className='skill-gaps-section'>
                                    <h3 className='section-sub-title'>Skill Gaps &amp; Learning Resources</h3>
                                    <div className='skill-gap-list'>
                                        {report.skillGaps.map((gap, i) => (
                                            <div key={i} className={`skill-gap-item skill-gap-item--${gap.severity}`}>
                                                <div className='skill-gap-item__top'>
                                                    <span className='skill-gap-item__name'>{gap.skill}</span>
                                                    <span className={`skill-tag skill-tag--${gap.severity}`}>{gap.severity}</span>
                                                </div>
                                                {gap.resource && (
                                                    <p className='skill-gap-item__resource'>📚 {gap.resource}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>
                    )}

                    {/* TECHNICAL QUESTIONS */}
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{report.technicalQuestions?.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* BEHAVIORAL QUESTIONS */}
                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{report.behavioralQuestions?.length} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions?.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* CASE STUDIES */}
                    {activeNav === 'casestudy' && (
                        <section>
                            <div className='content-header'>
                                <h2>Case Studies &amp; Challenges</h2>
                                <span className='content-header__count'>{report.caseStudyQuestions?.length} scenarios</span>
                            </div>
                            <div className='q-list'>
                                {report.caseStudyQuestions?.map((item, i) => (
                                    <CaseStudyCard key={i} item={item} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* ROADMAP */}
                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{report.preparationPlan?.length}-day plan</span>
                            </div>
                            <div className='roadmap-list'>
                                {report.preparationPlan?.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* INTERVIEW TIPS */}
                    {activeNav === 'tips' && (
                        <section>
                            <div className='content-header'>
                                <h2>Interview Tips</h2>
                                <span className='content-header__count'>{report.interviewTips?.length} tips</span>
                            </div>
                            <div className='tips-list'>
                                {report.interviewTips?.map((tip, i) => (
                                    <div key={i} className='tip-card'>
                                        <span className='tip-card__num'>{i + 1}</span>
                                        <p>{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* SALARY INSIGHTS */}
                    {activeNav === 'salary' && report.salaryInsights && (
                        <section>
                            <div className='content-header'>
                                <h2>Salary &amp; Negotiation</h2>
                            </div>
                            <div className='salary-section'>
                                <div className='salary-range-card'>
                                    <p className='salary-range-card__label'>Expected Salary Range</p>
                                    <p className='salary-range-card__value'>{report.salaryInsights.expectedRange || 'N/A'}</p>
                                </div>
                                {report.salaryInsights.negotiationTips?.length > 0 && (
                                    <div className='tips-list'>
                                        <h3 className='section-sub-title'>Negotiation Tips</h3>
                                        {report.salaryInsights.negotiationTips.map((tip, i) => (
                                            <div key={i} className='tip-card'>
                                                <span className='tip-card__num'>{i + 1}</span>
                                                <p>{tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </section>
                    )}

                </main>

                <div className='interview-divider' />

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    {/* Match Score */}
                    <div className='match-score'>
                        <p className='match-score__label'>Match Score</p>
                        <div className={`match-score__ring ${scoreColor}`}>
                            <span className='match-score__value'>{report.matchScore}</span>
                            <span className='match-score__pct'>%</span>
                        </div>
                        <p className='match-score__sub'>{scoreLabel}</p>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Quick stats */}
                    <div className='sidebar-stats'>
                        <div className='stat-item'>
                            <span className='stat-item__val'>{report.technicalQuestions?.length ?? 0}</span>
                            <span className='stat-item__label'>Technical Qs</span>
                        </div>
                        <div className='stat-item'>
                            <span className='stat-item__val'>{report.behavioralQuestions?.length ?? 0}</span>
                            <span className='stat-item__label'>Behavioral Qs</span>
                        </div>
                        <div className='stat-item'>
                            <span className='stat-item__val'>{report.preparationPlan?.length ?? 0}</span>
                            <span className='stat-item__label'>Day Plan</span>
                        </div>
                        <div className='stat-item'>
                            <span className='stat-item__val'>{report.skillGaps?.length ?? 0}</span>
                            <span className='stat-item__label'>Skill Gaps</span>
                        </div>
                    </div>

                    <div className='sidebar-divider' />

                    {/* Skill Gaps summary */}
                    <div className='skill-gaps'>
                        <p className='skill-gaps__label'>Skill Gaps</p>
                        <div className='skill-gaps__list'>
                            {report.skillGaps?.map((gap, i) => (
                                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                                    {gap.skill}
                                </span>
                            ))}
                        </div>
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview