import { Transaction } from "@/lib/entities/transaction";
import AsyncStorage from "@react-native-async-storage/async-storage";

type FirestoreValue<T> = T extends number
  ? { integerValue: string }
  : T extends string
  ? { stringValue: string }
  : never;

type TransactionFirestoreFields = {
  amount: FirestoreValue<number>;
  category: FirestoreValue<string>;
  date: FirestoreValue<string>;
  description: FirestoreValue<string>;
  type: FirestoreValue<"income" | "expense">;
};
type FirestoreDocument<T> = {
  fields: T;
  name: string;
};
type TransactionFirestoreDocument =
  FirestoreDocument<TransactionFirestoreFields>;

export type TransactionDto = {
  description: string;
  date: string;
  amount: number;
  category: string;
  type: string;
  id: string;
  paid?: boolean
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
  console.log(data);
  const transactions: TransactionDto[] = data.documents.map(
    (item: TransactionFirestoreDocument) => ({
      id: item.name.split("/").pop(),
      date: item.fields.date.stringValue,
      category: item.fields.category.stringValue,
      description: item.fields.description.stringValue,
      amount: Number(item.fields.amount.integerValue),
      type: item.fields.type.stringValue,
      ...item,
    })
  );

  return transactions;
}
export async function createNewItem(
  item: Transaction
): Promise<TransactionDto> {
  function toFirestoreFields(data: Record<string, any>) {
    const fields: Record<string, any> = {};

    for (const key in data) {
      const value = data[key];

      if (typeof value === "string") {
        fields[key] = { stringValue: value };
      } else if (typeof value === "number") {
        fields[key] = Number.isInteger(value)
          ? { integerValue: value }
          : { doubleValue: value };
      } else if (typeof value === "boolean") {
        fields[key] = { booleanValue: value };
      }
    }

    return fields;
  }
  const userId = await AsyncStorage.getItem("userId");
  const token = await AsyncStorage.getItem("token");
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/b-finances-2952b/databases/(default)/documents/users/${userId}/transactions`,
    {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fields: toFirestoreFields(item),
      }),
    }
  );
  const json = await res.json();

  return {
    id: json.name.split("/").pop(),
    ...item,
  };
}
export async function deleteTransactionItem(id: string) {
  const userId = await AsyncStorage.getItem("userId");
  const token = await AsyncStorage.getItem("token");

  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/b-finances-2952b/databases/(default)/documents/users/${userId}/transactions/${id}`,
    {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res
}
