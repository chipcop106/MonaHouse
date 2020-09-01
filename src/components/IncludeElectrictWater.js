import React, { useReducer, memo, useLayoutEffect, useRef } from 'react';
import { View, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Input, Button, Icon } from '@ui-kitten/components';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import { currencyFormat as cf } from '~/utils';
import { sizes, color } from '~/config';
import { uploadRenterImage } from '~/api/RenterAPI';

// const initialState = {
//   electrictNumber: '',
//   electrictPrice: '',
//   electrictPriceInclude: '',
//   electrictImage: null,
//   waterNumber: '',
//   waterPrice: '',
//   waterPriceInclude: '',
//   waterImage: null,
// };

IncludeElectrictWater.defaultProps = {
  index: 0,
  waterTitle: 'Số nước',
  electrictTitle: 'Số điện',
  priceDisplay: true,
};

const reducer = (state, { field, value }) => ({
  ...state,
  [field]: value,
});
const uploadIMG = async (file) => {
  let result = '';
  try {
    const res = await uploadRenterImage(file);
    res.Code === 1 && (result = res.Data);
    res.Code === 0 && (result = res.Code);
    res.Code === 2 && (result = res.Code);
  } catch (error) {
    console.log('uploadIMG fail at:', error);
    result = error;
  }
  return result;
};

