import React from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../auth/hooks/useAuth'
import './header.scss'

const Header = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <header className='app-header'>
            <div className='app-header__brand' onClick={() => navigate('/')}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                </svg>
                <span>InterviewAI</span>
            </div>
            <div className='app-header__actions'>
                {user && (
                    <>
                        <span className='app-header__username'>👋 {user.username}</span>
                        <button className='app-header__logout' onClick={onLogout}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}

export default Header
