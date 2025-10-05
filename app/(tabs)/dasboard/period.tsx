import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { ChevronDown } from "lucide-react-native"; 

type PeriodProps = {
  selectedMonth: number;
  onMonthChange: (month: number) => void;
};

const Period: React.FC<PeriodProps> = ({ selectedMonth, onMonthChange }) => {
  const [visible, setVisible] = useState(false);
  const months = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: new Date(0, i).toLocaleString("en-US", { month: "long" }),
  }));

  const currentYear = new Date().getFullYear();

  const handleSelect = (index: number) => {
    onMonthChange(index + 1);
    setVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.text}>{`${months[selectedMonth - 1]?.name || "Choose the Month"} ${currentYear}`}</Text>
        <ChevronDown size={20} color="#ccc" />
      </TouchableOpacity>

      <Modal transparent visible={visible} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          <View style={styles.modal}>
            <FlatList
              data={months}
              keyExtractor={( item ) => item.id.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[
                    styles.item,
                    index + 1 === selectedMonth && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(index)}
                >
                  <Text
                    style={[
                      styles.itemText,
                      index + 1 === selectedMonth && styles.selectedItemText,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
    marginVertical: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ccc",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: 12,
    width: 250,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 5,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  selectedItem: {
    backgroundColor: "#fee2e2",
  },
  itemText: {
    fontSize: 16,
    color: "#334155",
  },
  selectedItemText: {
    color: "#ccc",
    fontWeight: "600",
  },
});

export default Period;
