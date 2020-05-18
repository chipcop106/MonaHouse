import AsyncStorage from '@react-native-community/async-storage';
import CreateDataContext from './CreateDataContext';
import { loginAccount } from '../api/AccountAPI';

const authReducer = (state, action) => {
    switch (action.type) {
    case 'RESTORE_TOKEN':
        return {
            ...state,
            userToken: action.payload.token,
            isLoading: false,
        };
    case 'SIGN_IN':
        return {
            ...state,
            userToken: action.payload.token,
            isSignout: false,
            errorMessage: '',
        };
    case 'SIGN_UP':
        return {
            ...state,
            userToken: action.payload.token,
            errorMessage: '',
        };
    case 'SIGN_OUT':

        return {
            ...state,
            userToken: null,
            isSignout: true,
            errorMessage: '',
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
    default:
        return {
            ...state,
            isSignout: true,
            userToken: null,
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
        alert('Token không tồn tại');
    }
};

const signIn = (dispatch) => async (username, password) => {
    try {
        const res = await loginAccount({ username, password });
        const { token } = res.Data;
        await AsyncStorage.setItem('userToken', token);
        dispatch({ type: 'SIGN_IN', payload: { token } });
    } catch (error) {
        dispatch({ type: 'ADD_ERROR', payload: 'Tài khoản hoặc mật khẩu không đúng !!' });
    }
    // Thất bại send message error;
};

const signUp = (dispatch) => async (phone, name) => {
    dispatch({ type: 'SIGN_IN', payload: { token } });
};


const signOut = (dispatch) => async () => {
    await AsyncStorage.setItem('userToken', '');
    dispatch({ type: 'SIGN_OUT' });
};

const clearErrorMessage = (dispatch) => () => {
    dispatch({ type: 'CLEAR_ERROR_MESSAGE' });
};


export const { Context, Provider } = CreateDataContext(
    authReducer,
    {
        signIn, restoreToken, signOut, clearErrorMessage, signInLocalToken,
    },
    {
        isLoading: true,
        isSignout: false,
        userToken: null,
        errorMessage: '',
    },
);
