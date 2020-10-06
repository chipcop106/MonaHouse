import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Carousel, {  } from 'react-native-snap-carousel';

import { color, shadowStyle } from '~/config';
import { Button } from '@ui-kitten/components';
import {
  itemWidth,
  sliderWidth,
} from '~/screens/SettingScreen/sliderEntryOption/slidePackage';

const Slider = (props) => {
  const { carouselItems, onPress } = props;
  const [carouselIndex, setCarouselIndex] = useState(0);
  const ref_carousel = useRef(null);

  const _renderItem = React.useMemo(
    () => ({ item, index }) => {
      const isActive = index === carouselIndex;
      const colorPattern = [color.primary, color.blueColor, color.greenColor];
      const typeColor = colorPattern[item?.type || 0];
	    const _onPress = () => {
	    	return onPress(index);
	    }
      return (
        <SliderItem
	        onPress={ _onPress }
	        isActive={isActive}
	        typeColor={typeColor}
	        item={item} />
      );
    },
    [carouselIndex]
  );

  return (
    <>
      <Carousel
        layout={'default'}
        ref={ref_carousel}
        data={carouselItems}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        inactiveSlideScale={0.9}
        inactiveSlideOpacity={0.7}
        // autoplayDelay={500}
        // autoplayInterval={3000}
        renderItem={_renderItem}
        onSnapToItem={(index) => setCarouselIndex(parseInt(index))}
        containerCustomStyle={{ flex: 1 }}
        slideStyle={{ flex: 1 }}
      />
    </>
  );
};

export default Slider;
const SliderItem = (props) => {
  const { isActive, typeColor, item } = props;
  item?.title ||  (item.title =  item?.packageName ?? '');
  item?.text ||  (item.text =  item?.packageShortDescription ?? '');
  return (
    <View style={[styles.ptbWrap, isActive && shadowStyle]}>
      <View style={[styles.ptbHeader, { backgroundColor: typeColor }]}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
            textTransform: 'uppercase',
          }}>
          {item.title}
        </Text>
      </View>
      <View style={styles.ptbBody}>
        {/*<View style={styles.ptbPriceBox}>*/}
        {/*  <Text style={[styles.ptbPrice_txt, { color: typeColor }]}>*/}
        {/*    4,500,000*/}
        {/*  </Text>*/}
        {/*  <Text style={{ textTransform: 'uppercase', color: '#7F7F7F' }}>*/}
        {/*    vnd / tháng*/}
        {/*  </Text>*/}
        {/*</View>*/}
        <View style={styles.ptbFeat}>
          <Text style={{fontSize: 16}}>{item.text}</Text>
        </View>
      </View>
      <View style={styles.ptbFooter}>
        <Button
          style={[styles.btnSendPackage, { backgroundColor: typeColor }]}
          onPress={props.onPress}>
          <Text style={{ textTransform: 'uppercase' }}>Liên hệ</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  ptbWrap: {
    borderRadius: 6,
    padding: 0,
    justifyContent: 'center',
    minHeight: 100,
    backgroundColor: '#fff',
    marginBottom: 25,
		marginTop: 15,
  },
  ptbFeat: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  ptbHeader: {
    minHeight: 40,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
  },
  ptbBody: {
    padding: 10,
  },
  ptbFooter: {
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    padding: 15,
	  paddingTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSendPackage: {
    width: '100%',
    minHeight: 48,
    padding: 10,
    borderRadius: 6,
    justifyContent: 'center',
    alignContent: 'center',
    ...shadowStyle,
  },
  ptbPriceBox: {
    justifyContent: 'center',
    paddingVertical: 15,
    minHeight: 80,
    alignItems: 'center',
    textAlign: 'center',
  },
  ptbPrice_txt: {
    fontSize: 30,
    fontWeight: 'normal',
  },
});
