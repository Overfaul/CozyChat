import instance from "../../api/axios"

export const getMeData = () => {
    return async function(dispatch){
        const meDataResponse = await instance.get('/me')
        dispatch({ type: 'SET_ME_DATA', payload: meDataResponse.data})
        console.log(meDataResponse.data)
    }
}