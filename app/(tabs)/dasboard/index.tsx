import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
  Animated,
} from "react-native";
import "react-native-get-random-values";
import { ArrowDown, ArrowUpRight } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  List,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";
import { Transaction } from "@/lib/entities/transaction";
import { Container } from "@/components/container";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createNewItem,
  deleteTransactionItem,
  getUserCollection,
  TransactionDto,
} from "@/lib/services/transactions";
import { router } from "expo-router";

type Filter =
  | { type: "day"; day: number }
  | { type: "month"; month: number }
  | { type: "weekly"; start: Date; end: Date };

export default function Dashboard() {
  const [select, setSelect] = useState("month");
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  function createDateFromDDMM(ddmm: string): Date {
    const [year, month, day] = ddmm.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const [filter, setFilter] = useState<Filter>(() => ({
    type: "month",
    month: new Date().getMonth() + 1,
  }));
  const [items, setItems] = useState<TransactionDto[]>([]);
  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [date, setDate] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [selected, setSelected] = React.useState("Selected");
  const expenseOptions = ["Foods", "Fixes", "Entertainment", "Others"];
  const [expense, setExpense] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [logged, setLogged] = useState(true);

  const handleFecthTransaction = async () => {
    const transactions: TransactionDto[] = (await getUserCollection()) || [];
    setItems(transactions);
  };
  const filterByWeekly = () => {
    const today = new Date();
    const startWeek = new Date(today);
    startWeek.setDate(today.getDate() - today.getDay());
    startWeek.setHours(0, 0, 0, 0);

    const endWeek = new Date(startWeek);
    endWeek.setDate(startWeek.getDate() + 6);
    endWeek.setHours(23, 59, 59, 99);
    setFilter({ type: "weekly", start: startWeek, end: endWeek });
  };
  const filterByMonth = () => {
    const today = new Date();
    setFilter({ type: "month", month: today.getMonth() + 1 });
  };
  const filterByDay = () => {
    const today = new Date();
    setFilter({ type: "day", day: today.getDate() });
  };
  const filteredItems = items.filter((item) => {
    const dateItem = createDateFromDDMM(item.date);
    const dayOfMonth = dateItem.getDate();
    const month = dateItem.getMonth() + 1;

    switch (filter.type) {
      case "day":
        return dayOfMonth === filter.day;
      case "month":
        return month === filter.month;
      case "weekly":
        return (
          dateItem.getTime() >= filter.start.getTime() &&
          dateItem.getTime() <= filter.end.getTime()
        );
      default:
        return true;
    }
  });
  const sortItemByDate = (items: TransactionDto[]): TransactionDto[] => {
    return [...items].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };
  const dateHandleChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formated = "";

    if (cleaned.length >= 1) formated += cleaned.slice(0, 2);
    if (cleaned.length >= 3) formated += "/" + cleaned.slice(2, 4);
    if (cleaned.length >= 5) formated += "/" + cleaned.slice(4, 8);

    setDate(formated);
  };
  const calculateTotals = (
    items: Transaction[]
  ): { income: number; expense: number; balance: number } => {
    let totalIncome = 0;
    let totalExpense = 0;

    items.forEach((item) => {
      if (item.amount > 0) {
        totalIncome += item.amount;
      } else {
        totalExpense += item.amount;
      }
    });

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  };
  const handleAddNewItem = async () => {
    if (!description || !value || !date || !category) {
      alert("Preencha todos os campos!");
      return;
    }
    const newItem: Transaction = {
      amount: -value,
      category: category,
      date: date.replaceAll("/", "-").split("-").reverse().join("-"),
      description: description,
      type: "expense",
      paid: category === "Fixes" ? false : undefined,
    };
    const newTransaction = await createNewItem(newItem);
    const itemsArray = [...filteredItems, newTransaction];
    const sortedItems = sortItemByDate(itemsArray);
    setItems(sortedItems);

    const today = new Date();
    const currentYear = today.getFullYear();

    const filterItems = sortedItems.filter((item) => {
      const [year, month] = item.date.split("/").map(Number);

      return year === currentYear && month === new Date().getMonth() + 1;
    });
    const { income, expense, balance } = calculateTotals(filterItems);

    setIncome(income);
    setExpense(expense);
    setBalance(balance);
    setItems(sortedItems);

    setDialogVisible(false);
    setDescription("");
    setValue(0);
    setDate("");
    setSelected("Select Category");
    setCategory("");
  };
  const handleDeleteItem = async (id: string) => {
    await deleteTransactionItem(id);
    const deleteItem = items.filter((item) => item.id !== id);

    const sortedItems = sortItemByDate(deleteItem);

    const filterItems = sortedItems.filter((item) => {
      const [year, month, day] = item.date.split("/").map(Number);
      const dateItem = createDateFromDDMM(item.date);
      const dayOfMonth = dateItem.getDate();
      return day === dayOfMonth && month === new Date().getMonth() + 1;
    });

    const { income, expense, balance } = calculateTotals(filterItems);
    console.log(id);

    setIncome(income);
    setExpense(expense);
    setBalance(balance);
    setItems(sortedItems);
    handleFecthTransaction();
  };
  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem("token");
      setLogged(!!token);
      if (!logged) {
        router.replace("/login");
        return;
      }
      handleFecthTransaction();
    };
    checkLogin();
  }, []);

  useEffect(() => {
    const { income, expense, balance } = calculateTotals(filteredItems);
    setIncome(income);
    setExpense(expense);
    setBalance(balance);
  }, [filteredItems]);

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={{ padding: 16 }}>
          <Text style={{ fontWeight: 600, color: "#fff", fontSize: 22 }}>
            Hi, Welcome Back
          </Text>
        </View>
        <View style={styles.head}>
          <View style={styles.result}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ArrowDown color="white" size={14} />
              <Text style={styles.text}>Expense</Text>
            </View>
            <Text style={[styles.value, { color: "#e00808" }]}>${expense}</Text>
          </View>
          <View
            style={{
              width: 1,
              height: "60%",
              backgroundColor: "rgba(255,255,255,0.3)",
              marginHorizontal: 16,
              alignSelf: "center",
              borderRadius: 1,
            }}
          />
          <View style={styles.result}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ArrowUpRight color="white" size={14} />
              <Text style={styles.text}>Income</Text>
            </View>
            <Text style={[styles.value, { color: "#00f766" }]}>${income}</Text>
          </View>
          <View
            style={{
              width: 1,
              height: "60%",
              backgroundColor: "rgba(255,255,255,0.3)",
              marginHorizontal: 16,
              alignSelf: "center",
              borderRadius: 1,
            }}
          />
          <View style={styles.result}>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.text}>Balance</Text>
            </View>
            <Text
              style={[
                styles.value,
                {
                  color: "#3f7fe0",
                },
              ]}
            >
              ${balance}
            </Text>
          </View>
        </View>
        <View style={styles.transactionsContainer}>
          <View
            style={{
              flexDirection: "row",
              width: "85%",
              alignSelf: "center",
              padding: 6,
              backgroundColor: "#99cde9",
              borderRadius: 20,
            }}
          >
            <Pressable
              style={{ flex: 1 }}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                setSelect("day");
                filterByDay();
              }}
            >
              <Animated.View
                style={[
                  {
                    transform: [{ scale }],
                    borderRadius: 20,
                  },
                  select === "day" && { backgroundColor: "#4382ca" },
                ]}
              >
                <Animated.Text style={styles.listHeaderItem}>Day</Animated.Text>
              </Animated.View>
            </Pressable>
            <Pressable
              style={{ flex: 1 }}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                setSelect("weekly");
                filterByWeekly();
              }}
            >
              <Animated.View
                style={[
                  {
                    transform: [{ scale }],
                    borderRadius: 20,
                  },
                  select === "weekly" && { backgroundColor: "#4382ca" },
                ]}
              >
                <Animated.Text style={styles.listHeaderItem}>
                  Weekly
                </Animated.Text>
              </Animated.View>
            </Pressable>
            <Pressable
              style={{ flex: 1 }}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={() => {
                setSelect("month");
                filterByMonth();
              }}
            >
              <Animated.View
                style={[
                  {
                    transform: [{ scale }],
                    borderRadius: 20,
                  },
                  select === "month" && { backgroundColor: "#4382ca" },
                ]}
              >
                <Animated.Text style={styles.listHeaderItem}>
                  Month
                </Animated.Text>
              </Animated.View>
            </Pressable>
          </View>
          <Container
            filteredItems={filteredItems}
            handleDeleteItem={handleDeleteItem}
          />
        </View>
        <View>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => setDialogVisible(true)}
          >
            <Text
              style={{ fontSize: 32, color: "#f1f5f9", fontWeight: "bold" }}
            >
              +
            </Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Portal>
              <Dialog visible={dialogVisible} onDismiss={() => {}}>
                <Dialog.Title>Add new Transaction</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    style={styles.input}
                    label="Description"
                    value={description}
                    onChangeText={(description) => setDescription(description)}
                  />
                  <TextInput
                    style={styles.input}
                    label="Value"
                    value={value.toString()}
                    keyboardType="numeric"
                    onChangeText={(value) => setValue(Number(value))}
                  />
                  <TextInput
                    style={styles.input}
                    label="Date"
                    value={date}
                    onChangeText={dateHandleChange}
                    keyboardType="number-pad"
                    maxLength={10}
                  />
                  <Button
                    mode="outlined"
                    onPress={() => setShowOptions(!showOptions)}
                  >
                    {selected}
                  </Button>
                  {showOptions && (
                    <View>
                      {expenseOptions.map((option) => (
                        <List.Item
                          key={option}
                          title={option}
                          onPress={() => {
                            setSelected(option);
                            setCategory(option);
                            setShowOptions(false);
                          }}
                        />
                      ))}
                    </View>
                  )}
                </Dialog.Content>
                <Dialog.Actions>
                  <Button
                    onPress={() => {
                      setDialogVisible(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    onPress={() => {
                      handleAddNewItem();
                    }}
                  >
                    OK
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
  },
  text: {
    color: "#f1f5f9",
    fontSize: 14,
  },
  period: {
    paddingVertical: 4,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  value: {
    fontSize: 24,
    fontWeight: 600,
    color: "#f1f5f9",
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: "bold",
    fontSize: 36,
    color: "#9bafc4",
    marginBottom: 10,
  },
  titleList: {
    fontSize: 24,
    paddingVertical: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    color: "#1e293b",
  },
  result: {
    alignItems: "center",
    padding: 14,
    borderRadius: 8,
  },
  transactionsContainer: {
    flex: 1,
    backgroundColor: "#dde4eb",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 10,
    marginTop: 30,
  },
  listHeaderItem: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
    textAlign: "center",
    padding: 16,
  },
  transactionRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 4,
    marginBottom: 8,
    justifyContent: "space-around",
    alignItems: "center",
  },
  listItem: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "600",
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
  input: {
    marginBottom: 10,
  },
});
