import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState} from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts ,fetchFollowing,clearData} from '../redux/action'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Feed from './main/Feed'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import Add from './main/Add'
import Profile from './main/Profile'
import Search from './main/Search'
import firebase from 'firebase/compat/app'
import "firebase/compat/auth"
const EmptyScreen = () => { return null}

const Tab = createMaterialBottomTabNavigator();
const Main = (props) => {
    useEffect(() => {
      console.log("main") 
      props.clearData()
      props.fetchUser()
      props.fetchUserPosts()
      props.fetchFollowing()
      // console.log("currentuser",props.currentUser)
      // console.log("posts",props.posts)
    },[]) 
  if(props.currentUser === undefined){
    return <View></View>
  }
  return (
      <Tab.Navigator style = {styles.container} initialRouteName = {"Feed"}>
        <Tab.Screen name = "Feed" component={Feed}
          options = {
            {
              tabBarIcon : ({color,size}) =>(
                <MaterialCommunityIcons name = "home" color={color} size = {26} />
              )
            }
          }
          />
          <Tab.Screen name = "NotAdd" component={EmptyScreen}
          listeners = {({navigation})=>(
            {tabPress : (event)=>{
              event.preventDefault()
              navigation.navigate("Add")
            }}
          )} 
          options = {
            {
              tabBarIcon : ({color,size}) =>(
                <MaterialCommunityIcons name = "plus-box" color={color} size = {26} />
  )
            }
          }
          />
          <Tab.Screen name = "Profile" component={Profile}
          listeners = {({navigation})=>(
            {tabPress : (event)=>{
              event.preventDefault()
              navigation.navigate("Profile",{uid:firebase.auth().currentUser.uid})
              
            }}
          )}
          options = {
            {
              tabBarIcon : ({color,size}) =>(
                <MaterialCommunityIcons name = "account-circle" color={color} size = {26} />
              )
            }
          }
          />
          <Tab.Screen name = "Search" component={Search}
          options = {
            {
              tabBarIcon : ({color,size}) =>(
                <MaterialCommunityIcons name = "magnify" color={color} size = {26} navigation = {props.navigation} />
              )
            }
          }
          />
      </Tab.Navigator>
  ) 
}
const mapStateToProps = (store) =>(
  { currentUser :store.userState.currentUser,posts: store.userState.posts}
)
const mapDispatchToProps = (dispatch) =>(
    bindActionCreators({fetchUser,fetchUserPosts,fetchFollowing,clearData},dispatch)
    // {fetchUser : ()=>(dispatch(fetchUser()))}  
) 
export default connect(mapStateToProps,mapDispatchToProps)(Main);
const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : "center",
    }
})