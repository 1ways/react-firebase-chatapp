import React, { createContext } from 'react'

export const FormContext = createContext({
    isSignUp: true,
    toggleSign: () => {},
    isLogged: false,
    toggleLogged: () => {},
})
