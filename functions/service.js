const { Expo } = require("expo-server-sdk");
const axios = require("axios");

let expo = new Expo();

const FETCH_URL = "http://quotes.rest/qod.json";

const createMessages = async db => {
  // 여기선 메시지를 만든다.
  let messages = []; // 처음엔 비어있는 상태.
  const pushTokens = await getPushTokens(db);
  const partialQuote = await getQuote();

  for (let pushToken of pushTokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: "default",
      body: partialQuote
    });
  }

  return messages;
};

// receipt를 받아서 이상이 없는지 확인해야 하지만 여기선 생략한다.

/**
 * 명언 문구를 가져와서 20자만 보여주기.
 */
const getQuote = async () => {
  try {
    const result = await axios(FETCH_URL);

    const quote = result.data.contents.quotes[0];
    return `${quote.quote.substring(0, 20)}...`;
  } catch (err) {
    console.error(err);
  }

  return "오늘의 명언 보러 가기";
};

const getPushTokens = async db => {
  const collection = await db.collection("pushTokens").get();
  let pushTokens = [];
  collection.docs.forEach(async doc => {
    const docId = await doc.id;
    pushTokens.push(docId);
  });

  return pushTokens;
};

module.exports.sendExpoPush = async db => {
  let chunks = expo.chunkPushNotifications(await createMessages(db));
  let tickets = [];

  for (let chunk of chunks) {
    try {
      // chunk로 push noti를 보낸다.
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk); // 받은 ticket을 tickets에 모은다.
    } catch (error) {
      console.error(error);
    }
  }

  console.log(tickets);
};
