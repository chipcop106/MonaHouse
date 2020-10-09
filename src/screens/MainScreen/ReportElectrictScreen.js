import React, { useContext, useEffect, useState } from 'react'
import { Text, StyleSheet, View, Alert, ScrollView, RefreshControl, ActivityIndicator } from 'react-native'
import ModalizeSelect from '~/components/common/ModalizeSelect'
import { Context as MotelContext } from '~/context/MotelContext'
import { Context as AuthContext } from '~/context/AuthContext'
import { color } from '~/config'
import { getReportElectricWater } from '~/api/ReportAPI'
import moment from 'moment'
import BarChartWE from './homeComp/BarChartWE'
import MotelBarChart from '~/screens/MainScreen/homeComp/BarChart'
import { pad } from '~/utils'

const ReportElectricScreen = (props) => {

  const [loading, setLoading] = useState(false);

  const { signOut } = useContext(AuthContext);
  const { state: motelState } = useContext(MotelContext);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [pickerData, setPickerData] = useState('');
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
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
  useEffect(() => {
    ( async ()=>{
      const motelId = motelState.listMotels[selectedIndex - 1]?.ID ?? 0;
      setLoading(false);
      await loadChartData(motelId);
      setLoading(false);
    } )()
    return () => {}
  }, [])


  const loadChartData = async (motelId = 0) => {
    try {

      const rs =  await getReportElectricWater({motelId,
        year: moment().format('YYYY')
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
  const _onValueSelectChange = (itemIndex, itemValue) => {
    console.log('_onValueSelectChange', itemIndex, itemValue);
    setSelectedIndex(itemIndex);
    ( async ()=>{
      const motelId = motelState.listMotels[itemIndex - 1]?.ID ?? 0;
      setLoading(false);
      await loadChartData(motelId);
      setLoading(false);
    } )()
  }
  const _onRefresh = () => {

    ( async ()=>{
      const motelId = motelState.listMotels[selectedIndex - 1]?.ID ?? 0;
      setIsRefreshing(true);
      await loadChartData(motelId);
      setIsRefreshing(false);
    } )()

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
        style={[styles.container, { padding: 15 }]}
        refreshControl={<RefreshControl onRefresh={_onRefresh} refreshing={isRefreshing} />}
      >
        <Text style={{fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase'}}>{`Tổng sử dụng ở ${ pickerData[selectedIndex] }`}</Text>
        <View style={styles.chartContainer}>
          {
            !!!isRefreshing ? <BarChartWE data={chartData} /> : null
          }
        </View>

      </ScrollView>
    </View>
  )
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgmain
  },
  filterWrap: {
    padding: 10,
    backgroundColor: color.darkColor,
  },
  chartContainer: {
    marginLeft: -10,
    marginRight: -10,
    aspectRatio: 1,
  },
});

export default ReportElectricScreen;
