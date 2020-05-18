/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from '@ui-kitten/components';
import SignInScreen from './screens/AuthScreen/SignInScreen';
import SignUpScreen from './screens/AuthScreen/SignUpScreen';
import HomeScreen from './screens/MainScreen/HomeScreen';
import ReportDebtScreen from './screens/MainScreen/ReportDebtScreen';
import ReportElectrictScreen from './screens/MainScreen/ReportElectrictScreen';
import ReportFillRateScreen from './screens/MainScreen/ReportFillRateScreen';
import ReportRoomTypeScreen from './screens/MainScreen/ReportRoomTypeScreen';
import WelcomeScreen from './screens/AuthScreen/WelcomeScreen';
import RoomScreen from './screens/RoomScreen/RoomManagementScreen';
import { Context as AuthContext, Provider as AuthProvider } from './context/AuthContext';
import { color } from './config';
import ElectrictCollectScreen from './screens/RoomScreen/ElectrictCollectScreen';
import MoneyCollectScreen from './screens/RoomScreen/MoneyCollectScreen';
import RoomManagementScreen from './screens/RoomScreen/RoomManagementScreen';
import SettingScreen from './screens/MainScreen/SettingScreen';
import RoomGoOutScreen from './screens/RoomScreen/RoomGoOutScreen';
import RoomGoInScreen from './screens/RoomScreen/RoomGoInScreen';

export const isMountedRef = React.createRef();

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (isMountedRef.current && navigationRef.current) {
    // Perform navigation if the app has mounted
    navigationRef.current.navigate(name, params);
  } else {
    alert('App chưa mount');
    // You can decide what to do if the app hasn't mounted
    // You can ignore this, or add these actions to a queue you can call later
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: color.darkColor,
    shadowColor: 'transparent',
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


// Home stack
const HomeStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShow: true,
        headerStyle: styles.headerStyle,
        headerTitleStyle: {
          color: '#fff',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Dashboard',
        }}
      />
      <Stack.Screen
        name="ReportDebt"
        component={ReportDebtScreen}
        options={{
          title: 'Thống kê nợ',
        }}
      />
      <Stack.Screen
        name="ReportElectrict"
        component={ReportElectrictScreen}
        options={{
          title: 'Thống kê điện nước',
        }}
      />
      <Stack.Screen
        name="ReportFillRate"
        component={ReportFillRateScreen}
        options={{
          title: 'Tỉ lệ lấp đầy',
        }}
      />
      <Stack.Screen
        name="ReportRoomType"
        component={ReportRoomTypeScreen}
        options={{
          title: 'Thống kê loại phòng',
        }}
      />
    </Stack.Navigator>
  );
};

// Room stack
const RoomStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShow: true,
        headerStyle: styles.headerStyle,
        headerTitleStyle: {
          color: '#fff',
        },
        headerBackTitle: 'Back',
        headerBackTitleStyle: {
          color: color.primary
        },
        headerLeftContainerStyle: { paddingLeft: 10 },
        headerBackImage: () => <Icon name="arrow-back-outline" fill={color.primary} style={{...styles.tabIcon, marginRight: 5}} />,
      }}
    >
      <Stack.Screen
        name="RoomManagement"
        component={RoomManagementScreen}
        options={{
          title: 'Danh sách phòng',
        }}
      />

      <Stack.Screen
        name="ElectrictCollect"
        component={ElectrictCollectScreen}
        options={{
          title: 'Ghi điện | nước',
        }}
      />

      <Stack.Screen
        name="MoneyCollect"
        component={MoneyCollectScreen}
        options={{
          title: 'Thu tiền',
        }}
      />
      <Stack.Screen
        name="RoomGoIn"
        component={RoomGoInScreen}
        options={{
          title: 'Thông tin phòng, ki ốt',
        }}
      />
      <Stack.Screen
        name="RoomGoOut"
        component={RoomGoOutScreen}
        options={{
          title: 'Dọn ra',
        }}
      />
    </Stack.Navigator>
  );
};


const SettingStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShow: true,
        headerStyle: styles.headerStyle,
        headerTitleStyle: {
          color: '#fff',
        },
      }}
    >
      <Stack.Screen
        name="Setting"
        component={SettingScreen}
        options={{
          title: 'Cài đặt',
          headerTitleStyle: {
            color: '#fff',
            fontSize: 30,
          },
          headerTitleAlign: 'left',
        }}
      />
    </Stack.Navigator>
  );
};

const BottomNavigator = () => {
  const BottomTab = createMaterialBottomTabNavigator();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
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
          color: '#fff',
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
          tabBarLabel: 'Báo cáo',
          tabBarIcon: ({ color }) => (
            <Icon name="pie-chart-2" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="RoomManagement"
        component={RoomStack}
        options={{
          tabBarLabel: 'Phòng trọ',
          tabBarIcon: ({ color }) => (
            <Icon name="home" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="ElectrictCollect"
        component={ElectrictCollectScreen}
        options={{
          tabBarLabel: 'Ghi điện',
          tabBarIcon: ({ color }) => (
            <Icon name="flash" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="MoneyCollect"
        component={MoneyCollectScreen}
        options={{
          tabBarLabel: 'Thu tiền',
          tabBarIcon: ({ color }) => (
            <Icon name="credit-card" fill={color} style={styles.tabIcon} />
          ),
        }}
      />

      <BottomTab.Screen
        name="SettingStack"
        component={SettingStack}
        options={{
          tabBarLabel: 'Cài đặt',
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
  <Stack.Navigator>
    <Stack.Screen
      name="SignIn"
      component={SignInScreen}
      options={{
        title: 'Sign in',
        // When logging out, a pop animation feels intuitive
        // You can remove this if you want the default 'push' animation
      }}
    />
    <Stack.Screen
      name="SignUp"
      component={SignUpScreen}
      options={{
        title: 'Sign Up',
        // When logging out, a pop animation feels intuitive
        // You can remove this if you want the default 'push' animation
      }}
    />
  </Stack.Navigator>
);


const RootStack = () => {
  const { state } = useContext(AuthContext);
  return (
    <NavigationContainer
      ref={navigationRef}
    >
      <Stack.Navigator
        screenOptions={{ gestureEnabled: true }}
        headerMode="none"
      >
        {state.isLoading ? (
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{
              title: 'Welcome',
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
              title: 'AppScreen',
            }}
          />
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootStack;
