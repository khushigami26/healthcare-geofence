export const MOBILE_EXACT_LENGTH = 10;
export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const PASSWORD_MIN_LENGTH = 6;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function sanitizeDigits(value, maxLength = 15) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .slice(0, maxLength);
}

export function validateName(value, fieldLabel = "Name") {
  const name = String(value ?? "").trim();

  if (!name) {
    return `${fieldLabel} is required.`;
  }

  if (name.length < NAME_MIN_LENGTH) {
    return `${fieldLabel} must be at least ${NAME_MIN_LENGTH} characters.`;
  }

  if (name.length > NAME_MAX_LENGTH) {
    return `${fieldLabel} must not exceed ${NAME_MAX_LENGTH} characters.`;
  }

  return null;
}

export function validateEmail(value) {
  const email = String(value ?? "").trim().toLowerCase();

  if (!email) {
    return "Email address is required.";
  }

  if (!EMAIL_PATTERN.test(email)) {
    return "Please enter a valid email address.";
  }

  return null;
}

export function validateMobile(value) {
  const mobile = String(value ?? "").replace(/\D/g, "");

  if (!mobile) {
    return "Mobile number is required.";
  }

  if (mobile.length !== MOBILE_EXACT_LENGTH) {
    return `Mobile number must be exactly 10 digits (you entered ${mobile.length} digit${mobile.length !== 1 ? "s" : ""}).`;
  }

  return null;
}

export function validatePassword(value) {
  const password = String(value ?? "");

  if (!password) {
    return "Password is required.";
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  return null;
}

export function validateRelationship(value) {
  const relationship = String(value ?? "").trim();

  if (!relationship) {
    return "Relationship is required.";
  }

  if (relationship.length < 2) {
    return "Relationship must be at least 2 characters.";
  }

  if (relationship.length > 50) {
    return "Relationship must not exceed 50 characters.";
  }

  return null;
}

export function validatePatientForm(form) {
  const errors = {};

  const nameError = validateName(form.name, "Patient name");
  if (nameError) {
    errors.name = nameError;
  }

  const mobileError = validateMobile(form.mobile_number);
  if (mobileError) {
    errors.mobile_number = mobileError;
  }

  const status = String(form.status ?? "").trim();
  if (!status) {
    errors.status = "Status is required.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    firstError: Object.values(errors)[0] || null,
  };
}

export function validateFamilyMemberForm(form) {
  const errors = {};

  const nameError = validateName(form.name, "Name");
  if (nameError) {
    errors.name = nameError;
  }

  const relationshipError = validateRelationship(form.relationship_with_patient);
  if (relationshipError) {
    errors.relationship_with_patient = relationshipError;
  }

  const mobileError = validateMobile(form.mobile_number);
  if (mobileError) {
    errors.mobile_number = mobileError;
  }

  const emailError = validateEmail(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  if (
    form.notification_preference !== "Enabled" &&
    form.notification_preference !== "Disabled"
  ) {
    errors.notification_preference = "Select a valid notification preference.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    firstError: Object.values(errors)[0] || null,
  };
}

export function validateLocationForm(formData) {
  const errors = {};

  if (!String(formData.location_name ?? "").trim()) {
    errors.location_name = "Location name is required.";
  }

  if (!String(formData.address ?? "").trim()) {
    errors.address = "Address is required.";
  }

  const latitude = Number(formData.latitude);
  if (
    formData.latitude === "" ||
    Number.isNaN(latitude) ||
    latitude < -90 ||
    latitude > 90
  ) {
    errors.latitude = "Latitude must be between -90 and 90.";
  }

  const longitude = Number(formData.longitude);
  if (
    formData.longitude === "" ||
    Number.isNaN(longitude) ||
    longitude < -180 ||
    longitude > 180
  ) {
    errors.longitude = "Longitude must be between -180 and 180.";
  }

  const radius = Number(formData.geo_fence_radius);
  if (
    formData.geo_fence_radius === "" ||
    Number.isNaN(radius) ||
    radius <= 0
  ) {
    errors.geo_fence_radius = "Geo-fence radius must be greater than 0.";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    firstError: Object.values(errors)[0] || null,
  };
}

export function validateRegisterForm(form) {
  const errors = {};

  const nameError = validateName(form.name, "Full name");
  if (nameError) {
    errors.name = nameError;
  }

  const emailError = validateEmail(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(form.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    firstError: Object.values(errors)[0] || null,
  };
}

export function validateLoginForm(form) {
  const errors = {};

  const emailError = validateEmail(form.email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(form.password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
    firstError: Object.values(errors)[0] || null,
  };
}
