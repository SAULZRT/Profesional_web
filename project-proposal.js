const projectModal = document.getElementById('projectModal');
const proposeProjectBtn = document.getElementById('proposeProjectBtn');
const closeProjectBtn = document.getElementById('closeProjectBtn');
const projectForm = document.getElementById('projectProposalForm');
const projectFormMessage = document.getElementById('projectFormMessage');

if (!projectModal || !proposeProjectBtn || !closeProjectBtn || !projectForm || !projectFormMessage) {
  console.error('Elementos del modal de proyecto no encontrados');
}

try {
  if (proposeProjectBtn) {
    proposeProjectBtn.addEventListener('click', () => {
      try {
        if (projectModal) projectModal.classList.add('active');
        if (projectForm) projectForm.reset();
        clearAllProjectErrors();
      } catch (err) {
        console.error('Error abriendo modal de proyecto:', err);
      }
    });
  }
} catch (err) {
  console.warn('Error en proposeProjectBtn:', err);
}

try {
  if (closeProjectBtn) {
    closeProjectBtn.addEventListener('click', () => {
      try {
        if (projectModal) projectModal.classList.remove('active');
        if (projectForm) projectForm.reset();
        clearAllProjectErrors();
      } catch (err) {
        console.error('Error cerrando modal de proyecto:', err);
      }
    });
  }
} catch (err) {
  console.warn('Error en closeProjectBtn:', err);
}

function showProjectError(fieldId, message) {
  try {
    if (!fieldId || !message) return;
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }
  } catch (err) {
    console.warn('Error mostrando error de proyecto:', fieldId, err);
  }
}

function clearProjectError(fieldId) {
  try {
    if (!fieldId) return;
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  } catch (err) {
    console.warn('Error limpiando error de proyecto:', fieldId, err);
  }
}

function clearAllProjectErrors() {
  try {
    ['projectName', 'projectCategory', 'projectDescription', 'projectEmail', 'projectContact'].forEach(field => {
      clearProjectError(field);
    });
  } catch (err) {
    console.warn('Error limpiando todos los errores de proyecto:', err);
  }
}

const projectNameInput = document.getElementById('projectName');
const projectDescriptionInput = document.getElementById('projectDescription');
const projectEmailInput = document.getElementById('projectEmail');
const projectContactInput = document.getElementById('projectContact');

try {
  if (projectNameInput) {
    projectNameInput.addEventListener('blur', () => {
      try {
        const name = projectNameInput.value?.trim() || '';
        if (!name) {
          showProjectError('projectName', 'El nombre del proyecto es requerido');
        } else if (name.length < 5) {
          showProjectError('projectName', 'El nombre debe tener al menos 5 caracteres');
        } else {
          clearProjectError('projectName');
        }
      } catch (err) {
        console.warn('Error validando nombre de proyecto:', err);
      }
    });
  }
} catch (err) {
  console.warn('Error en projectNameInput:', err);
}

try {
  if (projectDescriptionInput) {
    projectDescriptionInput.addEventListener('blur', () => {
      try {
        const description = projectDescriptionInput.value?.trim() || '';
        if (!description) {
          showProjectError('projectDescription', 'La descripción es requerida');
        } else if (description.length < 20) {
          showProjectError('projectDescription', 'La descripción debe tener al menos 20 caracteres');
        } else {
          clearProjectError('projectDescription');
        }
      } catch (err) {
        console.warn('Error validando descripción de proyecto:', err);
      }
    });
  }
} catch (err) {
  console.warn('Error en projectDescriptionInput:', err);
}

try {
  if (projectEmailInput) {
    projectEmailInput.addEventListener('blur', () => {
      try {
        const email = projectEmailInput.value?.trim() || '';
        if (!email) {
          showProjectError('projectEmail', 'El email es requerido');
        } else if (typeof SecurityManager !== 'undefined' && SecurityManager.validateEmail) {
          if (!SecurityManager.validateEmail(email)) {
            showProjectError('projectEmail', 'Email inválido');
          } else {
            clearProjectError('projectEmail');
          }
        } else {
          clearProjectError('projectEmail');
        }
      } catch (err) {
        console.warn('Error validando email de proyecto:', err);
      }
    });
  }
} catch (err) {
  console.warn('Error en projectEmailInput:', err);
}

try {
  if (projectContactInput) {
    projectContactInput.addEventListener('blur', () => {
      try {
        const contact = projectContactInput.value?.trim() || '';
        if (contact && contact.length < 2) {
          showProjectError('projectContact', 'El nombre debe tener al menos 2 caracteres');
        } else {
          clearProjectError('projectContact');
        }
      } catch (err) {
        console.warn('Error validando contacto de proyecto:', err);
      }
    });
  }
} catch (err) {
  console.warn('Error en projectContactInput:', err);
}

