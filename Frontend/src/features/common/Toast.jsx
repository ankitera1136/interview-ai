import React, { createContext, useContext, useState, useCallback } from 'react'
import './toast.scss'

const ToastContext = createContext(null)

let toastId = 0

export const ToastProvider = ({ children }) => {
    const [ toasts, setToasts ] = useState([])

    const addToast = useCallback((message, type = 'error') => {
        const id = ++toastId
        setToasts(prev => [ ...prev, { id, message, type } ])
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    const removeToast = (id) => setToasts(prev => prev.filter(t => t.id !== id))

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className='toast-container'>
                {toasts.map(toast => (
                    <div key={toast.id} className={`toast toast--${toast.type}`}>
                        <span className='toast__icon'>
                            {toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ'}
                        </span>
                        <p className='toast__message'>{toast.message}</p>
                        <button className='toast__close' onClick={() => removeToast(toast.id)}>✕</button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}
