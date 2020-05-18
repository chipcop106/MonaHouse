import React, { useContext, useEffect } from "react";
import {
  Text, StyleSheet, View, Image, FlatList,
} from "react-native";
import {
  Input, Select, SelectItem, Button, Icon,
} from "@ui-kitten/components";
import ImagePicker from "react-native-image-crop-picker";
import { sizes, color } from "../../config";
import { Context as RoomGoInContext } from "../../context/RoomGoInContext";
import { getCity } from "../../api/AccountAPI";


const relationLists = ["Bạn bè", "Gia đình", "Ở ghép", "Khác"];

const RenterInfoForm = () => {
  const {
    state: RoomGoInState, changeStateFormStep,
  } = useContext(RoomGoInContext);
  const stateRenterInfo = RoomGoInState.dataForm[RoomGoInState.step];
  const { cityLists } = stateRenterInfo;

  const loadData = async () => {
    const resProvinces = await getCity();
    if (resProvinces.Code === 1) {
      changeStateFormStep("cityLists", resProvinces.Data);
    }
  };

  const handleChoosePhoto = async (key) => {
    const options = {
      multiple: true,
      maxFiles: 10,
      compressImageMaxWidth: 1280,
      compressImageMaxHeight: 768,
      mediaType: "photo",
    };
    try {
      const images = await ImagePicker.openPicker(options);
      changeStateFormStep(key, images);
    } catch (error) {
      changeStateFormStep(key, []);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


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
                value={stateRenterInfo.username}
                onChangeText={(nextValue) => changeStateFormStep("username", nextValue)}
                textContentType="none"
                keyboardType="default"
              />
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Số điện thoại"
                placeholder="0"
                value={stateRenterInfo.phoneNumber}
                onChangeText={(nextValue) => changeStateFormStep("phoneNumber", nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Địa chỉ email"
                placeholder=""
                value={stateRenterInfo.email}
                onChangeText={(nextValue) => changeStateFormStep("email", nextValue)}
                textContentType="none"
                keyboardType="email-address"
              />
            </View>
            <View style={[styles.formRow]}>
              <Select
                label="Quê quán"
                value={cityLists[stateRenterInfo.provinceIndex.row]?.CityName ?? "Chọn tỉnh thành"}
                selectedIndex={stateRenterInfo.provinceIndex}
                onSelect={(index) => changeStateFormStep("provinceIndex", index)}
              >
                {cityLists ? (cityLists.map((option) => <SelectItem key={option.ID} title={option.CityName} />))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Input
                textStyle={styles.textInput}
                label="Số người ở"
                placeholder="0"
                value={stateRenterInfo.numberPeople}
                onChangeText={(nextValue) => changeStateFormStep("numberPeople", nextValue)}
                textContentType="none"
                keyboardType="numeric"
              />
            </View>
            <View style={[styles.formRow, styles.halfCol]}>
              <Select
                label="Quan hệ"
                value={relationLists[stateRenterInfo.relationshipIndex.row] ?? "Chọn quan hệ"}
                selectedIndex={stateRenterInfo.relationshipIndex}
                onSelect={(index) => changeStateFormStep("relationshipIndex", index)}
              >
                {relationLists ? (relationLists.map((option) => <SelectItem key={option} title={option} />))
                  : null}
              </Select>
            </View>
            <View style={[styles.formRow]}>
              <Input
                textStyle={styles.textInput}
                label="Ghi chú"
                placeholder=""
                value={stateRenterInfo.note}
                onChangeText={(nextValue) => changeStateFormStep("note", nextValue)}
                textContentType="none"
                keyboardType="default"
                multiline
              />
            </View>
            <View style={[styles.formRow]}>
              <View style={{ marginBottom: 20 }}>
                <Button
                  onPress={() => handleChoosePhoto("licenseImages")}
                  accessoryLeft={() => <Icon name="camera-outline" fill={color.whiteColor} style={sizes.iconButtonSize} />}
                >
                  Ảnh giấy tờ
                </Button>

              </View>

              {stateRenterInfo.licenseImages && stateRenterInfo.licenseImages.length > 0 && (

              <FlatList
                data={stateRenterInfo.licenseImages}
                keyExtractor={(item, index) => `${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <Image
                    source={{ uri: item.path }}
                    style={[styles.imagePreview]}
                  />
                )}
              />
              )}

            </View>
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  mainWrap: {
    padding: 15,
  },
  section: {
    paddingTop: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
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
    marginRight: 10,
  },
});

export default RenterInfoForm;
