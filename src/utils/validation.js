// src/utils/validation.js

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {boolean} - True if password meets requirements
 */
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone
 */
export const isValidPhone = (phone) => {
  // Accepts various formats with +, -, (), and spaces
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate clinic name
 * @param {string} name - Clinic name
 * @returns {boolean} - True if valid
 */
export const isValidClinicName = (name) => {
  return name && name.trim().length >= 3 && name.trim().length <= 100;
};

/**
 * Validate clinic address
 * @param {string} address - Address to validate
 * @returns {boolean} - True if valid
 */
export const isValidAddress = (address) => {
  return address && address.trim().length >= 5 && address.trim().length <= 200;
};

/**
 * Validate consultation fee
 * @param {number} fee - Consultation fee
 * @returns {boolean} - True if valid
 */
export const isValidConsultationFee = (fee) => {
  const feeNum = parseFloat(fee);
  return !isNaN(feeNum) && feeNum > 0 && feeNum < 100000;
};

/**
 * Validate time format HH:MM
 * @param {string} time - Time string
 * @returns {boolean} - True if valid time
 */
export const isValidTimeFormat = (time) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

/**
 * Validate date format
 * @param {string} dateString - Date string
 * @returns {boolean} - True if valid date
 */
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

/**
 * Validate clinic profile data
 * @param {Object} profile - Clinic profile
 * @returns {Object} - Validation errors object
 */
export const validateClinicProfile = (profile) => {
  const errors = {};

  if (!isValidClinicName(profile.name)) {
    errors.name = 'Clinic name must be between 3 and 100 characters';
  }

  if (!isValidEmail(profile.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!isValidAddress(profile.address)) {
    errors.address = 'Address must be between 5 and 200 characters';
  }

  if (!isValidPhone(profile.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (profile.consultationFee && !isValidConsultationFee(profile.consultationFee)) {
    errors.consultationFee = 'Consultation fee must be between 0 and 100,000';
  }

  return errors;
};

/**
 * Validate availability slots
 * @param {Array} slots - Array of time slots
 * @returns {Array} - Validation errors
 */
export const validateAvailabilitySlots = (slots) => {
  const errors = [];

  if (!Array.isArray(slots) || slots.length === 0) {
    errors.push('At least one availability slot is required');
    return errors;
  }

  slots.forEach((slot, index) => {
    if (!slot.startTime || !isValidTimeFormat(slot.startTime)) {
      errors.push(`Slot ${index + 1}: Invalid start time`);
    }
    if (!slot.endTime || !isValidTimeFormat(slot.endTime)) {
      errors.push(`Slot ${index + 1}: Invalid end time`);
    }
    
    // Check if start time is before end time
    if (slot.startTime && slot.endTime) {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      const startTotal = startHour * 60 + startMin;
      const endTotal = endHour * 60 + endMin;
      
      if (startTotal >= endTotal) {
        errors.push(`Slot ${index + 1}: Start time must be before end time`);
      }
    }
  });

  return errors;
};

/**
 * Validate appointment data
 * @param {Object} appointment - Appointment data
 * @returns {Object} - Validation errors
 */
export const validateAppointment = (appointment) => {
  const errors = {};

  if (!appointment.patientName || appointment.patientName.trim().length < 2) {
    errors.patientName = 'Patient name is required';
  }

  if (!appointment.date || !isValidDate(appointment.date)) {
    errors.date = 'Valid appointment date is required';
  }

  if (!appointment.time || !isValidTimeFormat(appointment.time)) {
    errors.time = 'Valid appointment time is required';
  }

  if (!appointment.type || appointment.type.trim().length === 0) {
    errors.type = 'Appointment type is required';
  }

  return errors;
};

/**
 * Validate clinic hours
 * @param {Object} clinicHours - Clinic hours object
 * @returns {Array} - Validation errors
 */
export const validateClinicHours = (clinicHours) => {
  const errors = [];
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  daysOfWeek.forEach(day => {
    if (clinicHours[day] && !clinicHours[day].closed) {
      if (!isValidTimeFormat(clinicHours[day].open)) {
        errors.push(`${day}: Invalid opening time`);
      }
      if (!isValidTimeFormat(clinicHours[day].close)) {
        errors.push(`${day}: Invalid closing time`);
      }

      if (clinicHours[day].open && clinicHours[day].close) {
        const [openHour, openMin] = clinicHours[day].open.split(':').map(Number);
        const [closeHour, closeMin] = clinicHours[day].close.split(':').map(Number);
        const openTotal = openHour * 60 + openMin;
        const closeTotal = closeHour * 60 + closeMin;

        if (openTotal >= closeTotal) {
          errors.push(`${day}: Opening time must be before closing time`);
        }
      }
    }
  });

  return errors;
};

/**
 * Validate clinic settings
 * @param {Object} settings - Settings object
 * @returns {Object} - Validation errors
 */
export const validateClinicSettings = (settings) => {
  const errors = {};

  if (settings.appointmentDuration && (settings.appointmentDuration < 5 || settings.appointmentDuration > 180)) {
    errors.appointmentDuration = 'Appointment duration must be between 5 and 180 minutes';
  }

  if (settings.bufferBetweenAppointments && (settings.bufferBetweenAppointments < 0 || settings.bufferBetweenAppointments > 60)) {
    errors.bufferBetweenAppointments = 'Buffer time must be between 0 and 60 minutes';
  }

  if (settings.maxAppointmentsPerDay && (settings.maxAppointmentsPerDay < 1 || settings.maxAppointmentsPerDay > 100)) {
    errors.maxAppointmentsPerDay = 'Max appointments must be between 1 and 100';
  }

  return errors;
};

/**
 * Check if clinic profile is complete
 * @param {Object} profile - Clinic profile
 * @returns {boolean} - True if profile has all required fields
 */
export const isClinicProfileComplete = (profile) => {
  const requiredFields = ['name', 'email', 'phone', 'address'];
  return requiredFields.every(field => profile[field] && profile[field].toString().trim().length > 0);
};

/**
 * Validate numeric value within range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} - True if valid
 */
export const isNumericInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Sanitize string input
 * @param {string} input - Input to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate license number format (Philippine PRC format example)
 * @param {string} license - License number
 * @returns {boolean} - True if valid
 */
export const isValidLicenseNumber = (license) => {
  // Simple validation - alphanumeric, 6-20 characters
  const licenseRegex = /^[A-Z0-9\-]{6,20}$/;
  return licenseRegex.test(license);
};

/**
 * Validate tax ID format (Philippine TIN format example)
 * @param {string} taxId - Tax ID
 * @returns {boolean} - True if valid
 */
export const isValidTaxId = (taxId) => {
  // Philippine TIN format: XXX-XXX-XXX-XXX
  const taxIdRegex = /^\d{3}-\d{3}-\d{3}-\d{3}$/;
  return taxIdRegex.test(taxId);
};
