import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: 'react-online-chat-dfdd4.firebaseapp.com',
    projectId: 'react-online-chat-dfdd4',
    storageBucket: 'react-online-chat-dfdd4.appspot.com',
    messagingSenderId: '633081277229',
    appId: '1:633081277229:web:688f439a2642c9d4c2c1a4',
    databaseURL: 'https://react-online-chat-dfdd4-default-rtdb.firebaseio.com',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth()
export const db = getFirestore()
export const storage = getStorage()
export const database = getDatabase(app)
