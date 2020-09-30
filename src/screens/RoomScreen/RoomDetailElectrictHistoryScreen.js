import React, { useContext, useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl, Alert } from 'react-native'
import { Text, IndexPath, List, Spinner } from '@ui-kitten/components';
import moment from 'moment'
import { useRoute } from '@react-navigation/native'

import { Context as AuthContext } from '~/context/AuthContext'

import HistoryRecord from './ListItems/HistoryEW';
import FilterHeader from './FilterHeaderTime';
import { settings } from '~/config'

import { getEWHistory } from '~/api/CollectMoneyAPI';

const RoomDetailElectricHistoryScreen = () => {
  const { signOut } = useContext(AuthContext);
  const route = useRoute();
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
  const [isLoading, setIsLoading] = useState(false);
  const [listHistory, setListHistory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
      month: selectedMonthIndex + 1,
      year: `${settings?.yearLists[selectedYearIndex]}`,
      sort: 1
    };

    console.log(params, route);
    try {
      const res = await getEWHistory({ ...params, ...route.params });
      console.log(res);
      if (res.Code === 1) {
        setListHistory(res.Data);
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
  }
  const onFilterChange = async (filter) => {
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
          contentContainerStyle={styles.contentCard}
          data={listHistory}
          keyExtractor={(item, index) => `${index}-${item.ID}`}
          renderItem={({item}) => <HistoryRecord style={styles.card} data={item} />}
          style={styles.container}
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

export default RoomDetailElectricHistoryScreen;

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
