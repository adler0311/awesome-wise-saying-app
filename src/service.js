import { Notifications } from "expo";
import { AsyncStorage } from "react-native";
import axios from "axios";

const BACKEND_URL =
  "https://us-central1-awesome-quote-app.cloudfunctions.net/api/pushToken";

export const compareDateToNow = dateString => {
  let [month, day, year] = new Date().toLocaleDateString().split("/");
  const todayLocalDate = Date.parse(`20${year}-${month}-${day}`);
  return todayLocalDate === Date.parse(dateString);
};

export const sendPushToken = async () => {
  const pushTokenSent = await AsyncStorage.getItem("pushTokenSent");
  if (pushTokenSent !== null) return;
  const pushToken = await Notifications.getExpoPushTokenAsync();

  const response = await axios.post(BACKEND_URL, { pushToken });
  console.log(response.status);
  AsyncStorage.setItem("pushTokenSent", "true");
};
