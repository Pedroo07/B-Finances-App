import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getUserCollection, TransactionDto } from "@/lib/services/transactions";
import { Transaction } from "@/lib/entities/transaction";
import Period from "@/app/(tabs)/dasboard/period";
import {
  Button,
  Checkbox,
  IconButton,
  Modal,
  Portal,
} from "react-native-paper";
import { GraphicBar } from "@/components/graphic";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { format, parse } from "date-fns";

type Filter = {
  paid: boolean | null;
  categories: string[];
  month: number;
};

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);
  const [items, setItems] = useState<TransactionDto[]>([]);
  const handleFecthTransaction = async () => {
    const transactions: TransactionDto[] = (await getUserCollection()) || [];
    const filterItems = transactions.filter((item) => item.amount < 0);
    setItems(filterItems);
  };
  const [filter, setFilter] = useState<Filter>({
    paid: null,
    categories: [],
    month: new Date().getMonth() + 1,
  });
  const togglePaid = (id: string) => {
    setItems((prevItem) =>
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
    setFilter((currentFilter) => ({ ...currentFilter, month: newMonth }));
  };
  const filteredItems = items.filter((item) => {
    const [year, month, day] = item.date.split("-").map(Number);

    if (month !== filter.month) return false;

    if (
      filter.categories.length > 0 &&
      !filter.categories.includes(item.category)
    )
      return false;

    if (filter.paid !== null && item.paid !== filter.paid) return false;

    return true;
  });
  const result = separateByCategory(filteredItems);

  const categories = ["foods", "fixes", "others"]

  const paidOptions = [
    {
      label: "Paid",
      value: true,
    },
    { label: "Not Paid", value: false },
  ];
  const formatData = (text: string) => {
    const parsed = parse(text, "yyyy-MM-dd", new Date());
    return format(parsed, "dd/MM");
  };
  const toggleCategory = (category: string) => {
    setFilter((prev) => {
      const exist = prev.categories.includes(category);
      return {
        ...prev,
        categories: exist
          ? prev.categories.filter((c: string) => c !== category)
          : [...prev.categories, category],
      };
    });
  };
  const selectPaid = (value: boolean | null) => {
    if (filter.paid === value) {
      setFilter({ ...filter, paid: null });
    } else {
      setFilter({ ...filter, paid: value });
    }
  };
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }
      
      handleFecthTransaction();
      
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "90%",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Period
          selectedMonth={filter.month}
          onMonthChange={handleMonthChange}
        />
        <IconButton icon="filter-variant" onPress={openModal} />
      </View>
      <GraphicBar result={result} />
      <View
        style={{ width: "100%", alignItems: "center", marginTop: 20, flex: 1 }}
      >
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
                      onPress={() => togglePaid(item.id)}
                    />
                  )}
                  <Text style={styles.itemTransaction}>{item.description}</Text>
                </View>
                <Text style={styles.itemTransaction}>
                  {formatData(item.date)}
                </Text>
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
                    {item.paid ? "Paid" : "Payable"}
                  </Text>
                )}
              </View>
            </View>
          )}
        />
      </View>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={styles.modal}
        >
          <Text style={styles.title}>Filtrar por categoria</Text>
          <FlatList
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = filter.categories.includes(item);
              return (
                <TouchableOpacity
                  onPress={() => toggleCategory(item)}
                  style={{
                    backgroundColor: isSelected ? "#3b82f6" : "#374151",
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{item}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item}
          />

          <Text style={styles.title}>Filtrar por Status</Text>
          <FlatList
            data={paidOptions}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = filter.paid === item.value;
              return (
                <TouchableOpacity
                  onPress={() => selectPaid(item.value)}
                  style={{
                    backgroundColor: isSelected ? "#3b82f6" : "#374151",
                    paddingVertical: 6,
                    paddingHorizontal: 14,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                >
                  <Text style={{ color: "white" }}>{item.label}</Text>
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item.label}
          />

          <Button
            mode="contained"
            onPress={closeModal}
            style={{ marginTop: 16 }}
          >
            Aplicar Filtros
          </Button>
        </Modal>
      </Portal>
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
  modal: {
    backgroundColor: "#1e293b",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  card: {
    marginVertical: 4,
    marginHorizontal: 4,
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
    backgroundColor: "#7c90a3",
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
    backgroundColor: "#b4b4b4",
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
