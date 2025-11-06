const SecurityManager = (() => {
  const rateLimits = new Map();
  const MAX_REQUESTS = 5;
  const TIME_WINDOW = 60000;

  const sanitizeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[\d+\-\s()]+$/;
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  };

  const sanitizeInput = (input) => {
    return input
      .replace(/[<>\"']/g, (m) => ({
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;'
      }[m]))
      .trim();
  };

  const checkRateLimit = (key) => {
    const now = Date.now();
    if (!rateLimits.has(key)) {
      rateLimits.set(key, []);
    }
    
    const requests = rateLimits.get(key).filter(t => now - t < TIME_WINDOW);
    
    if (requests.length >= MAX_REQUESTS) {
      return false;
    }
    
    requests.push(now);
    rateLimits.set(key, requests);
    return true;
  };

  const validateFormData = (data) => {
    const errors = {};
    
    if (!data.name || data.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    if (!validateEmail(data.email)) {
      errors.email = 'Email inválido';
    }
    if (data.phone && !validatePhone(data.phone)) {
      errors.phone = 'Teléfono inválido';
    }
    if (!data.message || data.message.length < 10) {
      errors.message = 'El mensaje debe tener al menos 10 caracteres';
    }
    
    return Object.keys(errors).length === 0 ? null : errors;
  };

  const escapeAttribute = (str) => {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
  };

  return {
    sanitizeHTML,
    validateEmail,
    validatePhone,
    sanitizeInput,
    checkRateLimit,
    validateFormData,
    escapeAttribute
  };
})();
