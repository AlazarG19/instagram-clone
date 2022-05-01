import { StyleSheet, Text, View,TextInput,Button,Alert } from 'react-native'
import React,{useEffect,useState} from 'react'
import firebase from "firebase/compat/app"
import "firebase/compat/auth"
const Login = () => {
    useEffect(() => {
    
    }, [])
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const SignIn = ()=>{
        firebase.auth().signInWithEmailAndPassword(email,password)
          .then(()=>{
              console.log("success") 
          })
          .catch((err)=>{ 
              console.log("this is the error",err)
          })
    }
      return (
      <View>
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
          onPress={SignIn}
          title = "Login"
        />
      </View>
    )
  }

export default Login

const styles = StyleSheet.create({})