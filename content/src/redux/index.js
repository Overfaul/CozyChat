import { combineReducers, applyMiddleware ,legacy_createStore as createStore } from "redux"
import { replyReducer } from "./reducers/replyReducer"
import { messageReducer } from "./reducers/messageReducer"
import { meReducer } from "./reducers/meReducer"
import thunk from 'redux-thunk'

const rootReducer = combineReducers({
    reply: replyReducer,
    message: messageReducer,
    meinfo: meReducer,
})

export const store = createStore(rootReducer, applyMiddleware(thunk))