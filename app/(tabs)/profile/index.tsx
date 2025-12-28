import { View, Pressable, Text, StyleSheet, Image } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { LogOut, Settings, UserRoundPen } from "lucide-react-native";

export default function Profile() {
  const SignOut = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
  };
  const EditProfile = () => {
    router.push("/(tabs)/profile/editProfile")
  }
  return (
    <View style={styles.container}>
      <View>
        <Text style={{color: "white", fontSize: 24, padding: 5, fontWeight: "600"}}>Profile</Text>
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
          <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={EditProfile}>
            <UserRoundPen  style={styles.Icon} />
            <Text style={styles.listItem}>Edit Profile</Text>
          </Pressable>
          <Pressable style={{ flexDirection: "row", alignItems: "center" }}>
            <Settings style={styles.Icon} />
            <Text style={styles.listItem}>Settings</Text>
          </Pressable>
          <Pressable style={{ flexDirection: "row", alignItems: "center" }} onPress={SignOut}>
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
