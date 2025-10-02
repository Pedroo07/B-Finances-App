import React from "react";
import { FlatList, Text, View, StyleSheet } from "react-native";

export default function HomeScreen() {
  const transactions = [
    { description: "Groceries", value: "150.00" },
    { description: "Rent", value: "50.00" },
    { description: "Rent", value: "50.00" },
    { description: "Rent", value: "50.00" },
    { description: "Rent", value: "50.00" },
  ];
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Credit Card</Text>
        <View
          style={{
            backgroundColor: "#1e293b",
            padding: 20,
            borderRadius: 8,
            marginTop: 10,
            marginBottom: 10,
            width: "100%",
          }}
        >
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 32,
              fontWeight: "800",
            }}
          >
            $1,280.45
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            maxWidth: "auto",
          }}
        >
          <Text style={{ fontWeight: "500", color: "#1e293b" }}>Month</Text>
          <Text style={{ fontWeight: "500", color: "#1e293b" }}>Ouctober</Text>
        </View>
      </View>
      <View style={styles.graph}>
        <Text>Grafico</Text>
      </View>
      <View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            textTransform: "uppercase",
            padding: 10,
            color: "#1e293b",
          }}
        >
          Trasactions
        </Text>
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Text>I</Text>
                <Text style={styles.listItem}>{item.description}</Text>
              </View>
              <Text style={[styles.listItem, { color: "#e00808" }]}>
                {item.value}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  graph: {
    width: "80%",
    height: 160,
    backgroundColor: "#1e293b",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    alignSelf: "center",
    marginTop: 20,
  },
  transactionRow: {
    flexDirection: "row",
    width: "100%",
    padding: 15,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  listItem: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
});
