/* eslint-disable no-nested-ternary */
import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Icon } from "@ui-kitten/components";
import SignInScreen from "./screens/AuthScreen/SignInScreen";
import SignUpScreen from "./screens/AuthScreen/SignUpScreen";
import ForgotPass from "./screens/AuthScreen/ForgotPass";
import HomeScreen from "./screens/MainScreen/HomeScreen";
import ReportDebtScreen from "./screens/MainScreen/ReportDebtScreen";
import ReportElectrictScreen from "./screens/MainScreen/ReportElectrictScreen";
import ReportFillRateScreen from "./screens/MainScreen/ReportFillRateScreen";
import ReportRoomTypeScreen from "./screens/MainScreen/ReportRoomTypeScreen";
import WelcomeScreen from "./screens/AuthScreen/WelcomeScreen";
import { Context as AuthContext } from "./context/AuthContext";

import { color, sizes } from "./config";
import ElectrictCollectScreen from "./screens/RoomScreen/ElectrictCollectScreen";
import MoneyCollectScreen from "./screens/RoomScreen/MoneyCollectScreen";
import RoomManagementScreen from "./screens/RoomScreen/RoomManagementScreen";
import SettingScreen from "./screens/MainScreen/SettingScreen";
import RoomGoOutScreen from "./screens/RoomScreen/RoomGoOutScreen";
import RoomGoInScreen from "./screens/RoomScreen/RoomGoInScreen";
import RoomDetailScreen from "./screens/RoomScreen/RoomDetailScreen";
import RoomElectrictCollectAllScreen from "~/screens/RoomScreen/RoomElectrictCollectAllScreen";
import RoomMoneyCollectAllScreen from "~/screens/RoomScreen/RoomMoneyCollectAllScreen";
import RoomDetailMoneyHistoryScreen from "~/screens/RoomScreen/RoomDetailMoneyHistoryScreen";
import RoomDetailElectrictHistoryScreen from "~/screens/RoomScreen/RoomDetailElectrictHistoryScreen";
import RoomDetailRentHistoryScreen from "~/screens/RoomScreen/RoomDetailRentHistoryScreen";
import AddNewRoomScreen from "~/screens/RoomScreen/AddNewRoomScreen";
import EditRoomScreen from "~/screens/RoomScreen/EditRoomScreen";
import { Host } from "react-native-portalize";
import ElectrictHistoryScreen from "~/screens/RoomScreen/ElectrictHistoryScreen";
import MoneyHistoryScreen from "~/screens/RoomScreen/MoneyHistoryScreen";
import SettingUserDetailScreen from "~/screens/SettingScreen/SettingUserDetailScreen";
import SettingNotificationScreen from "~/screens/SettingScreen/SettingNotificationScreen";
import SettingPremiumPackageScreen from "~/screens/SettingScreen/SettingPremiumPackageScreen";
import SettingElectrictScreen from "~/screens/SettingScreen/SettingElectrictScreen";
import SettingSMSScreen from "~/screens/SettingScreen/SettingSMSScreen";
import SettingRoomScreen from "~/screens/SettingScreen/SettingRoomScreen";
import SettingServiceScreen from "~/screens/SettingScreen/SettingServiceScreen";
import SettingChangePasswordScreen from "~/screens/SettingScreen/SettingChangePasswordScreen";
import SettingHouseScreen from "~/screens/SettingScreen/SettingHouseScreen";
import SettingHouseDetailScreen from "~/screens/SettingScreen/SettingHouseDetailScreen";
import SettingFilledIndicatorScreen from "~/screens/SettingScreen/SettingFilledIndicatorScreen";
import SettingRoomTypeScreen from "~/screens/SettingScreen/SettingRoomTypeScreen";
import SettingCustomerRentingScreen from "~/screens/SettingScreen/SettingCustomerRentingScreen";
import SettingCustomerOldScreen from "~/screens/SettingScreen/SettingCustomerOldScreen";
import SettingCustomerDebtScreen from "~/screens/SettingScreen/SettingCustomerDebtScreen";
import SettingRevenueIncomeScreen from "~/screens/SettingScreen/SettingRevenueIncomeScreen";
import SettingRevenueNetScreen from "~/screens/SettingScreen/SettingRevenueNetScreen";
import SettingExpectedProfitScreen from "~/screens/SettingScreen/SettingExpectedProfitScreen";
import SettingCollateralDamageScreen from "~/screens/SettingScreen/SettingCollateralDamageScreen";
import { Provider as CustomerProvider } from "~/context/CustomerContext";
import RenterDetailScreen from "~/screens/RoomScreen/RenterDetailScreen";
export const isMountedRef = React.createRef();

