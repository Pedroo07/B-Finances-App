import { View, Text, StyleSheet, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { ArrowDown, ArrowUpRight, Equal } from "lucide-react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.head}>
          <View style={styles.result}>
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
      </View>
      <View
        style={{
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: "#555252",
          margin: 10,
        }}
      >
        <View>
          <Text style={styles.titleList}>Transaction List</Text>
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
            horizontal
            style={{
              ...styles.list,
              borderBottomWidth: 1,
              borderColor: "#555252",
              paddingRight: 30,
            }}
            data={[{ key: "Description" }, { key: "Value" }, { key: "Date" }]}
            renderItem={({ item }) => (
              <Text
                style={[
                  styles.listItem,
                  { color: "#5a5757", fontWeight: "semibold" },
                ]}
              >
                {item.key}
              </Text>
            )}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <FlatList
            style={styles.list}
            data={[{ key: "salary" }, { key: "Gorcieries" }, { key: "rent" }]}
            renderItem={({ item }) => (
              <Text style={styles.listItem}>{item.key}</Text>
            )}
          />
          <FlatList
            data={[{ key: "2,500,00" }, { key: "-150,00" }, { key: "-50,00" }]}
            renderItem={({ item }) => (
              <Text style={styles.listItem}>{item.key}</Text>
            )}
          />
          <FlatList
            style={styles.list}
            data={[{ key: "apr20" }, { key: "apr18" }, { key: "apr01" }]}
            renderItem={({ item }) => (
              <Text style={styles.listItem}>{item.key}</Text>
            )}
          />
        </View>
      </View>
      <Button>+</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    boxSizing: "border-box",
    flex: 1,
    backgroundColor: "#fff",
    gap: 12,
  },
  text: {
    color: "#fff",
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 36,
    color: "#1e293b",
    padding: 20,
  },
  titleList: {
    fontSize: 24,
    padding: 12,
    fontWeight: "semibold",
    textTransform: "uppercase",
  },
  result: {
    alignItems: "center",
    backgroundColor: "#e00808",
    padding: 14,
    borderRadius: 8,
  },
  list: {
    display: "flex",
    padding: 4,
  },
  listItem: {
    padding: 10,
    fontSize: 18,
  },
});
