export const checkRegistration = (formData, fieldsToValidate) => {
  console.log("formData:", formData);
  console.log("fieldsToValidate:", fieldsToValidate);

  const errors = [];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

  fieldsToValidate.forEach((field) => {
    if (!formData[field]) {
      errors.push({
        field,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`,
      });
    }

    if (field === "taxNumber" && formData.taxNumber && formData.taxNumber.length !== 8) {
      errors.push({ field: "taxNumber", message: "Tax number must be 8 digits" });
    }

    if (field === "pin" && formData.pin && formData.pin.length !== 13) {
      errors.push({ field: "pin", message: "Pin must be 13 digits" });
    }

    if (field === "email" && formData.email && !emailRegex.test(formData.email)) {
      errors.push({ field: "email", message: "Invalid email address" });
    }

    if (field === "password" && formData.password && !passwordRegex.test(formData.password)) {
      errors.push({
        field: "password",
        message: "Password must be at least 8 characters long and contain at least one letter and one number",
      });
    }

    if (field === "confirmPassword" && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      errors.push({ field: "confirmPassword", message: "Passwords do not match" });
    }
  });

  return errors.length === 0 ? "ok" : errors;
};
