import axiosClient from '../axios-client';

export const getColors = async () => {
    try {
        const response = await axiosClient.get("/colors");
        return response.data;
    }
    catch (error: any) {
        if (error.response) throw new Error(error.response.data.message);
        else if (error.request) throw new Error("No response received from server");
        else throw new Error("Failed to get data");
    }
}
