import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import UserListScreen from './component/UserListScreen'
import UserPostScreen from './component/UserPostScreen'

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='UserList' component={UserListScreen} options={{ headerShown: false, statusBarColor: "#515adc" }}/>
        <Stack.Screen name='UserPost' component={UserPostScreen} options={{ headerShown: false, statusBarColor: "#515adc" }}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({})  