import { StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import ItemList from "../Organisms/ItemList";
import { getSoldItems } from "../../apis/ItemApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

type Props = {
  navigation: any;
  route: object;
};

type Items = {
  items: Array<object>;
};

const Sold = (props: Props) => {
  const [items, setItems] = useState<Items | null | any>([]);
  const getData = async () => {
    const response = await getSoldItems();
    setItems(response);
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
      return () => {};
    }, [])
  );
  return (
    <ScrollView style={{ backgroundColor: "#fff", height: "100%" }}>
      <ItemList items={items} containerStyle={styles.container} />
    </ScrollView>
  );
};

export default Sold;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "#fff",
  },
});
