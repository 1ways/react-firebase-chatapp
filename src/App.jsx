import ChatPage from './pages/ChatPage'
import SignForm from './components/SignForm'
import { useEffect, useState } from 'react'
import { FormContext } from './context/form-context'
import Notification from './components/Notification'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './library/firebase'
import { useUserStore } from './library/userStore'
import Loader from './components/Loader'

const App = () => {
    const { currentUser, isLoading, fetchUserInfo } = useUserStore()

    const [isLogged, setIsLogged] = useState(false)

    const [isSignUp, setIsSignUp] = useState(true)

    const toggleSign = () => {
        setIsSignUp(!isSignUp)
    }

    const toggleLogged = () => {
        setIsLogged(!isLogged)
    }

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, (user) => {
            fetchUserInfo(user?.uid)
        })

        return () => {
            unSub()
        }
    }, [fetchUserInfo])

    return (
        <FormContext.Provider value={{ toggleSign, isLogged, toggleLogged }}>
            {currentUser ? <ChatPage /> : <SignForm signUp={isSignUp} />}
            <Notification />
            <Loader isLoading={isLoading} />
        </FormContext.Provider>
    )
}

export default App
