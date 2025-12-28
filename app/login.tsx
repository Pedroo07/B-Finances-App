import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { TextInput } from "react-native-paper";
import { signIn } from "@/lib/services/user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleSignIn = async () => {
    const result = await signIn({ email, password });
    if (!result.success) {
      setErrorMessage(result.error);
    } else {
      await AsyncStorage.setItem("token", result.data.idToken);
      await AsyncStorage.setItem("userId", result.data.localId);
      await AsyncStorage.setItem("idToken", result.data.idToken);
      router.navigate("/(tabs)");
    }
  };
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        router.navigate("/(tabs)");
      }
    };

    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/images/Logo.png")} />
      </View>

      <View style={styles.form}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          mode="outlined"
          activeOutlineColor="#3b82f6"
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          mode="outlined"
          secureTextEntry
          activeOutlineColor="#3b82f6"
        />

        <Pressable style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          If you don’t have an account,{" "}
          <Link href="/register">Register Now</Link>
        </Text>
        <Text style={{ color: "red" }}>{errorMessage}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 40,
    backgroundColor: "#475569",
    alignItems: "center",
  },
  logo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  form: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
