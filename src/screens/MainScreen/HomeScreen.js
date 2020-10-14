/* eslint-disable react-native/no-color-literals */
import React, { useContext, useEffect, useState, useRef, useLayoutEffect } from 'react'
import {
  Text,
  StyleSheet,
  View,
  processColor,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert, Platform,
} from 'react-native'
import { useNavigation } from '@react-navigation/native';
import NavLink from '../../components/common/NavLink';
import SummaryCard from '../../components/SummaryCard';

import { color } from '~/config';
import { currencyFormat, randomDataChart, renderNumberByArray } from '~/utils'
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as MotelContext } from '../../context/MotelContext';
import ModalizeSelect from '~/components/common/ModalizeSelect';
import { getOverview, getRevenueByMotelID } from '~/api/ReportAPI';

import moment from 'moment';
import MotelBarChart from './homeComp/BarChart'
// Example data


// End Example data
const pad = (n) => (n >= 10 ? n : `0${n}`);

//screen
const HomeScreen = () => {
  const navigation = useNavigation();

  const { signOut } = useContext(AuthContext);
  const { state: motelState, getListMotels } = useContext(MotelContext);
  const [pickerData, setPickerData] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState({
    house: 0,
    rooms: 0,
    renter: 0,
    renterMoveOut: 0,
  });
  useEffect(() => {
    (async () => {
      await getListMotels(signOut);
      loadInitData()
    })();
  }, []);
  useEffect(() => {
    console.log('motelState', motelState);
    setLoading(motelState.loading);
    if(!!motelState?.listMotels &&
      motelState?.listMotels.length > 0 ){
      setPickerData([
        'Tất cả nhà',
        ...motelState.listMotels.map((item) => item.MotelName),
      ]);
    } else {
      setPickerData(['Tất cả nhà']);
    }

  }, [motelState.listMotels]);
  useLayoutEffect(()=>{
    Platform.OS === 'android' && navigation.setOptions({
      headerLeft: null
    });
  }, [])
  const action_loadOverviewData = async (motelId) => {
    try {
      const rs = await getOverview({ motelid: motelId ?? 0 });
      if (rs.Code === 1) {
        setData({
          house: rs?.Data?.CountHouse ?? 0,
          rooms: rs?.Data?.CountRoom ?? 0,
          renter: rs?.Data?.CountRenter ?? 0,
          renterMoveOut: rs?.Data?.CountRenterComeOut ?? 0,
        });
      } else if (rs.Code === 2) {
        Alert.alert('Oops!!', 'Phiên làm việc đã hết, vui lòng đăng nhập lại');
        signOut();
      } else if (rs.Code === 0) {
        Alert.alert('Lỗi!!', JSON.stringify(rs.message));
      } else {
        Alert.alert('Lỗi!!', JSON.stringify(rs));
      }
    } catch (e) {
      console.log('action_loadOverviewData error:', e);
      Alert.alert('Lỗi!!', e);
    }
  };
  const action_loadChartData = async (motelId) => {
    try {
      // int MotelID - 0 lấy hết
      // int RoomID - 0 lấy hết
      // int Month - 0 lấy hết
      // int Year - 0 lấy năm hiện tại
      const rs = await getRevenueByMotelID({ MotelID: motelId ?? 0,
        RoomID: 0,
        Month: moment().subtract(1, 'months').format('DD'),
        Year: moment().format('YYYY')
      });
      if (rs.Code === 1) {
        setChartData(rs.Data);
      } else if (rs.Code === 2) {
        Alert.alert('Oops!!', 'Phiên làm việc đã hết, vui lòng đăng nhập lại');
        signOut();
      } else if (rs.Code === 0) {
        Alert.alert('Lỗi!!', JSON.stringify(rs));
      } else {
        Alert.alert('Lỗi!!', JSON.stringify(rs));
      }
    } catch (e) {
      console.log('action_loadChartData error:', e);
      Alert.alert('Lỗi!!', JSON.stringify(e));
    }
  };
  const loadInitData = (index = selectedIndex) => {
    const motelId = motelState.listMotels[index - 1]?.ID ?? 0;

    Promise.all([
      action_loadOverviewData(motelId),
      action_loadChartData(motelId),
    ])
      .then(([a, b]) => {
        //all done
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const _onRefresh = async () => {
    setIsRefreshing(true);
    await loadInitData(selectedIndex);
    setIsRefreshing(false);
  };
  const _onValueSelectChange = (itemIndex, itemValue) => {
    console.log('_onValueSelectChange', itemIndex, itemValue);
    setSelectedIndex(itemIndex);
    loadInitData(itemIndex);
  };
  const totalDeptRender = () => {
    let rs = 0;
    try{
      rs = renderNumberByArray(chartData, 'totalDebt');
      if(rs < 0){
        return rs*-1;
      }
    } catch (e) {
      console.log('totalDeptRender error', e);
    }
    return rs;
  }
  const totalCurrentRevenue = () => {
    let rs = 0;
    try {
      // console.log(new Date().getMonth());
      chartData.map(item => {
        rs = item.dataRevenue[new Date().getMonth()] + rs;
      })
    } catch (e) {
      console.log('totalCurrentRevenue error', e);
    }
    return rs;
  }
  return (
    <View style={styles.container}>
      <View style={styles.filterWrap}>
        <ModalizeSelect
          onChange={_onValueSelectChange}
          pickerData={pickerData}
          selectedValue={pickerData[0]}
          leftIcon="home"
          disabled={loading}
        />
      </View>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl onRefresh={_onRefresh} refreshing={isRefreshing} />
        }>
        <View
          style={{
            ...styles.wrapCard,
            backgroundColor: 'transparent',
            paddingTop: 10,
            paddingBottom: 0,
          }}>
          <View style={styles.summaryWrap}>
            <SummaryCard
              title="Nhà"
              number={
                selectedIndex === 0
                  ? motelState.listMotels?.length
                    ? pad(motelState.listMotels.length)
                    : '-'
                  : `1`
              }
              description={`${
                selectedIndex === 0
                  ? `Tổng số nhà ${'\n'} hiện có`
                  : `${motelState.listMotels[selectedIndex - 1].MotelName}`
              }`}
            />
            <SummaryCard
              title="Phòng"
              number={`${data?.rooms ?? 0}`}
              description={`Tổng số phòng ${'\n'} hiện có`}
            />
            <SummaryCard
              title="Phòng đang thuê"
              number={`${data?.renter ?? 0}`}
              description={`Số lượng phòng ${'\n'} đang thuê`}
              totalRoom={`${data?.rooms ?? 0}`}
            />
            <SummaryCard
              title="Sắp dọn ra"
              number={`${data?.renterMoveOut ?? 0}`}
              description={`Phòng sắp dọn ra ${'\n'} trong tháng tới`}
            />
          </View>
        </View>

        <View style={styles.wrapCard}>
          <View style={styles.chartWrap}>
            <View style={styles.infoRow}>
              <Text>
                Tổng doanh thu tháng {` `}
                <Text style={styles.txMedium}>{ `${ moment().format('MM/YYYY') }` }</Text> :
              </Text>
              <Text style={styles.txBold}>{`${ currencyFormat( totalCurrentRevenue() ) }`}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text>
                Tổng nợ tháng {` `}
                <Text style={styles.txMedium}>{ `${ moment().format('MM/YYYY') }` }</Text> :
              </Text>
              <Text style={[styles.txBold, { color: color.redColor }]}>{ currencyFormat(totalDeptRender()) }</Text>
            </View>
            <View style={styles.infoRow}>
              <Text>Biểu đồ doanh thu trong năm { `${ moment().format('YYYY') }` } ( triệu đồng )</Text>
            </View>
            <View style={styles.chartContainer}>
              {
                !!!isRefreshing ? <MotelBarChart data={chartData} /> : <ActivityIndicator />
              }
            </View>
          </View>
        </View>
        <View style={styles.wrapCard}>
          <Text style={styles.title}>Xem thống kê</Text>
          <NavLink
            routeName="ReportElectrict"
            title="Thống kê điện nước"
            imageUrl={require('../../../assets/electrict-chart.png')}
            borderBottom
          />
          <NavLink
            routeName="ReportFillRate"
            title="Tỉ lệ lấp đầy"
            imageUrl={require('../../../assets/fill-chart.png')}
            borderBottom
          />
          <NavLink
            routeName="ReportDebt"
            title="Doanh thu"
            imageUrl={require('../../../assets/debt-chart.png')}
            borderBottom
          />
          <NavLink
            routeName="ReportRoomType"
            title="Thống kê loại phòng"
            imageUrl={require('../../../assets/room-chart.png')}
            borderBottom={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapCard: {
    marginBottom: 10,
    paddingVertical: 30,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  summaryWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'stretch',
    marginHorizontal: '-1%',
  },
  txBold: {
    fontWeight: 'bold',
  },
  txMedium: {
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  chartContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#F5FCFF',
  },
  filterWrap: {
    padding: 10,
    backgroundColor: color.darkColor,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
});

export default HomeScreen;
