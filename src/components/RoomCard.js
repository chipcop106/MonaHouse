/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity,
} from 'react-native';
import {
  Card, OverflowMenu, MenuItem, Icon, Avatar, Button, ButtonGroup,
} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import Dash from 'react-native-dash';
import { color } from '../config';
import { useNavigation } from '@react-navigation/native';



const renderItemHeader = (headerprops, roomInfo, navigation) => {
 
  const [visible, setVisible] = useState(false);
  const onItemSelect = (index) => {
    setVisible(false);
  };

  const renderToggleMenuHeader = () => (<TouchableOpacity onPress={() => setVisible(true)}><Icon name="more-vertical" fill={color.whiteColor} style={styles.iconMenu} /></TouchableOpacity>);

  // console.log(roomInfo);
  return (
    <View {...headerprops} style={styles.headerWrap}>
      <View>
        <Text style={styles.roomName}>{roomInfo.item.name}</Text>
      </View>
      <OverflowMenu
        backdropStyle={styles.backdrop}
        anchor={renderToggleMenuHeader}
        visible={visible}
        onSelect={onItemSelect}
        onBackdropPress={() => setVisible(false)}
      >
        <MenuItem
          onPress={() => navigation.navigate('RoomDetail', { id: '1' })}
          title="Chi tiết"
          accessoryLeft={() => <Icon name="info-outline" fill={color.darkColor} style={styles.iconButton} />}
        />
        <MenuItem
          onPress={() => navigation.navigate('ElectrictCollect', { id: '1' })}
          title="Ghi điện"
          accessoryLeft={() => <Icon name="flash-outline" fill={color.darkColor} style={styles.iconButton} />}
        />
      </OverflowMenu>
    </View>
  );
};

const renderItemFooter = (footerProps, navigation) => (
  <View style={styles.footerAction}>
    <Button
      onPress={() => navigation.navigate('RoomGoIn', { id: '1' })}
      style={styles.actionButton}
      appearance="outline"
      status="primary"
      size="small"
      accessoryLeft={() => <Icon name="log-in-outline" fill={color.primary} style={styles.iconButton} />}
    >
      Dọn vào
    </Button>
    <Button
      onPress={() => navigation.navigate('RoomGoOut', { id: '1' })}
      style={styles.actionButton}
      appearance="outline"
      status="danger"
      size="small"
      accessoryLeft={() => <Icon name="log-out-outline" fill={color.redColor} style={styles.iconButton} />}
    >
      Dọn ra
    </Button>
    <Button
      onPress={() => navigation.navigate('MoneyCollect', { id: '1' })}
      style={styles.actionButton}
      appearance="outline"
      status="success"
      size="small"
      accessoryLeft={() => <Icon name="credit-card-outline" fill={color.greenColor} style={styles.iconButton} />}
    >
      Thu tiền
    </Button>

  </View>
);

const RoomCard = ({ roomInfo, addFee }) => {
  const navigation = useNavigation();
  return (
    <Card
      appearance="filled"
      style={styles.item}
      status="basic"
      header={(headerProps) => renderItemHeader(headerProps, roomInfo, navigation)}
      footer={(footerProps) => renderItemFooter(footerProps, navigation)}
    >
      <View style={styles.cardBody}>
        <View style={[styles.renter, styles.space]}>
          <Avatar style={styles.renterAvatar} size="large" source={{ uri: roomInfo.item.imageSrc }} />
          <Text style={styles.renterName}>Trương Văn Lam</Text>
        </View>
        <View style={[styles.space, styles.infoWrap]}>
          <View style={styles.info}>
            <Text style={styles.infoLabel}>Giá (tháng)</Text>
            <Text style={styles.infoValue}>2.500.000</Text>
          </View>
          <View style={[styles.info]}>
            <Text style={styles.infoLabel}>Ngày dọn ra dự kiến </Text>
            <Text style={styles.infoValue}>15/04/2021</Text>
          </View>
        </View>
        <View style={[styles.space, styles.statusWrap]}>
          <View style={styles.status}>
            <LinearGradient colors={color.gradients.success} style={styles.badge}>
              <Text style={styles.badgeText}>
                Đang thuê
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.status}>
            <LinearGradient colors={color.gradients.danger} style={styles.badge}>
              <Text style={styles.badgeText}>
                Chưa thu tiền
              </Text>
            </LinearGradient>
          </View>
          <View style={styles.status}>
            <LinearGradient colors={color.gradients.danger} style={styles.badge}>
              <Text style={styles.badgeText}>
                Chưa ghi điện nước
              </Text>
            </LinearGradient>
          </View>
        </View>
        <View style={[styles.balanceInfo]}>
          <View style={styles.balance}>
            <Text style={styles.balanceText}>
              Dư:
              <Text style={styles.balanceValue}> 5.925.000 đ</Text>
            </Text>
          </View>
          <TouchableOpacity 
          onPress={addFee}
          style={styles.touchButton}>
            <Icon name="plus-circle-outline" fill={color.darkColor} style={styles.iconButton} />
            <Text style={styles.textButton}>Thêm phí</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};


const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  headerWrap: {
    backgroundColor: color.primary,
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  roomName: {
    fontSize: 20,
    fontWeight: '700',
    color: color.whiteColor,
  },
  item: {
    marginBottom: 20,
    borderRadius: 8,
  },
  iconMenu: {
    width: 30,
    height: 30,
  },
  avatar: {
    margin: 10,
  },
  iconButton: {
    width: 20,
    height: 20,
  },
  space: {
    marginBottom: 20,
  },
  renter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  renterName: {
    marginLeft: 15,
    fontSize: 20,
    fontWeight: '600',
  },
  infoWrap: {
    marginHorizontal: -15,
    flexDirection: 'row',
  },
  info: {
    paddingHorizontal: 15,
    flexGrow: 1,
    flexShrink: 0,
  },
  infoLabel: {
    fontSize: 13,
    color: color.darkColor,
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 17,
    color: color.blackColor,
  },
  statusWrap: {
    flexDirection: 'row',
    marginHorizontal: -5
  },
  status: {
    marginHorizontal: 5,
  },
  badge: {
    padding: 5,
    borderRadius: 4,
  },
  badgeText: {
    color: color.whiteColor,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceText: {
    fontSize: 15,
    color: color.darkColor,
  },
  touchButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textButton: {
    color: color.darkColor,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 5,
  },
  balance: {
    fontSize: 15,
  },
  balanceValue: {
    color: color.greenColor,
  },
  footerAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  actionButton: {
    padding: 5,
  },
  cardBody: {
  },
});

export default RoomCard;
