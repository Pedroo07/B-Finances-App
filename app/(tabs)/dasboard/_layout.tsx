import { Stack } from 'expo-router'
import React from 'react'

export default function ProductLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Dashboard', headerShown: false }} />
    </Stack>
  )
}