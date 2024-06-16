import avatar from '../../assets/defaultProfilePicture.svg'
import { useChatStore } from '../../library/chatStore'

const ChatUserInfoCard = () => {
    const { user } = useChatStore()

    const formatFirebaseTimestamp = (timestamp) => {
        const date = timestamp.toDate()
        const options = { day: '2-digit', month: 'short', year: 'numeric' }
        return date.toLocaleDateString('en-GB', options)
    }
    return (
        <div className='flex flex-col flex-1 py-6 px-3 items-center overflow-y-auto'>
            <div className='w-[100px] h-[100px] mb-4 max-[800px]:w-[70px] max-[800px]:h-[70px]'>
                <img
                    className='w-full object-cover rounded-full w-[100px] h-[100px] max-[800px]:w-[70px] max-[800px]:h-[70px]'
                    src={user.avatar || avatar}
                    alt='avatar'
                />
            </div>
            <h4 className='font-medium text-2xl text-center min-[550px]:w-[200px] min-[550px]:whitespace-nowrap min-[550px]:overflow-hidden min-[550px]:text-ellipsis max-[1100px]:w-[110px] max-[800px]:w-[70px] max-[550px]:w-full'>
                {user.name}
            </h4>
            <p className='font-normal text-dark-d-grey text-base mb-5 text-center'>
                Joined{' '}
                <br className='hidden max-[1100px]:block max-[550px]:hidden' />{' '}
                {formatFirebaseTimestamp(user.joinedAt)}
            </p>
            <div className='pt-4 border-t-2 border-border w-full'>
                <h4 className='font-semibold text-[18px]'>About</h4>
                <p className='font-normal text-base text-dark-d-grey min-[620px]:max-w-[200px]  break-words'>
                    {user.bio || 'No bio yet'}
                </p>
            </div>
        </div>
    )
}

export default ChatUserInfoCard
