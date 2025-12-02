import { Container } from "@/components/container";
import { Transaction } from "@/lib/entities/transaction";
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { v4 as uuidv4 } from "uuid";
import credits from "../../../credits.json";
import { GraphicPie } from "@/components/graphic";

export default function CardPage() {
  const [items, setItems] = useState<Transaction[]>(
    credits.map((item) => ({ ...item, id: uuidv4() }))
  );

  const filteredItems = items.filter((item) => {
    const [day, month] = item.date.split("/").map(Number);

    if (month === new Date().getMonth() + 1) return true;
  });

  const sortItemByDate = (items: Transaction[]): Transaction[] => {
    return [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  const cauculateTotal = () => {
    let TotalExpense = 0;
    items.forEach((item) => (TotalExpense += Math.abs(item.amount)));
    return TotalExpense;
  };

  const handleDeleteItem = (id: string) => {
    const deleteItem = items.filter((item) => item.id !== id);

    setItems(sortItemByDate(deleteItem));
  };
  const colors = [
    "#093a83",
    "#114b8d",
    "#0658a0",
    "#1976D2",
    "#0B3C91",
    "#08306B",
  ];

  const results = filteredItems.map((item, index) => ({
    ...item,
    name: item.description,
    amount: Math.abs(item.amount),
    color: colors[index % colors.length],
    legendFontColor: "#fff",
    legendFontSize: "14",
  }));
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Credit Card</Text>
          <View
            style={{
              backgroundColor: '#1e293b',
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
              ${cauculateTotal()}.00
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
      <GraphicPie result={results} acessor={"amount"} />
      <View style={styles.transactionsContainer}>
        <Container
          filteredItems={filteredItems}
          handleDeleteItem={handleDeleteItem}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f1f5f9",
    marginBottom: 10,
    marginTop: 20,
    textAlign: "center",
    textTransform: "uppercase",
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: "#dde4eb",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    marginTop: 30,
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
