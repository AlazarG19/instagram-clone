import { StyleSheet, Text, View ,TextInput,FlatList,TouchableOpacity} from 'react-native'
import React,{useState} from 'react'
import firebase from 'firebase/compat/app'
import "firebase/compat/firestore"
// search not properly working fix later 
const Search = (props) => {
    const [users, setUsers] = useState([])
    const fetchUsers = (search) =>{
        console.log("name", ">=", search)
        firebase.firestore()
        .collection("users")
        // .where('name', '>=', search)
        // commented cause not properly working 
        .get()
        .then((snapshot)=>{ 
            let users = snapshot.docs.map((snap)=>{
                let data = snap.data()
                let id = snap.id;
                return {id,data}
            })
            users.map((data)=>{
                console.log(data.data.name)
            })
            setUsers(users)
        })
    }
    console.log("refresh")
  return (
    <View>
        <TextInput placeholder=' Search Your user' onChangeText={(string) => fetchUsers(string)} />
      <FlatList numColumns={1} horizontal = {false} data = {users}
        renderItem = { (item)=>{
            // console.log("mm")
            return(
            <TouchableOpacity
              onPress={()=>{props.navigation.navigate("Profile",{uid : item.item.id})}}
            ><Text>{`${item.item.data.name}`}</Text></TouchableOpacity>
        )}}
       />
    </View>
  )
}

export default Search

const styles = StyleSheet.create({})