import CreateDataContext from './CreateDataContext';
import {getMotels} from '../api/MotelAPI';
import AsyncStorage from '@react-native-community/async-storage';

const motelReducer = (prevstate, action) => {

  switch (action.type) {
    case 'GET_MOTEL':
      return {
        ...prevstate,
        listMotels:action.payload
      }
    case 'SET_ERROR':
      return {
        ...prevstate,
      }
    default:
      return {...prevstate}
  }
};


const getListMotels = (dispatch) => async () =>{
  try {
    const res = await getMotels();
    if(res.Data){
      dispatch({ type: 'GET_MOTEL',payload:res.Data});
    }else{
      dispatch({ type: 'SET_ERROR',payload:res});
    }
  } catch (error) {
    console.log(error.message);
  }
}


export const { Context, Provider } = CreateDataContext(
  motelReducer,
  {getListMotels},
  {listMotels:[],error:{code:'',message:''}},
);
