import instance, { getAccessToken } from "./instanceAPI";

const path = `/MotelApi`;

export const createMotel = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/createmotel`, {
            params: {
                ...params,
                token,
            },
        });

        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const updateMotel = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/updatemotel`, {
            params: {
                ...params,
                token,
            },
        });
        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const deleteMotel = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/deletemotel`, {
            params: {
                ...params,
                token,
            },
        });
        return res;
    } catch (error) {
        return error.message;
    }
};

export const getMotels = async (params) => {
    let result = "";
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/getmotels`, {
            params: {
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
    int motelid || 0, 
    int month, 
    int year, 
    string qsearch || "", 
    int sortby || 0, 
    int status || 0
*/

export const getMotelById = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/getmotelbyid`, {
            params: {
                ...params,
                token,
            },
        });
        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const getRoomsByMotelId = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/getroombymotelid`, {
            params: {
                ...params,
                token,
            },
        });
        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const getRoomById = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/getroombyid`, {
            params: {
                ...params,
                token,
            },
        });
        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const createRoom = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/createroom`, {
            params: {
                ...params,
                token,
            },
        });
        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const updateRoom = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/updateroom`, {
            params: {
                ...params,
                token,
            },
        });
        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const deleteRoom = async (params) => {
    try {
        const token = await getAccessToken();
        let res = await instance.get(`${path}/deleteroom`, {
            params: {
                ...params,
                token,
            },
        });
        return res.data;
    } catch (error) {
        return error.message;
    }
};

export const getOptionsSortRoom = async () => {
    try {
        let res = await instance.get(`${path}/getoptionsortroom`, {});
        return res.data;
    } catch (error) {
        return error.message;
    }
};
