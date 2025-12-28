import { Stack } from 'expo-router'
import React from 'react'

export default function ProductLayout() {
  return (
    
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Profile', headerShown: false }} />
      <Stack.Screen name="editProfile" options={{ title: 'editProfile', headerShown: false }} />
    </Stack>
  )
}