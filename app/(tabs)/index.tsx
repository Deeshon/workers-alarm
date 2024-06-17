import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LogBox,
  Modal,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlarmCalender from "@/components/AlarmCalender";
import Alarms from "@/components/Alarms";
import * as Notifications from "expo-notifications";
import CalenderView from "@/components/CalenderView";
import { GlobalContext } from "@/providers/GlobalProvider";

type TypeAlarm = {
  id: number;
  date: string;
  time: string;
  enabled: boolean;
};

LogBox.ignoreLogs(["new NativeEventEmitter"]);
LogBox.ignoreAllLogs();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const App = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showTime, setShowTime] = useState(false);

  const { alarms: alarm, setAlarms: setAlarm } = useContext(GlobalContext);

  const notificationListener = useRef<any>();
  const [notification, setNotification] = useState<any>(false);

  useEffect(() => {
    const loadAlarms = async () => {
      try {
        const storedAlarms = await AsyncStorage.getItem("alarms");
        if (storedAlarms !== null) {
          console.log("stored alarms", JSON.parse(storedAlarms));
          setAlarm(JSON.parse(storedAlarms) as TypeAlarm[]);
        }
      } catch (error) {
        console.error("Error loading alarms:", error);
      }
    };

    loadAlarms();
  }, []);

  const scheduleNotificationsHandler = async (alarm: TypeAlarm) => {
    console.log("notification handler", alarm);
    const currDate = new Date();
    currDate.setSeconds(currDate.getSeconds() + 10);
    const identifier = await Notifications.scheduleNotificationAsync({
      content: {
        title: "Alarm",
        body: "It is time to wake up!",
        data: { data: "Your morning alarm data" },
        sound: "notification1.wav",
        vibrate: [255, 0, 0],
      },
      trigger: {
        date: currDate,
      },
    });
  };

  const handleTimeChange = (event: any, selectedTime: Date) => {
    setShowTime(false);
    if (selectedTime) {
      console.log("selectedTime", selectedTime.toUTCString());
      const currentTime = selectedTime || new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      setTime(`${hours}:${minutes < 10 ? `0${minutes}` : minutes}`);
      setAlarm([
        ...alarm,
        {
          id: alarm.length + 1,
          date: date,
          time: `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
          enabled: false,
        },
      ]);
    }
  };

  useEffect(() => {
    AsyncStorage.setItem("alarms", JSON.stringify(alarm));
  }, [alarm]);

  console.log(alarm);

  const [modalVisible, setModalVisible] = useState(false);
  const [tab, setTab] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={{ flex: 1, padding: 10 }}>
          <Alarms
            alarm={alarm}
            setAlarm={setAlarm}
            scheduleNotificationsHandler={scheduleNotificationsHandler}
          />

          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.centeredView}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalView}>
                    <AlarmCalender
                      date={date}
                      handleTimeChange={handleTimeChange}
                      setDate={setDate}
                      setShowTime={setShowTime}
                      showTime={showTime}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </ScrollView>

      <Pressable
        style={{
          backgroundColor: "#787af1",
          padding: 10,
          borderRadius: 5,
          marginBottom: 30,
          marginTop: 40,
          width: 200,
          margin: 'auto'
        }}
        onPress={() => setModalVisible(true)}
      >
        <Text style={{ color: "white", textAlign: "center" }}>Add Alarm</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  container: {
    backgroundColor: "#121212",
    flex: 1,
  },
  textColor: {
    color: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#121212",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonNew: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    margin: 10,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

export default App;
