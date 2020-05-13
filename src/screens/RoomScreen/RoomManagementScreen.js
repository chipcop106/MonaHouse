/* eslint-disable react-native/no-color-literals */
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  Icon, Input, TabView, Tab, Layout, Text, Card, List,
} from '@ui-kitten/components';
import CustomSelect from '../../components/common/CustomSelect';
import RoomCard from '../../components/RoomCard';
import { color } from '../../config';

const HouseOptions = [{ id: 1, title: '319 C16 Lý Thường Kiệt', value: 1 }, { id: 2, title: '64 Út Tịch', value: 2 }];

const DateOptions = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'];

const RoomData = [
  { id: 1, name: 'Phòng 01', imageSrc: 'https://zicxa.com/hinh-anh/wp-content/uploads/2019/07/T%E1%BB%95ng-h%E1%BB%A3p-h%C3%ACnh-%E1%BA%A3nh-g%C3%A1i-xinh-d%E1%BB%85-th%C6%B0%C6%A1ng-cute-nh%E1%BA%A5t-6.jpg' },
  { id: 2, name: 'Phòng 02', imageSrc: 'https://gamek.mediacdn.vn/thumb_w/690/2019/7/8/1-15625474669018688730.jpg' },
];

const RoomManagementScreen = (evaProps) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const getSelectedIndex = (index) => {
    //    console.log(index);
  };
  return (
    <View style={styles.container}>
      <View style={styles.filterWrap}>
        <View style={styles.filterSelect}>
          <View style={[styles.filter, styles.firstFilter]}>
            <CustomSelect selectOptions={HouseOptions.map((option) => option.title)} getSelectedIndex={getSelectedIndex} icon="home" />
          </View>
          <View style={[styles.filter, styles.secondFilter]}>
            <CustomSelect selectOptions={DateOptions} getSelectedIndex={getSelectedIndex} icon="calendar" />
          </View>
        </View>
        <View style={styles.filterSearch}>
          <Input
            status="transparent"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChangeText={(nextValue) => setSearchValue(nextValue)}
            accessoryLeft={() => <Icon name="search" fill={color.whiteColor} style={styles.searchIcon} />}
          />
        </View>
      </View>

      <View style={styles.contentContainer}>
        <List
              style={styles.listContainer}
              contentContainerStyle={styles.contentCard}
              data={RoomData}
              renderItem={(room) => <RoomCard roomInfo={room} />}
            />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: '#ccc',
  },
  filterWrap: {
    padding: 10,
    backgroundColor: color.darkColor,
  },
  filterSelect: {
    flexDirection: 'row',
  },
  filter: {
    flexGrow: 1,
  },
  firstFilter: {
    marginRight: 5,
  },
  secondFilter: {
    marginLeft: 5,
  },
  filterSearch: {
    marginTop: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },
  tabContainer: {

  },
  tabView: {
    flexGrow: 1,
  },
  tab: {
    backgroundColor: color.darkColor,
    paddingVertical: 5,
  },
  tabText: {
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
  },
  tabIndicator: {
    backgroundColor: color.primary,
  },

  contentCard: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  listContainer: {
    flex: 1,
  },
});

export default RoomManagementScreen;
