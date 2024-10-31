import axios from "axios";

const API_URL = process.env.REACT_APP_API_BASE_URL;

export const signup = (fullname: string, email: string, password: string) => {
  return axios.post(API_URL + "auth/signup", {
    fullname,
    email,
    password,
  });
};

export const signin = (email: string, password: string) => {
  return axios
    .post(API_URL + "auth/signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

export const signout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) return JSON.parse(userStr);

  return null;
};
