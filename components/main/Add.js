import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { Camera } from 'expo-camera'
import { Button } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
export default function Add({navigation}) {
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [camera, setCamera] = useState(null)
  const [image, setImage] = useState(null)
  const [isFocused,setIsFocused] = useState(true)
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasPermission(cameraStatus.status === 'granted')
      const galleryStatus = await ImagePicker.getCameraPermissionsAsync()
      setHasGalleryPermission(galleryStatus.status === 'granted')
    })()
  }, [])

  if (hasPermission === null || hasGalleryPermission === false) {
    return <View />
  }
  if (hasPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera or gallery</Text>
  }
  const takepicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync(null)
      setImage(data.uri)
    }
  }
  const pickImage = async () => {
    setIsFocused(false)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })
    console.log(result.uri)
    if (!result.cancelled) {
      setImage(result.uri)
    }else{
      setIsFocused(true)
    }
  }
  return (
    <View style={styles.container}>
      {isFocused ? (
        <View style={styles.cameraContainer}>
          <Camera
            ref={(ref) => setCamera(ref)}
            style={styles.camera}
            type={type}
            ration={'1:1'}
          ></Camera>
        </View>
      ) : (
        <View />
      )}
      <Button
        style={styles.button}
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back,
          )
        }}
        title={'Flip Image'}
      />
      <Button title="Take Picture" onPress={takepicture} />
      <Button title="Pick Picture From Galery" onPress={pickImage} />
      <Button title="Save" onPress={()=> navigation.navigate("Save",{image})} />
      {image && <Image style={styles.image} source={{ uri: image }} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  camera: {
    flex: 1,
    aspectRatio: 1,
  },
  button: {},
  image: {
    flex: 1,
  },
})
