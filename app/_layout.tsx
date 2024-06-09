import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch, Pressable } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Icon } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AlarmCalender from "@/components/AlarmCalender";
import Alarms from "@/components/Alarms";

type TypeAlarm = {
  date: string;
  time: string;
};

const App = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showTime, setShowTime] = useState(false);
  const [alarm, setAlarm] = useState<TypeAlarm[]>([]);

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

  const handleTimeChange = (event: any, selectedTime: Date) => {
    setShowTime(false);
    if (selectedTime) {
      const currentTime = selectedTime || new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      setTime(`${hours}:${minutes < 10 ? `0${minutes}` : minutes}`);
      setAlarm([
        ...alarm,
        {
          date: date,
          time: `${hours}:${minutes < 10 ? `0${minutes}` : minutes}`,
        },
      ]);
    }
  };

  useEffect(() => {
    AsyncStorage.setItem("alarms", JSON.stringify(alarm));
  }, [alarm]);


  console.log(alarm);

  return (
    <SafeAreaView style={[styles.container]}>
      <View style={{ padding: 10 }}>
        <Alarms alarm={alarm} setAlarm={setAlarm} />
        <AlarmCalender
          date={date}
          handleTimeChange={handleTimeChange}
          setDate={setDate}
          setShowTime={setShowTime}
          showTime={showTime}
        />
      </View>
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
});

export default App;

// import { Stack } from 'expo-router/stack';

// export default function Layout() {
//   return (
//     <Stack>
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//     </Stack>
//   );
// }
