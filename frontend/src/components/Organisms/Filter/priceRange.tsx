import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

type Props = {
  getSelectInspformation: Function;
  getSelectInepformation: Function;
  navigation: any;
  route: object;
  reset: boolean;
};

type PriceType = {
  startPrice: object;
  endPrice: object;
};

const { height: ScreenHeight } = Dimensions.get("window");
const { width: ScreenWidth } = Dimensions.get("window");

const PriceRange = (props: Props) => {
  const [startPrice, setStartPrice] = useState<number | any | null>("");
  const [endPrice, setEndPrice] = useState<number | any | null>("");
  const inputStartPrice = (text) => {
    const num_startPrice = parseInt(text);
    setStartPrice(text);
    props.getSelectInspformation(num_startPrice);
  };
  const inputEndPrice = (text) => {
    const num_endPrice = parseInt(text);
    setEndPrice(text);
    props.getSelectInepformation(num_endPrice);
  };

  useFocusEffect(
    React.useCallback(() => {
      setStartPrice("");
      setEndPrice("");
    }, [props.reset])
  );

  return (
    <View>
      <View style={{ height: ScreenHeight / 20 }}>
        <Text style={{ fontSize: ScreenHeight / 45 }}>가격범위</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TextInput
          maxLength={15}
          keyboardType={"numeric"}
          value={startPrice}
          style={styles.textArea}
          textAlign="center"
          onChangeText={(text) => inputStartPrice(text)}
        />
        <View>
          <Text>~</Text>
        </View>
        <TextInput
          maxLength={15}
          keyboardType={"numeric"}
          value={endPrice}
          style={styles.textArea}
          textAlign="center"
          onChangeText={(text) => inputEndPrice(text)}
        />
      </View>
      <View
        style={{
          borderBottomColor: "#d7d4d4",
          borderBottomWidth: 1,
          marginTop: 10,
        }}
      ></View>
    </View>
  );
};

export default PriceRange;

const styles = StyleSheet.create({
  textArea: {
    borderRadius: 55,
    borderWidth: 0.7,
    width: ScreenWidth / 3,
    height: ScreenWidth / 13,
    marginBottom: 10,
    color: "#4A4C4E",
    paddingLeft: 15,
  },
});
