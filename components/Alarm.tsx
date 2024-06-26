import { useEffect, useRef, useState } from "react";
import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-fetch";
import NotificationService from "./NotificationService";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Button, Platform, Text, View, Pressable, TextInput, LogBox, StyleSheet } from "react-native";
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";
import NotificationSounds from 'react-native-notification-sounds';


LogBox.ignoreLogs(["new NativeEventEmitter"])
LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false
  })
})

const BACKGROUND_FETCH_TASK = "background-fetch-task";



const Alarm = () => {

  const notificationListener = useRef<any>();
  const [notification, setNotification] = useState<any>(false);
  const [hour, setHour] = useState('');
  const [minute, setMinute] = useState('');
  const [ampm, setAmpm] = useState('');
  const [notificationId, setNotificationId] = useState('none');



  useEffect(() => {
    getData();
    notificationListener.current = Notifications.addNotificationResponseReceivedListener((notification) => {
      setNotification(notification)
    })
    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      )
    }
  }, [])

  let date = new Date();
  date.setSeconds(date.getSeconds() + 5);

  async function scheduleNotificationsHandler() {
    console.log(notificationId);
    if (notificationId === "none") {
      var newHour = parseInt(hour);
      if (ampm === "pm") {
        newHour = newHour + 12;
      }

      await Notifications.setNotificationChannelAsync('new-emails', {
        name: 'E-mail notifications',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'email-sound.wav', // <- for Android 8.0+, see channelId property below
      });

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Alarm",
          sound: 'mixkit-confirmation-tone-2867.wav',
          body: "It is time to wake up!",
          data: { data: "Your morning alarm data" },
        },
        trigger: {
          hour: newHour,
          minute: parseInt(minute),
          repeats: true,
          channelId: 'new-emails'
        },
      });
      setAmpm("");
      setHour("");
      setMinute("");
      console.log(date);
      console.log(identifier);
      setNotificationId(identifier);
      storeData(identifier);
    } else {
      alert("Turn off alarm before starting a new one");
      setAmpm("");
      setHour("");
      setMinute("");
      console.log(notificationId);
      console.log("not working");
    }
  }

  async function turnOffAlarm() {
    console.log(notificationId);
    if (notificationId !== "none") {
      await Notifications.cancelAllScheduledNotificationsAsync();
      const resetValue = "none";
      await setNotificationId(resetValue);
      storeData(resetValue);
    } else {
      alert("Alarm already turned off");
      console.log(notificationId);
    }
  }

  async function storeData(id) {
    try {
      const savedValues = id;
      const jsonValue = await AsyncStorage.setItem(
        "currentAlarmId",
        JSON.stringify(savedValues)
      );
      return jsonValue;
    } catch (e) {
      alert(e);
    }
  }

  async function getData() {
    try {
      const jasonValue = await AsyncStorage.getItem("currentAlarmId");
      const jasonValue2 = JSON.parse(jasonValue as string);
      setNotificationId(jasonValue2);
    } catch (e) {
      alert(e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Alarm App</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Enter hour"
        value={hour}
        onChangeText={(text) => setHour(text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter minute"
        value={minute}
        onChangeText={(text) => setMinute(text)}
      />
      <TextInput
        style={styles.textInput}
        placeholder="Enter am or pm"
        value={ampm}
        onChangeText={(text) => setAmpm(text)}
      />
      <Pressable style={styles.button} onPress={scheduleNotificationsHandler}>
        <Text style={styles.buttonText}>Turn on Alarm</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={turnOffAlarm}>
        <Text style={styles.buttonText}>Turn off Alarm</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    color: "green",
    margin: 20,
    fontSize: 60,
    fontWeight: "bold",
  },
  button: {
    width: "70%",
    backgroundColor: "green",
    borderRadius: 18,
    margin: 15,
    padding: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 35,
    fontWeight: "bold",
  },
  textInput: {
    fontSize: 30,
    margin: 5,
  },
});

export default Alarm;
