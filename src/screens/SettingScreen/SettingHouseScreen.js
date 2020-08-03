import React, { useReducer, useState, useEffect, useContext } from "react";
import { StyleSheet, 
    Text, View, RefreshControl

} from "react-native";
import {useRoute, useNavigation} from '@react-navigation/native';
import {List, ListItem, Divider} from '@ui-kitten/components'
import Loading from '~/components/common/Loading'
import { Context as AuthContext } from "~/context/AuthContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { settings, color, sizes, shadowStyle } from "~/config";
import {getMotels} from '~/api/MotelAPI'

const reducer = (prevState, { type, value }) =>{

    switch (type) {
        case 'SET_STATE':
            return {
                ...prevState,
                ...value
            }
        default:
            return prevState
    }
}
const initialState = {
    isRefesh: false,
    listHouse: []
}

const SettingHouseScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { signOut } = useContext(AuthContext);
    const { state: motelState, getListMotels} = useContext(MotelContext);
    // const [state, dispatch] = useReducer(reducer, initialState)
    const [isLoading, setloading] = useState(false);
    const [isRefesh, setrefesh] = useState(false);
    

    useEffect(() => {
        !!!motelState.listMotels && (async () => {
            setloading(true);
            await getListMotels(signOut);
            setloading(false);
        })();
    }, [])
    
    const _onRefresh = async () => {
        setrefesh(true);
        await getListMotels(signOut);
        setrefesh(false);
    }
    const onPressItem = data => navigation.navigate('SettingHouseDetail', { data })
    const _renderItem = ({item}) => <ListItem 
        onPress={()=>onPressItem(item)}
        style={styles.listitem}
        title={(TextProps) => <Text {...TextProps} style={[...TextProps.style, {fontSize: 18}]} >{item.MotelName}</Text>}
        description={(TextProps) => <Text {...TextProps} style={[...TextProps.style, {fontSize: 14}]}>{item.Description}</Text>}
    />;

    return <View style={styles.container}>
        {
            !!isLoading && <View style={{flex: 1, alignItems: "center", padding: 15,}}><Loading /></View>
        }
        {
            !!!isLoading && <List 
                contentContainerStyle={styles.listwrap}
                refreshControl={
                    <RefreshControl
                        onRefresh={_onRefresh}
                        refreshing={isRefesh}
                    />
                }
                ItemSeparatorComponent={Divider}
                data={motelState.listMotels}
                ListEmptyComponent={<Text style={styles.emtyTxt}>Không có dữ liệu nhà</Text>}
                keyExtractor={(item,index)=> `${item.ID}-${index}`}
                renderItem={_renderItem}
            />
        }
        
    </View>
};

export default SettingHouseScreen;

const styles = StyleSheet.create({
    listwrap: {
        paddingVertical: 15,
        
        ...shadowStyle,
        
    },
    listitem: {
        marginHorizontal: 15,
    },
    emtyTxt: {
        fontSize: 24,
        color: "gray",
        textAlign: "center",
        padding: 15,
    },
    container: {
        flex: 1,
        backgroundColor: color.bgmain,
        
    },
    
    
});
