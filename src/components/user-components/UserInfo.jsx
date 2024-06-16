import { FormContext } from '../../context/form-context'
import { ModalContext } from '../../context/modal-context'
import { useContext } from 'react'
import avatar from '../../assets/defaultProfilePicture.svg'
import { useUserStore } from '../../library/userStore'
import { auth } from '../../library/firebase'
import { useChatStore } from '../../library/chatStore'

const UserInfo = () => {
    const { currentUser } = useUserStore()
    const { setChatId } = useChatStore()

    const { toggleModal } = useContext(ModalContext)
    const { toggleLogged } = useContext(FormContext)

    const openUserInfoModal = () => {
        toggleModal()
    }

    const handleLogOut = () => {
        auth.signOut()
        setChatId(null)
    }

    return (
        <div className='pt-3 px-6 pb-3 border-b-2 border-border flex items-center max-[1100px]:px-4'>
            <div className='w-[50px] h-[50px] mr-4 max-[900px]:mr-1.5'>
                <img
                    className='rounded-full object-cover w-[50px] h-[50px]'
                    src={currentUser.avatar || avatar}
                    alt='avatar'
                />
            </div>
            <div className='flex justify-between flex-1 items-center'>
                <div className='flex flex-col justify-center items-start'>
                    <h4 className='font-poppins font-medium text-base max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis'>
                        {currentUser.name}
                    </h4>
                    <button
                        className='font-poppins font-normal text-[12px] text-dark-white hover:underline'
                        onClick={openUserInfoModal}
                    >
                        Edit Profile
                    </button>
                </div>
                <button
                    className='px-2 py-2 bg-border rounded-[10px] border-2 border-border transition-all duration-200 hover:bg-transparent max-[900px]:text-[12px] max-[900px]:p-1.5'
                    onClick={handleLogOut}
                >
                    Log out
                </button>
            </div>
        </div>
    )
}

export default UserInfo
