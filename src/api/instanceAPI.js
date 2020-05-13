import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const apiConfig = {
    baseUrl: `https://app.mona.house/api`,
}

export const getAccessToken = async () =>{
    try {
        const retrievedItem = await AsyncStorage.getItem('userToken');
        if (retrievedItem !== null) {
            return retrievedItem;
        } 

        return null;
    } catch (err) {
        //retrievedItem error
    }
}

const getUrl = (config) => {
    if (config.baseURL) { return config.url.replace(config.baseURL, ''); }
    return config.url;
}

const instance = axios.create({
    baseURL: apiConfig.baseUrl,
    headers: {
        Accept: 'application/json',
    },
    // data: {
    //     // client_id: apiConfig.clientId,
    //     // client_secret: apiConfig.clientSecret,
    //     id: 'password',
    //     scope: '*',
    // },
})

// Intercept all request
// instance.interceptors.request.use(
//     config => {
//         console.log(
//             `%c ${config.method.toUpperCase()} - ${getUrl(config)}:`,
//             'color: #0086b3; font-weight: bold', config);
//         return config;
//     }, error => Promise.reject(error),
// );

// Intercept all responses
// instance.interceptors.response.use(
//     async response => {
//         console.log(
//             `%c ${response.status} - ${getUrl(response.config)}:`,
//             'color: #008000; font-weight: bold',
//             response,
//         );
       
//         return response;
//     }, error => {
//         console.log(
//             `%c ${error.response.status} - ${getUrl(error.response.config)}:`,
//             'color: #a71d5d; font-weight: bold',
//             error.response,
//         ); 
//         return Promise.reject(error);
//     }
// );

export default instance;