function IncludeElectrictWater({
  index,
  waterTitle,
  electrictTitle,
  priceDisplay,
  handleValueChange,
  initialState,
  roomData,
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = (key, value) => {
    dispatch({ field: key, value });
  };
  useLayoutEffect(() => {
    if (!!roomData) {
      try {
        console.log('Electtric/Water roomData', roomData);
        // dispatch
        // waterPrice, electrictPrice
        dispatch({
          field: 'electrictPrice',
          value: `${roomData.PriceElectric}`,
        });
        dispatch({ field: 'waterPrice', value: `${roomData.PriceWater}` });
      } catch (error) {
        console.log('roomData error', error);
      }
    }
  }, []);
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    console.log('useLayoutEffect run...');
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    handleValueChange(state);
  }, [state]);
  const refRBSheet = useRef();
  let RBSheetKey = '';
  const _onPressTakePhotos = async () => {
    refRBSheet.current.close();
    await new Promise((a) => setTimeout(a, 250));
    try {
      const options = {
        cropping: true,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768,
        forceJpg: true,
      };
      const rsImg = await ImagePicker.openCamera(options);

      const res = await uploadIMG(rsImg);
      if (Array.isArray(res)) {
        !!RBSheetKey && dispatch({ field: RBSheetKey, value: res[0] });
      }

      RBSheetKey = '';
    } catch (error) {
      console.log('ImagePicker.openPicker error', error.message);
      alert(error.message);
      RBSheetKey = '';
    }
  };
  const _onPressGetPhotos = async () => {
    refRBSheet.current?.close();
    await new Promise((a) => setTimeout(a, 250));
    try {
      const options = {
        cropping: true,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
        maxFiles: 10,
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768,
        mediaType: 'photo',
        forceJpg: true,
      };
      const rsImg = await ImagePicker.openPicker(options);
      console.log({ field: RBSheetKey, value: res });

      const res = await uploadIMG(rsImg);
      if (Array.isArray(res)) {
        !!RBSheetKey && dispatch({ field: RBSheetKey, value: res[0] });
      }
      RBSheetKey = '';
    } catch (error) {
      console.log('ImagePicker.openPicker error', error.message);
      alert(error.message);
      RBSheetKey = '';
    }
  };
  const _onCloseRBSheet = () => {};
  const handleChoosePhoto = (key) => {
    RBSheetKey = key;
    refRBSheet.current.open();
  };

  return (
    <>
      {index === 0 && (
        <>
          <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label={electrictTitle}
              placeholder="0"
              value={String(state.electrictNumber)}
              onChangeText={(nextValue) =>
                onChange('electrictNumber', nextValue.replace(/[^0-9\-]/g, ''))
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label={waterTitle}
              placeholder="0"
              value={String(state.waterNumber)}
              onChangeText={(nextValue) => onChange('waterNumber', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          {!!priceDisplay && (
            <>
              <View style={[styles.formRow, styles.halfCol]}>
                <Input
                  textStyle={styles.textInput}
                  label="Giá điện / kW"
                  placeholder="0"
                  value={cf(String(state.electrictPrice))}
                  onChangeText={(nextValue) => {
                    onChange(
                      'electrictPrice',
                      nextValue.replace(/[^0-9\-]/g, '')
                    );
                    console.log(nextValue.replace(/[^0-9\-]/g, ''));
                  }}
                  textContentType="none"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.formRow, styles.halfCol]}>
                <Input
                  textStyle={styles.textInput}
                  label="Giá nước / m3"
                  placeholder="0"
                  value={cf(String(state.waterPrice))}
                  onChangeText={(nextValue) =>
                    onChange('waterPrice', nextValue.replace(/[^0-9\-]/g, ''))
                  }
                  textContentType="none"
                  keyboardType="numeric"
                />
              </View>
            </>
          )}

          <View style={[styles.formRow, styles.halfCol]}>
            {!!state.electrictImage && (
              <Image
                source={{
                  uri:
                    state.electrictImage.path ||
                    state.electrictImage.UrlIMG ||
                    state.electrictImage,
                }}
                style={[styles.imagePreview]}
              />
            )}
            <Button
              onPress={() => handleChoosePhoto('electrictImage')}
              accessoryLeft={() => (
                <Icon
                  name="camera-outline"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )}>
              Đồng hồ điện
            </Button>
          </View>
          <View style={[styles.formRow, styles.halfCol]}>
            {!!state.waterImage && (
              <Image
                source={{
                  uri:
                    state.waterImage.path ||
                    state.waterImage.UrlIMG ||
                    state.waterImage,
                }}
                style={[styles.imagePreview]}
              />
            )}
            <Button
              onPress={() => handleChoosePhoto('waterImage')}
              accessoryLeft={() => (
                <Icon
                  name="camera-outline"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )}>
              Đồng hồ nước
            </Button>
          </View>
        </>
      )}
      {index === 1 && (
        <>
          <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label="Tiền trọn gói điện"
              placeholder="0"
              value={String(state.electrictPriceInclude)}
              onChangeText={(nextValue) =>
                onChange(
                  'electrictPriceInclude',
                  nextValue.replace(/[^0-9\-]/g, '')
                )
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label="Tiền trọn gói nước"
              placeholder="0"
              value={String(state.waterPriceInclude)}
              onChangeText={(nextValue) =>
                onChange(
                  'waterPriceInclude',
                  nextValue.replace(/[^0-9\-]/g, '')
                )
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
        </>
      )}

      {index === 2 && (
        <>
          <View style={[styles.formRow]}>
            <Input
              textStyle={styles.textInput}
              label="Tiền trọn gói điện"
              placeholder="0"
              value={cf(String(state.electrictPriceInclude))}
              onChangeText={(nextValue) =>
                onChange(
                  'electrictPriceInclude',
                  nextValue.replace(/[^0-9\-]/g, '')
                )
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow]}>
            <Input
              textStyle={styles.textInput}
              label="Số nước lúc dọn vào"
              placeholder="0"
              value={String(state.waterNumber)}
              onChangeText={(nextValue) => onChange('waterNumber', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow]}>
            <Input
              textStyle={styles.textInput}
              label="Tiền nước theo m3"
              placeholder="0"
              value={cf(String(state.waterPrice))}
              onChangeText={(nextValue) =>
                onChange('waterPrice', nextValue.replace(/[^0-9\-]/g, ''))
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formRow]}>
            {!!state.waterImage && (
              <Image
                source={{
                  uri:
                    state.waterImage.path ||
                    state.waterImage.UrlIMG ||
                    state.waterImage,
                }}
                style={[styles.imagePreview]}
              />
            )}
            <Button
              onPress={() => handleChoosePhoto('waterImage')}
              accessoryLeft={() => (
                <Icon
                  name="camera-outline"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )}>
              Chụp ảnh đồng hồ nước
            </Button>
          </View>
        </>
      )}
      {index === 3 && (
        <>
          <View style={[styles.formRow]}>
            <Input
              textStyle={styles.textInput}
              label="Tiền trọn gói nước"
              placeholder="0"
              value={cf(String(state.waterPriceInclude))}
              onChangeText={(nextValue) =>
                onChange(
                  'waterPriceInclude',
                  nextValue.replace(/[^0-9\-]/g, '')
                )
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow]}>
            <Input
              textStyle={styles.textInput}
              label="Số điện lúc dọn vào"
              placeholder="0"
              value={String(state.electrictNumber)}
              onChangeText={(nextValue) =>
                onChange('electrictNumber', nextValue)
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formRow]}>
            <Input
              textStyle={styles.textInput}
              label="Tiền điện theo kw"
              placeholder="0"
              value={cf(String(state.electrictPrice))}
              onChangeText={(nextValue) =>
                onChange('electrictPrice', nextValue.replace(/[^0-9\-]/g, ''))
              }
              textContentType="none"
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.formRow]}>
            {state.electrictImage && (
              <Image
                source={{
                  uri:
                    state.electrictImage.path ||
                    state.electrictImage.UrlIMG ||
                    state.electrictImage,
                }}
                style={[styles.imagePreview]}
              />
            )}
            <Button
              onPress={() => handleChoosePhoto('electrictImage')}
              accessoryLeft={() => (
                <Icon
                  name="camera-outline"
                  fill={color.whiteColor}
                  style={sizes.iconButtonSize}
                />
              )}>
              Chụp ảnh đồng hồ điện
            </Button>
          </View>
        </>
      )}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onClose={_onCloseRBSheet}
        height={260}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.8)',
          },
          container: {
            backgroundColor: 'transparent',
            padding: 15,
          },
          draggableIcon: {
            backgroundColor: 'transparent',
          },
        }}>
        <View
          onLayout={({
            nativeEvent: {
              layout: { x, y, width, height },
            },
          }) => {
            // alert(height);
          }}>
          <View style={styles.listButtonWrap}>
            <TouchableOpacity
              style={styles.listButton}
              onPress={_onPressTakePhotos}>
              <Text style={[styles.listButton_txt]}>Chụp ảnh</Text>
              <View style={styles.listButton_icon}>
                <Icon
                  name="camera-outline"
                  fill={color.primary}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: '#e1e1e1' }} />
            <TouchableOpacity
              style={styles.listButton}
              onPress={_onPressGetPhotos}>
              <Text style={[styles.listButton_txt]}>Thư viện ảnh</Text>
              <View style={styles.listButton_icon}>
                <Icon
                  name="image-outline"
                  fill={color.primary}
                  style={{ width: 24, height: 24 }}
                />
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.listButton, styles.btnClose]}
            onPress={() => refRBSheet.current.close()}>
            <Text
              style={[
                styles.listButton_txt,
                { color: '#147AFC', textAlign: 'center' },
              ]}>
              Trở lại
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </>
  );
}

const styles = StyleSheet.create({
  listButtonWrap: {
    borderRadius: 15,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  listButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: '#fff',
    minHeight: 50,
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 15,
  },
  listButton_txt: {
    fontSize: 20,
    flex: 1,
    color: '#797B7F',
  },
  listButton_icon: {
    width: 30,
    height: 30,
    // position: "absolute",
    // borderRadius: 15,
    // borderWidth: 1,
    // left: 10,
    // top: 10,
    borderColor: color.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnClose: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  formWrap: {
    paddingHorizontal: 10,
    marginVertical: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  formRow: {
    marginBottom: 15,
    width: '98%',
    marginHorizontal: '1%',
  },
  halfCol: {
    width: '48%',
  },
  imagePreview: {
    aspectRatio: 16 / 9,
    maxHeight: 100,
    marginTop: 0,
    marginBottom: 15,
    width: '100%',
    borderRadius: 4,
  },
});

export default memo(IncludeElectrictWater);
