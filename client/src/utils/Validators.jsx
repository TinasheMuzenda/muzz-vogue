export const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{13,}$/;

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const mobileRegex = /^\+\d{6,15}$/;

export const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;

export const validateRequiredFields = (fields) => {
  for (let key in fields) {
    if (!fields[key]) return false;
  }
  return true;
};
