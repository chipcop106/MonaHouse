import React, { useReducer, useEffect, memo } from 'react';
import {
  View, Image, StyleSheet, Text,
} from 'react-native';
import {
  Input, Button, Icon,
} from '@ui-kitten/components';
import ImagePicker from 'react-native-image-crop-picker';
import { sizes, color } from '~/config';

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
  waterTitle: "Số nước",
  electrictTitle: "Số điện",
  priceDisplay: true
}

const reducer = (state, { field, value }) => ({
  ...state,
  [field]: value,
});

function IncludeElectrictWater({ index, waterTitle, electrictTitle, priceDisplay, handleValueChange, initialState }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const onChange = (key, value) => {
    dispatch({ field: key, value });
  };

  useEffect(() => {
    handleValueChange(state);
  }, [state]);

  const handleChoosePhoto = async (key) => {
    try {
      const options = {
        cropping: true,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
        maxFiles: 10,
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768,
        mediaType: 'photo',
      };
      ImagePicker.openPicker(options).then((images) => {
        dispatch({ field: key, value:images });
      });
    } catch (error) {
      
    }
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
              value={state.electrictNumber}
              onChangeText={(nextValue) => onChange('electrictNumber', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label={waterTitle}
              placeholder="0"
              value={state.waterNumber}
              onChangeText={(nextValue) => onChange('waterNumber', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          {priceDisplay && (
            <>
     <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label="Giá điện / kW"
              placeholder="0"
              value={state.electrictPrice}
              onChangeText={(nextValue) => onChange('electrictPrice', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label="Giá nước / m3"
              placeholder="0"
              value={state.waterPrice}
              onChangeText={(nextValue) => onChange('waterPrice', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          </>
          )}
     
          <View style={[styles.formRow, styles.halfCol]}>
            {state.electrictImage && (
            <Image
              source={{ uri: state.electrictImage.path }}
              style={[styles.imagePreview]}
            />
            )}
            <Button
              onPress={() => handleChoosePhoto('electrictImage')}
              accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
            >
              Đồng hồ điện
            </Button>
          </View>
          <View style={[styles.formRow, styles.halfCol]}>
            {state.waterImage && (
            <Image
              source={{ uri: state.waterImage.path }}
              style={[styles.imagePreview]}
            />
            )}
            <Button
              onPress={() => handleChoosePhoto('waterImage')}
              accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
            >
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
              value={state.electrictPriceInclude}
              onChangeText={(nextValue) => onChange('electrictPriceInclude', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.formRow, styles.halfCol]}>
            <Input
              textStyle={styles.textInput}
              label="Tiền trọn gói nước"
              placeholder="0"
              value={state.waterPriceInclude}
              onChangeText={(nextValue) => onChange('waterPriceInclude', nextValue)}
              textContentType="none"
              keyboardType="numeric"
            />
          </View>
        </>
      )}

      {
        index === 2 && (
          <>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Tiền trọn gói điện"
                placeholder="0"
                value={state.electrictPriceInclude}
                onChangeText={(nextValue) => onChange('electrictPriceInclude', nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Số nước"
                placeholder="0"
                value={state.waterNumber}
                onChangeText={(nextValue) => onChange('waterNumber', nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Giá nước / m3"
                placeholder="0"
                value={state.waterPrice}
                onChangeText={(nextValue) => onChange('waterPrice', nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formRow]}>
              {state.waterImage && (
              <Image
                source={{ uri: state.waterImage.path }}
                style={[styles.imagePreview]}
              />
              )}
              <Button
                onPress={() => handleChoosePhoto('waterImage')}
                accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
              >
                Đồng hồ nước
              </Button>
            </View>
          </>
        )
      }
      {
        index === 3 && (
          <>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Tiền trọn gói nước"
                placeholder="0"
                value={state.waterPriceInclude}
                onChangeText={(nextValue) => onChange('waterPriceInclude', nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Số điện"
                placeholder="0"
                value={state.electrictNumber}
                onChangeText={(nextValue) => onChange('electrictNumber', nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Giá điện / kW"
                placeholder="0"
                value={state.electrictPrice}
                onChangeText={(nextValue) => onChange('electrictPrice', nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formRow]}>
              {state.electrictImage && (
              <Image
                source={{ uri: state.electrictImage.path }}
                style={[styles.imagePreview]}
              />
              )}
              <Button
                onPress={() => handleChoosePhoto('electrictImage')}
                accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
              >
                Đồng hồ điện
              </Button>
            </View>

          </>
        )
      }
    </>
  );
}

const styles = StyleSheet.create({
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