import React, { useEffect, useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Text, IndexPath, List, Spinner } from '@ui-kitten/components';
import moment from 'moment';

import { Context as AuthContext } from '~/context/AuthContext';

import HistoryRecord from './ListItems/HistoryRenter';
import FilterHeader from './FilterHeaderTime';
import { settings } from '~/config';

import { getHistoryRenter } from '~/api/ReportAPI';

const RoomDetailRentHistoryScreen = () => {
  const route = useRoute();
  const { signOut } = useContext(AuthContext);
  const [filterState, setFilterState] = useState({
    selectedMonthIndex:
      settings?.monthLists?.findIndex(
        (item) => moment().format('M') === `${item.replace('Tháng', '').trim()}`
      )  ?? 0,
    selectedYearIndex:
      settings?.yearLists?.findIndex(
        (item) => moment().format('YYYY') === `${item}`
      ) ?? 0,
  });

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listHistory, setListHistory] = useState(null);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadData(filterState);
      setIsLoading(false);
    })();
  }, []);

  const loadData = async (newFilter) => {
    const { selectedMonthIndex, selectedYearIndex } = newFilter;
    const params = {
      fromdate: `01/${
        selectedMonthIndex + 1 >= 10 ? selectedMonthIndex + 1 : `0${selectedMonthIndex + 1}`
      }/${settings?.yearLists[selectedYearIndex]}`,
      todate: `${moment().format('DD/MM/YYYY')}`,
    };

    console.log(params, route);

    try {
      const res = await getHistoryRenter({ ...params, ...route.params });
      console.log(res);
      if (res.Code === 1) {
        setListHistory(res.Data?.data ?? []);
      } else if (res.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(res));
      } else if (res.Code === 2) {
        signOut();
        Alert.alert('Phiên đăng nhập đã hết, vui lòng đăng nhập lại !!');
      }
    } catch (e) {
      console.log('loadData error', e);
      Alert.alert('Oops!!', JSON.stringify(e));
    }
  };
  const onFilterChange = async (filter) => {
    const { selectedMonthIndex, selectedYearIndex } = filter;
    if (
      selectedYearIndex === filterState.selectedYearIndex &&
      selectedMonthIndex === filterState.selectedMonthIndex
    ) {
      return '';
    }
    console.log('onFilterChange');
    setFilterState(filter);
    setIsLoading(true);
    await loadData(filter);
    setIsLoading(false);
  };

  const _onRefresh = async () => {
    setRefreshing(true);
    await loadData(filterState);
    setRefreshing(false);
  };
  const rdListHeaderComponent = () => {
    const { selectedMonthIndex, selectedYearIndex } = filterState;
    return (
      <Text style={{paddingBottom: 0, paddingTop: 10}}>
        <Text>Từ: </Text>
        <Text style={{fontWeight: 'bold'}}>{`01/${
          selectedMonthIndex + 1 > 10 ? selectedMonthIndex + 1 : `0${selectedMonthIndex + 1}`
        }/${settings?.yearLists[selectedYearIndex]}`}</Text>
        <Text> đến </Text>
        <Text style={{fontWeight: 'bold'}}>{moment().format(
          'DD/MM/YYYY'
        )}</Text>
      </Text>
    );
  };
  return (
    <>
      <FilterHeader
        onValueChange={onFilterChange}
        initialState={filterState}
        advanceFilter={false}
        yearFilter={true}
        houseFilter={false}
      />
      {!isLoading ? (
        <List
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
          ListHeaderComponent={rdListHeaderComponent}
          contentContainerStyle={styles.contentCard}
          style={styles.listContainer}
          data={listHistory}
          keyExtractor={(item, index) => `${index}-${item.ID}`}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <HistoryRecord
                data={item}
                renterInfo={true}
                title="Người thuê 1"
              />
            </View>
          )}
        />
      ) : (
        <View
          style={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Spinner size="giant" status="primary" />
        </View>
      )}
    </>
  );
};

export default RoomDetailRentHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 10,
  },
  contentCard: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  listContainer: {
    flex: 1,
  },
});
