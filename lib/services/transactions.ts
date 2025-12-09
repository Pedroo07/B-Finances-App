import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export type TransactionDto = {
  description: string;
  date: string;
  amount: number;
  category: string;
  type: string;
  id: string;
};

export async function getUserCollection(): Promise<TransactionDto[]> {
  const userId = await AsyncStorage.getItem("userId");
  const token = await AsyncStorage.getItem("token");
  if (!userId || !token) {
    console.log("user nao logado");
  }
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/b-finances-2952b/databases/(default)/documents/users/${userId}/transactions`,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const data = await res.json();
  console.log(data)

  const transactions =  data.documents.map((item: any) => ({
    id: uuidv4(),
    date: item.fields.date.stringValue,
    category: item.fields.category.stringValue,
    description: item.fields.description.stringValue,
    amount: Number(item.fields.amount.integerValue),
    type: item.fields.type.stringValue,
    ...item,
  }));
  console.log(transactions)
  return transactions
}
