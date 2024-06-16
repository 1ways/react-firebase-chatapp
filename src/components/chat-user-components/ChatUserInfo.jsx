import ChatUserInfoCard from './ChatUserInfoCard'
import arrowLeft from '../../assets/arrow-left.svg'
import { useContext } from 'react'
import { UserInfoContext } from '../../context/user-info-context'

const ChatUserInfo = () => {
    const { toggleInfo } = useContext(UserInfoContext)

    return (
        <div className='flex flex-col flex-[1] bg-primary border-l-2 border-border h-screen max-[1100px]:flex-[1.3] max-[620px]:absolute max-[620px]:w-full'>
            <div className='flex justify-center text-center py-6 border-b-2 border-border max-[900px]:py-4'>
                <img
                    className='w-[30px] min-[620px]:hidden cursor-pointer z-10'
                    src={arrowLeft}
                    alt='arrow-left'
                    onClick={toggleInfo}
                />
                <h4 className='font-medium text-2xl flex-1 max-[620px]:ml-[-30px]'>
                    Info
                </h4>
            </div>
            <ChatUserInfoCard />
        </div>
    )
}

export default ChatUserInfo
