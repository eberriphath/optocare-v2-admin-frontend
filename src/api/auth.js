import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api";

export const loginAdmin = async (email, password) => {
    const response = await axios.post(
        `${API_URL}/auth/login`,
        {
            email,
            password,
        }
    );

    return response.data;
};