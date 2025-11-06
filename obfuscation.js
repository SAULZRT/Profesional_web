const CodeProtection = (() => {
  function obfuscateString(str) {
    return Array.from(str)
      .map(char => `\\x${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
      .join('');
  }

  function protectWebhookURL() {
    const encoded = 'aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3M=';
    return atob(encoded);
  }

  function detectDebugger() {
    const check = () => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      return (end - start) > 100;
    };
    
    try {
      return check();
    } catch {
      return false;
    }
  }

  function preventCopyright() {
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      const text = document.getSelection().toString();
      if (text) {
        e.clipboardData.setData('text/plain', 
          `${text}\n\n© 2025 DarKlinca Services - Prohibida la reproducción sin autorización.`);
      }
    });
  }

  function preventDevTools() {
    const devtoolsRegex = /\{\s*constructor\(.*?\)\s*\{\s*constructor\(.*?\)\s*\{\s*constructor\(\)\s*\{\s*while.*?\}\(new Error\(\)\);\s*\}\s*new\s+this\(\)\s*\}\s*new\s+this\(\)\s*\}/;
    
    setInterval(() => {
      if (devtoolsRegex.test(console.log.toString())) {
        document.body.innerHTML = '<h1>⚠️ Acceso denegado</h1>';
      }
    }, 1000);
  }

  function encryptData(data, key = 'darklinca2025') {
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return btoa(result);
  }

  function decryptData(encrypted, key = 'darklinca2025') {
    const data = atob(encrypted);
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(
        data.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  }

  function validateOrigin() {
    if (!window.location.hostname.includes('localhost') && 
        !window.location.hostname === '127.0.0.1') {
      const allowedDomains = ['darklinca.com', 'www.darklinca.com'];
      if (!allowedDomains.includes(window.location.hostname)) {
        console.warn('⚠️ Ejecución en dominio no autorizado');
      }
    }
  }

  function preventScreenshot() {
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'PrintScreen') || 
          (e.ctrlKey && e.shiftKey && e.key === 'S') ||
          (e.ctrlKey && e.key === 'p')) {
        e.preventDefault();
      }
    });
  }

  function initProtections() {
    preventCopyright();
    preventScreenshot();
    validateOrigin();
  }

  return {
    obfuscateString,
    protectWebhookURL,
    detectDebugger,
    preventCopyright,
    preventDevTools,
    encryptData,
    decryptData,
    validateOrigin,
    preventScreenshot,
    initProtections
  };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', CodeProtection.initProtections);
} else {
  CodeProtection.initProtections();
}
