import instance, { getAccessToken } from './instanceAPI';
import { settings } from '../config';

const path = `/AccountApi`;


export const getPhoneHelp = async () => {
  let data = '';
  try {
    const res = await instance.get(path + '/getphonehelp');
    data = res.data

  } catch (error) {
    data = error.message
  }
  return data;

}

export const resetPassword = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(path + '/resetpassword', {
      params: {
        ...params,
        token
      }
    })
    return res.data;
  } catch (error) {
    return error.message;
  }

}
export const forgotPassword = async (params) => {
  try {
    let res = await instance.get(path + '/forgotpassword', {
      params: {
        ...params,
        key: settings.key
      }
    })
    return res.data;
  } catch (error) {
    return error.message;
  }

}

export const getVerifyCode = async (params) => {
  try {
    let res = await instance.get(path + '/getVerifyCode', {
      params: {
        key: settings.key,
        ...params
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }

}
export const verifyCode = async (params) => {
  try {
    let res = await instance.get(path + '/verifyCode', {
      params: {
        key: settings.key,
        ...params
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }

}


export const registerAccount = async (params) => {
  try {
    let res = await instance.get(path + '/registeraccount', {
      params: {
        key: settings.key,
        ...params
      }
    })
    return res.data;
  } catch (error) {
    console.log(error);
    return error;
  }

}



export const loginAccount = async (params) => {
  try {
    let res = await instance.get(path + '/login', {
      params: {
        ...params,
        key: settings.key,
        devicetype: 'mobile',
        deviceOS: settings.deviceOS,
        devicetoken: settings.userId || ''
      }
    })
    return res.data;
  } catch (error) {
    return error.message;
  }

}

export const updateAccount = async (params) => {
  try {
    const token = await getAccessToken();
    let res = await instance.get(path + '/updateaccount', {
      params: {
        ...params,
        token
      }
    })
    return res.data;
  } catch (error) {
    return error.message;
  }

}

export const getCity = async () => {
  let res = await instance.get(path + '/getcity', {
    params: {
      key: settings.key,

    }
  })
  return res.data;
}

