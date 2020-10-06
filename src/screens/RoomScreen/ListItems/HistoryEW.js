import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Icon, Text, Modal, Card } from '@ui-kitten/components';
import Swiper from 'react-native-swiper';
import moment from 'moment';

import { color } from '~/config';

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: 'rgba(0,0,0,.35)',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  datetime: {
    textAlign: 'center',
    paddingRight: 15,
    width: 80
  },
  date: {
    fontSize: 20,
    color: '#ccc',
    fontWeight: '700',
    textAlign: 'center',
  },
  year: {
    textAlign: 'center',
    fontWeight: '600',
    color: '#ccc',
  },
  metaIcon: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
  info: {
    justifyContent: 'space-between',
    flexGrow: 1,
    flexBasis: '60%'
  },
  metaWrap: {
    flexDirection: 'row',
    marginTop: 5,
  },
  meta: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 30,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    color: color.primary,
    fontWeight: 'bold',
  },
  textNumber: {
    letterSpacing: 1,
    color: color.darkColor,
    margin: 0,
    fontSize: 16,
  },
  action: {
    justifyContent: 'center',
    paddingLeft: 15,
    width: 45
  },
  slide: {
    width: '100%',
    height: '100%',
  },
  SwiperWrapper: {
    height: height / 3,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    padding: 10,
  },
  buttonText: {
    color: color.whiteColor,
    fontSize: 56,
    fontWeight: 'bold',
  },
  buttonWrap: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  imageBox: {
    ...StyleSheet.absoluteFill,
    zIndex: -1,
  },
});

const HistoryRW = ({
  style = {},
  renterInfo = false,
  title = 'Phòng 01',
  data,
}) => {
  const [visible, setVisible] = React.useState(false);
  const { Electrict, Water, NameRoom, Date, ElectricIMGThumbnail, WaterIMGThumbnail} = data;
  const hasImg = !!ElectricIMGThumbnail || !!WaterIMGThumbnail;
  return (
    <>
      <View style={style}>
        <View style={styles.wrapCard}>
          {!renterInfo && (
            <View style={styles.datetime}>
              <Text style={styles.date}> { moment(Date, 'YYYY-MM-DDTHH:mm:ss').format('DD/MM') } </Text>
              <Text style={styles.year}> { moment(Date, 'YYYY-MM-DDTHH:mm:ss').format('YYYY') } </Text>
            </View>
          )}

          <View style={styles.info}>
            <Text style={styles.name}>{NameRoom}</Text>
            <View style={styles.metaWrap}>
                <View style={styles.meta}>
                    <Icon
                      name="flash-outline"
                      fill={color.darkColor}
                      style={styles.metaIcon}
                    />
                    <Text style={styles.textNumber}>{Electrict}</Text>
                </View>
                <View style={styles.meta}>
                    <Icon
                      name="droplet-outline"
                      fill={color.darkColor}
                      style={styles.metaIcon}
                    />
                    <Text style={styles.textNumber}>{Water}</Text>
                </View>
            </View>
          </View>
          {hasImg && <TouchableOpacity
            onPress={() => setVisible(!visible)}
            style={styles.action}>
            <Icon
              name="image-outline"
              fill={color.darkColor}
              style={{
                width: 30,
                height: 30,
                textAlign: 'center',
                marginBottom: 3,
              }}
            />
            <Text
              style={{
                textAlign: 'center',
              }}>
              Ảnh
            </Text>
          </TouchableOpacity>}
        </View>
      </View>

      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(!visible)}
        style={styles.modal}>
        <Card disabled={true}>
          <Swiper
            containerStyle={styles.SwiperWrapper}
            showsButtons={true}
            loop={false}
            buttonWrapperStyle={styles.buttonWrap}
            activeDot={
              <View
                style={{
                  backgroundColor: color.whiteColor,
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  marginBottom: 3,
                }}
              />
            }
            nextButton={<Text style={styles.buttonText}>›</Text>}
            prevButton={<Text style={styles.buttonText}>‹</Text>}>
            <View style={styles.slide}>
              <View style={[styles.backdrop, { paddingVertical: 5 }]}>
                <Text
                  category="h5"
                  status="primary"
                  style={{ textAlign: 'center' }}>
                  Đồng hồ điện
                </Text>
              </View>
              <Image
                style={styles.imageBox}
                source={{
                  uri:
                  ElectricIMGThumbnail,
                }}
              />
            </View>
            <View style={styles.slide}>
              <View style={[styles.backdrop, { paddingVertical: 5 }]}>
                <Text
                  category="h5"
                  status="primary"
                  style={{ textAlign: 'center' }}>
                  Đồng hồ nước
                </Text>
              </View>
              <Image
                style={styles.imageBox}
                source={{
                  uri:
                  WaterIMGThumbnail,
                }}
              />
            </View>
          </Swiper>
        </Card>
      </Modal>
    </>
  );
};

export default HistoryRW;
