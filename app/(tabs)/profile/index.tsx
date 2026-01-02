import { View, Pressable, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { LogOut, Settings, UserRoundPen } from "lucide-react-native";

export default function Profile() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState("");
  const getUser = async () => {
    const token = await AsyncStorage.getItem("token");
    const name = await AsyncStorage.getItem("userName");
    const userImg = await AsyncStorage.getItem("userImg");
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDu_MJeDE9MajCCqXvfXrNUiyIPgytEj9o",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: token,
        }),
      }
    );
    const data = await res.json();
    setUserEmail(data.users[0].email);
    setImageUrl(userImg ? userImg : "");
    setUsername(name ? name : "UserName");
  };
  const SignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };
  useEffect(() => {
    getUser();
  }, []);
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
            {imageUrl === "" ? (
              <Image
                source={require("../../../assets/images/userImg.png")}
                style={styles.Image}
              />
            ) : (
              <Image
                source={{
                  uri: imageUrl,
                }}
                style={styles.Image}
              />
            )}

            <Text style={styles.username}>{username}</Text>
            <Text>{userEmail}</Text>
          </View>
          <View
            style={{ flexDirection: "row", alignItems: "center" }}
            
          >
            <UserRoundPen style={styles.Icon} />
            <Link href="/profile/editProfile" style={styles.listItem}>Edit Profile</Link>
          </View>
          <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
            <Settings style={styles.Icon} />
            <Text style={styles.listItem}>Settings</Text>
          </Pressable>
          <Pressable
            style={{ flexDirection: "row", alignItems: "center" }}
            onPress={SignOut}
          >
            <LogOut style={styles.Icon} />
            <Text style={styles.listItem}>Logout</Text>
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
  listItem: {
    padding: 2,
    fontSize: 20,
    fontWeight: "600",
  },
  Icon: {
    width: 35,
    height: 35,
    backgroundColor: "#428ee6",
    alignItems: "center",
    borderRadius: 15,
    padding: 4,
  },
});