export const navigationRef = React.createRef();
export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    alert("App chưa mount");
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: color.darkColor,
    shadowColor: "transparent",
    shadowRadius: 0,
    shadowOffset: {
      height: 0,
    },
  },
  tabIcon: {
    width: 25,
    height: 25,
  },
});

const headerOptions = {
  headerShow: true,
  headerStyle: styles.headerStyle,
  headerTitleStyle: {
    color: "#fff",
  },
  headerBackTitle: "Back",
  headerBackTitleStyle: {
    color: color.primary,
  },
  headerLeftContainerStyle: { paddingLeft: 10 },
  headerBackImage: () => (
    <Icon
      name="arrow-back-outline"
      fill={color.primary}
      style={{ ...styles.tabIcon, marginRight: 5 }}
    />
  ),
};
//
// const HeaderBack = ({ navigation, route, onPress }) => {
//   return (
//     <TouchableOpacity
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//         marginLeft: 10,
//       }}
//       onPress={onPress}
//     >
//       <Icon
//         name="arrow-back-outline"
//         fill={color.primary}
//         style={sizes.iconButtonSize}
//       />
//       <Text
//         style={{
//           color: color.primary,
//           marginLeft: 5,
//           fontSize: 16,
//         }}
//       >
//         Back
//       </Text>
//     </TouchableOpacity>
//   );
// };

// Home stack
const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShow: true,
        headerStyle: styles.headerStyle,
        headerTitleStyle: {
          color: "#fff",
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
        }}
      />
      <Stack.Screen
        name="ReportDebt"
        component={ReportDebtScreen}
        options={{
          title: "Thống kê nợ",
        }}
      />
      <Stack.Screen
        name="ReportElectrict"
        component={ReportElectrictScreen}
        options={{
          title: "Thống kê điện nước",
        }}
      />
      <Stack.Screen
        name="ReportFillRate"
        component={ReportFillRateScreen}
        options={{
          title: "Tỉ lệ lấp đầy",
        }}
      />
      <Stack.Screen
        name="ReportRoomType"
        component={ReportRoomTypeScreen}
        options={{
          title: "Thống kê loại phòng",
        }}
      />
    </Stack.Navigator>
  );
};

const RoomDetailStack = ({ navigation }) => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="RoomDetail"
        component={RoomDetailScreen}
        options={{
          headerShown: true,
          title: "Chi tiết phòng",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10,
              }}
              onPress={() => navigation.pop()}
            >
              <Icon
                name="arrow-back-outline"
                fill={color.primary}
                style={sizes.iconButtonSize}
              />
              <Text
                style={{
                  color: color.primary,
                  marginLeft: 5,
                  fontSize: 16,
                }}
              >
                Back
              </Text>
            </TouchableOpacity>
          ),
          inheritParams: ["roomId"],
        }}
      />

      <Stack.Screen
        name="EditRoom"
        component={EditRoomScreen}
        options={{
          headerShown: true,
          title: "Chỉnh sửa phòng",
        }}
      />
      <Stack.Screen
        name="DetailElectrictHistory"
        component={RoomDetailElectrictHistoryScreen}
        options={{
          headerShown: true,
          title: "Lịch sử ghi điện | nước",
        }}
      />

      <Stack.Screen
        name="DetailMoneyHistory"
        component={RoomDetailMoneyHistoryScreen}
        options={{
          headerShown: true,
          title: "Lịch sử thanh toán",
        }}
      />

      <Stack.Screen
        name="RentHistory"
        component={RoomDetailRentHistoryScreen}
        options={{
          headerShown: true,
          title: "Lịch sử thuê phòng",
        }}
      />

      <Stack.Screen
        name="RenterDetail"
        component={RenterDetailScreen}
        options={() => ({
          headerShown: true,
          title: "Thông tin người thuê",
        })}
      />
    </Stack.Navigator>
  );
};

// Room stack
const RoomStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="RoomManagement"
        component={RoomManagementScreen}
        options={{
          title: "Danh sách phòng",
        }}
      />

      <Stack.Screen
        name="ElectrictCollect"
        component={ElectrictCollectScreen}
        options={{
          title: "Ghi điện",
        }}
      />
      <Stack.Screen
        name="MoneyCollect"
        component={MoneyCollectScreen}
        options={{
          title: "Thu tiền",
        }}
      />

      <Stack.Screen
        name="RoomGoIn"
        component={RoomGoInScreen}
        options={{
          title: "Thông tin phòng, ki ốt",
        }}
      />
      <Stack.Screen
        name="RoomGoOut"
        component={RoomGoOutScreen}
        options={{
          title: "Dọn ra",
        }}
      />
      <Stack.Screen
        name="RoomDetailStack"
        component={RoomDetailStack}
        options={{
          headerShown: false,
          title: "Chi tiết phòng",
        }}
      />
      <Stack.Screen
        name="AddNewRoom"
        component={AddNewRoomScreen}
        options={{
          headerShown: true,
          title: "Thêm phòng mới",
        }}
      />
    </Stack.Navigator>
  );
};

