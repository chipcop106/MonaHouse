import React, { useState, useContext } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { List } from '@ui-kitten/components';
import HistoryRecord from './ListItems/HistoryEW';
import FilterHeader from '~/components/FilterHeader';
import { Context as RoomContext } from '~/context/RoomContext';
import { Context as MotelContext } from '~/context/MotelContext';
import { Context as AuthContext } from '~/context/AuthContext';
import Loading from '~/components/common/Loading';
const ElectricHistoryScreen = () => {
  //share state
  const { state: roomState, getElectricHistory } = useContext(RoomContext);
  const { state: motelState } = useContext(MotelContext);
  const { signOut } = useContext(AuthContext);
  const { listElectricHistory, filterStateDefault } = roomState;

  //local state
  const [isRefresh, setIsRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterState, setFilterState] = useState(filterStateDefault);

  const loadData = async (filter) => {
    console.log('filter', filter);
    const { selectedMonthIndex, selectedMotelIndex } = filter;
    try {
      //console.log(listMotels);

      const rs = await getElectricHistory({
        motelid: motelState.listMotels[selectedMotelIndex - 1]?.ID ?? 0,
        month: selectedMonthIndex,
      });
      if (rs.Code === 2) {
        signOut();
        Alert.alert('Phiên làm việc của bạn đã hết');
      } else if (rs.Code === 0) {
        Alert.alert('Oops!!', JSON.stringify(rs));
      } else if (rs.Code === 1) {
        // setlistData(rs.Data);
      } else {
        Alert.alert('Oops!!', JSON.stringify(rs));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const _onRefresh = async () => {
    setIsRefresh(true);
    try {
      await loadData(filterState);
    } catch (error) {
      console.log('_onRefresh error:', error);
    }
    setIsRefresh(false);
  };
  const onFilterChange = async (filter) => {
    console.log('filter', filter);
    setFilterState(filter);
    setIsLoading(true);
    await loadData(filter);
    setIsLoading(false);
  };

  return (
    <>
      <FilterHeader
        onValueChange={onFilterChange}
        initialState={filterStateDefault}
        advanceFilter={false}
      />
      {!!isLoading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Loading />
        </View>
      ) : (
        <List
          refreshControl={
            <RefreshControl onRefresh={_onRefresh} refreshing={isRefresh} />
          }
          contentContainerStyle={styles.contentCard}
          data={listElectricHistory}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={({item}) => <HistoryRecord style={styles.card} data={item}/>}
          style={styles.container}
        />
      )}
    </>
  );
};

export default ElectricHistoryScreen;

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
});
