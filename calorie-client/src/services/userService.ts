import API from './api'

export const currentUser = async () => {
    const resposne = await API.get('/auth/me')

    return await resposne.data
}
