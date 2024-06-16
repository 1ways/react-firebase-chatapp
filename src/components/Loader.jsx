import { useEffect, useState } from 'react'

const Loader = ({ isLoading }) => {
    const [dots, setDots] = useState('')

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setDots((prev) => {
                    if (prev.length < 3) return prev + '.'
                    return ''
                })
            }, 500)

            return () => clearInterval(interval)
        }
    }, [isLoading])

    return (
        <div
            className={`z-50 absolute top-0 left-0 w-full h-screen bg-black/25 backdrop-blur-md transition-all duration-300 flex items-center justify-center ${
                isLoading
                    ? 'pointer-events-auto opacity-100 visible'
                    : 'opacity-0 invisible pointer-events-none'
            }`}
        >
            <p className='font-medium text-5xl'>Wait{dots + ' :)'}</p>
        </div>
    )
}

export default Loader
