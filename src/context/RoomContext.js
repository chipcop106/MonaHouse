import CreateDataContext from './CreateDataContext';
import {getRoom} from '../api/MotelAPI';
import AsyncStorage from '@react-native-community/async-storage';

const roomReducer = (prevstate, action) => {

  switch (action.type) {
    case 'GET_ROOM':
      return {
        ...prevstate,
        ...action.payload
      }
    default:
      return {...prevstate}
  }
};


const getListRooms = (dispatch) => async () =>{
  try {
    const res = await getMotels();
    //console.log(res);
    dispatch({ type: 'GET_ROOM',payload:res});
   
  } catch (error) {
    console.log(error.message);
  }
}


export const { Context, Provider } = CreateDataContext(
  roomReducer,
  {getListRooms},
  {listMotels:[]},
);
