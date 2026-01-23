export interface image {
    id: number,
    size: number,
    src: string,
    removed?: boolean,
    file?: File,
    formData?: FormData
}

export default image