import React, { useState, useContext, useEffect } from 'react'
import { StyleSheet, View, ScrollView, Alert, RefreshControl } from 'react-native'
import { Text, IndexPath, List, Icon } from '@ui-kitten/components';
import HistoryRecord from './ListItems/HistoryMoney';
import FilterHeader from './FilterHeaderTime';
import { Context as AuthContext } from '~/context/AuthContext';
import { color, settings } from '~/config'
import { historyCollectMoney } from '~/api/CollectMoneyAPI'
import moment from 'moment'
import { useRoute } from '@react-navigation/native'
import Loading from '~/components/common/Loading'

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

const history = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: 'rgba(0,0,0,.35)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLeft: {
    width: 45,
    height: 45,
  },
  roundIcon: {
    width: 60,
    height: 60,
    borderWidth: 1,
    borderColor: color.darkColor,
    borderRadius: 60 / 2,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftPart: {
    flexBasis: 90,
    padding: 15,
  },
  rightPart: {
    flexGrow: 1,
    padding: 15,
    paddingLeft: 0,
    justifyContent: 'space-between',
    flexBasis: 100,
  },
  title: {
    fontWeight: '600',
    marginBottom: 10,
  },
  money: {
    fontSize: 18,
    color: color.redColor,
    fontWeight: 'bold',
  },
  date: {
    color: '#c0c0c0',
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

const RoomDetailMoneyHistoryScreen = () => {

  const { signOut } = useContext(AuthContext);
  const route = useRoute();

  const [listHistory, setListHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  useEffect(() => {
    // (async () => {
    //   setIsLoading(true);
    //   await loadData(filterState);
    //   setIsLoading(false);
    // })();
  }, []);

  const loadData = async (newFilter) =>{
    const { selectedMonthIndex, selectedYearIndex } = newFilter;
    const params = {
      month: selectedMonthIndex + 1,
      year: `${settings?.yearLists[selectedYearIndex]}`,
      sort: 1,
      ...route.params
    };
    try {
      const res = await historyCollectMoney( params );

      if (res.Code === 2) {
        signOut();
        Alert.alert('Phiên làm việc của bạn đã hết');
      } else if (res.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(rs));
      } else if (res.Code === 1) {
        setListHistory(res.Data);
      } else {
        Alert.alert('Oops!!', JSON.stringify(rs));
      }
    } catch (e) {

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
      />
      {!isLoading ? (
        <List
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
          }
          contentContainerStyle={styles.contentCard}
          style={styles.container}
          data={listHistory}
          keyExtractor={(item, index) => `${index}-${item.ID}`}
          renderItem={({item}) => ( <HistoryRecord data={item} />)}
        />
      ) : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Loading /></View>}

    </>
  );
};

export default RoomDetailMoneyHistoryScreen;
