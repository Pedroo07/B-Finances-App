import { Link } from "expo-router";
import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { TextInput } from "react-native-paper";
import * as z from "zod";

const userSchema = z.object({
  email: z.email("Email Invalid"),
  password: z.string().min(8).max(14).regex(/[a-z]/).regex(/[0-9]/),
});

type User = z.infer<typeof userSchema>;

export default function Register() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>("");
  const signUp = async ({ email, password }: User) => {
    const parsed = userSchema.safeParse({ email, password });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error!.issues[0].message,
      };
    }
    try {
      const res = await fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
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
        if (message === "EMAIL_EXISTS") {
          return { success: false, error: "Este email já está cadastrado." };
        }

        if (message === "INVALID_EMAIL") {
          return { success: false, error: "Email inválido." };
        }

        if (message === "WEAK_PASSWORD") {
          return { success: false, error: "A senha é muito fraca." };
        }

        return { success: false, error: "Erro ao criar conta." };
      }
      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: "Error ao conectar ao servidor",
      };
    }
  };
  const handleRegister = async () => {
    const result = await signUp({ email, password });
    if (!result.success) {
      setErrorMessage(result.error);
    } else {
      setSuccessMessage("User cadastrado com sucesso");
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require("../assets/images/Logo.png")} />
        <Text style={styles.logo}>B-finances</Text>
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

        <Pressable style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
        <Text style={{ color: "#fff", fontWeight: "600" }}>
          If you have an account, <Link href="/">Login</Link>
        </Text>
        <Text>{errorMessage ? errorMessage : successMessage}</Text>
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
