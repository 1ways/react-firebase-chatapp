/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            },
            colors: {
                primary: '#1E1E20',
                'primary-bg': '#131313',
                'dark-grey': '#323232',
                grey: '#494949',
                'light-grey': '#717171',
                'dark-white': '#CFCFCF',
                green: '#04B100',
                purple: '#EE81FC',
                red: '#FF204E',
                border: '#2F2F31',
                blue: '#6A44FF',
                yellow: '#B0BD5C',
                'message-bg': '#29292C',
                'dark-d-grey': '#AAAAAA',
                'plus-icon': '#7C7C7C',
            },
        },
    },
    plugins: [],
}
