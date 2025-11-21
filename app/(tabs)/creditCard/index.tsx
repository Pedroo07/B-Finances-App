import { Text, View, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Image } from "react-native";
import { Button, Dialog, List, Portal, TextInput } from "react-native-paper";
import cardStyles from "../../../cards.json";
import { CardProps, BanksDB } from "@/lib/entities/cardProps";
import React, { useState } from "react";
import { logos } from "@/assets/images/cardsLogo";

const typedCards = cardStyles as BanksDB;

export default function HomeScreen() {
  const [dialogVisible, setDialogVisible] = useState(false)
  const [cardName, setCardName] = useState("")
  const [cardLimit, setCardLimit] = useState(0)
  const [cardDueDate, setCardDueDate] = useState("")
   const [showOptions, setShowOptions] = useState(false);
   const [selected, setSelected] = React.useState("Selected");

  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const cardInfo: CardProps | null = selectedCard
    ? typedCards[selectedCard]
    : null;


     const dateHandleChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");

    if (cleaned.length > 4) cleaned = cleaned.slice(0, 4);

    let formated = "";

    if (cleaned.length >= 1) formated += cleaned.slice(0, 2);
    if (cleaned.length >= 3) formated += "/" + cleaned.slice(2, 4);

    setCardDueDate(formated);
  };
  const handleAddNewCard = () => {
    if (!cardName || !cardDueDate || !cardLimit){
      alert("Preencha os campo tio")
      return
    }
    setSelectedCard(selected)

    
  }

  return (
    <View style={styles.container}>
      {cardInfo && (
        <View style={[styles.cardContent, {backgroundColor: cardInfo.secondaryColor}]}>   
          <View style={styles.cardHeader}>
            <Image source={logos[cardInfo.logo]} style={styles.logo}/>
            <Text style={styles.cardTitle}>{cardName}</Text>
          </View>
          <View style={styles.separator} />
          <View>
            <View style={styles.row}>
              <Text style={styles.text}>Available</Text>
              <Text style={styles.text}>$500</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Spent</Text>
              <Text style={styles.text}>$1800</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Due Date</Text>
              <Text style={styles.text}>{cardDueDate}</Text>
            </View>
          </View>
        </View>
      )}
      <View style={{ width: "100%" }}>
        <View>
          <TouchableOpacity style={styles.button} onPress={() => setDialogVisible(true)}>
            <Text style={styles.text}>Add Card</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Portal>
              <Dialog visible={dialogVisible} onDismiss={() => {}}>
                <Dialog.Title>Add new Card</Dialog.Title>
                <Dialog.Content>
                  <TextInput
                    style={styles.input}
                    label="CardName"
                    value={cardName}
                    onChangeText={(CardName) => setCardName(CardName)}
                  />
                  <TextInput
                    style={styles.input}
                    label="CardLimit"
                    value={cardLimit.toString()}
                    keyboardType="numeric"
                    onChangeText={(CardLimit) => setCardLimit(Number(CardLimit))}
                  />
                  <TextInput
                    style={styles.input}
                    label="DueDate"
                    value={cardDueDate}
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
                      {Object.keys(typedCards).map((option) => (
                        <List.Item
                          key={option}
                          title={option}
                          onPress={() => {
                            setSelected(option);
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
                      handleAddNewCard();
                    }}
                  >
                    Add New Card
                  </Button>
                </Dialog.Actions>
              </Dialog>
            </Portal>
          </TouchableWithoutFeedback>
        </View>
        <Button style={styles.button}>
          <Text style={styles.text}>View Details</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    justifyContent: "space-around",
    paddingHorizontal: 18,
    paddingVertical: 20,
  },
  cardContent: {
    backgroundColor: 'transparent',
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 36,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  input: {
    marginBottom: 10,
  },
  cardTitle: {
    color: "#f1f5f9",
    fontSize: 18,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  separator: {
    borderBottomColor: "#a8a3a3",
    borderBottomWidth: 1,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  text: {
    fontSize: 16,
    color: "#f1f5f9",
  },
  button: {
    backgroundColor: "#1e293b",
    padding: 10,
    marginVertical: 5,
    width: "100%",
    borderRadius: 8,
  },
  logo: {
   
  }
});
