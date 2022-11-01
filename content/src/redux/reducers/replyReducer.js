

export const replyReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_REPLY_INFO": 
            return {...state, ...action.payload }
        default:
            return state // returns initial state if doesn't have action type
    }
}

