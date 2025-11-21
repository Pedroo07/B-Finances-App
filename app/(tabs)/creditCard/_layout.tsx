import { Stack } from "expo-router";
import React from "react";
import { PaperProvider } from "react-native-paper";

export default function ProductLayout() {
  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ title: "CreditCard", headerShown: false }}
        />
      </Stack>
    </PaperProvider>
  );
}
