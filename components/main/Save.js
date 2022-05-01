import { StyleSheet, Text, View,TextInput,Image,Button } from 'react-native'
import React,{useState} from 'react'
import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
import "firebase/compat/storage"
import "firebase/compat/auth"
const Save = (props) => {
  const savePostData = (link) =>{
    console.log(firebase.auth().currentUser.uid)
    firebase
    .firestore()
    .collection("posts")
    .doc(firebase.auth().currentUser.uid)
    .collection("userPosts")
    .add({
      downloadURL : link,
      caption,
      creationDate : firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(()=>{props.navigation.navigate("Profile",{link})})
  }
  const uploadImage = async() =>{
    console.log("saving started")  
    const uri = props.route.params.image
    const response = await fetch(uri);
    const blob = await response.blob();
    const childPath = `random/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}` 
    const task = firebase.storage()
    .ref()
    .child(childPath)
    .put(blob)
    const taskProgress = (snapshot)=>{
      console.log(`transferred : ${snapshot.bytesTransferred}`)
    }
    const taskCompleted = ()=>{
      task.snapshot.ref.getDownloadURL().then((link)=>{
        console.log("completed",link)
        savePostData(link)
      })
      
    }
    const taskError = (snapshot)=>{
      console.log(snapshot)
    }
    task.on("state_change",taskProgress,taskError,taskCompleted)
  }
    const [caption, setCaption] = useState("")
    return ( 
    <View> 
      <Image source = {{ uri : props.route.params.image}} />
      <TextInput value= {caption} onChangeText = {(text)=>setCaption(text)}  placeholder='Write a Caption' ></TextInput>
      <Button title = "Save" onPress = {uploadImage} />
    </View>
  )
}

export default Save

const styles = StyleSheet.create({})