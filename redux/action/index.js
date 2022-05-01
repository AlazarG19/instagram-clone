import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
import {
  CLEAR_DATA,
  OTHER_USERS_STATE_CHANGE,
  OTHER_USERS_STATE_LIKE_CHANGE,
  OTHER_USERS_STATE_POST_CHANGE,
  USER_FOLLOWING_STATE_CHANGE,
  USER_STATE_CHANGE,
  USER_STATE_POST_CHANGE, 
} from '../constants'
export const clearData = ( ) => {
  return((dispatch)=>{
    dispatch({type : CLEAR_DATA})
  })
}
export const fetchUser = () => {
  return (dispatch) => {
    console.log('fetchUser start')
    firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          // console.log(snapshot.data())
          dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
        } else {
          console.log('does not exist')
        }
      })
  }
}
export const fetchUserPosts = () => {
  return (dispatch) => {
    console.log('fetchUserPosts Start')
    firebase
      .firestore()
      .collection('posts')
      .doc(firebase.auth().currentUser.uid)
      .collection('userPosts')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          let data = doc.data()
          const id = doc.id
          return {
            id,
            ...data,
          }
        })
        dispatch({ type: USER_STATE_POST_CHANGE, posts })
      })
  }
}
export const fetchFollowing = () => {
  return (dispatch) => {
    console.log('fetchFollowing start')
    firebase
      .firestore()
      .collection('following')
      .doc(firebase.auth().currentUser.uid)
      .collection('userFollowing')
      .onSnapshot((snapshot) => {
        let following = snapshot.docs.map((doc) => {
          const id = doc.id
          return id
        })
        dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
        for(let i = 0;i < following.length;i++){
          // console.log("fetch userdaat with id",following[i])
          dispatch(fetchUsersData(following[i],true))
        }
      })
  }
}
export const fetchUsersData = (uid,getPosts)=>{
  return((dispatch,getState)=>{
    console.log("fetchUserData Start with uid ",uid," and getPosts value " , getPosts)
    const found = getState().otherUsersState.otherusers.some(el => el.uid === uid);
    // getState().otherUsersState.otherusers.map((el)=>{console.log(el)})
    // console.log("user with id ", uid,found)
    // console.log(getState().otherUsersState.otherusers) 
    // getState().otherUsersState.otherusers.map(el => {console.log(el.name,el.uid === uid)})
    // console.log(getState())
    // getState().otherUsersState.otherusers.map((el)=>console.log(el.uid))
    // console.log("other user are foung ?",getState().otherUsersState.otherusers)
    if(!found){ 
      firebase 
      .firestore()
      .collection('users')
      .doc(uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          let otherusers = snapshot.data()
          otherusers.uid = snapshot.id
          // console.log("other users",otherusers)
          // console.log("other users",otherusers )
          // console.log(otherusers.uid)
          dispatch({type : OTHER_USERS_STATE_CHANGE,otherusers})
          // console.log("passing the uid",otherusers.uid)
          if(getPosts){
            dispatch(fetchUsersFollowingPosts(otherusers.uid))
          }
        } else {
          console.log('does not exist')
        }
      })
    }
    else{
      console.log("found")
    }
  })
}
export const fetchUsersFollowingPosts = (uid) =>{
  console.log("fetchUsersFollowingPosts with uid",uid)
  return ((dispatch,getState) =>{
    // console.log("fetchUsersFollowingPosts direct",uid)
    
      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts') 
        // .orderBy("creation","asc")
        .get() 
        .then((snapshot) => {  
          // console.log("fetch users following posts snapshot",snapshot.docs)   
          try {
            const uid = snapshot.docs[0].ref.path.split("/")[1]          
            // console.log("uid of the following",uid)
            // console.log("other users to be checked",getState().otherUserState)
            let i = 0
            getState().otherUsersState.otherusers.map(el =>{ i ++})
            console.log(i)
            const otherusers = getState().otherUsersState.otherusers.find(el => el.uid === uid);
            // console.log("other users return value ",otherusers)
            let posts = snapshot.docs.map((doc) => {
              let data = doc.data()
              const id = doc.id
              return {
                id,
                ...data,
                otherusers
              }
            })
            // console.log("about to be passed posts",posts)
            console.log("posts length",posts.length)
            for(let i = 0; i<posts.length;i++){
              // console.log("loop ",i)
              dispatch(fetchUsersFollowingLikes(uid,posts[i].id)) 
            }
            dispatch({ type: OTHER_USERS_STATE_POST_CHANGE,uid, posts })
            // getState().otherUsersState.otherusers.map((el)=>{console.log(el.uid)}) 
             
          } catch (error) {
            console.log("encountered",error)
            // console.log(snapshot.docs)
            // console.log("fetch user following posts",posts)
          }
        })
    
  })
}
export const fetchUsersFollowingLikes = (uid,postId) =>{
  return ((dispatch) =>{
    console.log("fetchUsersFollowingLikes with uid",uid , "and postId",postId )   
      firebase
        .firestore()
        .collection('posts')
        .doc(uid)
        .collection('userPosts') 
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser.uid)
        .onSnapshot((snapshot) => {  
          // console.log("fetch users following likes snapshot",snapshot.ref.path.split("/")[3])   
          try {
            const postId = snapshot.ref.path.split("/")[3];
            // console.log("fetchUsersFollowingLikes  with post with uid",postId)

            let currentUserLike = false;
            if(snapshot.exists){
              currentUserLike = true
            } 
            // console.log("before dispatch like is",currentUserLike,"postId ", postId)
            dispatch({ type: OTHER_USERS_STATE_LIKE_CHANGE,postId, currentUserLike})             
          } catch (error) {
            console.log("encountered",error)
          }
        })
    
  })
}