import { useEffect } from 'react'
import { ref, onValue, set, onDisconnect } from 'firebase/database'
import { useUserStore } from '../library/userStore'
import { database } from '../library/firebase'

const useUserPresence = () => {
    const { currentUser } = useUserStore()

    useEffect(() => {
        if (!currentUser) return

        const userStatusDatabaseRef = ref(database, `/status/${currentUser.id}`)
        const isOfflineForDatabase = {
            state: 'offline',
            last_changed: Date.now(),
        }
        const isOnlineForDatabase = {
            state: 'online',
            last_changed: Date.now(),
        }

        const connectedRef = ref(database, '.info/connected')
        onValue(connectedRef, (snapshot) => {
            if (snapshot.val() === false) {
                return
            }

            onDisconnect(userStatusDatabaseRef)
                .set(isOfflineForDatabase)
                .then(() => {
                    set(userStatusDatabaseRef, isOnlineForDatabase)
                })
        })
    }, [currentUser])
}

export default useUserPresence
