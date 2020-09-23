import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CreateDataContext from './CreateDataContext';
import { getMotels, getOptionsSortRoom, updateMotel } from '../api/MotelAPI';

const motelReducer = (prevstate, action) => {
	switch (action.type) {
		case 'GET_MOTEL':
			return {
				...prevstate,
				listMotels: action.payload,
				loading: false,
			};
		case 'SET_MOTEL':
			return {
				...prevstate,
				listMotels: [...prevstate.listMotels, ...action.payload],
				loading: false,
			}
		case 'GET_SORT_OPT':
			return {
				...prevstate,
				listSortOptions: action.payload,
				loading: false,
			};
		case 'SET_ERROR':
			return {
				...prevstate,
				...action.payload,
				loading: false,
			};
		case 'SET_LOADING': {
			return {
				...prevstate,
				loading: true,
			};
		}
		default:
			return { ...prevstate };
	}
};

const getListMotels = (dispatch) => async (callback) => {
	dispatch({ type: 'SET_LOADING' });
	try {
		const res = await getMotels();
		if (res.Code === 2) {
			Alert.alert(
				'Thông báo',
				'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!'
			);
			callback();
			return false;
		} else if (res.Code === 1 && !!res.Data) {
			dispatch({ type: 'GET_MOTEL', payload: res.Data });
			return true;
		} else {
			dispatch({ type: 'SET_ERROR', payload: res });
			return false;
		}
	} catch (error) {
		console.log(error.message);
		return false;
	}
};
const setListMotels = (dispatch) => async (data) => {
	try {
		dispatch({ type: 'SET_MOTEL', payload: data });
	} catch (e) {
		console.log('setListMotels error', e);
		return false;
	}
};
const getSortOptions = (dispatch) => async () => {
	dispatch({ type: 'SET_LOADING' });
	try {
		const res = await getOptionsSortRoom();

		if (!!!res?.Code) throw res;
		res?.Code === 1 && dispatch({ type: 'GET_SORT_OPT', payload: res.Data });
	} catch (error) {
		console.log('getSortOptions error: ', error);
	}
};

export const { Context, Provider } = CreateDataContext(
	motelReducer,
	{ getListMotels, getSortOptions, setListMotels },
	{
		listMotels: [],
		listSortOptions: [],
		error: {},
		loading: false,
	}
);
