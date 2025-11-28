export const setToken = (token) => {
  if (!token) return;
  localStorage.setItem("jwt_token", token);
};

export const getToken = () => {
  return localStorage.getItem("jwt_token");
};

export const clearToken = () => {
  localStorage.removeItem("jwt_token");
};

export const setUserData = (user) => {
  localStorage.setItem("user_data", JSON.stringify(user));
};

export const getUserData = () => {
  const data = localStorage.getItem("user_data");
  return data ? JSON.parse(data) : null;
};

export const clearUserData = () => {
  localStorage.removeItem("user_data");
};
