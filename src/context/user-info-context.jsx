import React, { createContext } from 'react'

export const UserInfoContext = createContext({
    isInfoOpen: false,
    toggleInfo: () => {},
})
