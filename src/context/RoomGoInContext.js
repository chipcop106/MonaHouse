import { IndexPath } from '@ui-kitten/components';
import CreateDataContext from './CreateDataContext';
import { addRenterOnRoom } from '~/api/RenterAPI';
import { getRoomById } from '~/api/MotelAPI';
import { Alert } from 'react-native';
import { settings } from '~/config';
import { create_UUID } from '~/utils';
const initialState = {
	step: 0,
	isLoading: false,
	isLogout: false,
	dataForm: [
		{
			roomPrice: '',
			dateGoIn: new Date(),
			timeRent: '12',
			timeTypeIndex: new IndexPath(1),
			roomInfo: {
				electricNumber: '',
				electricPrice: '',
				electricPriceInclude: '',
				electricImage: null,
				waterNumber: '',
				waterPrice: '',
				waterPriceInclude: '',
				waterImage: null,
			},
			electricIndex: new IndexPath(0),
			services: [],
		},
		{
			fullName: '',
			phoneNumber: '',
			email: '',
			job: '',
			provinceIndex: new IndexPath(0),
			numberPeople: '1',
			relationshipIndex: new IndexPath(0),
			note: '',
			licenseImages: [],
			cityLists: [],
			relationLists: [],
		},
		{
			depositTypeIndex: new IndexPath(0),
			preDepositTimeIndex: new IndexPath(0),
			totalDeposit: '',
			prePaymentTimeIndex: new IndexPath(0),
			totalPrepay: '',
			actuallyReceived: '',
			paymentTypeIndex: new IndexPath(0),
			paymentNote: '',
			paymentType: [],
		},
	],
};
function updateItemByindex({ index, item, array }) {
	for (let i in array) {
		if (i == index) {
			array[i] = item;
			break;
		}
	}
	return array;
}

const goInReducer = (prevstate, action) => {
	switch (action.type) {
		case 'STEP_STATE_CHANGE': {
			const newFormState = prevstate.dataForm.map((item, index) => {
				if (index === prevstate.step) {
					const changeItem = item;
					changeItem[action.payload.field] = action.payload.value;
					return changeItem;
				}
				return item;
			});
			return {
				...prevstate,
				dataForm: newFormState,
			};
		}
		case 'SET_STATE_dataForm': {
			return {
				...prevstate,
				dataForm: updateItemByindex({
					index: prevstate.step,
					item: action.payload,
					array: prevstate.dataForm,
				}),
			};
		}
		case 'SET_STATE_dataMeta': {
			return {
				...prevstate,
				dataForm: updateItemByindex({
					index: 1,
					item: action.payload,
					array: prevstate.dataForm,
				}),
			};
		}
		case 'UPDATE_STEP': {
			const currentStep = prevstate.step;
			const stepChange = action.payload.stepValueChange;
			if (currentStep + stepChange > 2 || currentStep + stepChange < 0) {
				return prevstate;
			}
			return { ...prevstate, step: currentStep + stepChange };
		}

		case 'SERVICE_CHANGE': {
			const newFormState = prevstate.dataForm.map((item, index) => {
				if (index === prevstate.step) {
					const { services } = item;
					console.log(services, action.payload);
					return {
						...item,
						services: services.map((service) =>
							service.id === action.payload.id
								? { ...service, ...action.payload }
								: service
						),
					};
				}
				return item;
			});
			return {
				...prevstate,
				dataForm: newFormState,
			};
		}
		case 'SET_LOGOUT': {
			return {
				...prevstate,
				isLogout: action.payload,
			};
		}
		case 'RESET_STATE': {
			console.log(initialState);
			return initialState;
		}
		case 'SET_LOADING': {
			return {
				...prevstate,
				isLoading: action.payload,
			};
		}
		default: {
			return prevstate;
		}
	}
};

const errorHandle = (code, { signOut }) => {
	switch (code) {
		case 2:
			alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!');
			signOut && signOut();
			break;
		default:
			alert('Lỗi API !!');
			return;
	}
};

const changeStepForm = (dispatch) => (stepValueChange) => {
	dispatch({ type: 'UPDATE_STEP', payload: { stepValueChange } });
};

const changeStateFormStep = (dispatch) => (field, value) => {
	console.log(field, value);
	dispatch({ type: 'STEP_STATE_CHANGE', payload: { field, value } });
};

const onChangeService = (dispatch) => (value) => {
	dispatch({ type: 'SERVICE_CHANGE', payload: value });
};

