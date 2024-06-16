import { useContext, useState, useRef } from 'react'
import closeIcon from '../../assets/close.svg'
import { ModalContext } from '../../context/modal-context'
import avatarIcon from '../../assets/defaultProfilePicture.svg'
import { useUserStore } from '../../library/userStore'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../library/firebase'
import upload from '../../library/upload'

const UserInfoModal = () => {
    const { isModalOpen, toggleModal } = useContext(ModalContext)
    const { currentUser, fetchUserInfo } = useUserStore()

    const nameInput = useRef()
    const bioInput = useRef()

    const handleClose = (e) => {
        e.preventDefault()
        nameInput.current.value = currentUser.name
        toggleModal()
    }

    const [avatar, setAvatar] = useState({
        file: null,
        url: '',
    })

    const handleAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            })
        }
    }

    const handleEdit = async (e) => {
        e.preventDefault()

        const userDocRef = doc(db, 'users', currentUser.id)

        let imgUrl = null

        try {
            if (avatar.file) {
                imgUrl = await upload(avatar.file)
            }

            await updateDoc(userDocRef, {
                name: nameInput.current.value,
                bio: bioInput.current.value,
                ...(imgUrl && { avatar: imgUrl }),
            })

            fetchUserInfo(currentUser.id)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className={`z-50 absolute top-0 left-0 w-full h-screen bg-black/25 backdrop-blur-md transition-all duration-300 ${
                isModalOpen
                    ? 'pointer-events-auto opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
            }`}
        >
            <div
                className={`absolute bg-primary border-2 border-border rounded-[10px] z-50 top-[50%] left-[50%] translate-x-[-50%] shadow-2xl p-6 transition-all duration-300 ${
                    isModalOpen ? 'translate-y-[-50%]' : 'translate-y-[-60%]'
                }`}
            >
                <form>
                    <div className='flex justify-end'>
                        <button onClick={handleClose}>
                            <img
                                className='rounded-full'
                                src={closeIcon}
                                alt='close'
                            />
                        </button>
                    </div>
                    <div className='text-center font-medium mb-4 text-2xl border-b-2 border-border pb-1 max-[800px]:mb-1'>
                        <h4>Edit Your Profile</h4>
                    </div>
                    <div className='flex max-[800px]:flex-col max-[800px]:items-center'>
                        <div className='mx-8 flex flex-col items-center w-[100px] max-[800px]:mx-4 max-[800px]:mb-4'>
                            <div className='w-[85px] h-[85px] mb-2'>
                                <img
                                    className='object-cover rounded-full w-[85px] h-[85px]'
                                    src={
                                        avatar.url === ''
                                            ? currentUser.avatar || avatarIcon
                                            : avatar.url
                                    }
                                    alt='avatar'
                                />
                            </div>
                            <label
                                className='hover:underline cursor-pointer'
                                htmlFor='file'
                            >
                                Edit Avatar
                            </label>
                            <input
                                className='hidden'
                                type='file'
                                id='file'
                                onChange={handleAvatar}
                            />
                        </div>
                        <div className='flex flex-col items-start'>
                            <input
                                ref={nameInput}
                                className='font-poppins font-normal text-base text-white bg-primary-bg outline-none rounded-[10px] py-1 px-4 border-2 border-border mb-2 w-full'
                                type='text'
                                defaultValue={currentUser.name}
                            />
                            <h4 className='font-medium text-lg pl-4'>About:</h4>
                            <textarea
                                className='resize-none text-white text-base bg-primary-bg border-2 border-border rounded-[10px] py-1 px-4 outline-none w-[450px] h-[200px] mb-4 max-[800px]:w-[300px] max-[400px]:w-[260px]'
                                name='about'
                                id='about'
                                defaultValue={currentUser.bio}
                                placeholder='Write something about yourself'
                                ref={bioInput}
                            ></textarea>
                            <button
                                className='sign-button border-2 border-blue hover:border-2 hover:border-blue hover:bg-transparent hover:text-blue transition-all duration-200 max-[800px]:self-center'
                                type='send'
                                onClick={handleEdit}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserInfoModal
