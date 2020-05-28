require("../node_modules/react-native-gesture-handler/jestSetup");
jest.mock("react-native/Libraries/Animated/src/NativeAnimatedHelper");
jest.mock("@react-native-community/async-storage", () => ({
    default: jest.fn(),
}));

jest.mock("@react-native-firebase/app", () => ({
    default: jest.fn(),
}));

jest.mock("@react-native-firebase/ml-vision", () => ({
    default: jest.fn(),
}));
