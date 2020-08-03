import React, { useReducer, useState, useEffect, useContext, useLayoutEffect } from "react";
import { StyleSheet, ScrollView,
    Text, View, RefreshControl, Alert
} from "react-native";
import {useRoute, useNavigation} from '@react-navigation/native';
import { Input, Icon, Button, List } from "@ui-kitten/components";
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Service from '~/components/GoInForm/Service'
import Loading from '~/components/common/Loading'
import { Context as AuthContext } from "~/context/AuthContext";
import { settings, color, sizes, shadowStyle } from "~/config";
import { create_UUID } from "~/utils";
const reducer = (prevState, { type, value }) =>{
    
    switch (type) {
        case 'SET_STATE':
            return {
                ...prevState,
                ...value
            }
        case 'ADD_BLANK_ITEM':
            return {
                ...prevState,
                listService: [...prevState.listService, {id: `${create_UUID()}`, name: '', price: ''}]
            }
        case 'REMOVE_ITEM_BY_INDEX':
            return {
                ...prevState,
                listService: RemoveItemByindex({index: value, array: prevState.listService})
            }
        case 'UPDATE_ITEM_BY_INDEX':
            return {
                ...prevState,
                listService: updateItemByindex({
                    index: value.index, 
                    item: value.item, 
                    array: prevState.listService
                })
            }
        default:
            return prevState
    }
}
function updateItemByindex({index,item, array}) {
    for (var i in array) {
        if (i == index) {
              array[i] = item;
              break; 
        }
      }
      return array;
    
}
function RemoveItemByindex({index, array}) {
    array.splice(index, 1);
    return array;
}
const initialState = {
    isLogout: false,
    isAlertVisible: false,
    listService: []
    
}
const SettingServiceScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { ID } = route.params
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isRefesh, setisRefesh] = useState(false)
    
    useLayoutEffect(() => {
        return () => {}
    }, [])
    useEffect(() => {
        loadCurrentService();
        return () => {}
    }, [])
    const localController = React.useMemo(() => ({
        updateState: value => {
            dispatch({type: 'SET_STATE', value })
        },
        pushNewItem: value => {
            dispatch({type: 'ADD_BLANK_ITEM'})
        },
        removeByIndex: index => {
            
            dispatch({type: 'REMOVE_ITEM_BY_INDEX', value: index })
        },
        onChangeByIndex: (index, value) => {
            console.log(index, value);
            dispatch({ type: 'UPDATE_ITEM_BY_INDEX', value: {
                index,
                item: value
            } })
        }
    }), [])
    const loadCurrentService = () => {
        const sampleData = [];
        localController.updateState({listService: sampleData})
    }
    const _onPressSubmit = () => {
        console.log('_onPressSubmit data:', state.listService);
    }
    const _onPressAdd = () => {
        localController.pushNewItem();
    }
    
    const _onRefresh = () => {
        setisRefesh(true)
        
        setisRefesh(false)
    }
    const _renderItem = ({item, index}) => {
        
        // item:{name: '', price: ''}
        return <Service  initialState={item} 
            onDelete={()=> localController.removeByIndex(index)}
            onChangeValue={( value )=> localController.onChangeByIndex(index, value)}
        />
    }
    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{flex: 1}}
                contentContainerStyle={{paddingVertical: 15}}
                refreshControl={
                    <RefreshControl
                        onRefresh={_onRefresh}
                        refreshing={isRefesh}
                    />
                }    
            >
                <View style={styles.secWrap}>
                    <List
                        style={{paddingTop: 10}}
                        scrollEnabled={false}
                        extraData={state.listService}
                        data={state.listService}
                        renderItem={_renderItem}
                        keyExtractor={(item, index) => `${item.id}-${index}`} 
                    />
                    <Button appearance="outline" status="info" 
                        style={[styles.btn, { marginBottom: 5}]} 
                        onPress={_onPressAdd} accessoryLeft={(props)=> <Icon name="plus-outline" {...props}  />}
                    >
                        Thêm dịch vụ
                    </Button>
                </View>
                <Button style={[styles.btn, { marginHorizontal: 15}]} onPress={_onPressSubmit}>Cập nhật dịch vụ</Button>
            </KeyboardAwareScrollView>
            {/* <Text style={styles.subTitle}>Cấu hình hệ thống</Text> */}
            
        </View>
    );
};

export default SettingServiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.bgmain,
    },
    btnUpdate: {
        borderRadius: 6,
        justifyContent: "center",
        minHeight: 48,
        textTransform: "uppercase"

    },
    secWrap: {
        backgroundColor: '#fff',
        marginHorizontal: 15,
        marginBottom: 30,
        padding: 10,
        paddingVertical: 5,
        borderRadius: 6,
        minHeight: 50,
        ...shadowStyle
    },
    subTitle: {
        paddingHorizontal: 15,
        marginBottom: 10,
        fontSize: 16,
        color: '#3C3C43',
        textTransform: "uppercase",
        opacity: 0.6
    }
});
