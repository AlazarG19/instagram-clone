import {
  CLEAR_DATA,
  OTHER_USERS_STATE_CHANGE,
  OTHER_USERS_STATE_POST_CHANGE,
  OTHER_USERS_STATE_LIKE_CHANGE,
} from '../constants'

const initialState = {
  otherusers: [],
  otherusersFollowingLoaded: 0,
  feed : []
}
export const otherusers = (state = initialState, action) => {
  switch (action.type) {
    case OTHER_USERS_STATE_CHANGE:
      return {
        ...state,
        otherusers: [...state.otherusers, action.otherusers],
      }
    case OTHER_USERS_STATE_POST_CHANGE:
      return {
        ...state,
        otherusersFollowingLoaded: state.otherusersFollowingLoaded + 1,
        // otherusers: state.otherusers.map((otheruser) =>
        //   otheruser.uid === action.uid
        //     ? { ...otheruser, posts: action.posts }
        //     : otheruser,
        // ),
        feed : [...state.feed,...action.posts]
      }
    case OTHER_USERS_STATE_LIKE_CHANGE:
      // console.log("inside dispatch", action.currentUserLike,"and postid",action.postId) 
      return{ 
        ...state,
        feed:state.feed.map(post=> post.id == action.postId ? {
          ...post,currentUserLike : action.currentUserLike
        }:post)
      }  
    case CLEAR_DATA:
      return initialState
    default:
      return state
  }
}
