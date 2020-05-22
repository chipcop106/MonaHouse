/* eslint-disable react-native/no-color-literals */
import React, { useContext, useEffect } from 'react';
import {
  Text,
  StyleSheet,
  View,
  processColor,
  ScrollView,
} from 'react-native';
import { BarChart } from 'react-native-charts-wrapper';
import CustomSelect from '../../components/common/CustomSelect';
import NavLink from '../../components/common/NavLink';
import SummaryCard from '../../components/SummaryCard';
import { color } from '../../config';
import { randomDataChart } from '../../utils';
import { Context as AuthContext } from '../../context/AuthContext';
import { Context as MotelContext } from '../../context/MotelContext';

// Example data

const HouseOptions = [{ id: 1, title: '319 C16 Lý Thường Kiệt', value: 1 }, { id: 2, title: '64 Út Tịch', value: 2 }];


const ChartData = {
  dataSets: [
    {
      label: '319 C16 Lý Thường Kiệt',
      values: randomDataChart(12, 0, 20, false),
      configs: {
        drawValues: true,
        colors: [processColor('#1ABC9C'), processColor('red')],
        valueTextSize: 16,
        valueTextColor: processColor('red'),
        valueFormatter: 'largeValue',
      },
    },
    {
      label: '64 Út Tịch',
      values: randomDataChart(12, 0, 20, false),
      configs: {
        drawValues: true,
        colors: [processColor('#1ABC9C'), processColor('red')],
        valueTextSize: 16,
        valueTextColor: processColor('ellow'),
        valueFormatter: 'largeValue',
      },
    },
  ],
  config: {
    barWidth: 0.15,
    group: {
      barSpace: 0.1,
      fromX: 0,
      groupSpace: 0.5,
    },
  },
};

const xAxisConfig = {
  valueFormatter: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Oct', 'Sep', 'Nov', 'Dec'],
  granularityEnabled: true,
  granularity: 1,
  drawLabels: true,
  drawAxisLine: false,
  drawGridLines: false,
  position: 'BOTTOM',
  textColor: processColor('#000'),
  textSize: 14,
  axisMinimum: 0,
  axisMaximum: 12,
  labelCount: 12,
  centerAxisLabels: true,
  avoidFirstLastClipping: true,
  enabled: true,
};

const yAxisConfig = {
  enabled: true,
  position: 'OUTSIDE_CHART',
  drawLabels: false,
  drawAxisLine: false,
  drawGridLines: true,
  gridColor: processColor('#e1e1e1'),
  gridLineWidth: 1,
  textColor: processColor('#000'),
  textSize: 12,
  granularityEnabled: true,
  granularity: 1,
  labelCountForce: true,
  labelCount: 6,
  drawLimitLinesBehindData: true,
};

// End Example data


const HomeScreen = () => {
  const { signOut } = useContext(AuthContext);
  const { state: motelState, getListMotels } = useContext(MotelContext);
  const getSelectedIndex = (index) => {
    console.log(index);
  };

  const pad = (n) => (n >= 10 ? n : `0${n}`);


  useEffect(() => {
    getListMotels(signOut);
  }, []);

  return (

    <View style={styles.container}>
      <View style={styles.filterWrap}>
        <CustomSelect style={styles.filter} selectOptions={HouseOptions.map((option) => option.title)} getSelectedIndex={getSelectedIndex} icon="home" />
      </View>

      <ScrollView style={styles.container}>
        <View style={{
          ...styles.wrapCard, backgroundColor: 'transparent', paddingTop: 10, paddingBottom: 0,
        }}
        >
          <View style={styles.summaryWrap}>
            <SummaryCard title="Nhà" number={motelState.listMotels?.length ? pad(motelState.listMotels.length) : '-'} description={`Tổng số nhà ${'\n'} hiện có`} />
            <SummaryCard title="Phòng" number="05" description={`Tổng số phòng ${'\n'} hiện có`} />
            <SummaryCard title="Phòng đang thuê" number="42" description={`Số lượng phòng ${'\n'} đang thuê`} totalRoom="47" />
            <SummaryCard title="Sắp dọn ra" number="09" description={`Phòng sắp dọn ra ${'\n'} trong 2 tháng tới`} />
          </View>
        </View>

        <View style={styles.wrapCard}>
          <View style={styles.chartWrap}>
            <View style={styles.infoRow}>
              <Text>
                Tổng doanh thu tháng
                <Text style={styles.txMedium}>03/2020</Text>
                {' '}
                :
              </Text>
              <Text style={styles.txBold}>48,166,000</Text>
            </View>
            <View style={styles.infoRow}>
              <Text>Tổng nợ:</Text>
              <Text style={styles.txBold}>6,000,000</Text>
            </View>
            <View style={styles.chartContainer}>
              <BarChart
                style={styles.chart}
                data={ChartData}
                xAxis={xAxisConfig}
                yAxis={yAxisConfig}
                marker={{
                  enabled: true,
                }}
              />
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
            title="Thống kê nợ"
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
  chart: {
    flex: 1,
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
