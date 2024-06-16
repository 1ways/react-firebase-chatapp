import React, { createContext } from 'react'

export const SelectedChatContext = createContext({
    selectedChatId: null,
    toggleChat: (id) => {},
})
