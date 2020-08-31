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

/*
Lấy lịch sử điện nước theo: nhà, phòng, tháng, năm

string token, 
int motelid,
int roomid, 
int month, 
int year, 
int sort

Ghi chú: Sort
0 ngày ghi tăng
1 ngày ghi giảm
2 tên nhà A-Z
3 tên phòng Z-A
4 Tên nhà A-Z
5 Tên nhà Z-Z

motelid:0, roomid:0 => tất cả
motelid:1, roomid:0 => lấy theo nhà
motelid:0, roomid:1 => lấy theo phòng
*/
export const getEWHistory = async (params) => {
    let result;
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/HistoryUtility`, {
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