import { SafeAreaView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, LocaleConfig } from "react-native-calendars";

export default function AlarmCalender({
  setShowTime,
  setDate,
  handleTimeChange,
  date,
  showTime
}: {setShowTime: any, setDate: any, handleTimeChange: any, date: string, showTime: boolean}) {
  return (
    <SafeAreaView>
      <Calendar
        theme={{
          backgroundColor: "#1e1e1e",
          calendarBackground: "#1e1e1e",
          textSectionTitleColor: "#b6c1cd",
          selectedDayBackgroundColor: "white",
          selectedDayTextColor: "black",
          todayTextColor: "#00adf5",
          dayTextColor: "white",
          textDisabledColor: "#d9e",
        }}
        onDayPress={(day) => {
          setShowTime(true);
          setDate(day.dateString);
        }}
        markedDates={{
          [date]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "blue",
            selectedTextColor: "white",
          },
        }}
      />
      {showTime && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}
    </SafeAreaView>
  );
}
