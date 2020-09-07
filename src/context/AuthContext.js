import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CreateDataContext from './CreateDataContext';
import { loginAccount } from '../api/AccountAPI';

const authReducer = (state, action) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...state,
        userToken: action.payload.token,
        userInfo: action.payload.account,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...state,
        isLoading: false,
        errorMessage: '',
        ...action.payload,
      };
    case 'SIGN_UP':
      return {
        ...state,
        userToken: action.payload.token,
        userInfo: action.payload.account,
        errorMessage: '',
      };
    case 'SIGN_OUT':
      return {
        ...state,
        userToken: null,
        isLoading: false,
        errorMessage: '',
        userInfo: null,
      };
    case 'ADD_ERROR':
      return {
        ...state,
        errorMessage: action.payload,
      };
    case 'CLEAR_ERROR_MESSAGE':
      return {
        ...state,
        errorMessage: '',
      };
    case 'NEWPW': {
      return {
        ...state,
        ...action.payload,
      };
    }
    default:
      return {
        ...state,
        isSignout: true,
        userToken: null,
        userInfo: null,
      };
  }
};

const restoreToken = (dispatch) => async (token) => {
  dispatch({ type: 'RESTORE_TOKEN', payload: { token } });
};

const signInLocalToken = (dispatch) => async () => {
  let token;
  try {
    token = await AsyncStorage.getItem('userToken');
    dispatch({ type: 'RESTORE_TOKEN', payload: { token } });
  } catch (err) {
    console.log('signInLocalToken err', err);
    Alert.alert('Token da het han');
    dispatch({ type: 'SIGN_OUT' });
  }
};

const signIn = (dispatch) => async (username, password) => {
  try {
    const res = await loginAccount({ username, password });
    console.log('signIn Res:', res);

    if (res.Code == 0) {
      dispatch({
        type: 'ADD_ERROR',
        payload: 'Tài khoản hoặc mật khẩu không đúng!!',
      });
    } else {
      const { token, account } = res.Data;
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userInfo', JSON.stringify(account));
      dispatch({
        type: 'SIGN_IN',
        payload: { userToken: token, userInfo: account },
      });
    }
  } catch (error) {
    console.log('signIn error', error);
    dispatch({
      type: 'ADD_ERROR',
      payload: 'Xãy ra lỗi phía server, vui lòng liên hệ nhà cung cấp!!',
    });
  }
  // Thất bại send message error;
};

const signUp = (dispatch) => async (phone, name) => {
  dispatch({ type: 'SIGN_IN', payload: { token } });
};
const verificationSuccessAction = (dispatch) => async (data) => {
  try {
    console.log(data, JSON.stringify(data));
    const { TokenApp } = data;
    await AsyncStorage.setItem('userToken', TokenApp);
    await AsyncStorage.setItem('userInfo', JSON.stringify(data));
    dispatch({
      type: 'SIGN_IN',
      payload: { userToken: TokenApp, userInfo: data, isNewPW: true },
    });
  } catch (error) {
    console.log('verificationSuccessAction error', error);
  }
};

const signOut = (dispatch) => async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'userInfo']);
    dispatch({ type: 'SIGN_OUT' });
  } catch (error) {}
};
const setIsNewPW = (dispatch) => async (isnew) => {
  dispatch({ type: 'NEWPW', payload: { isNewPW: isnew } });
};
const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
};

export const { Context, Provider } = CreateDataContext(
  authReducer,
  {
    signIn,
    restoreToken,
    signOut,
    clearErrorMessage,
    signInLocalToken,
    verificationSuccessAction,
    setIsNewPW,
  },
  {
    isLoading: true,
    userToken: null,
    errorMessage: '',
    userInfo: null,
    isNewPW: false,
  }
);
