window.addEventListener('load', () => {
  try {
    const loader = document.getElementById('loader');
    if (loader) {
      setTimeout(() => loader.classList.add('hidden'), 1500);
    }
  } catch (err) {
    console.warn('Error cargando loader:', err);
  }
});

try {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
      themeToggle.textContent = '☀️';
    }

    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      themeToggle.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  }
} catch (err) {
  console.warn('Error inicializando theme toggle:', err);
}

try {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    try {
      const question = item?.querySelector('.faq-question');
      if (question) {
        question.addEventListener('click', () => {
          const wasActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!wasActive) {
            item.classList.add('active');
          }
        });
      }
    } catch (err) {
      console.warn('Error inicializando FAQ:', err);
    }
  });
} catch (err) {
  console.warn('Error cargando FAQ items:', err);
}

try {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      try {
        if (entry.isIntersecting && entry.target) {
          entry.target.style.animation = 'slideUp 0.8s ease-out forwards';
          observer.unobserve(entry.target);
        }
      } catch (err) {
        console.warn('Error en observer:', err);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.project-card, .service-card, .stat-card, .team-card').forEach(el => {
    try {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
      }
    } catch (err) {
      console.warn('Error observando elemento:', err);
    }
  });
} catch (err) {
  console.warn('Error en intersection observer:', err);
}

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (!form || !formMessage) {
  console.error('Formulario o mensaje no encontrado en DOM');
}

const validateEmail = (email) => {
  try {
    if (!email || typeof email !== 'string') return false;
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email.trim());
  } catch (err) {
    console.warn('Error validando email:', err);
    return false;
  }
};

const validateName = (name) => {
  try {
    if (!name || typeof name !== 'string') return false;
    const cleanName = name.trim();
    const hasValidChars = /^[a-zA-Z0-9\s\-áéíóúàèìòùäëïöüñ]+$/.test(cleanName);
    return cleanName.length >= 2 && cleanName.length <= 50 && hasValidChars;
  } catch (err) {
    console.warn('Error validando nombre:', err);
    return false;
  }
};

const validateMessage = (message) => {
  try {
    if (!message || typeof message !== 'string') return false;
    const cleanMessage = message.trim();
    return cleanMessage.length >= 10 && cleanMessage.length <= 500;
  } catch (err) {
    console.warn('Error validando mensaje:', err);
    return false;
  }
};

const sanitizeInput = (input) => {
  try {
    if (!input || typeof input !== 'string') return '';
    return input
      .trim()
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '');
  } catch (err) {
    console.warn('Error sanitizando input:', err);
    return '';
  }
};

const detectSpam = (text) => {
  try {
    if (!text || typeof text !== 'string') return false;
    const spamPatterns = [
      /(.)\1{5,}/gi,
      /([a-z])\1{4,}/gi,
      /(http|https|ftp):\/\/\S+/gi,
      /bit\.ly|tinyurl|short\.link/gi,
      /[!@#$%^&*]{3,}/g,
    ];
    
    return spamPatterns.some(pattern => pattern.test(text));
  } catch (err) {
    console.warn('Error detectando spam:', err);
    return false;
  }
};

const filterProfanity = (text) => {
  try {
    if (!text || typeof text !== 'string') return text;
    const profanities = ['badword1', 'badword2'];
    let cleaned = text;
    profanities.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      cleaned = cleaned.replace(regex, '***');
    });
    return cleaned;
  } catch (err) {
    console.warn('Error filtrando profanidades:', err);
    return text;
  }
};

const validatePhoneNumber = (phone) => {
  try {
    if (!phone || typeof phone !== 'string') return !phone;
    const phoneRegex = /^[0-9\s\-\+\(\)]{9,20}$/;
    return phoneRegex.test(phone);
  } catch (err) {
    console.warn('Error validando teléfono:', err);
    return !phone;
  }
};

const showError = (fieldId, message) => {
  try {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement && message) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  } catch (err) {
    console.warn('Error mostrando error para campo:', fieldId, err);
  }
};

const clearError = (fieldId) => {
  try {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  } catch (err) {
    console.warn('Error limpiando error para campo:', fieldId, err);
  }
};

try {
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');

  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      try {
        const name = nameInput.value;
        if (!name) {
          showError('name', 'El nombre es requerido');
        } else if (!validateName(name)) {
          showError('name', 'Solo letras, números, espacios y guiones permitidos');
        } else {
          clearError('name');
        }
      } catch (err) {
        console.warn('Error validando nombre en blur:', err);
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      try {
        const email = emailInput.value;
        if (!email) {
          showError('email', 'El email es requerido');
        } else if (!validateEmail(email)) {
          showError('email', 'Email inválido (ej: nombre@dominio.com)');
        } else {
          clearError('email');
        }
      } catch (err) {
        console.warn('Error validando email en blur:', err);
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      try {
        const message = messageInput.value;
        if (!message) {
          showError('message', 'El mensaje es requerido');
        } else if (detectSpam(message)) {
          showError('message', 'Mensaje detectado como spam');
        } else if (!validateMessage(message)) {
          showError('message', 'El mensaje debe tener entre 10 y 500 caracteres');
        } else {
          clearError('message');
        }
      } catch (err) {
        console.warn('Error validando mensaje en blur:', err);
      }
    });
  }
} catch (err) {
  console.warn('Error inicializando event listeners de validación:', err);
}

