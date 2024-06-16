import avatarDefault from '../../assets/defaultProfilePicture.svg'
import { database, db } from '../../library/firebase'
import { useChatStore } from '../../library/chatStore'
import { useUserStore } from '../../library/userStore'
import { doc, updateDoc } from 'firebase/firestore'
import useUserPresence from '../../hooks/useUserPresence'
import { ref as dbRef, onValue } from 'firebase/database'
import { useEffect, useState } from 'react'

const UserCard = ({ name, lastMsg, chat, avatar, chats }) => {
    const formatTime = (time) => {
        const date = new Date(time)
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    const { changeChat, chatId, setChatId, user } = useChatStore()
    const { currentUser } = useUserStore()
    const [userStatus, setUserStatus] = useState('offline')

    useUserPresence()

    useEffect(() => {
        if (user?.id) {
            const userStatusRef = dbRef(database, `/status/${user.id}`)
            onValue(userStatusRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val()
                    setUserStatus(data.state)
                }
            })
        }
    }, [user])

    const handleChatClick = async (event) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item
            return rest
        })

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        )

        if (chatId != userChats[chatIndex].chatId) {
            setChatId(null)
            userChats[chatIndex].isSeen = true

            const userChatsRef = doc(db, 'userchats', currentUser.id)

            try {
                await updateDoc(userChatsRef, {
                    chats: userChats,
                })
            } catch (error) {
                console.log(error)
            }

            changeChat(chat.chatId, chat.user)
            setChatId(chat.chatId)
        }
    }

    return (
        <div
            className={`${
                chat.isSeen ? '' : 'bg-plus-icon'
            } flex justify-between items-center px-6 py-2.5 cursor-pointer transition-all duration-100 hover:bg-neutral-800 max-[1100px]:px-4`}
            onClick={handleChatClick}
            data-id={chat.chatId}
        >
            <div className='flex items-center w-full'>
                <div className='relative mr-4'>
                    <div className='w-[50px] h-[50px]'>
                        <img
                            className='rounded-full object-cover w-[50px] h-[50px]'
                            src={avatar || avatarDefault}
                            alt='avatar'
                        />
                    </div>
                    {userStatus.charAt(0).toUpperCase() +
                        userStatus.slice(1) ===
                    'Online' ? (
                        <div className='rounded-full bg-green w-[10px] h-[10px] absolute bottom-0 right-0'></div>
                    ) : (
                        <div></div>
                    )}
                </div>
                <div className='flex h-[50px] py-1 w-full'>
                    <div className='flex-1'>
                        <h4 className='font-poppins font-medium text-base w-[220px] whitespace-nowrap overflow-hidden text-ellipsis max-[1200px]:w-[110px]'>
                            {name}
                        </h4>
                        <p className='font-poppins font-normal text-[12px] text-dark-white w-[167px] whitespace-nowrap overflow-hidden text-ellipsis max-[1200px]:w-[110px]'>
                            {lastMsg}
                        </p>
                    </div>
                    <div className='font-poppins font-bold text-[12px] text-dark-white'>
                        {lastMsg != '' && formatTime(chat.updatedAt)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard
