import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe } from "../services/auth.api";
import { useToast } from "../../common/Toast";


export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context
    const { addToast } = useToast()


    /**
     * Returns true on success, false on failure.
     * Caller can use this to decide whether to navigate.
     */
    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data && data.user) {
                setUser(data.user)
                return true
            }
            addToast("Login failed. Please check your credentials.", "error")
            return false
        } catch (err) {
            const msg = err?.response?.data?.message || "Login failed. Please try again."
            addToast(msg, "error")
            return false
        } finally {
            setLoading(false)
        }
    }

    /**
     * Returns true on success, false on failure.
     */
    const handleRegister = async ({ username, email, password }) => {
        setLoading(true)
        try {
            const data = await register({ username, email, password })
            if (data && data.user) {
                setUser(data.user)
                return true
            }
            addToast("Registration failed. Please try again.", "error")
            return false
        } catch (err) {
            const msg = err?.response?.data?.message || "Registration failed. Please try again."
            addToast(msg, "error")
            return false
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            addToast("Logout failed. Please try again.", "error")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {

        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data && data.user) {
                    setUser(data.user)
                }
            } catch (err) {
                // silently fail — user is just not logged in
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()

    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}