import React, { useContext, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  TouchableOpacity, Linking, Alert,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Icon, ListItem } from '@ui-kitten/components'

import { Context as AuthContext }  from '~/context/AuthContext';

import SliderPackage from './comp/Slider';
import CollapseMenu from '~/screens/RechargeScreen/comp/CollapseMenu'

import { color, settings, shadowStyle } from '~/config'
import { currencyFormat } from '~/utils';
import { getRechargePackage, rechargeAccount } from '~/api/CustomerAPI'

const RechargeIndex = (props) => {
  const navigation = useNavigation();
  const route = useRoute();

  const { signOut } = useContext(AuthContext);

  const [userData, setUserData] = useState('');
  const [packageData, setPackageData] = useState({
    isLoading: false,
    data: [
      {
        title: 'Gói ưu đãi nạp tiền 01',
        text: 'Nạp 500.000đ để nhận ưu đãi trị giá 800.000đ',
      },
      {
        title: 'Gói ưu đãi nạp tiền 02',
        text: 'Nạp 500.000đ để nhận ưu đãi trị giá 800.000đ',
      },
      {
        title: 'Gói ưu đãi nạp tiền 03',
        text: 'Nạp 500.000đ để nhận ưu đãi trị giá 800.000đ',
      },
    ]
  });

  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data } = route.params;
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await fetchData();
      setIsLoading(false);
    })();
  }, []);

  const fetchData = async () => {

    console.log( 'user data', JSON.parse(data || '{}'));
    try {
      setUserData(JSON.parse(data || '{}'));

      setPackageData({ ...packageData, isLoading: true });
      const res = await getRechargePackage();
      if(res.Code === 0){
        Alert.alert('Oops!!', JSON.stringify(res));
      } else if( res.Code === 1 ){
        setPackageData({ data: res?.Data ?? [], isLoading: false });
        return '';
      } else if (res.Code === 2){
        Alert.alert('Oops!!', 'Phiên đăng nhập của bạn đã hết hạng.');
        signOut();
      } else {
        Alert.alert('Oops!!', JSON.stringify(res));
      }
      setPackageData({ ...packageData, isLoading: false });
    } catch (e) {
      console.log('fetchData error', e);
      setPackageData({ ...packageData, isLoading: false });
    }
  };
  const _onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };
  const _handleSliderPackage = (index) => {
    console.log('_handleSliderPackage', index);
    !!settings.phoneHelp && Linking.openURL(`tel:${settings.phoneHelp}`);
  };

  const _onPressHistory = () => navigation.navigate('SettingRechargeHistory', {  });
  return (
    <>
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_onRefresh} />
        }
        style={styles.container}>
        <View style={styles.secWrap}>
          <Text style={styles.secTitle}>{`Tài khoản`}</Text>
          <View style={styles.whiteBox}>
            <Text style={styles.infoTextRow}>
              Tài khoản còn lại:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {` ${currencyFormat(userData?.Wallet) ?? ``} `}đ
              </Text>
            </Text>
            <Text style={styles.infoTextRow}>
              Số tiền cần thanh toán tháng này:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {` ${currencyFormat(userData?.TotalFee) ?? ``} `}đ
              </Text>
            </Text>
            <Text style={styles.infoTextRow}>
              Số tiền mỗi phòng:{' '}
              <Text style={{ fontWeight: 'bold' }}>
                {` ${currencyFormat(userData?.FeePerRoom) ?? ``} `}đ
              </Text>
            </Text>
          </View>
        </View>
        <View style={styles.secWrap}>
          <Text style={styles.secTitle}>{`Các hình thức thanh toán`}</Text>
          <View style={styles.whiteBox}>
            <CollapseMenu />
          </View>
        </View>
        <Text
          style={[
            styles.secTitle,
            { paddingHorizontal: 15 },
          ]}>{`Các gói ưu đãi`}</Text>
        <SliderPackage
          onPress={_handleSliderPackage}
          carouselItems={packageData.data}
        />
        <View style={{ height: 20 }} />
      </KeyboardAwareScrollView>
      <View style={{ padding: 15 }}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.btn,
            styles.grayBtn,
            { justifyContent: 'space-between', alignItems: 'center' },
          ]}
          onPress={_onPressHistory}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Icon
              name="clock-outline"
              fill={color.disabledTextColor}
              style={{ height: 25, width: 25, marginRight: 5 }}
            />
            <Text style={{ color: '#000' }}>Lịch sử nạp tiền</Text>
          </View>
          <Icon
            name={'chevron-right-outline'}
            fill={color.disabledTextColor}
            style={{ height: 30, width: 30 }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.bgmain,
    flex: 1,
    paddingVertical: 20,
  },
  infoTextRow: {
    paddingVertical: 5,
    fontSize: 16,
  },
  infoRow: {
    paddingVertical: 5,
  },
  btn: {
    borderRadius: 6,
  },
  grayBtn: {
    backgroundColor: '#d1d1d1',
    color: '#000',
    borderColor: color.grayColor,
    flexDirection: 'row',
    minHeight: 45,
    alignItems: 'center',
    padding: 5,
  },
  secWrap: {
    paddingHorizontal: 15,
    marginBottom: 30,
    padding: 0,
  },
  secTitle: {
    fontSize: 16,
    marginBottom: 5,
    color: color.disabledTextColor,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
  whiteBox: {
    backgroundColor: '#fff',
    borderRadius: 6,
    minHeight: 40,
    padding: 10,
    ...shadowStyle,
  },
});

export default RechargeIndex;
