import React from "react";
import { Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
type Props = {
  result: {
    chartData: { category: string; amount: number }[];
  }
}
const Graphic = ({ result }: Props) => {
  const screenWidth = Dimensions.get("window").width;
  return (
    <BarChart
      style={{ marginVertical: 8, borderRadius: 8, alignItems: "center" }}
      data={
        result.chartData.length
          ? {
              labels: result.chartData.map((item: any) => item.category),
              datasets: [{ data: result.chartData.map((item: any) => item.amount) }],
            }
          : {
              labels: ["Sem dados"],
              datasets: [{ data: [0] }],
            }
      }
      width={screenWidth * 0.9}
      height={220}
      fromZero
      yAxisLabel="R$"
      yAxisSuffix=",00"
      chartConfig={{
        backgroundColor: "#292f3a",
        backgroundGradientFrom: "#42526b",
        backgroundGradientFromOpacity: 0,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(0, 200, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        propsForLabels: {
          fontSize: 10,
          fontWeight: "600",
        },
      }}
      verticalLabelRotation={30}
    />
  );
};

export default Graphic;
