import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import AuctionTypeTag from "../Atoms/Tags/auctionTypeTag";
import CompletedTag from "../Atoms/Tags/completedTag";
import { ScrollView } from "react-native-gesture-handler";
import { getOnSaleItems } from "../../apis/ItemApi";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

type Props = {
  navigation: any;
  route: object;
};

type Items = {
  items: Array<object>;
};

const { height: ScreenHeight } = Dimensions.get("window");
const { width: ScreenWidth } = Dimensions.get("window");

const onSale = (props: Props) => {
  const [items, setItems] = useState<Items | null | any>([]);
  const [currentTime, setCurrentTime] = useState<any | undefined | object>(
    new Date()
  );
  const navigation: any = useNavigation();
  const getData = async () => {
    const response = await getOnSaleItems();
    setItems(response);
  };

  const goDetail = (item) => {
    if (item.auctionType == "NORMAL") {
      navigation.navigate("auctionDetail", {
        id: item.itemSeq,
      });
    } else {
      navigation.navigate("detail", {
        id: item.itemSeq,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getData();
      // const time = new Date();
      // console.log(time);
      // setCurrentTime(time)
      return () => {};
    }, [])
  );

  return (
    <ScrollView style={{ backgroundColor: "#fff" }}>
      {items &&
        items.map((item, index) => (
          <View key={index} style={styles.onSaleContainer}>
            <TouchableOpacity onPress={() => goDetail(item)}>
              <View style={{ flexDirection: "row" }}>
                <AuctionTypeTag
                  styles={{ tag: styles.auctionTypeTag }}
                  text={item.auctionType == "LIVE" ? "실시간" : "일반"}
                ></AuctionTypeTag>
                <CompletedTag
                  styles={{ tag: styles.completedTypeTag }}
                  text={
                    currentTime < new Date(item.startTime) ? "예약중" : "진행중"
                  }
                />
              </View>
              <View
                style={{ flexDirection: "row", marginTop: ScreenWidth / 50 }}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: ScreenWidth / 3.2,
                    height: ScreenWidth / 3.2,
                    borderColor: "#d7d4d4",
                    borderWidth: 1,
                  }}
                />

                <View
                  style={{
                    flexDirection: "column",
                    justifyContent: "space-around",
                    height: ScreenWidth / 3.2,
                  }}
                >
                  <Text
                    style={{
                      fontSize: ScreenWidth / 18,
                      marginLeft: ScreenWidth / 20,
                    }}
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: ScreenWidth / 24,
                      marginTop: ScreenWidth / 70,
                      marginLeft: ScreenWidth / 20,
                    }}
                  >
                    참여자 : {item.biddingCount} 명
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 19,
                      marginTop: ScreenWidth / 70,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: ScreenWidth / 24,
                        alignSelf: "center",
                      }}
                    >
                      시초가 :{" "}
                    </Text>
                    <TextInput
                      editable={false}
                      maxLength={7}
                      value={
                        item.startPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"
                      }
                      style={styles.textArea}
                      textAlign="center"
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      marginLeft: 19,
                      marginTop: ScreenWidth / 70,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: ScreenWidth / 24,
                        alignSelf: "center",
                      }}
                    >
                      입찰가 :{" "}
                    </Text>
                    <TextInput
                      editable={false}
                      maxLength={7}
                      value={
                        item.lastPrice
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"
                      }
                      style={styles.textArea}
                      textAlign="center"
                    />
                  </View>
                </View>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: ScreenWidth / 30,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: ScreenWidth / 24,
                      alignSelf: "center",
                    }}
                  >
                    경매일 :{" "}
                  </Text>
                  <TextInput
                    editable={false}
                    maxLength={50}
                    value={
                      item.auctionType == "LIVE"
                        ? item.startTime.split("T")[0] +
                          "-" +
                          item.startTime.split("T")[1]
                        : item.startTime.split("T")[0] +
                          "-" +
                          item.startTime.split("T")[1].slice(0, 5) +
                          " ~ " +
                          item.endTime.split("T")[0] +
                          "-" +
                          item.endTime.split("T")[1].slice(0, 5)
                    }
                    style={styles.textAreaDate}
                    textAlign="left"
                  />
                </View>
              </View>
              <View
                style={{
                  borderBottomColor: "#d7d4d4",
                  borderBottomWidth: 1,
                  marginTop: 15,
                }}
              ></View>
            </TouchableOpacity>
          </View>
        ))}
    </ScrollView>
  );
};

export default onSale;

const styles = StyleSheet.create({
  onSaleContainer: {
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
  },
  auctionTypeTag: {
    width: ScreenWidth / 6,
    height: ScreenHeight / 33,
    backgroundColor: "#F8A33E",
    borderRadius: 55,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  textArea: {
    borderRadius: 20,
    borderWidth: 0.5,
    height: 24,
    width: ScreenWidth / 3,
    fontWeight: "300",
  },
  textAreaDate: {
    borderRadius: 20,
    borderWidth: 0.5,
    height: 24,
    width: ScreenWidth * 0.75,
    paddingLeft: 8,
    fontWeight: "300",
  },
  completedTypeTag: {
    width: ScreenWidth / 6,
    height: ScreenHeight / 33,
    backgroundColor: "#719DD7",
    borderRadius: 55,
    marginRight: ScreenWidth / 12,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
});
