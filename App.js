import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  AsyncStorage
} from "react-native";
import axios from "axios";
import { sendPushToken, compareDateToNow } from "./src/service";

const FETCH_URL = "http://quotes.rest/qod.json";

sendPushToken();
// const mock = new MockAdapter(axios);
// mock.onGet(FETCH_URL).reply(200, {
//   success: {
//     total: 1
//   },
//   contents: {
//     quotes: [
//       {
//         quote:
//           "I think midlife crisis is just a point where people's careers have reached some plateau and they have to reflect on their personal relationships.",
//         length: "145",
//         author: "Bill Murray",
//         tags: ["life", "midlife-crisis", "tod"],
//         category: "life",
//         date: "2019-11-03",
//         permalink:
//           "https://theysaidso.com/quote/bill-murray-i-think-midlife-crisis-is-just-a-point-where-peoples-careers-have-re",
//         title: "Quote of the day about life",
//         background: "https://theysaidso.com/img/bgs/yoga_on_cliff.jpg",
//         id: "5wdL8dBk1P4Qnn5rFMrLegeF"
//       }
//     ],
//     copyright: "2017-19 theysaidso.com"
//   }
// });

const App = () => {
  const [quote, setQuote] = useState({
    quote: "",
    author: "",
    background: ""
  });

  useEffect(() => {
    const fetchQuotes = async () => {
      let storageQuote = await AsyncStorage.getItem("quote");
      storageQuote = JSON.parse(storageQuote);
      // const storageQuote = null;

      if (storageQuote && compareDateToNow(storageQuote.date)) {
        console.log("cache hit");
        setQuote(storageQuote);
        return;
      }

      const result = await axios(FETCH_URL);
      setQuote(result.data.contents.quotes[0]);
      AsyncStorage.setItem(
        "quote",
        JSON.stringify(result.data.contents.quotes[0])
      );
    };

    fetchQuotes();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleText}>Today's Quote</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={
            quote.background === ""
              ? require("./assets/man_on_the_mountain.jpg")
              : { uri: quote.background }
          }
        />
      </View>

      <View style={styles.textContainer}>
        <ScrollView>
          <View style={styles.quoteContaier}>
            <Text style={styles.quoteText}>{quote.quote}</Text>
          </View>
          <View style={styles.authorContainer}>
            <Text style={styles.authorText}>- {quote.author}</Text>
          </View>
          <View style={styles.providerContainer}>
            <Text style={styles.providerText}> provided by theysaidso.com</Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center"
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  titleText: { fontSize: 24, color: "#fff" },
  imageContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 60
  },
  image: {
    width: 280,
    height: 280,
    marginTop: 50,
    borderRadius: 20
  },
  textContainer: {
    marginLeft: 40,
    flex: 4,
    marginBottom: 20
  },
  quoteContaier: {
    width: 280
  },
  quoteText: {
    fontSize: 20,
    color: "#fff"
  },
  authorContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 50
  },
  authorText: { color: "#fff" },
  providerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 50
  },

  providerText: { fontSize: 4, color: "#fff" }
});

export default App;
