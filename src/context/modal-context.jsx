import React, { createContext } from 'react'

export const ModalContext = createContext({
    isModalOpen: false,
    toggleModal: () => {},
})
