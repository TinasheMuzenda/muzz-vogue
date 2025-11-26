export const PASSWORD_POLICY_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{13,}$/;
export const isPasswordStrong = (pwd) => PASSWORD_POLICY_REGEX.test(pwd);
