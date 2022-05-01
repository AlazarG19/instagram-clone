import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button } from 'react-native'

const Landing = ({navigation}) => {
    const register = () =>{
        navigation.navigate("Register")
    }
    const login = () =>{
        navigation.navigate("Login")
    }
  return (
    <View style = {styles.container}>
      <Button
        title = "Register"
        onPress = {register}
      />
      <Button
        title = "Login"
        onPress = {login}
      />
    </View>
  )
}

export default Landing

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : "center"
    }

})