import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
export default function HomeScreen() {
  const [logged, setLogged] = useState(false)

  useEffect(()=>{
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token")
      setLogged(!!token)
    }

    checkLogin()
  },[])

  if(!logged){
    router.replace("..")
  }
  return (
    
    <View>
      <Text>Hello World</Text>
    </View>
  );
}
