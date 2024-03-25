export const validateEmail = (value: string) => {
  let error = "";
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  !emailRegex.test(value) ? (error = "Invalid email") : "";
  if (!value) {
    error = "*Required";
  }
  return error;
};

export const validateUsername = (value: string) => {
  let error = "";
  const usernameRegex = /^[a-zA-Z0-9._-]{3,12}$/;
  !usernameRegex.test(value) ? (error = "Invalid username") : "";
  if (!value) {
    error = "*Required";
  }
  return error;
};

export const validatePassword = (value: string, setPassValue: Function) => {
  let error = "";
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).*$/;

  value.length < 8 ? (error = "Password must be 8 characters long") : "";
  !passwordRegex.test(value)
    ? (error = "Password invalid")
    : setPassValue(value);
  if (!value) {
    error = "*Required";
  }

  return error;
};

export const validateConfirmPassword = (value: string, passValue: string) => {
  let error = "";
  if (passValue && value) {
    if (passValue !== value) {
      error = "Password not matched";
    }
  }
  return error;
};

export const validatePhone = (value: string) => {
  let error = "";
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  !phoneRegex.test(value) ? (error = "Invalid phone number") : "";
  if (!value) {
    error = "";
  }
  return error;
};
