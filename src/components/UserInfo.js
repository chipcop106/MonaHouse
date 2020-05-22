import React, {memo} from 'react';
import { StyleSheet, View, TouchableOpacity, Linking } from 'react-native';
import { Text, Avatar, Icon } from '@ui-kitten/components';
import { color } from "~/config";

const UserInfo = ({ avatar, name, phone }) => {
    return (
        <View style={styles.userSection}>
            <View style={[styles.section]}>
                <View style={styles.userWrap}>
                    <View style={styles.userInfo}>
                        <Avatar
                            style={styles.avatar}
                            shape="round"
                            size="medium"
                            source={avatar ? { uri: avatar } : require('~/../assets/user.png')}
                        />
                        <View style={{ marginLeft: 10 }}>
                            <Text style={styles.userName}>{name}</Text>
                            <Text style={styles.phoneNumber}>{phone ? phone : 'Chưa có'}</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${phone}`)}
                    >
                        <Icon name="phone-outline" fill={color.primary} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    section: {
        paddingHorizontal: 15,
        marginBottom: 30,
        backgroundColor: color.whiteColor,
        borderRadius: 8,
    },
    userWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 0,
        marginBottom: 0
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    userSection: {
        marginBottom: 0,
        paddingHorizontal: 15,
        marginTop: 15,
    },
    userName: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 5,
    },
    userPhone: {
        color: color.labelColor
    }
})

export default memo(UserInfo);