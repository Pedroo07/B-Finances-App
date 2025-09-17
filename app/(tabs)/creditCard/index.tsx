import { Text, View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import React from "react";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Text style={{ color: "#f1f5f9" }}>Icon</Text>
          <Text style={styles.cardTitle}>CardName</Text>
        </View>
        <View style={styles.separator} />
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>Available</Text>
            <Text style={styles.text}>$500</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>Spent</Text>
            <Text style={styles.text}>$1800</Text>
          </View>
        </View>
      </View>
      <View style={{ width: "100%" }}>
        <Button style={styles.button}>
          <Text style={styles.text}>Add Card</Text>
        </Button>
        <Button style={styles.button}>
          <Text style={styles.text}>View Details</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    justifyContent: "space-around",
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  cardContent: {
    backgroundColor: "#1e293b",
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 36,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  cardTitle: {
    color: "#f1f5f9",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  separator: {
    borderBottomColor: "#a8a3a3",
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#f1f5f9",
  },
  button: {
    backgroundColor: "#1e293b",
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderRadius: 8,
  },
});
