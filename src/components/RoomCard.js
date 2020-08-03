/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, memo } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, Image
} from 'react-native';
import {
    Card, OverflowMenu, MenuItem, Icon, Avatar, Button, ButtonGroup,
} from '@ui-kitten/components';
import LinearGradient from 'react-native-linear-gradient';
import Dash from 'react-native-dash';
import { color, shadowStyle } from '../config';
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
                    screen: "RoomDetail",
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

    const renderToggleMenuHeader = () => (<TouchableOpacity style={{ position: 'absolute', right: 10, }} onPress={() => setVisible(true)}><Icon name="more-vertical" fill={color.whiteColor} style={styles.iconMenu} /></TouchableOpacity>);

    return (
        <View
            {...headerprops}
            style={styles.headerWrap}>
            <TouchableOpacity
                onPress={() => navigation.navigate('RoomDetailStack', {
                    screen: "RoomDetail",
                    params: {
                        roomId: item.RoomID,
                    },
                })}
            >
                <Text
                    style={styles.roomName}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                >
                    {item.RoomName}
                </Text>
            </TouchableOpacity>
            <OverflowMenu
                backdropStyle={styles.backdrop}
                anchor={renderToggleMenuHeader}
                visible={visible}
                onSelect={onItemSelect}
                onBackdropPress={() => setVisible(false)}
            >
                <MenuItem
                    title="Chi tiết"
                    accessoryLeft={() => <Icon name="info-outline" fill={color.darkColor} style={styles.iconButton} />}
                />
                <MenuItem
                    title="Ghi điện"
                    accessoryLeft={() => <Icon name="flash-outline" fill={color.darkColor} style={styles.iconButton} />}
                />
            </OverflowMenu>
        </View>
    );
};

const renderItemFooter = (footerProps, roomInfo, navigation) => {
    const { item } = roomInfo;

    return (

        <View style={styles.footerAction}>
            <Button
                onPress={() => navigation.navigate('RoomGoIn', { roomId: item.RoomID })}
                style={styles.actionButton}
                appearance="outline"
                status="primary"
                size="small"
                disabled={item.StatusRoomID !== 1}
                accessoryLeft={() => <Icon name="log-in-outline" fill={item.StatusRoomID !== 1 ? color.disabledTextColor : color.primary} style={styles.iconButton} />}
            >
                Dọn vào
          </Button>
            <Button
                onPress={() => navigation.navigate('RoomGoOut', { roomId: item.RoomID })}
                style={styles.actionButton}
                appearance="outline"
                status="danger"
                size="small"
                disabled={item.StatusRoomID === 1}
                accessoryLeft={() => <Icon name="log-out-outline" fill={item.StatusRoomID === 1 ? color.disabledTextColor : color.redColor} style={styles.iconButton} />}
            >
                Dọn ra
          </Button>
            <Button
                onPress={() => navigation.navigate('MoneyCollect', { roomId: item.RoomID })}
                style={styles.actionButton}
                appearance="outline"
                status="success"
                size="small"
                disabled={item.StatusRoomID === 1}
                accessoryLeft={() => <Icon name="credit-card-outline" fill={item.StatusRoomID === 1 ? color.disabledTextColor : color.greenColor} style={styles.iconButton} />}
            >
                Thu tiền
          </Button>

        </View>
    );
}

const RoomCard = ({ roomInfo, addFee }) => {
    const navigation = useNavigation();
    const { item } = roomInfo;
    return (
        <View style={styles.item}>

            <Card
                style={[{ borderRadius: 9 }]}
                appearance="filled"
                status="basic"
                header={(headerProps) => renderItemHeader(headerProps, roomInfo, navigation)}
                footer={(footerProps) => renderItemFooter(footerProps, roomInfo, navigation)}
            >
                <View style={[styles.renter, styles.space]}>
                    <View style={[styles.renterAvatar, !!!item.Avatar && styles.renterAvatarNoimg]}>
                        <Avatar style={[styles.avatarinner]} shape="square"  source={item.Avatar ? { url: item.Avatar } : noImageSrc} />
                    </View>
                    <Text style={styles.renterName}>{item.Renter ? item.Renter : 'Chưa có khách'}</Text>
                </View>
                <View style={styles.cardBody}>
                    
                    <View style={[styles.space, styles.infoWrap]}>
                        <View style={styles.info}>
                            <Text style={styles.infoLabel}>Giá (tháng)</Text>
                            <Text style={styles.infoValue}>{currencyFormat(item.RoomPrice)}</Text>
                        </View>
                        <View style={[styles.info]}>
                            <Text style={styles.infoLabel}>Ngày dọn ra dự kiến </Text>
                            <Text style={styles.infoValue}>{item.RenterDateOut ? item.RenterDateOut : 'Chưa có'}</Text>
                        </View>
                    </View>
                    <View style={[styles.space, styles.statusWrap]}>
                        <View style={styles.status}>
                            {item.StatusRoomID === 2 ? (
                                <LinearGradient colors={color.gradients.success} style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        Đang thuê
                    </Text>
                                </LinearGradient>
                            )
                                : (
                                    <LinearGradient colors={color.gradients.danger} style={styles.badge}>
                                        <Text style={styles.badgeText}>
                                            Trống
                    </Text>
                                    </LinearGradient>
                                )
                            }

                        </View>
                        <View style={styles.status}>
                            {item.StatusColletID === 5 &&
                                (<LinearGradient colors={color.gradients.danger} style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        Chưa thu tiền
                    </Text>
                                </LinearGradient>)
                            }
                            {item.StatusColletID === 6 &&
                                (<LinearGradient colors={color.gradients.success} style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        Đã thu tiền
                    </Text>
                                </LinearGradient>)
                            }
                        </View>
                        <View style={styles.status}>
                            {item.StatusWEID === 7 && (
                                <LinearGradient colors={color.gradients.danger} style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        Chưa ghi điện nước
                    </Text>
                                </LinearGradient>
                            )}
                            {item.StatusWEID === 8 && (
                                <LinearGradient colors={color.gradients.success} style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        Đã ghi điện nước
                    </Text>
                                </LinearGradient>
                            )}
                        </View>
                    </View>
                    <View style={[styles.balanceInfo]}>
                        <View style={styles.balance}>
                            <Text style={styles.balanceText}>
                                Dư:
                            <Text style={styles.balanceValue}> {currencyFormat(item.MoneyDebtID)} đ</Text>
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
        position: 'relative'
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
        ...shadowStyle
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
        backgroundColor: '#fff'
    },
    actionButton: {
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 6,
        minHeight: 45,
        justifyContent: "center"
    },
    cardBody: {
        backgroundColor: '#F0F4F8',
        padding: 15,
        borderRadius: 6
    },
    renterAvatar: {
        width: 36,
        aspectRatio: 1,
        borderRadius: 36/2,
        overflow: 'hidden',
        justifyContent: "center",
        alignItems: "center"
    },
    avatarinner: {
        width: 16,
        height: 16
    },
    renterAvatarNoimg: {
        backgroundColor: 'rgba(0,0,0,0.2)',
       
    }
});

export default memo(RoomCard);
