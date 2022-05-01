import { StyleSheet, Text, View,FlatList,Button,TextInput } from 'react-native'
import React,{useState,useEffect} from 'react'
import firebase  from 'firebase/compat/app'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/action'

const Comment = (props) => {
    const [comments, setComments] = useState([])
    const [postId, setPostId] = useState("")
    const [text,setText] = useState("")
    const [refresh,setRefresh] = useState(false)
    const matchUserToComment = (comments) =>{
        for(let i = 0; i< comments.length ; i++){
            console.log("commetns at i",comments[i])
            if(comments[i].hasOwnProperty('user')){
                console.log("continued")
                continue 
            }
            console.log("not continued")
            const user = props.otherusers.find(c => c.uid === comments[i].creator)
            if(user == undefined){
                props.fetchUsersData(comments[i].creator,false) 
            }
            else{
                comments[i].user = user
            }
        }
        setComments(comments)
    }
    useEffect(() => {
        // console.log(props.route.params)
        
      if(props.route.params.postId != postId){
          firebase
          .firestore()
          .collection("posts")
          .doc(props.route.params.uid)
          .collection("userPosts")
          .doc(props.route.params.postId)
          .collection("comments")
          .get()
          .then((snapshot)=>{ 
            //   console.log(snapshot)
            let comments = snapshot.docs.map((doc)=>{
                const data = doc.data()
                const id = doc.id
                return {id ,...data}
            })
            console.log("comments fetched",comments)
            matchUserToComment(comments)
        })
        setPostId(props.route.params.postId,props.otherusers)
      }else{
          matchUserToComment(comments)
      }
    }, [props.route.params.postId])
    const sendComment = ( ) => {
        firebase
          .firestore()
          .collection("posts")
          .doc(props.route.params.uid)
          .collection("userPosts")
          .doc(props.route.params.postId)
          .collection("comments")
          .add({
              creator : firebase.auth().currentUser.uid,
              comment : text,
          })
          console.log("commented")
          setRefresh(!refresh)
        //   console.log(firebase.auth().currentUser)
    }
    // console.log(comments)
    return (
    <View>
      <FlatList
        numColumns={1}
        horizontal = {false}
        data = {comments}
        renderItem = {({item})=>(
            <View>
                {item.user != undefined ?
                <Text>{item.user.name}</Text>  
                :<Text>undefined</Text>}
                <Text>{item.comment}</Text>
            </View>
        )}
      />
      <View>
          <TextInput 
            placeholder='comment here ..'
            onChangeText={(text)=>{
                setText(text)
            }}
          />
          <Button onPress={sendComment} title = "Send Comment" />
      </View>
    </View>
  )
}
const mapStateToProps = (store) =>{
    return{
        otherusers: store.otherUsersState.otherusers
    }
}
const mapDispatchToProps = (dispatch) =>(
    bindActionCreators({fetchUsersData},dispatch)
)
export default connect(mapStateToProps,mapDispatchToProps)(Comment)

const styles = StyleSheet.create({})