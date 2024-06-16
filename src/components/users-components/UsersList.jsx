import editIcon from '../../assets/edit.svg'
import searchIcon from '../../assets/search.svg'
import closeIcon from '../../assets/close.svg'
import UserCard from './UserCard'
import UserInfo from '../user-components/UserInfo'
import { useContext, useEffect, useRef, useState } from 'react'
import { useUserStore } from '../../library/userStore'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import { db } from '../../library/firebase'
import { AddChatModalContext } from '../../context/add-chat-modal-context'
import { useChatStore } from '../../library/chatStore'

const UsersList = () => {
    const { toggleAddChatModal } = useContext(AddChatModalContext)
    const [inputText, setInputText] = useState('')
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    const openAddChatModal = () => {
        toggleAddChatModal()
    }

    const input = useRef(null)

    const clearInput = (e) => {
        input.current.value = ''
        setInputText('')
    }

    const [chats, setChats] = useState([])

    const { currentUser } = useUserStore()
    const { chatId } = useChatStore()

    useEffect(() => {
        const unSub = onSnapshot(
            doc(db, 'userchats', currentUser.id),
            async (res) => {
                const items = res.data().chats

                const promises = items.map(async (item) => {
                    const userDocRef = doc(db, 'users', item.receiverId)
                    const userDocSnap = await getDoc(userDocRef)

                    const user = userDocSnap.data()

                    return { ...item, user }
                })

                const chatData = await Promise.all(promises)

                setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt))
            }
        )

        const handleResize = () => {
            setWindowWidth(window.innerWidth)
        }

        window.addEventListener('resize', handleResize)

        return () => {
            unSub()
            window.removeEventListener('resize', handleResize)
        }
    }, [currentUser.id])

    const filteredChats = chats.filter((c) =>
        c.user.name.toLowerCase().includes(inputText.toLowerCase())
    )

    return (
        <div
            className={`flex flex-col min-[800px]:flex-[1] border-r-2 border-border h-screen bg-primary max-[900px]:max-w-[280px] max-[800px]:flex-none max-[800px]:min-w-[100%] ${
                windowWidth <= 800 ? chatId && 'hidden' : ''
            }`}
        >
            <div className='flex items-center justify-between px-6 py-6 border-b-2 border-border max-[1100px]:px-4 max-[900px]:py-4'>
                <h1 className='font-poppins font-medium text-2xl'>Messages</h1>
            </div>
            <UserInfo />
            <div className='flex items-center mr-6 py-6 max-[1100px]:mr-4 max-[900px]:py-5'>
                <div className='relative mx-6 w-[300px] max-[1260px]:w-full max-[1100px]:mx-4'>
                    <button className='absolute z-10 top-[50%] translate-y-[-50%] left-[10px] max-[900px]:hidden'>
                        <img src={searchIcon} alt='search' />
                    </button>
                    <button
                        className='absolute z-10 top-[50%] translate-y-[-50%] right-[10px] p-[4px] bg-transparent rounded-[10px] transition-all duration-200 hover:bg-primary'
                        onClick={clearInput}
                    >
                        <img src={closeIcon} alt='close' />
                    </button>
                    <input
                        className='outline-none border-none bg-dark-grey rounded-[10px] font-poppins font-normal text-base text-dark-white search-bar py-2.5 px-10 w-full max-[900px]:pl-5'
                        type='text'
                        placeholder='Search'
                        ref={input}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                </div>
                <button
                    className='font-light text-4xl text-plus-icon px-2 rounded-[10px] h-full bg-dark-grey flex items-center justify-center border-2 border-dark-grey transition-all duration-200 hover:bg-transparent'
                    onClick={openAddChatModal}
                >
                    <span>+</span>
                </button>
            </div>
            <div className='overflow-y-auto flex-1 max-[1260px]:w-[400px] max-[1200px]:w-[350px] max-[900px]:w-[250px] max-[800px]:w-full'>
                {filteredChats.map((chat) => (
                    <UserCard
                        key={chat.chatId}
                        name={chat.user.name}
                        lastMsg={chat.lastMessage}
                        chat={chat}
                        avatar={chat.user?.avatar}
                        chats={chats}
                    />
                ))}
                {filteredChats.length == 0 && chats.length != 0 ? (
                    <div className='text-center'>No chat found</div>
                ) : (
                    ''
                )}
                {chats.length === 0 && (
                    <div className='text-center'>
                        No Chats Yet! Add One :{')'}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UsersList
