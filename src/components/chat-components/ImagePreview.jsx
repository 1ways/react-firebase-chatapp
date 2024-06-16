import React from 'react'
import { usePreviewStore } from '../../library/previewStore'
import upload from '../../library/upload'
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../library/firebase'
import { useChatStore } from '../../library/chatStore'
import { useUserStore } from '../../library/userStore'

export const ImagePreview = () => {
    const { isPreview, setIsPreview, setImgURL, imgURL, imgFile, setImgFile } =
        usePreviewStore()
    const { chatId, user } = useChatStore()
    const { currentUser } = useUserStore()

    const handleClose = (e) => {
        setIsPreview(false)
        setTimeout(() => {
            setImgURL(null)
            setImgFile(null)
        }, 300)
    }

    const handleSend = async () => {
        let imgUrl = null

        try {
            if (imgFile) {
                imgUrl = await upload(imgFile)
            }

            await updateDoc(doc(db, 'chats', chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    createdAt: new Date(),
                    img: imgUrl,
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

                    userChatsData.chats[chatIndex].lastMessage = imgUrl
                        ? 'Photo'
                        : inputText
                    userChatsData.chats[chatIndex].isSeen =
                        id === currentUser.id
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            })

            setIsPreview(false)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className={`absolute w-full h-full z-50 top-0 left-0 bg-black/25 backdrop-blur-md transition-all duration-300 flex items-center justify-center ${
                isPreview
                    ? 'pointer-events-auto opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
            }`}
        >
            <div className='flex flex-col items-center'>
                <div className='w-[200px]'>
                    <img
                        className='object-cover w-full'
                        src={imgURL}
                        alt='img'
                    />
                </div>
                <div className='flex items-center justify-between w-full'>
                    <button
                        className='mt-8 sign-button px-4 py-1 border-2 border-blue hover:border-2 hover:border-blue hover:bg-transparent hover:text-blue transition-all duration-200'
                        onClick={handleClose}
                    >
                        Close
                    </button>
                    <button
                        className='mt-8 sign-button px-4 py-1 border-2 border-blue hover:border-2 hover:border-blue hover:bg-transparent hover:text-blue transition-all duration-200'
                        onClick={handleSend}
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}
