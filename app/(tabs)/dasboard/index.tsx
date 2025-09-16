import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { ArrowDown, ArrowUpRight, Equal } from "lucide-react-native";
import React from "react";

export default function Dashboard() {
  const headerData = [
    { key: "Description" },
    { key: "Value" },
    { key: "Date" },
  ];

  const transactions = [
    { description: "Salary", value: "2,500.00", date: "Apr 20" },
    { description: "Groceries", value: "-150.00", date: "Apr 18" },
    { description: "Rent", value: "-50.00", date: "Apr 01" },
    { description: "Rent", value: "-50.00", date: "Apr 01" },
    { description: "Rent", value: "-50.00", date: "Apr 01" },
    { description: "Rent", value: "-50.00", date: "Apr 01" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <View style={styles.head}>
        <View style={[styles.result, { backgroundColor: "#e00808" }]}>
          <ArrowDown color="white" size={40} />
          <Text style={styles.text}>Expense</Text>
          <Text style={styles.text}>$500,00</Text>
        </View>
        <View style={[styles.result, { backgroundColor: "#0f766e" }]}>
          <ArrowUpRight color="white" size={40} />
          <Text style={styles.text}>Income</Text>
          <Text style={styles.text}>$2,500</Text>
        </View>
        <View style={[styles.result, { backgroundColor: "#918d8d" }]}>
          <Equal color="white" size={40} />
          <Text style={styles.text}>Total</Text>
          <Text style={styles.text}>$2,000</Text>
        </View>
      </View>
      <View style={styles.transactionsContainer}>
        <Text style={styles.titleList}>Transaction List</Text>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 10, alignItems: "center" }}
          data={headerData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => (
            <Text
              style={[
                styles.listHeaderItem,
                { marginRight: index < headerData.length - 1 ? 20 : 0 },
              ]}
            >
              {item.key}
            </Text>
          )}
        />
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <View style={styles.transactionRow}>
              <Text style={styles.listItem}>{item.description}</Text>
              <Text
                style={[
                  styles.listItem,
                  { color: item.value.startsWith("-") ? "#e00808" : "#0f766e" },
                ]}
              >
                {item.value}
              </Text>
              <Text style={styles.listItem}>{item.date}</Text>
            </View>
          )}
        />
      </View>
      <TouchableOpacity style={styles.fab}>
        <Text style={{ fontSize: 32, color: "#f1f5f9", fontWeight: "bold" }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  text: {
    color: "#f1f5f9",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 36,
    color: "#f1f5f9",
    marginBottom: 10,
  },
  titleList: {
    fontSize: 24,
    paddingVertical: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#f1f5f9",
  },
  result: {
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
  },
  transactionsContainer: {
    borderWidth: 1,
    borderColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  listHeaderItem: {
    fontSize: 18,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listItem: {
    fontSize: 16,
    width: "30%",
    color: "#f1f5f9",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#1e293b",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
