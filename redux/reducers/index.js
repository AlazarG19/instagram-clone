import {combineReducers} from "redux"
import { otherusers } from "./otherusers"
import {user } from "./users"
const Reducers = combineReducers({
    userState:user,
    otherUsersState : otherusers
})
export default Reducers