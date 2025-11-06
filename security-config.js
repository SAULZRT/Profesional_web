const SecurityConfig = (() => {
  const CONFIG = {
    apiTimeout: 10000,
    maxRetries: 3,
    maxFileSize: 5 * 1024 * 1024,
    allowedOrigins: [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://127.0.0.1:3000'
    ],
    trustedDomains: [
      'discord.com',
      'discordapp.com',
      'googleapis.com',
      'cdn.jsdelivr.net'
    ]
  };

  function setSecurityHeaders() {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://discord.com https://discordapp.com;
      frame-ancestors 'none';
      base-uri 'self';
      form-action 'self';
    `.trim().replace(/\s+/g, ' ');
    document.head.appendChild(meta);
  }

  function validateAPIResponse(response) {
    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response');
    }
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response;
  }

  function sanitizeURL(url) {
    try {
      const parsed = new URL(url);
      const trusted = CONFIG.trustedDomains.some(domain => 
        parsed.hostname.endsWith(domain)
      );
      
      if (!trusted) {
        console.warn(`Untrusted domain: ${parsed.hostname}`);
        return null;
      }
      
      return parsed.toString();
    } catch {
      return null;
    }
  }

  function validateJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed === null || typeof parsed !== 'object') {
        throw new Error('Invalid JSON structure');
      }
      return parsed;
    } catch (err) {
      console.error('JSON validation failed:', err);
      return null;
    }
  }

  function secureLocalStorage(key, value) {
    try {
      const encrypted = CodeProtection.encryptData(
        JSON.stringify({ value, timestamp: Date.now() }),
        key
      );
      localStorage.setItem(`secure_${key}`, encrypted);
      return true;
    } catch (err) {
      console.error('Secure storage failed:', err);
      return false;
    }
  }

  function retrieveSecureStorage(key) {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      
      const decrypted = CodeProtection.decryptData(encrypted, key);
      const data = JSON.parse(decrypted);
      
      if (Date.now() - data.timestamp > 24 * 60 * 60 * 1000) {
        localStorage.removeItem(`secure_${key}`);
        return null;
      }
      
      return data.value;
    } catch (err) {
      console.error('Secure retrieval failed:', err);
      return null;
    }
  }

  function verifySameOrigin(url) {
    try {
      const target = new URL(url, window.location.href);
      const current = new URL(window.location.href);
      
      if (target.protocol !== current.protocol ||
          target.hostname !== current.hostname ||
          target.port !== current.port) {
        console.warn('Cross-origin request detected');
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  }

  function createSecureElement(tag, attributes, content) {
    const element = document.createElement(tag);
    
    for (const [key, value] of Object.entries(attributes || {})) {
      if (key.startsWith('on')) {
        console.warn('Event handlers not allowed in secure element creation');
        continue;
      }
      element.setAttribute(key, SecurityManager.escapeAttribute(String(value)));
    }
    
    if (content) {
      element.textContent = content;
    }
    
    return element;
  }

  function hashData(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  function preventXSS(userInput) {
    const div = document.createElement('div');
    div.textContent = userInput;
    return div.innerHTML;
  }

  function init() {
    setSecurityHeaders();
  }

  return {
    CONFIG,
    setSecurityHeaders,
    validateAPIResponse,
    sanitizeURL,
    validateJSON,
    secureLocalStorage,
    retrieveSecureStorage,
    verifySameOrigin,
    createSecureElement,
    hashData,
    preventXSS,
    init
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', SecurityConfig.init);
} else {
  SecurityConfig.init();
}
