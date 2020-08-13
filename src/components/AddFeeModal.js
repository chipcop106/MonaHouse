import React, {useState, useContext, memo, useEffect} from "react";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator } from "react-native";
import {
    Icon, Input, Text, Button
} from "@ui-kitten/components";

const AddFeeModal = props => {
    const [money, setMoney] = useState('');
    const [note, setNote] = useState('');
    const { data } = props;
    
    console.log('AddFeeModal', data);
    // useEffect(() => {
    //     console.log('new Data', data);
    // }, [data.RoomID])
    return (<>
        { !!data ? <><View style={styles.formGroup}>
                <Text category="h5" status="primary">{ data.RoomName || '' }</Text>
            </View>
        
            <View style={[styles.formGroup]}>
                <Input
                    label="Số tiền"
                    placeholder="0"
                    keyboardType="numeric"
                    value={money}
                    onChangeText={(nextValue) => setMoney(nextValue)}
                />
            </View>
            <View style={[styles.formGroup]}>
                <Input
                    label="Ghi chú"
                    placeholder=""
                    keyboardType="default"
                    value={note}
                    onChangeText={(nextValue) => setNote(nextValue)}
                    multiline
                />
            </View>
            <Button
            status="success"
            >
                Thêm phí cho phòng này
            </Button></> : <ActivityIndicator />
        }
    </>)
}

const styles = StyleSheet.create({
    formGroup:{
        marginBottom: 15
    },
})

export default memo(AddFeeModal);