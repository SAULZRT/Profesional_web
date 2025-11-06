const WebhookManager = (() => {
  const SECRET_KEY = 'D4rKl1nc4S3rv1c3s2025';
  
  function xorEncrypt(str, key) {
    return str.split('').map((char, i) => 
      String.fromCharCode(char.charCodeAt(0) ^ key.charCodeAt(i % key.length))
    ).join('');
  }

  function xorDecrypt(str, key) {
    return xorEncrypt(str, key);
  }

  function buildURL() {
    const chunks = [
      btoa('https://discordapp.com/api/webhooks/'),
      btoa('1436036018951295096/'),
      btoa('-bIpqjENFectrag-HZssmdMm0Nw8ccqkqj6O13OV2NfpfQidiAY8K1MYo6RHoUubAx3t')
    ];

    const part1 = atob(chunks[0]);
    const part2 = atob(chunks[1]);
    const part3 = atob(chunks[2]);

    return part1 + part2 + part3;
  }

  function obscureURL() {
    const url = buildURL();
    const reversed = url.split('').reverse().join('');
    const encrypted = btoa(xorEncrypt(reversed, SECRET_KEY));
    return encrypted;
  }

  function revealURL(obfuscated) {
    try {
      const encrypted = atob(obfuscated);
      const reversed = xorDecrypt(encrypted, SECRET_KEY);
      const url = reversed.split('').reverse().join('');
      return url;
    } catch (err) {
      console.error('Error revelando URL:', err);
      return null;
    }
  }

  function fetchWithObfuscation(obfuscatedURL, payload) {
    return new Promise(async (resolve, reject) => {
      try {
        const url = revealURL(obfuscatedURL);
        if (!url) throw new Error('URL revelation failed');

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Discord error: ${response.status}`);
        }
        resolve(response);
      } catch (err) {
        console.error('Error en webhook:', err);
        reject(err);
      }
    });
  }

  const cachedObfuscated = (() => {
    try {
      return obscureURL();
    } catch (err) {
      console.error('Error cachéando URL:', err);
      return null;
    }
  })();

  return {
    getWebhook: () => cachedObfuscated,
    send: (payload) => {
      if (!cachedObfuscated) {
        return Promise.reject(new Error('Webhook no inicializada'));
      }
      return fetchWithObfuscation(cachedObfuscated, payload);
    },
    revealURL,
    obscureURL,
    debugURL: () => {
      return revealURL(cachedObfuscated);
    }
  };
})();
