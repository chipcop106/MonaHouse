/* eslint-disable react-native/no-color-literals */
import React, {
    useState,
    createRef,
    useContext,
    useEffect,
    useMemo,
    useLayoutEffect
} from "react";
import { StyleSheet, View, Alert,
    TouchableOpacity, ActivityIndicator, RefreshControl
} from "react-native";
import { useNavigation, useRoute, useIsFocused} from "@react-navigation/native"
import { Icon, Input, List, IndexPath, Text } from "@ui-kitten/components";

import RoomCard from "~/components/RoomCard";
import { settings, color, sizes } from "~/config";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import LinearGradient from 'react-native-linear-gradient';

import AddFeeModal from "~/components/AddFeeModal";
import FilterHeader from "~/components/FilterHeader";
import { Context as RoomContext } from "~/context/RoomContext";
import { Context as MotelContext } from "~/context/MotelContext";
import { Context as AuthContext } from "~/context/AuthContext";
import Loading from "~/components/common/Loading";

const RoomManagementScreen = () => {
    const { signOut } = useContext(AuthContext);
    const { state: roomState, getListRooms, updateState } = useContext(RoomContext);
    const { state: motelState } = useContext(MotelContext);
    const { listRooms, filterStateDefault, isLoading } = roomState;
    const { listMotels } = motelState;
    const navigation = useNavigation();
    const route = useRoute();
    const isFocused = useIsFocused();
    //local screen state
    const [loading, setLoading] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    // useEffect(() => {
    //     console.log('aaaaaaaaaaaaaaa');
    //     console.log(navigation);
    //     console.log(route);
    //     // navigation.setOptions({
    //     //     headerRight: () => <TouchableOpacity
    //     //         style={{paddingHorizontal: 15, paddingVertical: 5, flexDirection: "row"}}
    //     //         onPress={_pressAddNewRoom}
    //     //     >
    //     //         <Icon
    //     //             name="plus-circle-outline"
    //     //             fill={color.primary}
    //     //             style={[sizes.iconButtonSize, { marginRight: 5 }]}
    //     //         /> 
    //     //         <Text style={[{color: color.primary, fontSize: 16}]}>Thêm</Text>
    //     //     </TouchableOpacity>
    //     // })
    // }, [])

    useEffect(() => {
        !!!listRooms && loadData();
    },[])
    const _pressAddNewRoom = ()=>{
    
        navigation.navigate('AddNewRoom', {
            onGoBack: () => {
                console.log("loadData(filterValue)")
                loadData(filterValue)
            }
        });
    }
    const loadData = async (filterList) => {
        console.log('filterList', filterList);
        !!!filterList ? updateState('isLoading', true) : setLoading(true);
        const {
            selectedMonthIndex,
            selectedMotelIndex,
            selectedYearIndex,
        } = filterList || {
            selectedMonthIndex: 0,
            selectedMotelIndex: 0,
            selectedYearIndex: 0,
            searchValue: ""
        };
        
        try {
            // console.log(listMotels);
            
            await getListRooms(
                {
                    motelid: listMotels[selectedMotelIndex - 1]?.ID ?? 0,
                    month: selectedMonthIndex + 1,
                    year: settings.yearLists[selectedYearIndex],
                },
                signOut
            );
        } catch (error) {
            console.log(error);
        }
        !!!filterList ? updateState('isLoading', false) : setLoading(false);
    };
    const _onValueChange = (filterFormvalue) => {
        setFilterValue(filterFormvalue);
        loadData(filterFormvalue);
    }
    
    const _onRefresh = () =>{
        loadData(filterValue);
    }

    const bsFee = createRef();

    const openAddFeeModal = () => {
        bsFee.current?.open();
    };
    return (
        <>
            <View style={styles.container}>
                
                <FilterHeader
                    onValueChange={_onValueChange}
                    initialState={filterStateDefault}
                    advanceFilter={true}
                    loading={loading}
                />
                {!!isLoading && <View
                    style={{
                        flexGrow: 1,
                        alignItems: "center",
                        paddingTop: 30,
                    }}
                >
                    <Loading />
                </View> }
                {!!!isLoading && <View style={styles.contentContainer}>
                    <List
                        refreshControl={
                            <RefreshControl
                              onRefresh={_onRefresh}
                              refreshing={loading}
                            />
                        }
                        
                        keyExtractor={(room, index) => `${room.RoomID}-${index}`}
                        style={styles.listContainer}
                        contentContainerStyle={styles.contentCard}
                        data={listRooms}
                        renderItem={(room) => (
                            <RoomCard
                                roomInfo={room}
                                addFee={openAddFeeModal}
                            />
                        )}
                    />
                    <Portal >
                        <Modalize
                            
                            ref={bsFee}
                            closeOnOverlayTap={false}
                            adjustToContentHeight={true}
                        >
                            <View style={styles.bottomSheetContent}>
                                <AddFeeModal />
                            </View>
                        </Modalize>
                    </Portal>
                </View>}
            </View>
            {!!!loading && <TouchableOpacity
                onPress={_pressAddNewRoom}
                style={styles.addAction}
            >
                <LinearGradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    useAngle={true}
                    angle={45}
                    angleCenter={{ x: 0.5, y: 0.25 }}
                    colors={color.gradients.success}
                    style={{
                        borderRadius: 50,
                    }}
                >
                    <View style={styles.btnAdd}>
                        <Icon
                            name="plus"
                            fill={color.whiteColor}
                            style={styles.btnAddIcon}
                        />
                    </View>
                </LinearGradient>
            </TouchableOpacity>}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    contentContainer: {
        flexGrow: 1,
        backgroundColor: color.bgmain,
    },

    contentCard: {
        paddingHorizontal: 8,
        paddingVertical: 4,
    },

    listContainer: {
        flex: 1,
    },

    bottomSheetContent: {
        paddingHorizontal: 15,
        paddingVertical: 30,
        paddingBottom: 60,
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
    btnAdd: {
        justifyContent: "center",
        alignItems: "center",
        width: 60,
        height: 60,
    },
    btnAddIcon: {
        width: 30,
        height: 30,
    }
});

export default RoomManagementScreen;
