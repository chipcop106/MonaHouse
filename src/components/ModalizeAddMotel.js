import React, {useState, useContext, memo, useEffect,
     useRef, forwardRef, useReducer } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import {
    Icon, Input, Button, List
} from "@ui-kitten/components";
import { Modalize } from 'react-native-modalize';
import Spinner from 'react-native-loading-spinner-overlay'
import Loading from '~/components/common/Loading'
import { color } from '~/config'
import { create_UUID } from '~/utils'
import { createMotelByName } from '~/api/MotelAPI'
import { Context as AuthContext } from "~/context/AuthContext";

const LoadingIndicator = () => <ActivityIndicator color="#fff" />
const RemoveIcon = (props) => (
    <Icon {...props} name='trash-2-outline'/>
  );
  
const initialState = {
    isLoading: false,
    isReload: false,
    listMotel: []
}
function RemoveItemByindex({index, array}) {
    array.splice(index, 1);
    return array;
}
function updateItemByindex({index, item, array}) {
    for (var i in array) {
        if (i == index) {
              array[i] = {id: array[i].id, ...item};
              break; 
        }
      }
      return array;
}
const reducer = (prevState, {type , value}) => {
    switch (type) {
        case "SET_STATE":

            return {
                ...prevState,
                ...value
            }
        case "ADD_BLANK_ITEM": 
            return {
                ...prevState,
                listMotel: [...prevState.listMotel, {id: `${create_UUID()}`, name: ''}]
            }
        case "REMOVE_ITEM_BY_INDEX":
            return {
                ...prevState,
                listMotel: RemoveItemByindex({index: value, array: prevState.listMotel})
            }
        case "UPDATE_ITEM_BY_INDEX": 
            return {
                ...prevState,
                listMotel: updateItemByindex({
                    index: value.index,
                    item: {name: value.item},
                    array: prevState.listMotel
                })
            }
        case "RESET_STATE": 
            return initialState
        default:
            return prevState
    }
}

const ModalizeAddMotel = forwardRef((props, ref) => {
    const { signOut } = useContext(AuthContext);

    const [spinner, setspinner] = useState(false);
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => () => dispatch({type: 'RESET_STATE'}), []);

    // action + event
    const _onPressAdd = () => {
        dispatch({type: "ADD_BLANK_ITEM"})
    }
    const _onPressRemove = (index) => {
        dispatch({type: "REMOVE_ITEM_BY_INDEX", value: index})
    }
    const _onChangeByIndex = (index, value) => {
        dispatch({ type: 'UPDATE_ITEM_BY_INDEX', value: {
            index,
            item: value
        } })
    }
    const action_Submit = async () => {
        setspinner(true);
        try {
            console.log(state.listMotel)
            const res = await createMotelByName( { listname: JSON.stringify(state.listMotel.map(s => s.name)) } ); 
            if(res.Code === 2) {
                Alert.alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!");
                signOut();
            } else if( res.Code === 1 ){
                Alert.alert("Thành công", '', [{
                    text: "Tiếp tục thêm nhà",
                    onPress: () => {
                        setspinner(false);
                        dispatch({type: "RESET_STATE"});
                    },
                },
                {
                    text: "Trở lại quản lý phòng",
                    onPress: () => {
                        setspinner(false);
                        ref.current?.close();
                    },
                },]);

            } else {

            }

        } catch (error) {
            setspinner(false);
        }
       
        // ref.current?.close();
    }

    const _renderItem = (item, index) => {
        return <View style={styles.formRow} key={`${item.id}`}>
            <Input
              returnKeyType={"done"}
                textStyle={styles.input}
                style={{flex: 1, marginRight: 10, marginBottom: -5}}
                label=""
                status="primary"
                placeholder="Tên nhà trọ ( địa chỉ ): 343 CMT8, HCM"
                onBlur={ ({nativeEvent})=>  _onChangeByIndex(index, nativeEvent.text) }
            />
            
            <Button
                onPress={() => _onPressRemove(index)}
                status="danger"
                accessoryLeft={RemoveIcon}
            />
        </View>
    }
    const renderContent = () => {
        
        return (
            <View style={styles.formWrap}>
                {
                    Array.isArray(state.listMotel) && state.listMotel.map( _renderItem )
                }
                
                <View style={styles.formRow}>
                    <Button appearance="outline" status="info" 
                        style={[{ marginBottom: 5, flex: 1}]} 
                        onPress={_onPressAdd} accessoryLeft={(props)=> <Icon name="plus-outline" {...props}  />}>
                        Thêm Nhà Mới
                    </Button>
                </View>
            </View>
        )
    }
    const _onPressSubmit =  () => {
        action_Submit();
    }
    return (
        <Modalize ref={ref} {...props}  >

           {renderContent()}
           <Button
                onPress={_onPressSubmit}
                style={styles.btnSubmit}
                accessoryRight={state.isLoading ? LoadingIndicator : null}>
                <Text style={styles.btnSubmit}>Xác nhận thêm {state.listMotel.length} nhà</Text>
            </Button>
            
            <Spinner visible={spinner} />
        </Modalize>
    )
});

const styles = StyleSheet.create({
    input: {
        flex: 1,
        minHeight: 30,
        
    },
    formRow: {
        marginBottom: 10,
        flexDirection: "row",
    },
    formWrap: {
        padding: 15
    },
    btnSubmit: {
        backgroundColor: color.success, 
        borderRadius: 0,
        minHeight: 50,
        justifyContent: "center",
        fontSize: 15,
        textTransform: "uppercase"
    }
})

export default memo(ModalizeAddMotel);