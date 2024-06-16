const MessageTemplate = ({ own, other, children, textMsg, time, img }) => {
    const formatTimestamp = (timestamp) => {
        const date = timestamp.toDate()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
    }

    return (
        <div
            className={`max-w-[300px] mb-2.5 ${
                own ? 'self-end' : 'self-start'
            }`}
        >
            <div
                className={`max-w-[300px] break-words ${
                    own ? 'self-end' : 'self-start'
                } ${textMsg && own ? 'bg-blue' : ''} ${
                    textMsg && other ? 'bg-message-bg' : ''
                } ${
                    textMsg && img
                        ? 'pt-0 px-0 pb-2 rounded-[10px] font-poppins font-normal text-[15px]'
                        : ''
                } ${
                    textMsg && !img
                        ? 'py-2.5 px-4 rounded-[10px] font-poppins font-normal text-[15px]'
                        : 'rounded-[10px] font-poppins font-normal text-[15px]'
                }`}
            >
                {children}
            </div>
            <div className='text-[11px] mt-1 font-poppins font-medium text-right'>
                {formatTimestamp(time)}
            </div>
        </div>
    )
}

export default MessageTemplate
