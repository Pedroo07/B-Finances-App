import { View, Text, FlatList, StyleSheet } from "react-native";
import React from "react";

export default function HomeScreen() {
  const headerData = [{ key: "Type" }, { key: "Date" }, { key: "Category" }];
  const transactionsData = [
    { description: "Salary", amount: 600, category: "Income", date: "Jan 24" },
    {
      description: "Groceries",
      amount: -120,
      category: "Food",
      date: "Jan 25",
    },
    {
      description: "Netflix",
      amount: -30,
      category: "Entertainment",
      date: "Jan 26",
    },
  ];

  return (
    <View style={styles.container}>
      <View style={{ width: "90%" }}>
        <Text style={styles.title}>Transactions</Text>
        <FlatList
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: 10,
          }}
          data={headerData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index }) => (
            <Text
              style={[
                styles.listItem,
                {
                  color: "#f1f5f9",
                  fontWeight: "bold",
                  marginRight: index < headerData.length - 1 ? 16 : 0,
                },
              ]}
            >
              {item.key}
            </Text>
          )}
        />
      </View>

      <View style={styles.graph}>
        <Text>Grafico</Text>
      </View>

      <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
        <FlatList
          contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
          data={transactionsData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listTransaction}>
              <View style={styles.row}>
                <Text style={[styles.itemTransaction, { fontWeight: "600" }]}>
                  {item.description}
                </Text>
                <Text
                  style={[
                    styles.itemTransaction,
                    {
                      color: item.amount > 0 ? "#164e0b" : "#8b0000",
                      fontWeight: "600",
                    },
                  ]}
                >
                  {item.amount > 0
                    ? `+R$${item.amount},00`
                    : `-R$${Math.abs(item.amount)},00`}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.row}>
                <Text style={styles.itemTransaction}>{item.category}</Text>
                <Text style={styles.itemTransaction}>{item.date}</Text>
              </View>
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
    paddingHorizontal: 20,
    alignItems: "center",
    backgroundColor: "#1e293b",
  },
  title: {
    fontWeight: "bold",
    fontSize: 36,
    color: "#f1f5f9",
    marginVertical: 20,
    alignSelf: "flex-start",
  },
  listItem: {
    fontSize: 14,
    borderWidth: 1.6,
    borderColor: "#f1f5f9",
    paddingVertical: 12,
    paddingHorizontal: 16,
    textAlign: "center",
    borderRadius: 4,
  },
  graph: {
    width: "80%",
    height: 160,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6,
    alignSelf: "center",
    marginTop: 20,
  },
  listTransaction: {
    borderWidth: 1,
    borderRadius: 6,
    width: "90%",
    marginBottom: 12,
    padding: 8,
    backgroundColor: "#f1f5f9",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  separator: {
    height: 1,
    backgroundColor: "#000",
    marginVertical: 4,
  },
  itemTransaction: {
    fontSize: 16,
    fontWeight: "500",
    padding: 4,
  },
});
