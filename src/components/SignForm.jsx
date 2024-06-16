import { useContext, useState } from 'react'
import { FormContext } from '../context/form-context'
import { toast } from 'react-toastify'
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'
import { auth, db } from '../library/firebase'
import { doc, setDoc } from 'firebase/firestore'
import Loader from './Loader'
import { useUserStore } from '../library/userStore'

const SignForm = ({ signUp }) => {
    const { fetchUserInfo } = useUserStore()

    const [isLoading, setIsLoading] = useState(false)

    const { toggleSign } = useContext(FormContext)

    const handleSignUp = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.target)

        const { name, username, email, password, confirmPassword } =
            Object.fromEntries(formData)

        try {
            if (password === confirmPassword) {
                const res = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                )

                await setDoc(doc(db, 'users', res.user.uid), {
                    id: res.user.uid,
                    name,
                    username,
                    email,
                    password,
                    joinedAt: new Date(),
                    bio: '',
                })

                await setDoc(doc(db, 'userchats', res.user.uid), {
                    chats: [],
                })

                toggleSign()
                toast.success("You're Done!")
            } else {
                toast.warn('Passwords must be the same!')
            }
        } catch (error) {
            if (
                error.message ===
                'Firebase: Password should be at least 6 characters (auth/weak-password).'
            ) {
                toast.error('Password should be at least 6 characters')
            } else {
                toast.error(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleSigIn = async (e) => {
        e.preventDefault()
        setIsLoading(true)

        const formData = new FormData(e.target)

        const { email, password } = Object.fromEntries(formData)

        try {
            await signInWithEmailAndPassword(auth, email, password)

            toast.success("You're Logged In!")
        } catch (error) {
            if (
                error.message === 'Firebase: Error (auth/invalid-credential).'
            ) {
                toast.error('Something Invalid :(')
            } else {
                toast.error(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='flex items-center justify-center h-screen'>
                {signUp ? (
                    <form
                        className='border-2 border-border p-6 text-center rounded-[10px] flex flex-col items-center w-[900px] mx-4 max-[650px]:w-full'
                        onSubmit={handleSignUp}
                    >
                        <div>
                            <h3 className='font-medium text-4xl mb-4'>
                                Sign Up
                            </h3>
                            <div className='flex items-start mb-2'>
                                <div className='text-left flex-1'>
                                    <h4 className='sign-input__title'>
                                        <span className='text-blue'>*</span>Your
                                        Name:
                                    </h4>
                                    <input
                                        className='sign-input w-full'
                                        type='text'
                                        placeholder='First Name'
                                        name='name'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='flex max-[480px]:flex-col'>
                                <div className='mb-2'>
                                    <h4 className='sign-input__title text-left'>
                                        <span className='text-blue'>*</span>Your
                                        Username:
                                    </h4>
                                    <input
                                        className='sign-input'
                                        type='text'
                                        placeholder='Username'
                                        name='username'
                                        required
                                    />
                                </div>
                                <div className='mb-2 ml-2.5 max-[480px]:ml-0'>
                                    <h4 className='sign-input__title text-left'>
                                        <span className='text-blue'>*</span>Your
                                        Email:
                                    </h4>
                                    <input
                                        className='sign-input'
                                        type='email'
                                        placeholder='Email'
                                        name='email'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='flex max-[480px]:flex-col'>
                                <div className='mb-2'>
                                    <h4 className='sign-input__title text-left'>
                                        <span className='text-blue'>*</span>Your
                                        Password:
                                    </h4>
                                    <input
                                        className='sign-input'
                                        type='password'
                                        placeholder='Password'
                                        name='password'
                                        required
                                    />
                                </div>
                                <div className='mb-2 ml-2.5 max-[480px]:ml-0'>
                                    <h4 className='sign-input__title text-left'>
                                        <span className='text-blue'>*</span>
                                        Confirm Password:
                                    </h4>
                                    <input
                                        className='sign-input'
                                        type='password'
                                        placeholder='Confirm Password'
                                        name='confirmPassword'
                                        required
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col items-center mt-2'>
                                <button
                                    className='sign-button border-2 border-blue hover:border-2 hover:border-blue hover:bg-transparent hover:text-blue transition-all duration-200'
                                    type='send'
                                >
                                    Sign Up
                                </button>
                                <div
                                    className='cursor-pointer'
                                    onClick={toggleSign}
                                >
                                    Already have an account?{' '}
                                    <span className='text-blue'>Sign In</span>
                                </div>
                            </div>
                        </div>
                    </form>
                ) : (
                    <form
                        className='border-2 border-border p-6 text-center rounded-[10px] flex flex-col items-center w-[900px] mx-4 max-[650px]:w-full'
                        onSubmit={handleSigIn}
                    >
                        <div>
                            <h3 className='font-medium text-4xl mb-4'>
                                Sign In
                            </h3>

                            <div className='text-left mb-3'>
                                <h4 className='sign-input__title'>
                                    <span className='text-blue'>*</span>
                                    Email:
                                </h4>
                                <input
                                    className='sign-input'
                                    type='email'
                                    placeholder='Email'
                                    name='email'
                                    required
                                />
                            </div>

                            <div className=''>
                                <h4 className='sign-input__title text-left'>
                                    <span className='text-blue'>*</span>Your
                                    Password:
                                </h4>
                                <input
                                    className='sign-input w-full'
                                    type='password'
                                    placeholder='Password'
                                    name='password'
                                    required
                                />
                            </div>
                            <div className='flex flex-col items-center mt-4'>
                                <button
                                    className='sign-button border-2 border-blue hover:border-2 hover:border-blue hover:bg-transparent hover:text-blue transition-all duration-200'
                                    type='send'
                                >
                                    Sign In
                                </button>
                                <div
                                    className='cursor-pointer'
                                    onClick={toggleSign}
                                >
                                    Don't have an account?{' '}
                                    <span className='text-blue'>Sign Up</span>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </div>
            <Loader isLoading={isLoading} />
        </>
    )
}

export default SignForm
