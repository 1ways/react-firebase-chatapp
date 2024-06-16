import { create } from 'zustand'
import { useUserStore } from './userStore'

export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser

        set({
            chatId,
            user,
        })
    },
    setChatId: (value) =>
        set({
            chatId: value,
        }),
}))
