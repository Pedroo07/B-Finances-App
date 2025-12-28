import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-paper";
import { updateEmail, updatePassword } from "@/lib/services/user";
import z from "zod";


export default function EditProfile() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleUpdateUser = async () => {
    if (email) {
      const data = await updateEmail({ email });
      return data;
    }
    if (password) {
      const data = await updatePassword({password})
      return data
    } else {
      
    }
  };
  return (
    <View style={styles.container}>
      <View>
        <Text
          style={{
            color: "white",
            fontSize: 24,
            padding: 5,
            fontWeight: "600",
          }}
        >
          Profile
        </Text>
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.contentContainer}>
          <View style={styles.imgContainer}>
            <Image
              source={require("../../../assets/images/userImg.jpg")}
              style={styles.Image}
            />
            <Text style={styles.username}>UserName</Text>
            <Text>Email</Text>
          </View>
          <View>
            <Text
              style={{ fontSize: 18, fontWeight: "500", paddingBottom: 20 }}
            >
              Account Settings
            </Text>
            <View>
              <Text>Password</Text>
              <TextInput
                label="password"
                style={styles.TextInput}
                mode="outlined"
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <View>
              <Text>Email Adress</Text>
              <TextInput
                label="email"
                style={styles.TextInput}
                mode="outlined"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
          <Pressable onPress={handleUpdateUser} style={styles.button}>
            <Text style={{ color: "white" }}>Update Profile</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
  profileContainer: {
    flex: 1,
    backgroundColor: "#dde4eb",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 10,
    marginTop: 30,
  },
  Image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  imgContainer: {
    justifyContent: "center",
    alignItems: "center",
    top: -40,
  },
  contentContainer: {
    paddingLeft: 10,
    flexDirection: "column",
    textAlign: "center",
    gap: 40,
  },
  username: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
  },
  TextInput: {
    borderRadius: 10,
    fontSize: 14,
    backgroundColor: "#1e293b45",
    width: "auto",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: "#1e293b",
    width: 140,
  },
});
