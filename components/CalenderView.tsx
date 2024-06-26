import React, {Component, useState} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda, DateData, AgendaEntry, AgendaSchedule} from 'react-native-calendars';
import testIDs from './testIDs';

interface State {
  items?: AgendaSchedule;
}

type TypeAlarm = {
  id: number;
  date: string;
  time: string;
  enabled: boolean;
};

type TypeCalenderViewProps = {
  alarms: TypeAlarm[]
}



export default function CalenderView({alarms}: TypeCalenderViewProps) {
  const [items, setItems] = useState<any>()

  const loadItems = (day: DateData) => {
    const itemsNew: AgendaSchedule = {};
  
    setTimeout(() => {
      alarms.forEach(alarm => {
        const strTime = alarm.date;
        const time = new Date(day.timestamp).getTime() + new Date(alarm.date).getTime();
  
        if (!itemsNew[strTime]) {
          itemsNew[strTime] = [];
        }
  
        itemsNew[strTime].push({
          day: alarm.date,
          height: 50,
          name: `Alarm at ${alarm.time}`
        });
      });
  
      console.log('newItems', itemsNew);
      setItems(itemsNew);
    }, 1000);
  };
  

  const renderDay = (day: Date) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem}/>;
  };

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';

    // console.log({reservation})

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: reservation.height}]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{fontSize, color}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  function timeToString(time: number) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

  return (
    <Agenda
      testID={testIDs.agenda.CONTAINER}
      items={items}
      loadItemsForMonth={loadItems}
      selected={new Date().toString()}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
      showClosingKnob={true}
      // markingType={'period'}
      // markedDates={{
      //    '2017-05-08': {textColor: '#43515c'},
      //    '2017-05-09': {textColor: '#43515c'},
      //    '2017-05-14': {startingDay: true, endingDay: true, color: 'blue'},
      //    '2017-05-21': {startingDay: true, color: 'blue'},
      //    '2017-05-22': {endingDay: true, color: 'gray'},
      //    '2017-05-24': {startingDay: true, color: 'gray'},
      //    '2017-05-25': {color: 'gray'},
      //    '2017-05-26': {endingDay: true, color: 'gray'}}}
      // monthFormat={'yyyy'}
      // theme={{calendarBackground: 'red', agendaKnobColor: 'green'}}
      // renderDay={this.renderDay}
      // hideExtraDays={false}
      // showOnlySelectedDayItems
      // reservationsKeyExtractor={this.reservationsKeyExtractor}
    />
  );
}


const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green'
  },
  dayItem: {
    marginLeft: 34
  }
})