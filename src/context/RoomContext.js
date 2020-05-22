import CreateDataContext from '~/context/CreateDataContext';
import { getRoomsByMotelId } from '../api/MotelAPI';

const currentTime = new Date();
const currentMonth = currentTime.getMonth() + 1;
const currentYear = currentTime.getFullYear();

const roomReducer = (prevstate, action) => {

  switch (action.type) {
    case 'GET_ROOM':
      return {
        ...prevstate,
        listRooms: action.payload
      }
    default:
      return prevstate
  }
};


const getListRooms = (dispatch) => async ({ motelid = 0,
  month = currentMonth,
  year = currentYear,
  qsearch = "",
  sortby = 0,
  status = 0}, callback) => {
  try {
    const res = await getRoomsByMotelId({ motelid, month, year, qsearch, sortby, status });
    if(res.Code === 2 ) {
      alert('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại !!')
      callback();
    }
    dispatch({ type: 'GET_ROOM', payload: res.Data });
  } catch (error) {
    alert(JSON.stringify(error));
  }
}


export const { Context, Provider } = CreateDataContext(
  roomReducer,
  {
    getListRooms
  },
  { listRooms: [] },
);