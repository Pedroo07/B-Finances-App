import { View, Pressable } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function User() {
  const SignOut = async () => {
         await AsyncStorage.removeItem("token");
         router.replace("/login");
    }
  return (
    <View>
      <Pressable onPress={SignOut}>Log-out</Pressable>
    </View>
  );
}
