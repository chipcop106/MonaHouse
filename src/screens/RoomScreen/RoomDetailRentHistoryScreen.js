import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, IndexPath, List, Spinner } from '@ui-kitten/components';
import HistoryRecord from '~/components/HistoryRecord';
import FilterHeader from './FilterHeaderTime';

const RoomDetailRentHistoryScreen = () => {
  const [filterState, setfilterState] = useState({
    selectedMonthIndex: new IndexPath(0),
    selectedYearIndex: new IndexPath(0),
  });
  const [isLoading, setIsLoading] = useState(true);
  const [listHistory, setListHistory] = useState(null);

  const onFilterChange = (filter) => {
    setListHistory([{ id: 1 }, { id: 2 }]);
    setfilterState(filter);
    setIsLoading(false);
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
          contentContainerStyle={styles.contentCard}
          style={styles.listContainer}
          data={listHistory}
          keyExtractor={(item) => `${item.id}`}
          renderItem={() => (
            <HistoryRecord
              style={styles.card}
              renterInfo={true}
              title="Người thuê 1"
            />
          )}
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
