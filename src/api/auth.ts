import axios from "./axiosConfig";

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

interface OtpPayload {
  email: string;
  otp: string;
}
interface OtpAgainPayload {
  email: string;
}

interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

interface TokenResponse {
  access: string;
  refresh: string;
  user_id?: number;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export async function signup(data: SignupPayload) {
  return axios.post(`${API_URL}/register/`, data);
}

export async function login(data: LoginPayload): Promise<LoginResponse> {
  return axios.post(`${API_URL}/login/`, data);
}

export async function verify_otp(data: OtpPayload) {
  return axios.post(`${API_URL}/verify-otp/`, data);
}

export async function request_otp_again(data: OtpAgainPayload) {
  return axios.post(`${API_URL}/request-otp-again/`, data);
}

export async function token(data: LoginPayload): Promise<TokenResponse> {
  return axios.post(`${API_URL}/token/`, data);
}

export async function refresh_token(data: { refresh: string }): Promise<RefreshTokenResponse> {
  return axios.post(`${API_URL}/token/refresh/`, data);
}
