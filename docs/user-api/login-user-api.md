# Login User API

## Endpoint: Login User

**URL:** `POST /users/login`

**Descripción:** Autentica un usuario en el sistema mediante email y contraseña, retornando un token JWT para sesiones posteriores.

**Autenticación:** No requerida

---

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
    "email": "string",
    "password": "string"
}
```

#### Validaciones del Request Body

- **email**: Requerido, debe ser un email válido
- **password**: Requerido, string no vacío

---

### Response Examples

#### Success Response (200 OK)

```json
{
    "message": "Login successful",
    "payload": {
        "user": {
            "user_id": "550e8400-e29b-41d4-a716-446655440000",
            "first_name": "Juan",
            "last_name": "Pérez",
            "email": "juan.perez@example.com",
            "roles": ["customer"],
            "status": "active",
            "dni": "12345678",
            "phone": {
                "number": "1234567890",
                "country_code": "+54"
            },
            "avatar": "https://example.com/avatar.jpg",
            "created_at": "2024-01-15T10:30:00.000Z",
            "updated_at": "2024-01-20T14:45:00.000Z",
            "last_login": "2024-01-21T16:45:00.000Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoianVhbi5wZXJlekBleGFtcGxlLmNvbSIsInN0YXR1cyI6ImFjdGl2ZSIsImlhdCI6MTcwNTg1NDMwMCwiZXhwIjoxNzA1OTQwNzAwfQ.signature"
    }
}
```

#### Error Responses

**400 Bad Request - Email no encontrado**

```json
{
    "error": "Email not found"
}
```

**400 Bad Request - Contraseña incorrecta**

```json
{
    "error": "Invalid password"
}
```

**400 Bad Request - Validación fallida**

```json
{
    "error": "Invalid email"
}
```

**400 Bad Request - Usuario inactivo**

```json
{
    "error": "Account is inactive"
}
```

---

### cURL Example

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@example.com",
    "password": "securePassword123"
  }'
```

---

### JWT Token Information

El token JWT incluye la siguiente información en su payload:

```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "juan.perez@example.com",
    "status": "active",
    "iat": 1705854300,
    "exp": 1705940700
}
```

### Uso del Token

Una vez obtenido el token, debe incluirse en las siguientes peticiones que requieran autenticación:

```bash
curl -X PUT http://localhost:3000/users/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json"
```

---

### Flujo de Proceso

1. **Validación de entrada**: Validar email y contraseña usando Zod schema
2. **Búsqueda de usuario**: Buscar usuario por email en la base de datos
3. **Verificación de existencia**: Confirmar que el usuario existe
4. **Verificación de estado**: Confirmar que el usuario está activo
5. **Comparación de contraseña**: Verificar contraseña usando bcrypt
6. **Generación de token**: Crear JWT con información del usuario
7. **Actualización de último login**: Registrar timestamp de acceso
8. **Respuesta**: Retornar usuario y token

---

### Seguridad del Token

#### Configuración JWT
- **Algoritmo**: HS256 (HMAC SHA-256)
- **Expiración**: 24 horas (configurable)
- **Secret**: Variable de entorno `TOKEN_JWT`
- **Payload**: ID, email, status del usuario

#### Mejores Prácticas
- Token expira automáticamente
- Secret debe ser seguro y único por ambiente
- Token incluye solo información esencial
- No incluye datos sensibles como contraseña

---

### Estados de Usuario

El login verifica que el usuario tenga estado válido:

| Estado | Descripción | Login Permitido |
|--------|-------------|-----------------|
| active | Usuario activo | ✅ Sí |
| inactive | Usuario inactivo | ❌ No |
| suspended | Usuario suspendido | ❌ No |
| deleted | Usuario eliminado | ❌ No |

---

### Notas de Seguridad

- ✅ Contraseñas comparadas usando bcrypt (timing-safe)
- ✅ Validación de formato de email
- ✅ Verificación de estado de usuario activo
- ✅ Token JWT con expiración configurada
- ✅ No exposición de información sensible en errores
- ✅ Actualización de timestamp de último login
- ⚠️ Considerar rate limiting para prevenir ataques de fuerza bruta
- ⚠️ Implementar bloqueo temporal tras múltiples intentos fallidos
- ⚠️ Considerar 2FA para usuarios con roles administrativos

### Mejores Prácticas Recomendadas

#### Rate Limiting
```bash
# Limitar intentos por IP
# Ejemplo: 5 intentos por minuto
```

#### Logs de Seguridad
- Registrar intentos de login fallidos
- Alertar sobre múltiples fallos consecutivos
- Auditar accesos administrativos

#### Rotación de Tokens
- Implementar refresh tokens
- Invalidar tokens en cambio de contraseña
- Permitir logout global (invalidar todos los tokens)

---

### Estados HTTP

| Código | Descripción                      |
| ------ | -------------------------------- |
| 200    | Login exitoso                    |
| 400    | Credenciales inválidas           |
| 401    | Email o contraseña incorrectos   |
| 403    | Cuenta inactiva o suspendida     |
| 429    | Demasiados intentos (rate limit) |
| 500    | Error interno del servidor       |