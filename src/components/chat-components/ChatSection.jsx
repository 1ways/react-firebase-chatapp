import ChatBody from './ChatBody'
import { useChatStore } from '../../library/chatStore'
import { useEffect, useRef } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../../library/firebase'

const ChatSection = () => {
    const { chatId, setChatId } = useChatStore()
    const prevChatCountRef = useRef(0)

    useEffect(() => {
        const chatsRef = collection(db, 'chats')
        const unSub = onSnapshot(chatsRef, (snapshot) => {
            const newChatCount = snapshot.size
            if (prevChatCountRef.current !== newChatCount) {
                setChatId(null)
            }
            prevChatCountRef.current = newChatCount
        })

        return () => unSub()
    }, [setChatId])

    return (
        <div className='flex flex-[3] flex-col h-screen relative'>
            {chatId && <ChatBody />}
        </div>
    )
}

export default ChatSection