if (form) {
  form.addEventListener('submit', async (e) => {
    try {
      e.preventDefault();

      let name = sanitizeInput(nameInput?.value || '');
      let email = sanitizeInput(emailInput?.value || '');
      let phone = sanitizeInput(document.getElementById('phone')?.value || '');
      let message = sanitizeInput(messageInput?.value || '');

      let isValid = true;

      if (!name) {
        showError('name', 'El nombre es requerido');
        isValid = false;
      } else if (!validateName(name)) {
        showError('name', 'Solo letras, números, espacios y guiones permitidos');
        isValid = false;
      } else {
        clearError('name');
      }

      if (!email) {
        showError('email', 'El email es requerido');
        isValid = false;
      } else if (!validateEmail(email)) {
        showError('email', 'Email inválido');
        isValid = false;
      } else {
        clearError('email');
      }

      if (phone && !validatePhoneNumber(phone)) {
        showError('phone', 'Teléfono inválido');
        isValid = false;
      } else {
        clearError('phone');
      }

      if (!message) {
        showError('message', 'El mensaje es requerido');
        isValid = false;
      } else if (detectSpam(message)) {
        showError('message', 'El mensaje contiene spam detectado');
        isValid = false;
      } else if (!validateMessage(message)) {
        showError('message', 'El mensaje debe tener entre 10 y 500 caracteres');
        isValid = false;
      } else {
        message = filterProfanity(message);
        clearError('message');
      }

      if (!isValid) return;

      if (typeof SecurityManager !== 'undefined' && SecurityManager.checkRateLimit) {
        if (!SecurityManager.checkRateLimit(email)) {
          showError('email', 'Demasiadas solicitudes. Intenta en unos minutos.');
          return;
        }
      }

      const submitBtn = form.querySelector('.submit-btn');
      if (!submitBtn) {
        console.error('Submit button no encontrado');
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.classList.add('sending');
      submitBtn.textContent = 'Enviando...';
      if (formMessage) {
        formMessage.className = '';
        formMessage.textContent = '';
      }

      try {
        const discordWebhook = atob('aHR0cHM6Ly9kaXNjb3JkYXBwLmNvbS9hcGkvd2ViaG9va3MvMTQzNjAzNjAxODk1MTI5NTA5Ni8tYklwcWpFTkZlY3RyYWctSFpzc21kTW0wTnc4Y2Nxa3FqNk8xM09WMk5mcGZRaWRpQVk4SzFNWW82UkhvVXViQXgzdA==');
        
        if (!discordWebhook) {
          throw new Error('Webhook URL inválido');
        }

        const timestamp = new Date().toLocaleString('es-ES', { 
          timeZone: 'Europe/Madrid',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        const payload = {
          embeds: [{
            title: '📨 Nuevo Mensaje de Contacto',
            description: message || 'Sin descripción',
            color: 0x00ffff,
            fields: [
              {
                name: '👤 Nombre',
                value: name || 'No proporcionado',
                inline: true
              },
              {
                name: '📧 Email',
                value: email || 'No proporcionado',
                inline: true
              },
              {
                name: '📱 Teléfono',
                value: phone || 'No proporcionado',
                inline: true
              },
              {
                name: '💬 Mensaje Completo',
                value: message || 'Sin mensaje',
                inline: false
              }
            ],
            footer: {
              text: `DarKlinca Services | ${timestamp}`
            },
            timestamp: new Date().toISOString()
          }]
        };

        const response = await fetch(discordWebhook, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(10000)
        });

        if (response && response.ok) {
          const burst = document.getElementById('successBurst');
          const particles = document.getElementById('successBurstParticles');
          
          if (burst) burst.classList.add('active');
          if (particles) particles.classList.add('active');
          
          if (formMessage) {
            formMessage.className = 'form-message success';
            formMessage.textContent = '✓ ¡Mensaje enviado correctamente! Te responderemos pronto.';
          }
          form.reset();
          
          setTimeout(() => {
            if (burst) burst.classList.remove('active');
            if (particles) particles.classList.remove('active');
          }, 1200);
          
          setTimeout(() => {
            if (formMessage) {
              formMessage.className = '';
              formMessage.textContent = '';
            }
          }, 5000);
        } else {
          throw new Error(`Error en Discord: ${response?.status || 'desconocido'}`);
        }
      } catch (err) {
        console.error('Error enviando webhook:', err);
        if (formMessage) {
          formMessage.className = 'form-message error';
          formMessage.textContent = '✗ Hubo un error al enviar. Intenta nuevamente.';
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');
        submitBtn.textContent = originalText;
      }
    } catch (err) {
      console.error('Error general en submit:', err);
      if (formMessage) {
        formMessage.className = 'form-message error';
        formMessage.textContent = '✗ Hubo un error. Intenta nuevamente.';
      }
    }
  });
}



