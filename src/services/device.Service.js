"use client";
import axios from 'axios';
const API_BASE_URL = "http://5.189.156.172:3003";
// admin login api
export const adminLogin = async (credentials) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/device/adminLogin`, credentials, {
            headers: { 'Content-Type': 'application/json' }
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

// get device list
export const fetchDeviceData = async (getCords) => {
    try {
        console.log(API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/device/deviceList` + (getCords ? '?getCords=true' : ''));
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data :', error);
        throw error;
    } 
};

// api for device configure
export const deviceConfigure = async (fromData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/device/configureDevice`, fromData, {
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.data.success) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error('Error while chaning Password :', error);
        throw error;
    }
};
