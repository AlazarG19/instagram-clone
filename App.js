import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import Landing from './components/auth/Landing'
import firebase from 'firebase/compat/app'
import { Platform, InteractionManager } from 'react-native'

import Main from './components/Main'
import Register from './components/auth/Register'
import Login from './components/auth/Login'
import { useState, useEffect } from 'react'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers/index'
import thunk from 'redux-thunk'
import Add from './components/main/Add'
import Save from './components/main/Save'
import Comment from './components/main/Comment'
const store = createStore(rootReducer, applyMiddleware(thunk))
const firebaseConfig = {
  apiKey: 'AIzaSyBdMcLNnT7e6bMXCeNWz9YZKpHar7YtLSk',
  authDomain: 'instagram-clone-1a84a.firebaseapp.com',
  projectId: 'instagram-clone-1a84a',
  storageBucket: 'instagram-clone-1a84a.appspot.com',
  messagingSenderId: '1031692451162',
  appId: '1:1031692451162:web:9c5431417a68def9214763',
  measurementId: 'G-0Z80G8H0KM',
}
let app
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app()
}
const Stack = createStackNavigator()
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoggedIn(false)
        setLoaded(true)
      } else {
        setLoggedIn(true)
        setLoaded(true)
      }
    })
    // code for timer warning
    const _setTimeout = global.setTimeout
    const _clearTimeout = global.clearTimeout
    const MAX_TIMER_DURATION_MS = 60 * 1000
    if (Platform.OS === 'android') {
      const timerFix = {}
      const runTask = (id, fn, ttl, args) => {
        const waitingTime = ttl - Date.now()
        if (waitingTime <= 1) {
          InteractionManager.runAfterInteractions(() => {
            if (!timerFix[id]) {
              return
            }
            delete timerFix[id]
            fn(...args)
          })
          return
        }
        const afterTime = Math.min(waitingTime, MAX_TIMER_DURATION_MS)
        timerFix[id] = _setTimeout(() => runTask(id, fn, ttl, args), afterTime)
      }
      global.setTimeout = (fn, time, ...args) => {
        if (MAX_TIMER_DURATION_MS < time) {
          const ttl = Date.now() + time
          const id = '_lt_' + Object.keys(timerFix).length
          runTask(id, fn, ttl, args)
          return id
        }
        return _setTimeout(fn, time, ...args)
      }
      global.clearTimeout = (id) => {
        if (typeof id === 'string' && id.startsWith('_lt_')) {
          _clearTimeout(timerFix[id])
          delete timerFix[id]
          return
        }
        _clearTimeout(id)
      }
    }
    // end of code for timer warning
  })
  console.log('logged in ', loggedIn, 'loaded', loaded)
  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Loading</Text>
      </View>
    )
  }
  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={Landing}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
          <Stack.Screen
            name="Main"
            component={Main}
            // options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Add"
            
            component={Add}
          />
          <Stack.Screen
            name="Save"
            component={Save}
          />
          <Stack.Screen
            name="Comment"
            component={Comment}
          />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
