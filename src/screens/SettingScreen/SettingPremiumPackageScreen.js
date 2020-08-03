import React, { useReducer, useState, useEffect, 
    useContext, useLayoutEffect, useRef } from "react";
import { StyleSheet, ScrollView,
    Text, View, RefreshControl, Alert
} from "react-native";
import {useRoute, useNavigation} from '@react-navigation/native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Carousel from 'react-native-snap-carousel'
import { settings, color, sizes, shadowStyle } from "~/config";
import Loading from '~/components/common/Loading'

const SettingPremiumPackageScreen = () => {
    const [isRefesh, setrefesh] = useState(false);
    const [carouselItems, setcarouselItems] = useState([]);
    const [carouselIndex, setcarouselIndex] = useState('');
    const ref_carousel = useRef(null)
    const loadData = async () => {
        try {
            await new Promise(a=>setTimeout(() => a(), 1000))
            setcarouselItems([
                {
                    title:"Item 1",
                    text: "Text 1",
                },
                {
                    title:"Item 2",
                    text: "Text 2",
                },
                {
                    title:"Item 3",
                    text: "Text 3",
                },
                {
                    title:"Item 4",
                    text: "Text 4",
                },
                {
                    title:"Item 5",
                    text: "Text 5",
                },
              ])
        } catch (error) {
            
        }
    }
    const _onRefresh = async () => {
        setrefesh(true);
        await loadData();
        setrefesh(false);
    }

    const _renderItem = (item, index) => {
        return (
            <View style={{
                backgroundColor:'floralwhite',
                borderRadius: 5,
                height: 250,
                padding: 50,
                marginLeft: 25,
                marginRight: 25, }}>
              <Text style={{fontSize: 30}}>{item.title}</Text>
              <Text>{item.text}</Text>
            </View>
  
          )
    }
    return (<View style={styles.container}>
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
            <Carousel
                  layout={"default"}
                  ref={ref_carousel}
                  data={carouselItems}
                  sliderWidth={300}
                  itemWidth={300}
                  renderItem={_renderItem}
                  onSnapToItem = { index => setcarouselIndex({index}) } />
        </KeyboardAwareScrollView>
    </View>);
};

export default SettingPremiumPackageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.bgmain, 
    }
});
