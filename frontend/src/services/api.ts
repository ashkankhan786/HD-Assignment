import axios from "axios";
import { getHeaders } from "../utils/auth";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const fetchUserProfile = () =>
  axios.get(`${SERVER_URL}/api/auth/me`, { headers: getHeaders() });

export const fetchNotes = () =>
  axios.get(`${SERVER_URL}/api/notes`, { headers: getHeaders() });

export const createNoteAPI = (content: string) =>
  axios.post(`${SERVER_URL}/api/notes`, { content }, { headers: getHeaders() });

export const deleteNoteAPI = (id: string) =>
  axios.delete(`${SERVER_URL}/api/notes/${id}`, { headers: getHeaders() });

export const sendOtp = (email: string) =>
  axios.post(`${SERVER_URL}/api/auth/send-otp`, { email });

export const verifyOtp = (
  email: string,
  otp: string,
  keepMeLoggedIn: boolean
) =>
  axios.post(`${SERVER_URL}/api/auth/verify-otp`, {
    email,
    otp,
    keepMeLoggedIn,
  });

export const loginWithGoogle = (token: string) =>
  axios.post(`${SERVER_URL}/api/auth/google`, { token });
