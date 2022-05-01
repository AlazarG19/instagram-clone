import { StyleSheet, Text, View, Image, FlatList, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUserPosts, fetchFollowing } from '../../redux/action'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
const Feed = (props) => {
  const [post, setPost] = useState([])
  useEffect(() => {
    if(props.following.length != 0){
      // console.log('feed',props.following.length)
      // for (let i = 0; i < props.following.length; i++) {
    //   const otherusers = props.otherusers.find(
      //     (el) => el.uid === props.following[i],
    //   )
    //   if (otherusers.posts != undefined) {
      //     post = [...post, ...otherusers.posts]
      //   }
      // }
      
      // post.sort((x, y) => x.creation - y.creation)
      props.feed.sort((x, y) => x.creation - y.creation)
      // setPost(post)
      setPost(props.feed)
    }
  }, [props.otherusersFollowingLoaded,props.feed])
  console.log("feed posts",post)
  const onLike = (userId,postId ) =>{ 
    firebase
        .firestore()
        .collection('posts')
        .doc(userId)
        .collection('userPosts') 
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser)
        .set({})

  }
  const onDisLike = (userId,postId ) =>{
    firebase
        .firestore()
        .collection('posts')
        .doc(userId)
        .collection('userPosts') 
        .doc(postId)
        .collection("likes")
        .doc(firebase.auth().currentUser)
        .delete({})

  }
  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={3}
          horizontal={false}
          data={post}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Text style={styles.container}>{item.otherusers.name}</Text>
              <Image source={{ uri: item.downloadURL }} style={styles.image} />
              {item.currentUserLike? 
              (<Button title = "DisLike" onPress={() => {onDisLike()}} />):
              <Button title = "Like" onPress={() => {onLike()}} />  
            }
              <Text
                onPress={() => {
                  props.navigation.navigate('Comment', { postId: item.id,uid : item.otherusers.uid})
                }}
              >
                View Comments ...
              </Text>
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
  following: store.userState.following,
  // otherusers: store.otherUsersState.otherusers,
  feed: store.otherUsersState.feed,
  otherusersFollowingLoaded: store.otherUsersState.otherusersFollowingLoaded,
})
const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ fetchUserPosts, fetchFollowing }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Feed)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  infoContainer: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1 / 1,
  },
  imageContainer: {
    flex: 1 / 3,
  },
  flatList: {},
})
