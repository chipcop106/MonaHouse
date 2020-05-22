import { Platform } from "react-native";
import {NativeDateService} from '@ui-kitten/components';

const currentYear = (new Date()).getFullYear();

export const color = {
  primary: "#2BC7C7",
  second: "#25c4d9",
  darkColor: "#48466d",
  grayColor: "#E8E8E8",
  whiteColor: "#fff",
  blackColor: "#000",
  blueColor: "#3366FF",
  greenColor: "#00E096",
  redColor: "#FF3D71",
  transparent: "transparent",
  labelColor: "#707070",
  disabledTextColor: "rgba(131, 131, 131, 0.24)",
  gradients: {
    success: ["#00E096", "#00E096", "#00E096"],
    danger: ["#FF3D71", "#FF3D71", "#FF3D71"],
  },
};

export const sizes = {
  iconButtonSize: {
    width: 20,
    height: 20,
  },
};

export const settings = {
  oneSignalKey: "92eed1ed-9a7c-4b5f-a73f-2178b8e994c5",
  deviceOS: ["", "ios", "android"].indexOf(Platform.OS).toString(),
  key: "VnVOQG0zODlNb25hRGV2",
  formatDateService : new NativeDateService('en','DD/MM/YYYY'),
  minRangeDatePicker: new Date(`01/01/${currentYear - 5}`),
  maxRangeDatePicker: new Date(`01/01/${currentYear + 5}`),
};


