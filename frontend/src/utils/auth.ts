export const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

export const setToken = (token: string, keepLoggedIn: boolean) => {
  if (keepLoggedIn) {
    localStorage.setItem("token", token);
  } else {
    sessionStorage.setItem("token", token);
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const signOut = () => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

export const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});
