import React, { useReducer, useState, useEffect, useContext } from "react";
import { StyleSheet, 
    Text, View, RefreshControl,
    TouchableOpacity
} from "react-native";
import {useRoute, useNavigation} from '@react-navigation/native';
import {List, ListItem, Divider, Icon} from '@ui-kitten/components'
import LinearGradient from 'react-native-linear-gradient';
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
    const _pressAddNewMotel= () => {

    }
    return <View style={styles.container}>
        {
            !!isLoading && <View style={{flex: 1, alignItems: "center", padding: 15,}}><Loading /></View>
        }
        {
            !!!isLoading && <><List 
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
                <TouchableOpacity
                    onPress={_pressAddNewMotel}
                    style={styles.addAction}
                >
                    <View style={styles.btnAdd}>
                        <Icon
                            name="plus"
                            fill={color.whiteColor}
                            style={styles.btnAddIcon}
                        />
                    </View>
                </TouchableOpacity>
            </>
        }
        
    </View>
};

export default SettingHouseScreen;

const styles = StyleSheet.create({
    btnAdd: {
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: color.success
    },
    btnAddIcon: {
        width: 30,
        height: 30,
    },
    addAction: {
        shadowColor: "#000",
        position: "absolute",
        right: 15,
        bottom: 15,
        shadowOffset: {
            width: 2,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4.27,
        elevation: 7,
        borderRadius: 60 / 2,
    },
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
        position: "relative"
    },
    
    
});
