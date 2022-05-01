import { StyleSheet, Text, View, Image, FlatList,Button } from 'react-native'
import React,{useEffect,useState} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserPosts ,fetchFollowing} from '../../redux/action'
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
const Profile = (props) => {
  // console.log(props)
  const [userPost, setUserPost] = useState(null)
  const [user, setUser] = useState(null)
  const { currentUser, posts } = props
  const [following ,setFollowing] = useState(false)
  useEffect(()=>{
    console.log("i am refreshed",firebase.auth().currentUser.name)
    // console.log("other users data",props.otherusersData)
    props.fetchUserPosts()
    props.fetchFollowing()
    // console.log(props)
    if(props.route.params.uid == firebase.auth().currentUser.uid){
      setUser(currentUser)
      setUserPost(posts)
    }else{
      firebase
      .firestore()
      .collection('posts')
      .doc(props.route.params.uid)
      .collection('userPosts')
      .get()
      .then((snapshot) => {
        let posts = snapshot.docs.map((doc) => {
          let data = doc.data()
          const id = doc.id
          // console.log(id)
          return {
            id,
            ...data,
          }
        })
        setUserPost(posts)
        // dispatch({ type: USER_STATE_POST_CHANGE, posts })
      })
// 
      firebase
      .firestore()
      .collection('users')
      .doc(props.route.params.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setUser(snapshot.data())
          // dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
        } else {
          console.log('does not exist')
        }
        // console.log("where is it ",props.following)
        if(props.following.indexOf(props.route.params.uid)>-1){
          setFollowing(true)
        }else{
          setFollowing(false)
        }
      })
    }
  },[props.route.params.uid,props.route.params.link])
  console.log(props.posts.length)   
    // console.log('hello',following)
    // console.log('profile currentUser', props)
    // console.log('profile posts', props)
    const Follow = ()=>{
      console.log("initializing follow")
      firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
      .then(()=>{
        setFollowing(true)
      })
      .catch((error) => {
        console.log("Error removing document: ", error);
    })
    }
    const Unfollow = ()=>{
      firebase
      .firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete()
      .then(()=>{
        setFollowing(false)
      })
      .catch((error) => {
        console.log("Error removing document: ", error);
    })
    }
    const Logout = ()=>{
      firebase.auth().signOut();
    }
    if(user == null){
      return <View/>
    }
  return (
    <View style = {styles.container} >
      <View style = {styles.infoContainer}>
      <Text>{user.name}</Text> 
      <Text>{user.email}</Text> 
      {props.route.params.uid !== firebase.auth().currentUser.uid?(
        <View>
          {following? (<Button title = "Following" onPress={Unfollow}/>):(
            <Button title = "Follow" onPress={Follow}/>
          )}
        </View>
      ):
      
        <Button title = "Logout" onPress={Logout}/>
          
      }
      </View>
      <View style = {styles.containerGallery} >
        <FlatList numColumns={3} horizontal = {false}  
        data = {userPost}  
        renderItem = {({item})=>(
          <View style = {styles.imageContainer} >
            <Image source = {{uri : item.downloadURL,}} style = {styles.image} />
          </View>
        )}
        />
      </View>
    </View>
  )
}
const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  posts: store.userState.posts,
  following : store.userState.following,
  otherusersData : store.otherUsersState.otherusers
})
const mapDispatchToProps = (dispatch)=>(
  bindActionCreators({fetchUserPosts,fetchFollowing},dispatch)
)
export default connect(mapStateToProps, mapDispatchToProps)(Profile)

const styles = StyleSheet.create({
  container : {
    flex : 1,
    marginTop : 40
  }, 
  infoContainer : {
    margin:20
  },
  containerGallery : {
    flex : 1,
  },
  image : {
    flex : 1,
    aspectRatio : 1/1,
    margin : 5
  },
  imageContainer : {
    flex : 1/3
  },
  flatList: {},
}) 
