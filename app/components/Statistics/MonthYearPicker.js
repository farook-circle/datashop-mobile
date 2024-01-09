/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import colors from '../../../assets/colors/colors';
import moment from 'moment-timezone';
import {Button, HStack} from 'native-base';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const MonthYearPicker = ({onCancel, onConfirm}) => {
  const [selectedMonth, setSelectedMonth] = useState(
    months[new Date().getDate() - 1],
  );
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 11}, (_, index) => currentYear - 5 + index);

  const renderItem = ({item, index, list}) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          borderWidth: 1,
          borderColor:
            item === selectedMonth || item === selectedYear
              ? colors.primary
              : 'white',
        },
      ]}
      onPress={() => {
        if (Number(item)) {
          setSelectedYear(list[index]);
        } else {
          setSelectedMonth(item);
        }
      }}>
      <Text style={{color: item === list[index] ? 'black' : 'black'}}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.selectedInfo}>
        <Text>Month: {selectedMonth}</Text>
        <Text>Year: {selectedYear}</Text>
      </View>
      <View style={{flex: 1, flexDirection: 'row'}}>
        <View style={{flex: 1}}>
          <FlatList
            data={months}
            keyExtractor={item => item}
            renderItem={({item, index}) =>
              renderItem({item, index, list: months})
            }
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <View style={{flex: 1}}>
          <FlatList
            data={years}
            keyExtractor={item => item.toString()}
            renderItem={({item, index}) =>
              renderItem({item, index, list: years})
            }
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
      <HStack pt={'2'} width={'100%'} space={1}>
        <Button onPress={onCancel} variant={'ghost'} flex={1}>
          Cancel
        </Button>
        <Button
          variant={'ghost'}
          flex={1}
          onPress={() => onConfirm(selectedMonth, selectedYear)}>
          Confirm
        </Button>
      </HStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 0,
  },
  item: {
    padding: 10,
    margin: 4,
  },
  selectedInfo: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
});