if (projectForm) {
  projectForm.addEventListener('submit', async (e) => {
    try {
      e.preventDefault();

      let projectName = '';
      let projectDescription = '';
      let projectEmail = '';
      let projectContact = '';

      if (typeof SecurityManager !== 'undefined' && SecurityManager.sanitizeInput) {
        projectName = SecurityManager.sanitizeInput(projectNameInput?.value || '');
        projectDescription = SecurityManager.sanitizeInput(projectDescriptionInput?.value || '');
        projectEmail = SecurityManager.sanitizeInput(projectEmailInput?.value || '');
        projectContact = SecurityManager.sanitizeInput(projectContactInput?.value || '') || 'No proporcionado';
      } else {
        projectName = (projectNameInput?.value || '').trim();
        projectDescription = (projectDescriptionInput?.value || '').trim();
        projectEmail = (projectEmailInput?.value || '').trim();
        projectContact = (projectContactInput?.value || '').trim() || 'No proporcionado';
      }

      let isValid = true;

      if (!projectName || projectName.length < 5) {
        showProjectError('projectName', 'El nombre debe tener al menos 5 caracteres');
        isValid = false;
      } else {
        clearProjectError('projectName');
      }

      if (!projectDescription || projectDescription.length < 20) {
        showProjectError('projectDescription', 'La descripción debe tener al menos 20 caracteres');
        isValid = false;
      } else {
        clearProjectError('projectDescription');
      }

      if (!projectEmail) {
        showProjectError('projectEmail', 'El email es requerido');
        isValid = false;
      } else if (typeof SecurityManager !== 'undefined' && SecurityManager.validateEmail) {
        if (!SecurityManager.validateEmail(projectEmail)) {
          showProjectError('projectEmail', 'Email inválido');
          isValid = false;
        } else {
          clearProjectError('projectEmail');
        }
      } else {
        clearProjectError('projectEmail');
      }

      if (!isValid) return;

      if (typeof SecurityManager !== 'undefined' && SecurityManager.checkRateLimit) {
        if (!SecurityManager.checkRateLimit(`project_${projectEmail}`)) {
          showProjectError('projectEmail', 'Demasiadas solicitudes. Intenta en unos minutos.');
          return;
        }
      }

      const submitBtn = projectForm.querySelector('.submit-project-btn');
      if (!submitBtn) {
        console.error('Submit button no encontrado en proyecto');
        return;
      }

      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.classList.add('sending');
      submitBtn.textContent = 'Enviando...';
      if (projectFormMessage) {
        projectFormMessage.className = '';
        projectFormMessage.textContent = '';
      }

      try {
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
            title: '💡 Nueva Propuesta de Proyecto',
            description: projectDescription || 'Sin descripción',
            color: 0x00ff64,
            fields: [
              {
                name: '📋 Nombre del Proyecto',
                value: projectName || 'No proporcionado',
                inline: true
              },
              {
                name: '📧 Email',
                value: projectEmail || 'No proporcionado',
                inline: true
              },
              {
                name: '👤 Contacto',
                value: projectContact,
                inline: true
              },
              {
                name: '📝 Descripción',
                value: projectDescription || 'Sin descripción',
                inline: false
              }
            ],
            footer: {
              text: `DarKlinca Services | ${timestamp}`
            }
          }]
        };

        let response;

        try {
          response = await fetch('http://localhost:3000/api/proposal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              projectName,
              projectDescription,
              projectEmail,
              projectContact
            }),
            signal: AbortSignal.timeout(10000)
          });
        } catch (backendErr) {
          console.log('Backend no disponible, usando webhook directa...');
          if (typeof WebhookManager !== 'undefined' && WebhookManager.send) {
            response = await WebhookManager.send(payload);
          } else {
            throw new Error('WebhookManager no disponible');
          }
        }

        if (response && response.ok) {
          if (projectFormMessage) {
            projectFormMessage.className = 'form-message success';
            projectFormMessage.textContent = '✓ ¡Propuesta recibida! Te contactaremos pronto.';
          }
          
          const burst = document.getElementById('successBurst');
          const particles = document.getElementById('successBurstParticles');
          if (burst) burst.classList.add('active');
          if (particles) particles.classList.add('active');
          
          setTimeout(() => {
            if (projectForm) projectForm.reset();
            clearAllProjectErrors();
          }, 1200);
          
          setTimeout(() => {
            if (burst) burst.classList.remove('active');
            if (particles) particles.classList.remove('active');
          }, 1200);
          
          setTimeout(() => {
            if (projectFormMessage) {
              projectFormMessage.className = '';
              projectFormMessage.textContent = '';
            }
          }, 5000);
        } else {
          throw new Error(`Error al enviar propuesta: ${response?.status || 'desconocido'}`);
        }
      } catch (err) {
        console.error('Error enviando propuesta:', err);
        if (projectFormMessage) {
          projectFormMessage.className = 'form-message error';
          projectFormMessage.textContent = '✗ Error: ' + (err.message || 'Intenta nuevamente.');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.classList.remove('sending');
        submitBtn.textContent = originalText;
      }
    } catch (err) {
      console.error('Error general en submit de proyecto:', err);
      if (projectFormMessage) {
        projectFormMessage.className = 'form-message error';
        projectFormMessage.textContent = '✗ Error al procesar solicitud.';
      }
    }
  });
}
