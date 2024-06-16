import UsersList from '../components/users-components/UsersList'
import ChatSection from '../components/chat-components/ChatSection'
import UserInfo from '../components/chat-user-components/ChatUserInfo'
import UserInfoModal from '../components/user-components/UserInfoModal'
import { useState } from 'react'
import { ModalContext } from '../context/modal-context'
import { SelectedChatContext } from '../context/selected-chat-context'
import { UserInfoContext } from '../context/user-info-context'
import { AddChatModalContext } from '../context/add-chat-modal-context'
import AddChatModal from '../components/chat-components/AddChatModal'

function ChatPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAddChatModalOpen, setIsAddChatModalOpen] = useState(false)
    const [selectedChatId, setSelectedChatId] = useState(null)
    const [isInfoOpen, setIsInfoOpen] = useState(false)

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen)
    }

    const toggleAddChatModal = () => {
        setIsAddChatModalOpen(!isAddChatModalOpen)
    }

    const toggleChat = (id) => {
        setSelectedChatId(id)
    }

    const toggleInfo = () => {
        setIsInfoOpen(!isInfoOpen)
    }

    return (
        <AddChatModalContext.Provider
            value={{ isAddChatModalOpen, toggleAddChatModal }}
        >
            <ModalContext.Provider value={{ isModalOpen, toggleModal }}>
                <SelectedChatContext.Provider
                    value={{ selectedChatId, toggleChat }}
                >
                    <UserInfoContext.Provider
                        value={{ isInfoOpen, toggleInfo }}
                    >
                        <div className='flex'>
                            <UsersList />
                            <ChatSection />
                            {isInfoOpen && <UserInfo />}
                            <UserInfoModal />
                            <AddChatModal />
                        </div>
                    </UserInfoContext.Provider>
                </SelectedChatContext.Provider>
            </ModalContext.Provider>
        </AddChatModalContext.Provider>
    )
}

export default ChatPage
