import React, {useState, useContext, memo, useEffect, useMemo, useRef} from "react";
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import {
    Icon, Input, Text, Button
} from "@ui-kitten/components";
import Spinner from 'react-native-loading-spinner-overlay';
import Loading from '~/components/common/Loading';
import { insertRoomFee } from '~/api/MotelAPI';
import Moment from 'moment';
import { currencyFormat } from '~/utils'
const AddFeeModal = props => {
    const [money, setMoney] = useState('');
    const [note, setNote] = useState('');
    const [spinner, setSpinner] = useState(false);
    const { data } = props;

    const _onPressAddFee = async () => {
        if(!!!money) return Alert.alert('Chưa nhập số tiền', '',{});
        if(parseInt(money) < 1000) return Alert.alert('Số tiền quá ít', 'Số tiền ít nhất là 1000',{});
        setSpinner(true);
        try {
            const res = await insertRoomFee({
                roomid: data.RoomID,
                renterid: data.RenterID,
                date: Moment().format('DD/MM/YYYY'),
                note: note,
                price: money,
            })
            if(res?.Code === 1){
                setSpinner(false);
                await new Promise(a => setTimeout(a, 300));
                Alert.alert('Chúc Mừng!!', 'thêm phí thành công', [{
                    text: "Ok",
                    onPress: () => {
                        !!props?.onSuccess && props?.onSuccess();
                    },
                }]);
            } else {
                throw res;
            }
        } catch (error) {
            console.log('_onPressAddFee error', error);
            Alert.alert('Thông báo!!', `thêm phí thất bại \n ${ error }`,[{
                text: "Ok",
                onPress: () => {
                    setSpinner(false);
                },
            }]);
            
        }
        
    }

    return (<>
        { !!data ? <><View style={styles.formGroup}>
                <Text category="h5" status="primary">{ data.RoomName || '' }</Text>
            </View>
        
            <View style={[styles.formGroup]}>
                <Input
                    label="Số tiền"
                    placeholder="0"
                    keyboardType="numeric"
                    value={currencyFormat(money)}
                    onChangeText={(nextValue) => setMoney(nextValue.replace(/\./g,''))}
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
                onPress={_onPressAddFee}
            >
                <Text style={{textTransform: "uppercase", fontSize: 14, fontWeight: "bold"}}>Thêm phí cho phòng này</Text>
            </Button></>
            : <View style={{minHeight: 150, padding: 15, justifyContent: "center", alignItems: "center"}}>
                <Loading />
            </View>
        }
         <Spinner visible={spinner} />
    </>)
}

const styles = StyleSheet.create({
    formGroup:{
        marginBottom: 15
    },
})
function areEqual(prevProps, nextProps) {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
    return prevProps.data === nextProps.data
}

export default memo(AddFeeModal, areEqual);