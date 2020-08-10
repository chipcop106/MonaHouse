import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, View, ScrollView, 
    RefreshControl } from "react-native";
import { Text, IndexPath, List } from "@ui-kitten/components";
import HistoryRecord from "./ListItems/HistoryMoney";
import FilterHeader from "~/components/FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import Loading from '~/components/common/Loading'
import {create_UUID} from '~/utils';
import { getPaymentHistory } from '~/api/CollectMoneyAPI'
const MoneyHistoryScreen = () => {
    const { state: roomState, getElectrictHistory, updateState } = useContext(RoomContext);
    const { state: motelState } = useContext(MotelContext);
    const { signOut } = useContext(AuthContext);
    const { filterStateDefault,  listElectrictRooms} = roomState;
    const [listData, setlistData] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const [isRefesh, setisRefesh] = useState(false);
    
    useEffect(() => {
        ( async () => {
            setisLoading(true);
            try {
                await loadData();
            } catch (error) {
                console.log('load init error:', error)
            }
            setisLoading(false);
        } )();
        return () => {
            
        }
    }, [])
    const loadData = async () => {
        try {
           
            setlistData(['a', ...listData])
        } catch (error) {
            
        }
    }
    const onFilterChange = (filter) => {
        console.log(filter);
        const { selectedMonthIndex, selectedMotelIndex } = filter;
        try {
            //console.log(listMotels);
            const motelid =  motelState.listMotels[selectedMotelIndex - 1]?.ID ??
            0, month = selectedMonthIndex + 1;
            getElectrictHistory(
                {
                    motelid,
                    month
                },
                signOut
            );
        } catch (error) {
            console.log(error);
        }
    };
    const _onRefresh = async () => {
        setisRefesh(true);
        try {
            await loadData();
        } catch (error) {
            console.log('_onRefresh error:', error)
        }
        setisRefesh(false);
    }
    const _renderItem = () => {

        return (
            <HistoryRecord style={styles.card} />
        )
    }
    return (
        <>
            <FilterHeader
                onValueChange={onFilterChange}
                initialState={filterStateDefault}
                advanceFilter={false}
            />
            { !!isLoading && <View style={{padding: 15, alignItems: "center"}}><Loading /></View>}
            { !!!isLoading &&  <List
                
                contentContainerStyle={[{paddingHorizontal: 15, paddingVertical: 10}]}
                style={styles.listContainer}
                data={listData}
                keyExtractor={(item) => `${create_UUID()}-${item.id}`}
                renderItem={_renderItem}
                refreshControl={
                    <RefreshControl
                        onRefresh={_onRefresh}
                        refreshing={isRefesh}
                    />
                }
                ListEmptyComponent={<Text style={{textAlign: "center", fontSize: 18, color: "grey"}}>Bạn chưa có lần thu tiền nào</Text>}
            />}
            
        </>
    );
};

export default MoneyHistoryScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
    card: {
        marginVertical: 7,
    },
    contentCard: {
        
    },

    listContainer: {
        flex: 1
    },
});
