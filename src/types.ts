export type UseMutationCallback = {
    onSuccess?: () => void,
    onError?: (error: Error) => void,
    onMutate?: () => void,
    onSettled?: () => void,
}

export type Image = {
    file: File,
    previewUrl: string
}

export type Theme = 'light' | 'dark'