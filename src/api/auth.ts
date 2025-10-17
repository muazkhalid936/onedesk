import axios from "./axiosConfig"

const API_URL = "/auth";

interface SignupPayload {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}
interface LoginPayload {
    email: string;
    password: string;
}
interface LoginResponse {
    success: boolean;
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    refresh: string;
    access: string;
}

export async function signup(data: SignupPayload) {
    return axios.post(`${API_URL}/signup`, data);
}

export async function login(data: LoginPayload): Promise<LoginResponse> {
    return axios.post(`${API_URL}/login/`, data);
}
