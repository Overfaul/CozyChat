

export const meReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET_ME_DATA":
            return { ...state, ...action.payload }
        default:
            return state // returns initial state if doesn't have action type
    }
}

