import React, { useContext, useEffect, useState, useRef } from "react";
import { Text, StyleSheet, View, Image, FlatList } from "react-native";
import { Input, Select, SelectItem, Button, Icon, IndexPath } from '@ui-kitten/components'
import ImagePicker from "react-native-image-crop-picker";
import { sizes, color, settings } from '~/config';
import { Context as RoomGoInContext } from "../../context/RoomGoInContext";
import { TouchableOpacity } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
const RenterInfoForm = () => {
  const { state: RoomGoInState, changeStateFormStep } = useContext(
    RoomGoInContext
  );
  const stateRenterInfo = RoomGoInState.dataForm[RoomGoInState.step];
  const { cityLists, relationLists } = stateRenterInfo;
  const roomInfo = RoomGoInState.dataForm[0];
  const { renterDeposit } = roomInfo;

  // const loadData = () => {
  //   changeStateFormStep("cityLists", settings.cityLists);
  //   changeStateFormStep("relationLists", settings.relationLists);
  // };

  // const handleChoosePhoto = async (key) => {
  //     // const options = {
  //     //     cropping: true,
  //     //     cropperToolbarTitle: 'Chỉnh sửa ảnh',
  //     //     maxFiles: 10,
  //     //     compressImageMaxWidth: 1280,
  //     //     compressImageMaxHeight: 768,
  //     //     mediaType: 'photo',
  //     // };
  //     // ImagePicker.openPicker(options).then((images) => {
  //     //     dispatch({ field: key, value: images });
  //     // });
  //     const options = {
  //         multiple: true,
  //         maxFiles: 10,
  //         compressImageMaxWidth: 1280,
  //         compressImageMaxHeight: 768,
  //         mediaType: "photo",
  //     };
  //     try {
  //         const images = await ImagePicker.openPicker(options);
  //         if (!!images && Array.isArray(images)) {
  //             const res = await uploadRenterImage(images);
  //             changeStateFormStep(key, res.Data);
  //         }
  //     } catch (error) {
  //         //alert(JSON.stringify(error.message));
  //         changeStateFormStep(key, []);
  //     }
  // };

  // useEffect(() => {
  //   loadData();
  // }, []);
  const _onPressUseDepositInfo = () => {
    console.log('_onPressUseDepositInfo', renterDeposit);
    changeStateFormStep('fullName', renterDeposit.FullName);
    changeStateFormStep('phoneNumber', renterDeposit.Phone);
    changeStateFormStep('job', renterDeposit.Job);
    changeStateFormStep(
      'provinceIndex',
      new IndexPath(
        stateRenterInfo.cityLists.findIndex((item) => {
          return item.ID === renterDeposit.CityID;
        })
      )
    );
    changeStateFormStep('numberPeople', `${ renterDeposit.Quantity }`);
    changeStateFormStep(
      'relationshipIndex',
      new IndexPath(
        stateRenterInfo.relationLists.findIndex((item) => {
          return item.id === renterDeposit.RelationshipID;
        })
      )
    );
    changeStateFormStep('note', renterDeposit.Note)

  }

  const refRBSheet = useRef();
  let RBSheetKey = '';
  const handleIMG_RS = async images => {
    console.log(images);
    try {
      const res = await uploadRenterImage(images);
      if (res.Code === 1) {
        changeStateFormStep(RBSheetKey, res.Data);
      }
      return true
    } catch (error) {
      throw error
    }

  }

  const _onPressTakePhotos = async () => {
    refRBSheet.current.close();
    await new Promise(a => setTimeout(a, 250));
    try {
      const options = {
        cropping: true,
        forceJpg: true,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768
      };
      const images = await ImagePicker.openCamera(options);
      await handleIMG_RS(images);

    } catch (error) {
      console.log('ImagePicker.openPicker error', error.message);
      alert(error.message);
      changeStateFormStep(RBSheetKey, []);
    }
    RBSheetKey = '';
  }
  const _onPressGetPhotos = async () => {
    refRBSheet.current.close();
    await new Promise(a => setTimeout(a, 250));
    try {
      const options = {
        cropping: true,
        forceJpg: true,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
        multiple: true,
        maxFiles: 2,
        compressImageMaxWidth: 1280,
        compressImageMaxHeight: 768,
        mediaType: 'photo',
      };
      const images = await ImagePicker.openPicker(options);
      await handleIMG_RS(images);

    } catch (error) {
      console.log('ImagePicker.openPicker error', error.message);
      changeStateFormStep(RBSheetKey, []);
    }
    RBSheetKey = '';
  }
  const _onCloseRBSheet = () => {

  }
  const handleChoosePhoto = (key) => {
    RBSheetKey = key;
    refRBSheet.current?.open();
  };
  return (
    <>
      <View style={styles.mainWrap}>
        <Text style={styles.secTitle}>Thông tin người thuê</Text>
        <View style={styles.section}>
          <View style={styles.formWrap}>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Họ và tên"
                placeholder=""
                value={stateRenterInfo.fullName}
                onChangeText={(nextValue) =>
                  changeStateFormStep('fullName', nextValue)
                }
                textContentType="none"
                keyboardType="default"
              />
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Số điện thoại"
                placeholder="09xxxxxx"
                value={stateRenterInfo.phoneNumber}
                onChangeText={(nextValue) =>
                  changeStateFormStep('phoneNumber', nextValue)
                }
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            {/* <View style={[styles.formRow]}>
                <Input
                    textStyle={styles.textInput}
                    label="Địa chỉ email"
                    placeholder=""
                    value={stateRenterInfo.email}
                    onChangeText={(nextValue) =>
                        changeStateFormStep("email", nextValue)
                    }
                    textContentType="none"
                    keyboardType="email-address"
                />
            </View> */}
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Công việc hiện tại"
                placeholder="Văn phòng, sinh viên, phổ thông, khác"
                value={stateRenterInfo.job}
                onChangeText={(nextValue) =>
                  changeStateFormStep('job', nextValue)
                }
                textContentType="none"
                keyboardType="default"
              />
            </View>
            <View style={[styles.formRow]}>
              <Select
                label="Quê quán"
                value={
                  cityLists[stateRenterInfo?.provinceIndex?.row ?? 0]
                    ?.CityName ?? 'Chọn tỉnh thành'
                }
                selectedIndex={stateRenterInfo.provinceIndex}
                onSelect={(index) =>
                  changeStateFormStep('provinceIndex', index)
                }>
                {!!cityLists
                  ? cityLists.map((option) => (
                      <SelectItem key={option.ID} title={option.CityName} />
                    ))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Input
                textStyle={styles.textInput}
                label="Số người ở"
                placeholder="0"
                value={stateRenterInfo.numberPeople}
                onChangeText={(nextValue) =>
                  changeStateFormStep('numberPeople', nextValue)
                }
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Select
                label="Quan hệ"
                value={
                  relationLists[stateRenterInfo?.relationshipIndex?.row ?? 0]
                    ?.text ?? 'Chọn quan hệ'
                }
                selectedIndex={stateRenterInfo.relationshipIndex}
                onSelect={(index) =>
                  changeStateFormStep('relationshipIndex', index)
                }>
                {relationLists
                  ? relationLists.map((option) => (
                      <SelectItem key={option.id} title={option.text} />
                    ))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Ghi chú"
                placeholder=""
                value={stateRenterInfo.note}
                onChangeText={(nextValue) =>
                  changeStateFormStep('note', nextValue)
                }
                textContentType="none"
                keyboardType="default"
                multiline
              />
            </View>
            <View style={[styles.formRow]}>
              <View style={{ marginBottom: 20 }}>
                <Button
                  onPress={() => handleChoosePhoto('licenseImages')}
                  accessoryLeft={() => (
                    <Icon
                      name="camera-outline"
                      fill={color.whiteColor}
                      style={sizes.iconButtonSize}
                    />
                  )}>
                  Ảnh giấy tờ
                </Button>
              </View>

              {stateRenterInfo.licenseImages &&
                stateRenterInfo.licenseImages.length > 0 && (
                  <FlatList
                    data={stateRenterInfo.licenseImages}
                    keyExtractor={(item, index) => `${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.imageWrap}>
                        <Image
                          source={{
                            uri: item.UrlIMG,
                          }}
                          style={[styles.imagePreview]}
                        />
                        <View style={styles.deleteImage}>
                          <TouchableOpacity>
                            <Icon
                              name="minus"
                              style={{
                                width: 25,
                                height: 30,
                              }}
                              fill={color.redColor}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  />
                )}
            </View>
          </View>
        </View>
        {/* end renter info form  */}
        { !!renterDeposit?.ID && <Button
          style={{backgroundColor: 'transparent'}}
          status={'success'}
          appearance={'outline'}
          onPress={_onPressUseDepositInfo}
          accessoryLeft={() => (
            <Icon
              name="person-done-outline"
              fill={color.primary}
              style={sizes.iconButtonSize}
            />
          )}>
          Lấy thông tin đặt cọc
        </Button>
        }
      </View>
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
        <View>
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
};

const styles = StyleSheet.create({
  listButtonWrap: {
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: 15
  },
  listButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 15,
    backgroundColor: "#fff",
    minHeight: 50,
    justifyContent: "center",
    position: "relative",
    paddingHorizontal: 15
  },
  listButton_txt: {
    fontSize: 20,
    flex: 1,
    color: '#797B7F'
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
    justifyContent: "center",
    alignItems: "center"
  },
  btnClose: {
    flexDirection: "row",
    alignItems: "center",

  },
  mainWrap: {
    padding: 15,
  },
  section: {
    paddingTop: 15,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: color.whiteColor,
    borderRadius: 8,
  },
  secTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
  },
  formWrap: {
    paddingHorizontal: 10,
    marginHorizontal: -10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  formRow: {
    marginBottom: 15,
    width: "98%",
    marginHorizontal: "1%",
  },
  halfCol: {
    width: "48%",
  },
  imagePreview: {
    aspectRatio: 1,
    height: 100,
    marginTop: 0,
    marginBottom: 15,
    borderRadius: 4,
    marginHorizontal: 10,
    zIndex: 1,
  },
  imageWrap: {
    position: "relative",
    zIndex: 1,
  },
  deleteImage: {
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    backgroundColor: "rgba(255,255,255,.8)",
    top: 5,
    right: 15,
    zIndex: 100,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RenterInfoForm;
