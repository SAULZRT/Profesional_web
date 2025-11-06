# Setup - DarKlinca Services

## Estructura del Proyecto

```
webcompleja/
├── frontend/              (Archivos web - TODO complejo + Propuestas)
│   ├── index.html
│   ├── styles.css
│   ├── script.js
│   ├── todo.js
│   ├── project-proposal.js
│   ├── webhook-obfuscated.js  (Webhook ofuscada)
│   ├── security.js
│   ├── obfuscation.js
│   ├── particles.js
│   └── advanced-effects.js
├── backend/               (Opcional - para desarrollo)
│   ├── server.js
│   ├── package.json
│   └── .env
└── SETUP.md
```

## Configuración Frontend (Solo Necesario)

El proyecto es **100% Frontend**. No requiere backend para funcionar.

### Archivos principales:

- **index.html** - Estructura HTML
- **styles.css** - Estilos Neon completos
- **webhook-obfuscated.js** - Manager de webhook ofuscada
- **project-proposal.js** - Formulario de propuestas
- **todo.js** - Gestor avanzado de tareas

### Seguridad de Webhook

La webhook de Discord está protegida con:

1. **XOR Encryption** - Cifrado con clave secreta
2. **Base64 Encoding** - Doble codificación
3. **String Reversal** - Reversión de cadenas
4. **Chunking** - División en múltiples fragmentos
5. **Dynamic Construction** - Construcción dinámica en runtime

```javascript
// Uso automático en background
WebhookManager.send(payload)
```

## Funcionamiento

1. **Frontend captura datos** del formulario o tareas
2. **WebhookManager ofusca y revela** la webhook en runtime
3. **Envía directamente a Discord** vía fetch con CORS
4. **Discord recibe embed** con información formateada

## Diferencias vs Backend

| Aspecto | Frontend | Backend |
|---------|----------|---------|
| Instalación | Solo abrir HTML | npm install + npm start |
| Webhook visible | Ofuscada (multilayer) | Segura (privada) |
| Complejidad | Simple | Media |
| Escalabilidad | Limitada | Completa |
| CORS | Habilitado Discord | Servidor proxy |

## Notas Seguridad

⚠️ La ofuscación frontend **NO es criptografía segura**. Está diseñada para:
- Evitar scraping automático
- Proteger contra inspeccionadores casuales
- Añadir complejidad accesoria

Para producción con datos sensibles, usa backend.
