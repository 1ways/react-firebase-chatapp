import { create } from 'zustand'

export const usePreviewStore = create((set) => ({
    isPreview: false,
    imgFile: null,
    imgURL: null,
    setIsPreview: (value) => {
        set({
            isPreview: value,
        })
    },
    setImgURL: (value) => {
        set({
            imgURL: value,
        })
    },
    setImgFile: (value) => {
        set({
            imgFile: value,
        })
    },
}))
