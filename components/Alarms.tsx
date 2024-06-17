import React, { useState } from "react";
import { View, Text, Switch, Pressable } from "react-native";


type TypeAlarm = {
    id: number;
    date: string;
    time: string;
    enabled: boolean;
  };

export default function Alarms({alarm, setAlarm, scheduleNotificationsHandler}: {alarm: TypeAlarm[], setAlarm: any, scheduleNotificationsHandler: (alarm: TypeAlarm) => Promise<void>}) {

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = (id: number) => {
      const updatedAlarm = alarm.map((al) => {
        if (al.id === id) {
          return {
            ...al,
            enabled: !al.enabled
          };
        }
        return al;
      });

      setAlarm(updatedAlarm)
      const selectedAlarm = updatedAlarm.find((al) => al.id === id);
      scheduleNotificationsHandler(selectedAlarm as TypeAlarm)
    };
  

return (
    <View
    style={{
      padding: 10,
      justifyContent: "space-between",
    }}
  >
    {alarm.length > 0 &&
      alarm.map((al) => {
        return (
          <View
            key={al.time}
            style={{
              backgroundColor: "#1e1e1e",
              margin: 10,
              flexDirection: "row",
              alignItems: "center",
              padding: 10,
              borderRadius: 10,
              justifyContent: "space-between",
            }}
          >
            <View>
              <View>
                <Text
                  key={al.time}
                  style={{
                    color: "#787af1",
                    fontSize: 12,
                    fontWeight: "bold",
                  }}
                >
                  {al.date}
                </Text>
              </View>
              <View>
                <Text
                  style={{
                    color: "white",
                    fontSize: 32,
                    fontWeight: "bold",
                  }}
                >
                  {al.time}
                </Text>
              </View>
            </View>
            <View>
              <Switch
                trackColor={{ false: "black", true: "#d2e3fc" }}
                thumbColor={isEnabled ? "#1973e8" : "#5f6368"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={() => toggleSwitch(al.id)}
                value={al.enabled}
              />
              {/* <Icon name="more-vert" color={'white'} /> */}
              <Pressable
                style={({ pressed }) => [
                  {
                    borderRadius: 1000,
                    alignItems: "center",
                    justifyContent: "center",
                    width: 40,
                    height: 40,
                  },
                  { backgroundColor: pressed ? "green" : "black" },
                ]}
                onPress={() => {
                  setAlarm((previous: TypeAlarm[]) => {
                    return previous.filter((item) => item !== al);
                  });
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  X
                </Text>
              </Pressable>
            </View>
          </View>
        )
      })}
  </View>
)

}