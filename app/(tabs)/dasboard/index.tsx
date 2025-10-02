import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { ArrowDown, ArrowUpRight, Equal } from "lucide-react-native";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  List,
  PaperProvider,
  Portal,
  TextInput,
} from "react-native-paper";
type Transaction =  {
    description: string
    date: string
    amount: number
    type: string
    id: string
    category: string
}

export default function Dashboard() {
  const headerData = [
    { key: "Description" },
    { key: "Value" },
    { key: "Category" },
    { key: "Date" },
  ];

  const [transactions, SetTransactions] = React.useState<Transaction[]>([
    {
      id: uuidv4(),
      description: "Salary",
      amount: 2500,
      date: "20/01",
      category: "Salary",
      type: "income",
    },
    {
      id: uuidv4(),
      description: "Groceries",
      amount: -150.0,
      date: "20/01",
      category: "Fixes",
      type: "expense",
    },
    {
      id: uuidv4(),
      description: "Rent",
      amount: -50,
      date: "20/01",
      category: "Foods",
      type: "expense",
    },
    {
      id: uuidv4(),
      description: "Rent",
      amount: -50,
      date: "20/01",
      category: "Foods",
      type: "expense",
    },
    {
      id: uuidv4(),
      description: "Rent",
      amount: -50,
      date: "20/01",
      category: "Foods",
      type: "expense",
    },
  ]);
  const [description, setDescription] = React.useState("");
  const [value, setValue] = React.useState(0);
  const [date, setDate] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [selected, setSelected] = React.useState("Selected");
  const expenseOptions = ["Foods", "Fixes", "Entertainment", "Others"];

  //funçoes
  const dateHandleChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 8) cleaned = cleaned.slice(0, 8);

    let formated = "";

    if (cleaned.length >= 1) formated += cleaned.slice(0, 2);
    if (cleaned.length >= 3) formated += "/" + cleaned.slice(2, 4);
    if (cleaned.length >= 5) formated += "/" + cleaned.slice(4, 8);

    setDate(formated);
  };
 

  const handleAddNewItem = () => {
    if (!description || !value || !date || !category) {
      alert("Preencha todos os campos!");
      return;
    }
    const newItem: Transaction = {
      amount: value,
      category: category,
      date: date,
      description: description,
      id: uuidv4(),
      type: "expense",
    };

    SetTransactions((prev) => [...prev, newItem]);

    setDialogVisible(false);
    setDescription("");
    setValue(0);
    setDate("");
    setSelected("Select Category");
    setCategory("");
  };
   const handleDeleteItem = (id: string) => {
    SetTransactions((currentItems) => {
      return currentItems.filter((item) => item.id !== id);
    })};

  return (
    <PaperProvider>
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
          <View
            style={{ flexDirection: "row", width: "92%", paddingVertical: 8 }}
          >
            {headerData.map((item, index) => (
              <View key={index} style={{ flex: 1, alignItems: "flex-start" }}>
                <Text style={styles.listHeaderItem} numberOfLines={1}>
                  {item.key}
                </Text>
              </View>
            ))}
          </View>
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
                    {
                      color: String(item.amount).startsWith("-")
                        ? "#e00808"
                        : "#0f766e",
                    },
                  ]}
                >
                  {item.amount}
                </Text>
                <Text style={styles.listItem}>{item.category}</Text>
                <Text style={styles.listItem}>{item.date}</Text>
                <Text style={{color: '#fff', fontWeight: 700 }} key={item.id} onPress={() =>  handleDeleteItem(item.id)}>X</Text>
              </View>
            )}
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
                  keyboardType="decimal-pad"
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
        </View>
      </View>
    </PaperProvider>
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
    paddingLeft: 10,
    marginVertical: 10,
  },
  listHeaderItem: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f1f5f9",
  },
  transactionRow: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  listItem: {
    fontSize: 16,
    width: "23%",
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
  input: {
    marginBottom: 10,
  },
});