const addPeopleToRoom = (dispatch) => async (params, actions) => {
	try {
		const res = await addRenterOnRoom(params);
		res.Code !== 1 && errorHandle(res.Code, actions);
		Alert.alert('Thông báo', 'Thêm thành công !', [
			{
				text: 'Ok',
				onPress: () => {},
			},
		]);
		actions.navigation.popToTop();
	} catch (error) {
		alert(JSON.stringify(error.message));
	}
};
const loadRoomInfo = (dispatch) => async (value) => {

	const roomid = value || '';
	dispatch({ type: 'SET_LOADING', payload: true });
	try {
		dispatch({
			type: 'SET_STATE_dataMeta',
			payload: {
				fullName: '',
				phoneNumber: '',
				email: '',
				job: '',
				provinceIndex: new IndexPath(0),
				numberPeople: '1',
				relationshipIndex: new IndexPath(0),
				note: '',
				licenseImages: [],
				cityLists: settings.cityLists,
				relationLists: settings.relationLists,
			},
		});


		const res = await getRoomById({ roomid });
		console.log(res);
		if (res.Code === 1) {
			const { room, addonsdefault, water, electric, renter, renterDeposit } = res.Data;
			const dateGoIn = (()=>{
				const hasRenter =  !!renter?.renter?.ID ?? false;
				if(hasRenter) return new Date(renter?.renter?.Dateout);
				return new Date();
			})();
			dispatch({
				type: 'SET_STATE_dataForm',
				payload: {
					roomPrice: `${room.PriceRoom}`,
					dateGoIn: dateGoIn,
					timeRent: '12',
					timeTypeIndex: new IndexPath(1),
					roomInfo: {
						electricNumber: `${electric.number || 0}`,
						electricPrice: `${room.PriceElectric || 0}`,
						electricPriceInclude: `${electric.PriceElectric || 0}`,
						electricImage: !!electric.image_thumbnails
							? `${electric.image_thumbnails}`
							: null,
						waterNumber: `${water.number || 0}`,
						waterPrice: `${room.PriceWater || 0}`,
						waterPriceInclude: `${room.PriceWater || 0}`,
						waterImage: !!water.image_thumbnails
							? `${water.image_thumbnails}`
							: null,
					},
					renter: renter?.renter ?? '',
					renterDeposit: renterDeposit?.renter ?? '',
					renterDepositImages: renterDeposit?.renterimage ?? [],
					electricIndex: new IndexPath(0),
					services: !!addonsdefault ? addonsdefault.map(sv => { return { ...sv, id: create_UUID() } }) : [], // [{"ID":1,"Name":"Wifi","Price":100000}]
				},
			});

		} else if (res.Code === 0) {
		} else if (res.Code === 2) {
			dispatch({ type: 'SET_LOGOUT', payload: true });
		}
	} catch (error) {
		console.log('loadRoomInfo error:', error.message);
	}
	dispatch({ type: 'SET_LOADING', payload: false });
};
const resetState = (dispatch) => (value) => {
	dispatch({ type: 'RESET_STATE' });
};

export const { Context, Provider } = CreateDataContext(
	goInReducer,
	{
		changeStepForm,
		changeStateFormStep,
		onChangeService,
		resetState,
		addPeopleToRoom,
		loadRoomInfo,
	},
	{
		step: 0,
		isLoading: false,
		isLogout: false,
		dataForm: [
			{
				roomPrice: '',
				dateGoIn: new Date(),
				timeRent: '12',
				timeTypeIndex: new IndexPath(1),
				roomInfo: {
					electricNumber: '',
					electricPrice: '',
					electricPriceInclude: '',
					electricImage: null,
					waterNumber: '',
					waterPrice: '',
					waterPriceInclude: '',
					waterImage: null,
				},
				electricIndex: new IndexPath(0),
				services: [],
			},
			{
				fullName: '',
				phoneNumber: '',
				email: '',
				job: '',
				provinceIndex: new IndexPath(0),
				numberPeople: '1',
				relationshipIndex: new IndexPath(0),
				note: '',
				licenseImages: null,
				cityLists: [],
				relationLists: [],
			},
			{
				depositTypeIndex: new IndexPath(0),
				preDepositTimeIndex: new IndexPath(0),
				totalDeposit: '',
				prePaymentTimeIndex: new IndexPath(0),
				totalPrepay: '',
				actuallyReceived: '',
				paymentTypeIndex: new IndexPath(0),
				paymentNote: '',
				paymentType: [],
				isCollect: true,
			},
		],
	}
);
