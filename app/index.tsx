import { Link, Redirect, useRouter} from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { TextInput } from "react-native-paper";
import * as z from "zod";


const userSchema = z.object({
  email: z.email("Email Invalid"),
  password: z.string().min(8).max(14).regex(/[a-z]/).regex(/[0-9]/),
});
type User = z.infer<typeof userSchema>;
export default function Login() {
  const router = useRouter()
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [successMessage, setSuccessMessage] = useState("")

  const SignIn = async ({ email, password }: User) => {
    const parsed = userSchema.safeParse({ email, password });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0].message,
      };
    }
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            returnSecureToken: true,
          }),
        }
      );
      const data = await res.json();
      if (data.error) {
        const message = data.error.message;
        if (message === "EMAIL_NOT_FOUND")
          return {
            success: false,
            error: "user does not exist",
          };
        if (message === "INVALID_PASSWORD")
          return {
            success: false,
            error: "The password is invalid.",
          };
        if (message === "USER_DISABLED")
          return {
            success: false,
            error: "The user account has been disabled by an administrator.",
          };
        return { success: false, error: "Error logging in" };
      }
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: "Error connecting to the server.",
      };
    }
  };

  const handleSignIn = async () => {
    const result = await SignIn({email, password})
    if(!result.success){
      setErrorMessage(result.error)
    }else{
      console.log(result)
      router.navigate('/(tabs)/dasboard')
    }
    
  }

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

        <Pressable
          style={styles.button}
          onPress={handleSignIn}
        >
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          If you don’t have an account,{" "}
          <Link href="/register">Register Now</Link>
        </Text>
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
