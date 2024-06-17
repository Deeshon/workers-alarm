import React, { useState, useContext, useEffect } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { AgendaEntry, AgendaSchedule, Calendar, DateData } from 'react-native-calendars';
import testIDs from '../../components/testIDs';
import { GlobalContext } from '@/providers/GlobalProvider';

type TypeAlarm = {
  id: number;
  date: string;
  time: string;
  enabled: boolean;
};

type TypeCalenderViewProps = {
  alarms: TypeAlarm[];
};

export default function CalenderView({}: TypeCalenderViewProps) {
  const [items, setItems] = useState<AgendaSchedule>({});
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: any }>({});
  const { alarms } = useContext(GlobalContext);

  useEffect(() => {
    loadItems();
    markAlarmDates();
  }, [selectedDate, alarms]);

  const loadItems = () => {
    const itemsNew: AgendaSchedule = {};

    alarms.forEach(alarm => {
      const strTime = alarm.date;

      if (!itemsNew[strTime]) {
        itemsNew[strTime] = [];
      }

      itemsNew[strTime].push({
        day: alarm.date,
        height: 50,
        name: `Alarm at ${alarm.time}`,
      });
    });

    setItems(itemsNew);
  };

  const markAlarmDates = () => {
    const markedDatesNew: { [key: string]: any } = {};

    alarms.forEach(alarm => {
      markedDatesNew[alarm.date] = { marked: true, dotColor: '#787af1' };
    });

    markedDatesNew[selectedDate] = { ...markedDatesNew[selectedDate], selected: true };

    setMarkedDates(markedDatesNew);
  };

  const renderItem = ({ item, index }: { item: AgendaEntry, index: number }) => {
    const fontSize = index === 0 ? 16 : 14;
    const color = index === 0 ? 'white' : '#dddddd';

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, { height: item.height }]}
        onPress={() => Alert.alert(item.name)}
      >
        <Text style={{ fontSize, color }}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text style={styles.emptyDateText}>No events for today!</Text>
      </View>
    );
  };

  const getAgendaItemsForSelectedDate = () => {
    return items[selectedDate] || [];
  };

  return (
    <View style={styles.container}>
      <Calendar
        testID={testIDs.agenda.CONTAINER}
        onDayPress={(day: DateData) => {
          setSelectedDate(day.dateString);
        }}
        markedDates={markedDates}
        theme={{
          calendarBackground: '#1e1e1e',
          textSectionTitleColor: 'white',
          selectedDayBackgroundColor: '#555555',
          selectedDayTextColor: 'white',
          todayTextColor: '#787af1',
          dayTextColor: 'white',
          textDisabledColor: '#555555',
          dotColor: '#787af1',
          selectedDotColor: '#787af1',
          arrowColor: 'white',
          monthTextColor: 'white',
          indicatorColor: 'white',
        }}
      />
      <FlatList
        data={getAgendaItemsForSelectedDate()}
        renderItem={renderItem}
        ListEmptyComponent={renderEmptyDate}
        keyExtractor={(item, index) => index.toString()}
        style={styles.flatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    padding: 10,
    paddingTop: 50
  },
  item: {
    backgroundColor: '#1e1e1e',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 200,
    flex: 1,
    marginTop: 10,
    paddingTop: 40,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyDateText: {
    textAlign: 'center',
    color: 'gray',
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green',
  },
  dayItem: {
    marginLeft: 34,
  },
  flatList: {
    backgroundColor: '#000000',
  },
});
