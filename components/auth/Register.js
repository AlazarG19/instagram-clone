import { StyleSheet, Text, View,TextInput,Button } from 'react-native'
import React,{useEffect,useState} from 'react'
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
import "firebase/compat/firestore"
const Register = () => {
  useEffect(() => {
    
  }, [])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const signup = ()=>{
      firebase.auth().createUserWithEmailAndPassword(email,password)
        .then(()=>{
            firebase.firestore().collection("users")
            .doc(firebase.auth().currentUser.uid)
            .set({
                name ,
                email
            })
        })
        .catch((err)=>{
            console.log(err)
            console.log("please try again")
        })
  }
    return (
    <View>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text)=>{setName(text)}}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text)=>{setEmail(text)}}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry = {true}
        value={password}
        onChangeText={(text)=>{setPassword(text)}}
      />
      <Button
        onPress={signup}
        title = "SignUp"
      />
    </View>
  )
}

export default Register

const styles = StyleSheet.create({})