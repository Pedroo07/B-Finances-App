import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import transactions from "../../../transactions.json";
import { Transaction } from "@/lib/entities/transaction";
import Period from "@/app/(tabs)/dasboard/period";
import { Checkbox } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";

export default function HomeScreen() {
   const screenWidth = Dimensions.get("window").width;
  const [items] = useState<Transaction[]>(
    transactions.map((item) => ({ ...item, id: uuidv4() }))
  );
  const [filteredItems, setFilteredItems] = useState<Transaction[]>([]);
  const [activeFilter, setActiveFilter] = useState("month");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    () => new Date().getMonth() + 1
  );
  const togglePaid = (id: string) => {
    setFilteredItems((prevItem) =>
      prevItem.map((item) =>
        item.id === id ? { ...item, paid: !item.paid } : item
      )
    );
  };
  const separateByCategory = (items: Transaction[]) => {
    const totalExpenses = items
      .filter((item) => item.amount < 0)
      .reduce((acc, item) => acc + Math.abs(item.amount), 0);
    const expensesByCategory: Record<string, number> = {};
    items.forEach((item) => {
      if (item.amount < 0) {
        if (!expensesByCategory[item.category]) {
          expensesByCategory[item.category] = 0;
        }
        expensesByCategory[item.category] += Math.abs(item.amount);
      }
    });
    const chartData = Object.entries(expensesByCategory).map(
      ([category, amount]) => ({
        category,
        amount,
      })
    );

    const percentageData = Object.entries(expensesByCategory).map(
      ([category, value]) => ({
        category,
        value: (value / totalExpenses) * 100,
      })
    );
    return { chartData, percentageData };
  };
  const handleMonthChange = (newMonth: number) => {
    setSelectedMonth(newMonth);
    setActiveFilter("month");
  };
  useEffect(() => {
    const today = new Date();
    const currentYear = today.getFullYear();

    if (activeFilter !== "month") return;
    const filteredItems = items.filter((item) => {
      const [day, month] = item.date.split("/").map(Number);
      const year = currentYear;
      return year === new Date().getFullYear() && month === selectedMonth;
    });
    setFilteredItems(filteredItems);
  }, [selectedMonth, items]);

  const result = separateByCategory(filteredItems);

  return (
    <View style={styles.container}>
      <View style={{ width: "90%" }}>
        <Period
          selectedMonth={selectedMonth}
          onMonthChange={handleMonthChange}
        />
      </View>
      <BarChart
        style={{ marginVertical: 8, borderRadius: 8, alignItems: "center" }}
        data={
          result.chartData.length
            ? {
                labels: result.chartData.map((item) => item.category),
                datasets: [
                  { data: result.chartData.map((item) => item.amount) },
                ],
              }
            : {
                labels: ["Sem dados"],
                datasets: [{ data: [0] }],
              }
        }
        width={screenWidth * 0.9}
        height={220}
        fromZero
        yAxisLabel="R$"
        yAxisSuffix=",00"
        chartConfig={{
          backgroundColor: "#292f3a",
          backgroundGradientFrom: "#42526b",
          backgroundGradientFromOpacity: 0,  
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 200, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          propsForLabels:{
            fontSize: 10,
            fontWeight: "600"
          },
        }}
        
        verticalLabelRotation={30}
      />
      <View style={{ width: "100%", alignItems: "center", marginTop: 20 }}>
        <FlatList
          contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
          data={filteredItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listTransaction}>
              <View style={styles.row}>
                <Text style={[styles.itemCategory, { fontWeight: "600" }]}>
                  {item.category}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.paid !== undefined && (
                    <Checkbox
                      status={item.paid ? "checked" : "unchecked"}
                      color="#007AFF"
                      uncheckedColor="#000"
                      theme={{ colors: { background: "#000" } }}
                      onPress={() => {
                        togglePaid(item.id);
                      }}
                    />
                  )}
                  <Text style={styles.itemTransaction}>{item.description}</Text>
                </View>
                <Text style={styles.itemTransaction}>{item.date}</Text>
              </View>
              <View style={styles.row}>
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
                {item.paid !== undefined && (
                  <Text
                    style={[
                      styles.status,
                      { backgroundColor: item.paid ? "#45db09" : "#a7811b" },
                    ]}
                  >
                    {item.paid ? "Pago" : "Em aberto"}
                  </Text>
                )}
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
    borderRadius: 6,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    minWidth: "90%",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f1f5f9",
  },
  itemTransaction: {
    fontSize: 16,
    fontWeight: "500",
    padding: 4,
  },
  row: {
    flexDirection: "column",
  },
  itemCategory: {
    fontSize: 12,
    fontWeight: "600",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ccc",
    textAlign: "center",
  },
  status: {
    fontSize: 12,
    fontWeight: "600",
    padding: 1,
    borderRadius: 8,
    textAlign: "center",
    opacity: 0.8,
  },
});
