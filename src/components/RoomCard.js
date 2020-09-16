/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Icon,
  MenuItem,
  OverflowMenu,
} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import { color, shadowStyle } from '~/config';
import { useNavigation } from '@react-navigation/native';
import { currencyFormat } from '~/utils';

const noImageSrc = require('../../assets/user.png');

const renderItemHeader = (headerprops, roomInfo, navigation) => {
  const { item } = roomInfo;
  const [visible, setVisible] = useState(false);
  const onItemSelect = (index) => {
    switch (index.row) {
      case 0: {
        navigation.navigate('RoomDetailStack', {
          screen: 'RoomDetail',
          params: {
            roomId: item.RoomID,
          },
        });
        break;
      }
      case 1: {
        console.log(item.RoomID);
        navigation.navigate('ElectrictCollect', { roomId: item.RoomID });
        break;
      }
    }
    setVisible(false);
  };

  const renderToggleMenuHeader = () => (
    <TouchableOpacity
      style={{ position: 'absolute', right: 10 }}
      onPress={() => setVisible(true)}>
      <Icon
        name="more-vertical"
        fill={color.whiteColor}
        style={styles.iconMenu}
      />
    </TouchableOpacity>
  );

  return (
    <View {...headerprops} style={styles.headerWrap}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('RoomDetailStack', {
            screen: 'RoomDetail',
            params: {
              roomId: item.RoomID,
            },
          })
        }>
        <Text style={styles.roomName} ellipsizeMode="tail" numberOfLines={1}>
          {item.RoomName}
        </Text>
      </TouchableOpacity>
      <OverflowMenu
        backdropStyle={styles.backdrop}
        anchor={renderToggleMenuHeader}
        visible={visible}
        onSelect={onItemSelect}
        onBackdropPress={() => setVisible(false)}>
        <MenuItem
          title="Chi tiết"
          accessoryLeft={() => (
            <Icon
              name="info-outline"
              fill={color.darkColor}
              style={styles.iconButton}
            />
          )}
        />
        <MenuItem
          title="Ghi điện"
          accessoryLeft={() => (
            <Icon
              name="flash-outline"
              fill={color.darkColor}
              style={styles.iconButton}
            />
          )}
        />
      </OverflowMenu>
    </View>
  );
};

const renderItemFooter = (footerProps, roomInfo, navigation) => {
  const { item } = roomInfo;
  const { StatusRoomID, RoomID, RenterID } = item;

  const checkIsGoIn = () => {
    if (StatusRoomID !== 1) {
      return !(!!item.RenterDateOut && item.RenterDepositID === 0);
    } else {
      return false;
    }
  };
  return (
    <View style={styles.footerAction}>
      <Button
        onPress={() =>
          navigation.navigate('RoomGoIn', {
            roomId: RoomID,
            isDeposit: !!RenterID,
          })
        }
        style={[
          styles.actionButton,
          checkIsGoIn() && { borderColor: color.disabledTextColor },
        ]}
        appearance="outline"
        status="primary"
        size="small"
        disabled={checkIsGoIn()}
        accessoryLeft={() => (
          <Icon
            name="log-in-outline"
            fill={checkIsGoIn() ? color.disabledTextColor : color.primary}
            style={styles.iconButton}
          />
        )}>
        <Text style={checkIsGoIn() && { color: color.disabledTextColor }}>
          Dọn vào
        </Text>
      </Button>

      <Button
        onPress={() => navigation.navigate('RoomGoOut', { roomId: RoomID })}
        style={[
          styles.actionButton,
          StatusRoomID === 1 && { borderColor: color.disabledTextColor },
        ]}
        appearance="outline"
        status="danger"
        size="small"
        disabled={StatusRoomID === 1}
        accessoryLeft={() => (
          <Icon
            name="log-out-outline"
            fill={StatusRoomID === 1 ? color.disabledTextColor : color.redColor}
            style={styles.iconButton}
          />
        )}>
        <Text style={StatusRoomID === 1 && { color: color.disabledTextColor }}>
          Dọn ra
        </Text>
      </Button>
      <Button
        onPress={() =>
          navigation.navigate('MoneyCollect', {
            roomId: RoomID,
            data: JSON.stringify(item),
          })
        }
        style={[
          styles.actionButton,
          StatusRoomID === 1 && { borderColor: color.disabledTextColor },
        ]}
        appearance="outline"
        status="success"
        size="small"
        disabled={StatusRoomID === 1}
        accessoryLeft={() => (
          <Icon
            name="credit-card-outline"
            fill={
              StatusRoomID === 1 ? color.disabledTextColor : color.greenColor
            }
            style={styles.iconButton}
          />
        )}>
        <Text style={StatusRoomID === 1 && { color: color.disabledTextColor }}>
          Thu tiền
        </Text>
      </Button>
    </View>
  );
};

