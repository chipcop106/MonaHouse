import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Text, IndexPath, List } from '@ui-kitten/components';
import HistoryRecord from './ListItems/HistoryMoney';
import FilterHeader from '~/components/FilterHeader';
import { Context as RoomContext } from '~/context/RoomContext';
import { Context as MotelContext } from '~/context/MotelContext';
import { Context as AuthContext } from '~/context/AuthContext';
import Loading from '~/components/common/Loading';
import { create_UUID } from '~/utils';
import { historyCollectMoney } from '~/api/CollectMoneyAPI';
import moment from 'moment';
const MoneyHistoryScreen = () => {
  const { signOut } = useContext(AuthContext);
  const { state: roomState, getElectrictHistory, updateState } = useContext(
    RoomContext
  );
  const { state: motelState } = useContext(MotelContext);
  const { listMotels } = motelState;
  const { filterStateDefault, listElectrictRooms } = roomState;
  const [listData, setlistData] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const [isRefresh, setIsRefresh] = useState(false);
  const [filterState, setFilterState] = useState(filterStateDefault);
  // useEffect(() => {
  //     ( async () => {
  //         setisLoading(true);
  //         try {
  //             await loadData();
  //         } catch (error) {
  //             console.log('load init error:', error)
  //         }
  //         setisLoading(false);
  //     } )();
  //     return () => {
  //
  //     }
  // }, [])
  const loadData = async (filter = filterState) => {
    try {
      // motelid:0
      // roomid:0
      // month:8
      // year:2020
      // sort:0
      console.log(filter);
      const rs = await historyCollectMoney({
        motelid: listMotels[filter?.selectedMotelIndex - 1]?.ID ?? 0,
        roomid: 0,
        month:
          filter.selectedMonthIndex === 0
            ? moment().format('MM')
            : filter.selectedMonthIndex,
        year: moment().format('YYYY'),
        sort: 0,
      });
      if (rs.Code === 2) {
        signOut();
        Alert.alert('Phiên làm việc của bạn đã hết');
      } else if (rs.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(rs));
      } else if (rs.Code === 1) {
        setlistData(rs.Data);
      } else {
        Alert.alert('Oops!!', JSON.stringify(rs));
      }
    } catch (error) {
      console.log('loadData', error);
      Alert.alert('Oops!!', JSON.stringify(error));
    }
  };
  const onFilterChange = (filter) => {
    setFilterState(filter);
    (async () => {
      setisLoading(true);
      try {
        await loadData(filter);
      } catch (error) {
        console.log('load init error:', error);
      }
      setisLoading(false);
    })();
  };
  const _onRefresh = async () => {
    setIsRefresh(true);
    try {
      await loadData();
    } catch (error) {
      console.log('_onRefresh error:', error);
    }
    setIsRefresh(false);
  };
  const _renderItem = ({ item }) => {
    return <HistoryRecord style={styles.card} data={item} />;
  };
  return (
    <>
      <FilterHeader
        onValueChange={onFilterChange}
        initialState={filterStateDefault}
        advanceFilter={false}
      />
      {!!isLoading && (
        <View style={{ padding: 15, alignItems: 'center' }}>
          <Loading />
        </View>
      )}
      {!!!isLoading && (
        <List
          contentContainerStyle={[{ padding: 15 }]}
          style={styles.listContainer}
          data={listData}
          keyExtractor={(item) => `${create_UUID()}-${item.id}`}
          renderItem={_renderItem}
          refreshControl={
            <RefreshControl onRefresh={_onRefresh} refreshing={isRefresh} />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', fontSize: 18, color: 'grey' }}>
              Bạn chưa có lần thu tiền nào
            </Text>
          }
        />
      )}
    </>
  );
};

export default MoneyHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  card: {
    marginVertical: 7,
  },
  contentCard: {},

  listContainer: {
    flex: 1,
  },
});
