import React, {
  useContext,
  useEffect,
  useState,
  memo,
  useReducer,
} from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Icon, Input } from '@ui-kitten/components';
import CustomSelect from '~/components/common/CustomSelect';
import { color, settings } from '~/config';
import { Context as MotelContext } from '~/context/MotelContext';
import { Context as RoomContext } from '~/context/RoomContext';
import ModalizeSelect from '~/components/common/ModalizeSelect';
// const initialState = {
//     selectedMonthIndex: new IndexPath(0),
//     selectedMotelIndex: new IndexPath(0),
//     searchValue: "",
// }

const reducer = (prevstate, { type, payload }) => {
  switch (type) {
    case 'STATE_CHANGE': {
      return {
        ...prevstate,
        [payload.key]: payload.value,
      };
    }
    default:
      return prevstate;
  }
};

const FilterHeader = ({
  advanceFilter,
  onValueChange,
  yearFilter,
  initialState,
  loading,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filterShow, setFilterShow] = useState(false);
  const {
    selectedMonthIndex,
    selectedMotelIndex,
    selectedYearIndex,
    searchValue,
  } = state;
  const { state: motelState } = useContext(MotelContext);

  const _getSelectedIndex = (key) => {
    return (index) => {
      console.log(key, index);
      dispatch({ type: 'STATE_CHANGE', payload: { key, value: index } });
    };
  };
  useEffect(() => {
    onValueChange(state);
  }, [selectedMotelIndex, selectedMonthIndex, selectedYearIndex]);
  return (
    <View style={styles.filterWrap}>
      <View style={styles.filterSelect}>
        <View
          style={[
            styles.filter,
            styles.firstFilter,
            yearFilter && styles.fullWidth,
            { position: 'relative' },
          ]}>
          {/* <CustomSelect
                        disabled={loading}
                        selectOptions={[
                            { MotelName: "Tất cả" },
                            ...motelState.listMotels,
                        ].map((motel) => motel.MotelName)}
                        getSelectedIndex={_getSelectedIndex("selectedMotelIndex")}
                        selectedIndex={selectedMotelIndex}
                        icon="home"
                    /> */}
          <View style={[StyleSheet.absoluteFill]}>
            <ModalizeSelect
              disabled={loading}
              onChange={_getSelectedIndex('selectedMotelIndex')}
              pickerData={[
                'Tất cả',
                ...motelState.listMotels.map((item) => item.MotelName),
              ]}
              selectedValue={'Tất cả'}
              leftIcon="home"
              disabled={loading}
            />
          </View>
        </View>
        <View
          style={[
            styles.filter,
            styles.secondFilter,
            yearFilter && { marginLeft: 0, marginRight: 5 },
            { position: 'relative' },
          ]}>
          {/* <CustomSelect
                        selectOptions={settings.monthLists}
                        getSelectedIndex={_getSelectedIndex("selectedMonthIndex")}
                        selectedIndex={selectedMonthIndex}
                        icon="calendar"
                        disabled={loading}
                    /> */}
          <View style={[StyleSheet.absoluteFill]}>
            <ModalizeSelect
              disabled={loading}
              onChange={_getSelectedIndex('selectedMonthIndex')}
              pickerData={['Mới nhất', ...settings.monthLists]}
              selectedValue={
                ['Mới nhất', ...settings.monthLists][selectedMonthIndex || 0]
              }
              leftIcon="calendar"
              disabled={loading}
            />
          </View>
        </View>
        {yearFilter && (
          <View style={[styles.filter, styles.secondFilter]}>
            {/* <CustomSelect
                            selectOptions={settings.yearLists}
                            getSelectedIndex={_getSelectedIndex("selectedYearIndex")}
                            selectedIndex={selectedYearIndex}
                            icon="calendar"
                            disabled={loading}
                        /> */}
            <ModalizeSelect
              disabled={loading}
              onChange={_getSelectedIndex('selectedYearIndex')}
              pickerData={settings.yearLists}
              selectedValue={settings.yearLists[selectedYearIndex || 0]}
              leftIcon="calendar"
              disabled={loading}
            />
          </View>
        )}
        {advanceFilter && (
          <TouchableOpacity
            onPress={() => setFilterShow(!filterShow)}
            style={styles.buttonFilter}>
            <Icon
              name="funnel"
              fill={filterShow ? color.primary : color.whiteColor}
              style={{ width: 25, height: 25 }}
            />
          </TouchableOpacity>
        )}
      </View>
      {filterShow && (
        <View style={styles.filterSearch}>
          <Input
            returnKeyType={'done'}
            editable={loading}
            status="transparent"
            placeholder="Tìm kiếm..."
            value={searchValue}
            onChangeText={_getSelectedIndex('searchValue')}
            onEndEditing={() => onValueChange(state)}
            onSubmitEditing={() => onValueChange(state)}
            accessoryLeft={() => (
              <Icon
                name="search"
                fill={color.whiteColor}
                style={styles.searchIcon}
              />
            )}
          />
        </View>
      )}
    </View>
  );
};

export default memo(FilterHeader);

const styles = StyleSheet.create({
  filterWrap: {
    padding: 10,
    paddingBottom: 0,
    backgroundColor: color.darkColor,
  },

  filterSelect: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  filter: {
    flexGrow: 1,
    marginBottom: 10,
    minHeight: 40,
  },
  fullWidth: {
    width: '100%',
  },
  firstFilter: {
    marginRight: 5,
  },

  secondFilter: {
    marginLeft: 5,
  },

  filterSearch: {
    flexGrow: 1,
    marginBottom: 10,
  },

  searchIcon: {
    width: 20,
    height: 20,
  },
  buttonFilter: {
    backgroundColor: 'rgba(65,63,98,1)',
    marginLeft: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});
