import instance, { getAccessToken } from "./instanceAPI";

const path = `/CollectMoneyApi`;

/*Lấy list phương thức thanh toán*/

export const getPaymentMethod = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/getpaymentmethod`);
        result = res.data;
    } catch (error) {
        result = error;
    }
    return result;
};

/*Thu tiền khách
string token, 
int roomid, 
int renterid, 
int month, 
int year, 
int paid, 
int payment, 

*/

export const collectMoney = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/collectmoney`, {
            params: {
                ...params,
                token,
            },
        });
        result = res.data;
    } catch (error) {
        result = error;
    }
    return result;
};

/*Lấy lịch sử thanh toán khách đó, phòng đó

string token, 
int roomid, 

*/

export const getPaymentHistory = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/gethistorycolletmoney`, {
            params: {
                ...params,
                token,
            },
        });
        result = res.data;
    } catch (error) {
        result = error;
    }
    return result;
};
