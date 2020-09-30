import React, {
  useReducer,
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  RefreshControl,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Input, Icon, Button } from '@ui-kitten/components';
import { settings, color, sizes, shadowStyle } from '~/config';
import Loading from '~/components/common/Loading';
import sliderStyle, {
  sliderWidth,
  itemWidth,
  colors as sliderColors,
} from './sliderEntryOption/slidePackage';

const DotElement = (props) => {
  const { active, index } = props;
  const currentColor = !!active
    ? sliderColors.activeColor
    : sliderColors.inActiveColor;
  const targetColor = !!!active
    ? sliderColors.inActiveColor
    : sliderColors.activeColor;

  const [animColor, setanimColor] = useState(new Animated.Value(0));

  useEffect(() => {
    (() => {
      Animated.timing(animColor, {
        toValue: active ? 1 : 0,
        duration: 500,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start();
    })();
  }, [active]);
  const animatedbgStyle = {
    opacity: animColor.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  return (
    <View style={[sliderStyle.paginationDot]}>
      <View style={[sliderStyle.paginationDotInner]}></View>
      <Animated.View style={[{}, animatedbgStyle]}>
        <View
          style={[sliderStyle.paginationDot, sliderStyle.paginationDotActive]}>
          <View
            style={[
              sliderStyle.paginationDotInner,
              sliderStyle.paginationDotInnerActive,
            ]}></View>
        </View>
      </Animated.View>
    </View>
  );
};

const SettingPremiumPackageScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setisLoading] = useState(false);
  const [isRefesh, setrefesh] = useState(false);
  const [carouselItems, setcarouselItems] = useState([]);
  const [carouselIndex, setcarouselIndex] = useState(0);
  const ref_carousel = useRef(null);
  const loadData = async () => {
    try {
      await new Promise((a) => setTimeout(() => a(), 1000));
      setcarouselItems([
        {
          title: 'Item 1',
          text: 'Text 1',
        },
        {
          title: 'Item 2',
          text: 'Text 2',
        },
        {
          title: 'Item 3',
          text: 'Text 3',
        },
        {
          title: 'Item 4',
          text: 'Text 4',
        },
        {
          title: 'Item 5',
          text: 'Text 5',
        },
      ]);
    } catch (error) {}
  };
  const _onRefresh = async () => {
    setrefesh(true);
    await loadData();
    setrefesh(false);
  };

  const _renderItem = React.useMemo(
    () => ({ item, index }) => {
      const isActive = index === carouselIndex;
      const colorPattern = [color.primary, color.blueColor, color.greenColor];
      const typeColor = colorPattern[item?.type || 0];
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
            <View style={styles.ptbPricebox}>
              <Text style={[styles.ptbPrice_txt, { color: typeColor }]}>
                4,500,000
              </Text>
              <Text style={{ textTransform: 'uppercase', color: '#7F7F7F' }}>
                vnd / tháng
              </Text>
            </View>
            <View style={styles.ptbFeat}>
              <Text>{item.text}</Text>
            </View>
          </View>
          <View style={styles.ptbFooter}>
            <Button
              style={[styles.btnSendPackage, { backgroundColor: typeColor }]}>
              <Text style={{ textTransform: 'uppercase' }}>chọn gói này</Text>
            </Button>
          </View>
        </View>
      );
    },
    [carouselIndex]
  );

  useEffect(() => {
    (async () => {
      setisLoading(true);
      try {
        await loadData();
      } catch (error) {
        console.log('Init screen error:', error);
      }
      setisLoading(false);
    })();
    return () => {};
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 30 }}
        refreshControl={
          <RefreshControl onRefresh={_onRefresh} refreshing={isRefesh} />
        }>
        {!!isLoading ? (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Loading />
          </View>
        ) : (
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
              onSnapToItem={(index) => setcarouselIndex(parseInt(index))}
              containerCustomStyle={{ flex: 1 }}
              slideStyle={{ flex: 1 }}
            />
            <Pagination
              dotsLength={carouselItems.length}
              activeDotIndex={carouselIndex}
              containerStyle={sliderStyle.paginationContainer}
              dotElement={
                <DotElement active={true} carouselRef={ref_carousel} />
              }
              inactiveDotElement={
                <DotElement active={false} carouselRef={ref_carousel} />
              }
            />
          </>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SettingPremiumPackageScreen;
const BOXRadius = 6;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.bgmain,
  },
  ptbWrap: {
    borderRadius: 6,
    padding: 0,
    justifyContent: 'center',
    minHeight: 100,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  ptbFeat: {
    borderStyle: 'solid',
    borderTopWidth: 1,
    borderColor: '#e1e1e1',
    paddingHorizontal: 15,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ptbHeader: {
    minHeight: 50,
    borderTopLeftRadius: BOXRadius,
    borderTopRightRadius: BOXRadius,
    padding: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.primary,
  },
  ptbBody: {
    padding: 10,
  },
  ptbFooter: {
    minHeight: 50,
    borderBottomLeftRadius: BOXRadius,
    borderBottomRightRadius: BOXRadius,
    padding: 10,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSendPackage: {
    width: '100%',
    minHeight: 48,
    padding: 10,
    borderRadius: BOXRadius,
    justifyContent: 'center',
    alignContent: 'center',
    ...shadowStyle,
  },
  ptbPricebox: {
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
