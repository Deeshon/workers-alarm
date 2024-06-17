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
      style={{width: 350}}
        theme={{
          calendarBackground: '#1e1e1e',
          textSectionTitleColor: 'white',
          selectedDayBackgroundColor: '#555555',
          selectedDayTextColor: 'white',
          todayTextColor: '#787af1',
          dayTextColor: 'white',
          textDisabledColor: '#555555',
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
