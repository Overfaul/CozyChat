

export const messageReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_MESSAGE_INFO": 
            return {...state, ...action.payload }
        default:
            return state // returns initial state if doesn't have action type
    }
}

