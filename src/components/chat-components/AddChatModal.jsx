import { useContext, useRef, useState } from 'react'
import { AddChatModalContext } from '../../context/add-chat-modal-context'
import closeIcon from '../../assets/close.svg'
import { db } from '../../library/firebase'
import {
    collection,
    query,
    where,
    getDocs,
    serverTimestamp,
    doc,
    setDoc,
    updateDoc,
    arrayUnion,
    getDoc,
} from 'firebase/firestore'
import avatarIcon from '../../assets/defaultProfilePicture.svg'
import { useUserStore } from '../../library/userStore'

const AddChatModal = () => {
    const [user, setUser] = useState(null)
    const { currentUser } = useUserStore()

    const { isAddChatModalOpen, toggleAddChatModal } =
        useContext(AddChatModalContext)

    const handleClose = (e) => {
        e.preventDefault()
        searchInput.current.value = ''
        toggleAddChatModal()
        setUser(null)
        if (notFoundText.current) {
            notFoundText.current.textContent = ''
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch(e)
        }
    }

    const searchInput = useRef()
    const notFoundText = useRef()

    const handleSearch = async (e) => {
        e.preventDefault()
        const formData = new FormData(e.target.form || e.target)
        const username = formData.get('name')

        if (username != '') {
            if (username != currentUser.name) {
                setUser(null)

                try {
                    const userRef = collection(db, 'users')

                    const q = query(userRef, where('name', '==', username))

                    const querySnapShot = await getDocs(q)

                    if (!querySnapShot.empty) {
                        notFoundText.current.textContent = ''
                        setUser(querySnapShot.docs[0].data())
                    } else {
                        notFoundText.current.textContent = 'No User found :/'
                    }
                } catch (error) {
                    console.log(error)
                }
            } else {
                notFoundText.current.textContent = "You Can't Add Yourself :)"
            }
        }
    }

    const handleAdd = async (e) => {
        const chatRef = collection(db, 'chats')
        const userChatsRef = collection(db, 'userchats')

        try {
            const userChatDoc = doc(userChatsRef, currentUser.id)
            const userChatSnap = await getDoc(userChatDoc)

            let chatExists = false
            if (userChatSnap.exists()) {
                const userChats = userChatSnap.data().chats || []
                chatExists = userChats.some(
                    (chat) => chat.receiverId === user.id
                )
            }

            if (chatExists) {
                notFoundText.current.textContent = 'Chat already exists.'
                setUser(null)
                return
            }

            const newChatRef = doc(chatRef)

            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            })

            await updateDoc(doc(userChatsRef, user.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                    isSeen: true,
                }),
            })

            await updateDoc(doc(userChatsRef, currentUser.id), {
                chats: arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage: '',
                    receiverId: user.id,
                    updatedAt: Date.now(),
                    isSeen: true,
                }),
            })
        } catch (error) {
            console.log(error)
        } finally {
            setUser(null)
            console.log(123)
        }
    }

    return (
        <div
            className={`z-50 absolute top-0 left-0 w-full h-screen bg-black/25 backdrop-blur-md transition-all duration-300 ${
                isAddChatModalOpen
                    ? 'pointer-events-auto opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
            }`}
        >
            <div
                className={`absolute bg-primary border-2 border-border rounded-[10px] z-50 top-[50%] left-[50%] translate-x-[-50%] shadow-2xl p-6 transition-all duration-300 w-[500px] max-[800px]:w-[400px] max-[420px]:w-[290px] ${
                    isAddChatModalOpen
                        ? 'translate-y-[-50%]'
                        : 'translate-y-[-60%]'
                }`}
            >
                <form onSubmit={handleSearch} onKeyDown={handleKeyDown}>
                    <div className='flex justify-end'>
                        <button onClick={handleClose}>
                            <img
                                className='rounded-full'
                                src={closeIcon}
                                alt='close'
                            />
                        </button>
                    </div>
                    <div className='text-center font-medium mb-4 mt-4 text-2xl border-b-2 border-border pb-4'>
                        <h4>Search for a User :{')'}</h4>
                    </div>
                    <div className=''>
                        <div className='flex justify-center max-[800px]:flex-col'>
                            <input
                                ref={searchInput}
                                className='mr-4 flex-1 font-poppins font-normal text-xl text-white bg-dark-grey outline-none rounded-[10px] py-1 px-4 border-2 border-border placeholder:font-normal placeholder:text-xl placeholder:text-white max-[800px]:mr-0 max-[800px]:mb-3'
                                type='text'
                                placeholder='Type a User Name'
                                name='name'
                            />
                            <button
                                className='mb-0 sign-button border-2 border-blue hover:border-2 hover:border-blue hover:bg-transparent hover:text-blue transition-all duration-200'
                                type='send'
                            >
                                Search
                            </button>
                        </div>
                        <div>
                            {user ? (
                                <div className='flex items-center mt-5 justify-between'>
                                    <div className='flex items-center'>
                                        <div className='w-[50px] h-[50px] mr-2'>
                                            <img
                                                className='rounded-full object-cover w-[50px] h-[50px]'
                                                src={user.avatar || avatarIcon}
                                                alt='avatar'
                                            />
                                        </div>
                                        <p className='w-[100px] whitespace-nowrap overflow-hidden text-ellipsis'>
                                            {user.name}
                                        </p>
                                    </div>
                                    <button
                                        className='mb-0 px-2 sign-button border-2 border-blue hover:border-2 hover:border-blue hover:bg-transparent hover:text-blue transition-all duration-200'
                                        onClick={handleAdd}
                                    >
                                        Add
                                    </button>
                                </div>
                            ) : (
                                <p
                                    ref={notFoundText}
                                    className='text-center mt-4'
                                ></p>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddChatModal
