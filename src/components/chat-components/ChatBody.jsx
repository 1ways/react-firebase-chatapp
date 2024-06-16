import { useEffect, useRef, useState, useContext } from 'react'
import MessageTemplate from './MessageTemplate'
import { useChatStore } from '../../library/chatStore'
import { database, db } from '../../library/firebase'
import {
    doc,
    onSnapshot,
    arrayUnion,
    getDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore'
import { useUserStore } from '../../library/userStore'
import infoIcon from '../../assets/info.svg'
import trashIcon from '../../assets/trash.svg'
import { UserInfoContext } from '../../context/user-info-context'
import avatar from '../../assets/defaultProfilePicture.svg'
import sendArrow from '../../assets/send.svg'
import pictureIcon from '../../assets/picture.svg'
import emojiIcon from '../../assets/emoji.svg'
import EmojiPicker from 'emoji-picker-react'
import upload from '../../library/upload'
import useUserPresence from '../../hooks/useUserPresence'
import { child, get, onDisconnect, onValue, ref, set } from 'firebase/database'
import { ImagePreview } from './ImagePreview'
import { usePreviewStore } from '../../library/previewStore'
import arrowLeft from '../../assets/arrow-left.svg'

const ChatBody = () => {
    const { chatId, user, setChatId } = useChatStore()
    const endRef = useRef(null)
    const chatContainerRef = useRef(null)
    const [chat, setChat] = useState()
    const { currentUser } = useUserStore()
    const { toggleInfo } = useContext(UserInfoContext)
    const [openEmoji, setOpenEmoji] = useState(false)
    const [inputText, setInputText] = useState('')
    const [loading, setLoading] = useState(true)
    const [dots, setDots] = useState('')
    const { isInfoOpen } = useContext(UserInfoContext)
    const [userStatus, setUserStatus] = useState('offline')
    const { setIsPreview, setImgURL, setImgFile } = usePreviewStore()
    const [img, setImg] = useState(null)

    useUserPresence()

    useEffect(() => {
        const unSub = onSnapshot(doc(db, 'chats', chatId), (res) => {
            setChat(res.data())
            setLoading(false)
        })

        if (loading) {
            const interval = setInterval(() => {
                setDots((prev) => {
                    if (prev.length < 3) return prev + '.'
                    return ''
                })
            }, 500)

            return () => clearInterval(interval)
        }

        return () => {
            unSub()
        }
    }, [chatId])

    useEffect(() => {
        if (!loading) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [chat, loading])

    useEffect(() => {
        const observer = new MutationObserver(() => {
            endRef.current?.scrollIntoView({ behavior: 'smooth' })
        })

        const config = { childList: true, subtree: true }

        if (chatContainerRef.current) {
            observer.observe(chatContainerRef.current, config)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const images = chatContainerRef.current?.querySelectorAll('img')

        const handleImageLoad = () => {
            endRef.current?.scrollIntoView({ behavior: 'smooth' })
        }

        images?.forEach((img) => {
            img.addEventListener('load', handleImageLoad)
        })

        return () => {
            images?.forEach((img) => {
                img.removeEventListener('load', handleImageLoad)
            })
        }
    }, [chat])

    useEffect(() => {
        if (user?.id) {
            const userStatusRef = ref(database, `/status/${user.id}`)
            onValue(userStatusRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    setUserStatus(data.state)
                }
            })
        }
    }, [user])

    const deleteChatHandle = async (e) => {
        const chatsRef = doc(db, 'chats', chatId)
        const currentUserChatsRef = doc(db, 'userchats', currentUser.id)
        const userChatsRef = doc(db, 'userchats', user.id)
        try {
            const currentUserChatsRefSnapshot = await getDoc(
                currentUserChatsRef
            )
            if (currentUserChatsRefSnapshot.exists()) {
                const currentUserChatsData = currentUserChatsRefSnapshot.data()
                const updatedCurrentUserChats =
                    currentUserChatsData.chats.filter(
                        (chat) => chat.chatId !== chatId
                    )

                await updateDoc(currentUserChatsRef, {
                    chats: updatedCurrentUserChats,
                })
            }

            const userChatsRefSnapshot = await getDoc(userChatsRef)
            if (userChatsRefSnapshot.exists()) {
                const userChatsData = userChatsRefSnapshot.data()
                const updatedUserChatsData = userChatsData.chats.filter(
                    (chat) => chat.chatId !== chatId
                )

                await updateDoc(userChatsRef, {
                    chats: updatedUserChatsData,
                })
            }

            isInfoOpen && toggleInfo()
            setChatId(null)
            console.log(chatId)
            await deleteDoc(chatsRef)
        } catch (error) {
            console.log(error)
        }
    }

    const handleEmoji = (e) => {
        setInputText((prev) => prev + e.emoji)
    }

    const handleImg = (e) => {
        setIsPreview(true)
        if (e.target.files[0]) {
            setImgURL(URL.createObjectURL(e.target.files[0]))
            setImgFile(e.target.files[0])
        }
        e.target.value = null
    }

    const handleEmojiIconClick = (e) => {
        e.stopPropagation()
        if (e.currentTarget.id === 'emoji-btn') {
            setOpenEmoji((prev) => !prev)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSend()
        }
    }

    const handleClose = (e) => {
        setChatId(null)
    }

    const handleSend = async () => {
        if (inputText === '') return

        try {
            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    inputText,
                    createdAt: new Date(),
                }),
            })

            const userIds = [currentUser.id, user.id]

            userIds.forEach(async (id) => {
                const userChatsRef = doc(db, 'userchats', id)
                const userChatsSnapshot = await getDoc(userChatsRef)

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    )

                    userChatsData.chats[chatIndex].lastMessage = inputText
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            })
        } catch (error) {
            console.log(error)
        }

        setInputText('')
        setImg({
            file: null,
            url: '',
        })
    }

    return (
        <>
            {loading ? (
                <div className='h-screen flex justify-center items-center'>
                    <p className='font-medium text-2xl'>Loading{dots}</p>
                </div>
            ) : (
                <>
                    <div className='border-b-2 border-border bg-primary pt-4 px-8 flex justify-between items-start max-[1100px]:px-4 max-[900px]:pt-0 max-[900px]:items-center max-[800px]:pl-1 max-[390px]:px-2'>
                        <div className='flex items-center'>
                            <div className='min-[800px]:hidden flex items-center'>
                                <button onClick={handleClose}>
                                    <img
                                        className='w-[35px]'
                                        src={arrowLeft}
                                        alt='arrow-left'
                                    />
                                </button>
                            </div>
                            <div className='relative mr-4 w-[50px] h-[50px]'>
                                <img
                                    className='rounded-full object-cover w-[50px] h-[50px]'
                                    src={user.avatar || avatar}
                                    alt='avatar'
                                />
                            </div>
                            <div>
                                <h4 className='font-poppins font-medium text-[17px] w-[400px] whitespace-nowrap overflow-hidden text-ellipsis max-[1200px]:w-[200px] max-[420px]:w-[100px]'>
                                    {user.name}
                                </h4>
                                <p className='font-poppins font-normal text-[15px] text-dark-white'>
                                    {userStatus.charAt(0).toUpperCase() +
                                        userStatus.slice(1)}
                                </p>
                            </div>
                        </div>
                        <div className='relative pb-[14px] dropdown-container max-[900px]:pt-[7px] max-[900px]:pb-[7px]'>
                            <div className='rounded-full w-[50px] h-[50px] bg-primary-bg border-2 border-border flex flex-col items-center justify-center cursor-pointer'>
                                <div className='w-[6px] h-[6px] bg-white rounded-full mb-[3px]'></div>
                                <div className='w-[6px] h-[6px] bg-white rounded-full mb-[3px]'></div>
                                <div className='w-[6px] h-[6px] bg-white rounded-full'></div>
                            </div>
                            <div className='bg-dark-grey py-3 px-3 rounded-[10px] absolute w-[125px] top-[60px] right-0 opacity-0 invisible pointer-events-none dropdown-body transition-all duration-200 translate-y-[-10%]'>
                                <div
                                    className='flex items-center cursor-pointer rounded-[10px] p-2 bg-transparent transition-all duration-200 hover:bg-neutral-700'
                                    onClick={toggleInfo}
                                >
                                    <img
                                        className='mr-2'
                                        src={infoIcon}
                                        alt='info'
                                    />
                                    <h4 className='font-poppins font-light text-base'>
                                        Info
                                    </h4>
                                </div>
                                <div
                                    className='flex items-center cursor-pointer rounded-[10px] p-2 bg-transparent transition-all duration-200 hover:bg-neutral-700'
                                    onClick={deleteChatHandle}
                                >
                                    <img
                                        className='mr-2'
                                        src={trashIcon}
                                        alt='trash'
                                    />
                                    <h4 className='font-poppins font-light text-base'>
                                        Delete
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className='flex flex-col flex-1 overflow-y-auto pt-8 pb-1 px-8 max-[1100px]:pt-4 max-[1100px]:px-4 max-[390px]:px-2'
                        ref={chatContainerRef}
                    >
                        {chat?.messages?.map((message, index) => (
                            <MessageTemplate
                                own={message.senderId === currentUser.id}
                                other={message.senderId != currentUser.id}
                                key={message?.createdAt}
                                textMsg={message.inputText}
                                time={message.createdAt}
                                img={message.img}
                            >
                                <div>
                                    {message.img && (
                                        <img
                                            className='rounded-[10px] max-[1100px]:max-w-[220px]'
                                            src={message.img}
                                            alt='chat-img'
                                        />
                                    )}
                                    <p
                                        className={`${
                                            message.img && 'mt-2 px-4'
                                        }`}
                                    >
                                        {message.inputText}
                                    </p>
                                    {chat.messages.length - 1 === index && (
                                        <div ref={endRef}></div>
                                    )}
                                </div>
                            </MessageTemplate>
                        ))}
                        {chat?.messages?.length === 0 && (
                            <div className='h-full flex items-center justify-center'>
                                Start a conversation ;{')'}
                            </div>
                        )}
                    </div>
                    <div className='px-8 py-4 flex items-center justify-center bg-primary border-t-2 border-border max-[1100px]:px-4 max-[390px]:px-2'>
                        <div className='flex items-center relative'>
                            <div className='w-[30px] mr-2'>
                                <label
                                    className='cursor-pointer'
                                    htmlFor='file'
                                >
                                    <img
                                        className='object-cover'
                                        src={pictureIcon}
                                        alt='picture'
                                    />
                                </label>
                                <input
                                    className='hidden'
                                    type='file'
                                    id='file'
                                    onChange={handleImg}
                                />
                            </div>
                            <div
                                className='w-[30px] mr-2 cursor-pointer'
                                onClick={handleEmojiIconClick}
                                id='emoji-btn'
                            >
                                <img
                                    className='object-cover'
                                    src={emojiIcon}
                                    alt='emoji'
                                />
                            </div>
                            <div
                                className={`absolute top-[-475px] left-[40px] transition-all duration-200 max-[600px]:w-[100px] ${
                                    openEmoji
                                        ? 'translate-y-0 opacity-100'
                                        : 'translate-y-[10%] opacity-0'
                                }`}
                            >
                                <EmojiPicker
                                    open={openEmoji}
                                    onEmojiClick={handleEmoji}
                                    emojiStyle={'apple'}
                                    width={270}
                                />
                            </div>
                        </div>
                        <input
                            className='flex-1 bg-primary-bg rounded-[10px] px-4 py-3 font-poppins font-normal text-[15px] text-dark-white outline-none placeholder:font-normal placeholder:text-[15px] placeholder:text-dark-white'
                            type='text'
                            placeholder='Write a message...'
                            onChange={(e) => setInputText(e.target.value)}
                            value={inputText}
                            onKeyDown={handleKeyDown}
                        />
                        <button
                            className='ml-4 rounded-[10px] w-[45px] h-[45px] flex items-center justify-center bg-blue transition-all duration-200 hover:rounded-[50%] max-[390px]:ml-2'
                            onClick={handleSend}
                        >
                            <img src={sendArrow} alt='sendArrow' />
                        </button>
                    </div>
                    <ImagePreview />
                </>
            )}
        </>
    )
}

export default ChatBody
