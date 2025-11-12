import { Transaction } from "@/lib/entities/transaction";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";



type TransactionItem = {
  filteredItems : Transaction[]
  handleDeleteItem: (id: string) => void
}

export const Container = ({filteredItems , handleDeleteItem}: TransactionItem) => {
  return (
    <View>
      <FlatList
        data={filteredItems}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <View style={styles.transactionRow}>
            <View style={{ flexDirection: "column" }}>
              <Text style={[styles.listItem, { fontSize: 18 }]}>
                {item.description}
              </Text>
              <Text style={[styles.listItem, { color: "#0404f6" }]}>
                {item.date}
              </Text>
            </View>
            <View
              style={{
                width: 1,
                height: "70%",
                backgroundColor: "#1e293b",
                alignSelf: "center",
                borderRadius: 1,
              }}
            />
            <Text style={styles.listItem}>{item.category}</Text>
            <View
              style={{
                width: 1,
                height: "70%",
                backgroundColor: "#1e293b",
                alignSelf: "center",
                borderRadius: 1,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                gap: 16,
                alignItems: "center",
              }}
            >
              <Text
                style={[
                  styles.listItem,
                  {
                    color: String(item.amount).startsWith("-")
                      ? "#e00808"
                      : "#0f766e",
                  },
                ]}
              >
                {String(item.amount).startsWith("-")
                  ? `-$${String(item.amount).slice(1)}`
                  : `$${item.amount}`}
              </Text>

              <Text
                style={{ color: "#fff", fontWeight: 700 }}
                key={item.id}
                onPress={() => handleDeleteItem(item.id)}
              >
                X
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
   listItem: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
  },
  transactionRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 4,
    marginBottom: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
})