//Stack customer inside setting
const SettingCustomerStack = ({ navigation }) => {
  const Stack = createStackNavigator();
  return (
    <CustomerProvider>
      <Stack.Navigator
        screenOptions={({ route }) => {
          return {
            ...headerOptions,
            headerShown: true,
            title: route.params?.title ?? "",
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginLeft: 10,
                }}
                onPress={() => navigation.pop()}
              >
                <Icon
                  name="arrow-back-outline"
                  fill={color.primary}
                  style={sizes.iconButtonSize}
                />
                <Text
                  style={{
                    color: color.primary,
                    marginLeft: 5,
                    fontSize: 16,
                  }}
                >
                  Back
                </Text>
              </TouchableOpacity>
            ),
          };
        }}
      >
        <Stack.Screen
          name="SettingCustomerRenting"
          component={SettingCustomerRentingScreen}
        />
        <Stack.Screen
          name="SettingCustomerOld"
          component={SettingCustomerOldScreen}
        />
        <Stack.Screen
          name="SettingCustomerDebt"
          component={SettingCustomerDebtScreen}
        />
        <Stack.Screen
          name="RoomDetailStack"
          component={RoomDetailStack}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </CustomerProvider>
  );
};

const SettingStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: "Cài đặt",
          // headerTitleStyle: {
          //     color: "#fff",
          //     fontSize: 30,
          // },
          // headerTitleAlign: "left",
        }}
      />
      <Stack.Screen
        name="ForgotPass"
        component={ForgotPass}
        options={{
          title: "ForgotPass",
        }}
      />
      <Stack.Screen
        name="SettingUserDetail"
        component={SettingUserDetailScreen}
        options={{
          title: "Tài khoản",
        }}
      />
      <Stack.Screen
        name="SettingPremiumPackage"
        component={SettingPremiumPackageScreen}
        options={{
          title: "Nâng cấp tài khoản",
        }}
      />
      <Stack.Screen
        name="SettingChangePassword"
        component={SettingChangePasswordScreen}
        options={{
          title: "Thay đổi mật khẩu",
        }}
      />
      <Stack.Screen
        name="SettingSMS"
        component={SettingSMSScreen}
        options={{
          title: "Cấu hình SMS",
        }}
      />
      <Stack.Screen
        name="SettingRoom"
        component={SettingRoomScreen}
        options={{
          title: "Cấu hình phòng",
        }}
      />
      <Stack.Screen
        name="SettingElectrict"
        component={SettingElectrictScreen}
        options={{
          title: "Cấu hình điện nước",
        }}
      />
      <Stack.Screen
        name="SettingService"
        component={SettingServiceScreen}
        options={{
          title: "Dịch vụ kèm theo",
        }}
      />
      <Stack.Screen
        name="SettingNotification"
        component={SettingNotificationScreen}
        options={{
          title: "Cấu hình thông báo",
        }}
      />
      <Stack.Screen
        name="SettingHouse"
        component={SettingHouseScreen}
        options={{
          title: "Danh Sách nhà",
        }}
      />
      <Stack.Screen
        name="SettingHouseDetail"
        component={SettingHouseDetailScreen}
        options={{
          title: "Chi tiết nhà",
        }}
      />

      <Stack.Screen
        name="SettingFilledIndicator"
        component={SettingFilledIndicatorScreen}
        options={{
          title: "Tỉ lệ lấp đầy",
        }}
      />

      <Stack.Screen
        name="SettingRoomType"
        component={SettingRoomTypeScreen}
        options={{
          title: "Thống kê loại phòng",
        }}
      />

      <Stack.Screen
        name="SettingCustomerStack"
        component={SettingCustomerStack}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="SettingRevenueIncome"
        component={SettingRevenueIncomeScreen}
        options={{
          title: "Doanh thu thực tế",
        }}
      />
      <Stack.Screen
        name="SettingRevenueNet"
        component={SettingRevenueNetScreen}
        options={{
          title: "Lợi nhuận thực tế",
        }}
      />
      <Stack.Screen
        name="SettingExpectedProfit"
        component={SettingExpectedProfitScreen}
        options={{
          title: "Lợi nhuận dự kiến",
        }}
      />
      <Stack.Screen
        name="SettingCollateralDamage"
        component={SettingCollateralDamageScreen}
        options={{
          title: "Tổn thất dự kiến",
        }}
      />
    </Stack.Navigator>
  );
};

const ElectrictCollectStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="ElectrictCollectAll"
        component={RoomElectrictCollectAllScreen}
        options={{
          title: "Ghi điện | nước",
        }}
      />

      <Stack.Screen
        name="ElectrictHistory"
        component={ElectrictHistoryScreen}
        options={{
          title: "Lịch sử ghi điện | nước",
        }}
      />
    </Stack.Navigator>
  );
};

const MoneyCollectStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={headerOptions}>
      <Stack.Screen
        name="MoneyCollectAll"
        component={RoomMoneyCollectAllScreen}
        options={{
          title: "Thu tiền",
        }}
      />
      <Stack.Screen
        name="MoneyCollectDetail"
        component={MoneyCollectScreen}
        options={{
          title: "Chi tiết tiền phòng",
        }}
      />
      <Stack.Screen
        name="MoneyHistory"
        component={MoneyHistoryScreen}
        options={{
          title: "Lịch sử thu tiền",
        }}
      />
    </Stack.Navigator>
  );
};

const BottomNavigator = () => {
  const BottomTab = createMaterialBottomTabNavigator();
  const { state: authState } = useContext(AuthContext);

  return (
    <BottomTab.Navigator
      initialRouteName={authState.isNewPW ? "SettingStack" : "Home"}
      activeColor={color.primary}
      inactiveColor={color.grayColor}
      backBehavior="history"
      shifting={false}
      tabBarBadge
      barStyle={{
        backgroundColor: color.darkColor,
        paddingVertical: 5,
      }}
      options={{
        headerShow: true,
        headerStyle: {
          backgroundColor: color.darkColor,
        },
        headerTitleStyle: {
          color: "#fff",
        },
        labelStyle: {
          marginTop: 10,
        },
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarLabel: "Báo cáo",
          tabBarIcon: ({ color }) => (
            <Icon name="pie-chart-2" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="RoomManagement"
        component={RoomStack}
        options={{
          tabBarLabel: "Phòng trọ",
          tabBarIcon: ({ color }) => (
            <Icon name="home" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="ElectrictCollectAllStack"
        component={ElectrictCollectStack}
        options={{
          tabBarLabel: "Ghi điện",
          tabBarIcon: ({ color }) => (
            <Icon name="flash" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="MoneyCollectAllStack"
        component={MoneyCollectStack}
        options={{
          tabBarLabel: "Thu tiền",
          tabBarIcon: ({ color }) => (
            <Icon name="credit-card" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          tabBarLabel: "Cài đặt",
          tabBarIcon: ({ color }) => (
            <Icon name="settings" fill={color} style={styles.tabIcon} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

const Stack = createStackNavigator();

const AuthenticationScreen = () => (
  <Stack.Navigator
    screenOptions={{
      headerShow: true,
      headerStyle: styles.headerStyle,
      headerTitleStyle: {
        color: "#fff",
      },
      headerTintColor: "#fff",
      headerBackTitle: "",
      headerBackTitleVisible: false,
      headerTitle: "",
    }}
  >
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        title: "Sign in",
        // When logging out, a pop animation feels intuitive
        // You can remove this if you want the default 'push' animation
      }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{
        title: "Sign Up",
        // When logging out, a pop animation feels intuitive
        // You can remove this if you want the default 'push' animation
      }}
    />
    <Stack.Screen
      name="ForgotPass"
      component={ForgotPass}
      options={{
        title: "ForgotPass",
        // When logging out, a pop animation feels intuitive
        // You can remove this if you want the default 'push' animation
      }}
    />
  </Stack.Navigator>
);

const RootStack = () => {
  const { state } = useContext(AuthContext);
  return (
    <NavigationContainer ref={navigationRef}>
      <Host>
        <Stack.Navigator
          screenOptions={{ gestureEnabled: true }}
          headerMode="none"
        >
          {state.isLoading ? (
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{
                title: "Welcome",
              }}
            />
          ) : state.userToken == null ? (
            <Stack.Screen
              name="Authentication"
              component={AuthenticationScreen}
            />
          ) : (
            <Stack.Screen
              name="BottomNavigator"
              component={BottomNavigator}
              options={{
                title: "AppScreen",
              }}
            />
          )}
        </Stack.Navigator>
      </Host>
    </NavigationContainer>
  );
};
export default RootStack;