const RoomCard = ({ roomInfo, onPressaddFee }) => {
  const navigation = useNavigation();
  const { item } = roomInfo;
  const renderStatusRoom = (caseIndex = item.StatusRoomID) => {
    switch (caseIndex) {
      case 1:
        return (
          <LinearGradient colors={color.gradients.danger} style={styles.badge}>
            <Text style={styles.badgeText}>
              {`Trống`}
              {item.StatusRoomID === 3 && 'Sắp hết hợp đồng'}
              {item.StatusRoomID === 4 && 'Sắp dọn vào'}
            </Text>
          </LinearGradient>
        );
      case 2:
        return (
          <LinearGradient colors={color.gradients.success} style={styles.badge}>
            <Text style={styles.badgeText}>{'Đang thuê'}</Text>
          </LinearGradient>
        );
      case 3:
        return (
          <LinearGradient colors={color.gradients.danger} style={styles.badge}>
            <Text style={styles.badgeText}>{`Sắp hết hợp đồng`}</Text>
          </LinearGradient>
        );
      case 4:
        return (
          <LinearGradient colors={color.gradients.danger} style={styles.badge}>
            <Text style={styles.badgeText}>{`Sắp dọn vào`}</Text>
          </LinearGradient>
        );
      case 14:
        return (
          <LinearGradient colors={color.gradients.danger} style={styles.badge}>
            <Text style={styles.badgeText}>{`Sắp dọn ra`}</Text>
          </LinearGradient>
        );
      default:
        return null;
    }
  };
  return (
    <View style={styles.item}>
      <Card
        style={[{ borderRadius: 9 }]}
        appearance="filled"
        status="basic"
        header={(headerProps) =>
          renderItemHeader(headerProps, roomInfo, navigation)
        }
        footer={(footerProps) =>
          renderItemFooter(footerProps, roomInfo, navigation)
        }>
        <View style={[styles.renter, styles.space]}>
          <View
            style={[
              styles.renterAvatar,
              !!!item.Avatar && styles.renterAvatarNoimg,
            ]}>
            <Avatar
              style={[styles.avatarinner]}
              shape="square"
              source={item.Avatar ? { url: item.Avatar } : noImageSrc}
            />
          </View>
          <Text style={styles.renterName}>
            {item.Renter ? item.Renter : 'Chưa có khách'}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <View style={[styles.space, styles.infoWrap]}>
            <View style={styles.info}>
              <Text style={styles.infoLabel}>Giá (tháng)</Text>
              <Text style={styles.infoValue}>
                {currencyFormat(item.RoomPrice)}
              </Text>
            </View>
            <View style={[styles.info]}>
              <Text style={styles.infoLabel}>Ngày dọn ra dự kiến </Text>
              <Text style={styles.infoValue}>
                {item.RenterDateOutContract
                  ? item.RenterDateOutContract
                  : 'Chưa có'}
              </Text>
            </View>
          </View>
          <View style={[item.Renter && styles.space, styles.statusWrap]}>
            <View style={styles.status}>{renderStatusRoom()}</View>
            <View style={styles.status}>
              {item.StatusRoomID !== 1 && item.StatusCollectID === 5 && (
                <LinearGradient
                  colors={color.gradients.danger}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Chưa thu tiền</Text>
                </LinearGradient>
              )}
              {item.StatusRoomID !== 1 && item.StatusCollectID === 6 && (
                <LinearGradient
                  colors={color.gradients.success}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Đã thu tiền</Text>
                </LinearGradient>
              )}
            </View>
            <View style={styles.status}>
              {item.StatusWEID === 7 && (
                <LinearGradient
                  colors={color.gradients.danger}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Chưa ghi điện nước</Text>
                </LinearGradient>
              )}
              {item.StatusWEID === 8 && (
                <LinearGradient
                  colors={color.gradients.success}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Đã ghi điện nước</Text>
                </LinearGradient>
              )}
              {item.StatusWEID === 9 && (
                <LinearGradient
                  colors={color.gradients.success}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Bao điện nước</Text>
                </LinearGradient>
              )}
              {item.StatusWEID === 10 && (
                <LinearGradient
                  colors={color.gradients.success}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Bao điện, đã ghi nước</Text>
                </LinearGradient>
              )}
              {item.StatusWEID === 11 && (
                <LinearGradient
                  colors={color.gradients.success}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Bao điện, chưa ghi nước</Text>
                </LinearGradient>
              )}
              {item.StatusWEID === 12 && (
                <LinearGradient
                  colors={color.gradients.success}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Bao nước, đã ghi điện</Text>
                </LinearGradient>
              )}
              {item.StatusWEID === 13 && (
                <LinearGradient
                  colors={color.gradients.success}
                  style={styles.badge}>
                  <Text style={styles.badgeText}>Bao nước, chưa ghi điện</Text>
                </LinearGradient>
              )}
            </View>
            {!!item.RenterDateOut && (
              <>
                <View style={[styles.status, {}]}>
                  <LinearGradient
                    colors={color.gradients.danger}
                    style={styles.badge}>
                    <Text
                      style={
                        styles.badgeText
                      }>{`Dọn ra ngày ${item.RenterDateOut}`}</Text>
                  </LinearGradient>
                </View>
                {!!!item.RenterDepositID ? (
                  <View style={[styles.status, {}]}>
                    <LinearGradient
                      colors={color.gradients.danger}
                      style={styles.badge}>
                      <Text
                        style={
                          styles.badgeText
                        }>{`Chưa có ngưởi đặt cọc`}</Text>
                    </LinearGradient>
                  </View>
                ) : (
                  <View style={[styles.status, {}]}>
                    <LinearGradient
                      colors={color.gradients.success}
                      style={styles.badge}>
                      <Text
                        style={
                          styles.badgeText
                        }>{`Đặt cọc ngày ${item.RenterDepositDateIn}`}</Text>
                    </LinearGradient>
                  </View>
                )}
              </>
            )}
          </View>
          {!!item.Renter && (
            <View style={[styles.balanceInfo]}>
              <View style={styles.balance}>
                <Text style={styles.balanceText}>
                  {item.MoneyDebtID > 0 ? 'Dư:' : 'Nợ:'}
                  <Text
                    style={[
                      styles.balanceValue,
                      item.MoneyDebtID < 0 && { color: color.redColor },
                    ]}>
                    {' '}
                    {currencyFormat(Math.abs(item.MoneyDebtID))} đ
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={onPressaddFee}
                style={styles.touchButton}>
                <Icon
                  name="plus-circle-outline"
                  fill={color.darkColor}
                  style={styles.iconButton}
                />
                <Text style={styles.textButton}>Thêm phí</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Card>
    </View>
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
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    position: 'relative',
  },
  roomName: {
    fontSize: 20,
    fontWeight: '700',
    color: color.whiteColor,
    paddingRight: 45,
  },
  item: {
    marginBottom: 20,
    borderRadius: 6,
    ...shadowStyle,
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
    marginHorizontal: -5,
    flexWrap: 'wrap',
  },
  status: {
    margin: 5,
  },
  badge: {
    padding: 10,
    borderRadius: 6,
    minHeight: 32,
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
    color: color.info,
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
    borderWidth: 0,
    marginTop: -1,
    backgroundColor: '#fff',
  },
  actionButton: {
    padding: 10,
    borderRadius: 6,
    minHeight: 45,
    justifyContent: 'center',
  },
  cardBody: {
    backgroundColor: '#F0F4F8',
    padding: 15,
    borderRadius: 6,
  },
  renterAvatar: {
    width: 36,
    aspectRatio: 1,
    borderRadius: 36 / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  renterAvatarNoimg: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

export default memo(RoomCard);
