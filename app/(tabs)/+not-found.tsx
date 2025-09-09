import {  Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <Text>Not Found 404</Text>
    </View>
  );
}

const styles = StyleSheet.create({
});
