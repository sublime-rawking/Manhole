
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const fetchDeviceData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/device/deviceList`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data :', error);
        throw error;
    }
};
export const fetchUserTripList = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/tripListByUser?userId=${userId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data by ID:', error);
        throw error;
    }
};
export const fetchUserOrderList = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/orderListByUser?userId=${userId}`);
        return response.data.data;
    } catch (error) {
        console.error('Error fetching data by ID:', error);
        throw error;
    }
};

export const changeUserStatus = async (userId, status) => {
    try {
        const postData = { userId: userId, status: status }
        const response = await axios.post(`${API_BASE_URL}/user/changeUserStatus`, postData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data.success;
    } catch (error) {
        console.error('Error While Changing Status :', error);
        throw error;
    }
};

export const adminLogin = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/user/adminLogin`, credentials, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            return response.data;
        } else {
            return null;
        }

    } catch (error) {
        console.error('Error while login :', error);
        throw error;
    }
};

export const changePassword = async (fromData) => {
    try {
        console.log(fromData);
        const response = await axios.post(`${API_BASE_URL}/user/changePassword`, fromData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data.success) {
            return response.data;
        } else {
            return response.data;
        }

    } catch (error) {
        console.error('Error while chaning Password :', error);
        throw error;
    }
};
