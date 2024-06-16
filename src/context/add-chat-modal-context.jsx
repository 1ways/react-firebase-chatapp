import React, { createContext } from 'react'

export const AddChatModalContext = createContext({
    isAddChatModalOpen: false,
    toggleAddChatModal: () => {},
})
