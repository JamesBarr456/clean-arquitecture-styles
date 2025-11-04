# Register User API

## Endpoint: Register User

**URL:** `POST /users/register`

**Descripción:** Registra un nuevo usuario en el sistema con validación de datos y encriptación de contraseña.

**Autenticación:** No requerida

---

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "password": "string",
    "dni": "string (opcional)",
    "number_phone": "string (opcional)",
    "avatar": "string (opcional)"
}
```

#### Validaciones del Request Body

- **first_name**: Requerido, string no vacío
- **last_name**: Requerido, string no vacío
- **email**: Requerido, debe ser un email válido y único en el sistema
- **password**: Requerido, mínimo 6 caracteres (será encriptada automáticamente)
- **dni**: Opcional, documento de identidad
- **number_phone**: Opcional, número de teléfono
- **avatar**: Opcional, URL de imagen de perfil

---

### Response Examples

#### Success Response (201 Created)

```json
{
    "message": "Register successful",
    "payload": {
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "first_name": "Juan",
        "last_name": "Pérez",
        "email": "juan.perez@example.com",
        "roles": ["customer"],
        "status": "active",
        "dni": "12345678",
        "phone": {
            "number": "1234567890",
            "country_code": ""
        },
        "avatar": "https://example.com/avatar.jpg",
        "created_at": "2024-01-21T16:45:00.000Z",
        "updated_at": "2024-01-21T16:45:00.000Z",
        "last_login": null
    }
}
```

#### Error Responses

**400 Bad Request - Validación fallida**

```json
{
    "error": "Email is required"
}
```

**400 Bad Request - Email ya existe**

```json
{
    "error": "Email already exists"
}
```

**400 Bad Request - Múltiples errores**

```json
{
    "error": "First name is required; Invalid email; Password must be at least 6 characters"
}
```

---

### cURL Example

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan.perez@example.com",
    "password": "securePassword123",
    "dni": "12345678",
    "number_phone": "1234567890",
    "avatar": "https://example.com/avatar.jpg"
  }'
```

---

### Flujo de Proceso

1. **Validación de entrada**: Validar todos los campos usando Zod schema
2. **Verificación de unicidad**: Comprobar que el email no existe en el sistema
3. **Encriptación**: Hashear la contraseña usando bcrypt
4. **Creación de entidad**: Crear instancia de UserEntity con valores por defecto
5. **Guardado en BD**: Persistir nuevo usuario en la base de datos
6. **Respuesta**: Retornar usuario creado (sin contraseña)

---

### Valores por Defecto

Al crear un usuario, se asignan automáticamente:

- **user_id**: UUID generado automáticamente
- **roles**: `["customer"]` (rol por defecto)
- **status**: `"active"` (estado por defecto)
- **created_at**: Timestamp actual
- **updated_at**: Timestamp actual
- **last_login**: `null`
- **phone.country_code**: String vacío si no se especifica

---

### Validaciones Detalladas

#### email
- Formato de email válido
- Único en el sistema
- Requerido
- Se convierte a minúsculas automáticamente

#### password
- Mínimo 6 caracteres
- Se encripta con bcrypt (salt rounds: 10)
- No se retorna en respuestas por seguridad

#### first_name / last_name
- Strings no vacíos
- Requeridos
- Se almacenan tal como se envían

#### Campos opcionales
- **dni**: Se almacena como string vacío si no se proporciona
- **number_phone**: Se mapea a estructura phone interna
- **avatar**: URL de imagen de perfil

---

### Notas de Seguridad

- ✅ Contraseñas encriptadas con bcrypt antes del almacenamiento
- ✅ Validación estricta de formato de email
- ✅ Verificación de unicidad de email
- ✅ UUID generado automáticamente para prevenir enumeración
- ✅ Contraseña nunca se retorna en respuestas
- ✅ Rol por defecto seguro (customer)
- ⚠️ Considerar implementar verificación de email
- ⚠️ Considerar rate limiting para prevenir spam de registros

### Mejores Prácticas

#### Validación de Contraseña Fuerte (Recomendado)
Considerar implementar validaciones adicionales:
- Mínimo 8 caracteres
- Al menos una mayúscula
- Al menos una minúscula  
- Al menos un número
- Al menos un carácter especial

#### Verificación de Email (Recomendado)
```json
{
    "status": "pending_verification",
    "email_verification_token": "generated_token",
    "email_verification_expires": "timestamp"
}
```

#### Prevención de Spam
- Implementar rate limiting por IP
- Validar que el email no sea temporal/desechable
- Captcha para registros automatizados

---

### Estados HTTP

| Código | Descripción                      |
| ------ | -------------------------------- |
| 201    | Usuario registrado exitosamente  |
| 400    | Error de validación de datos     |
| 409    | Conflicto (email ya existe)      |
| 429    | Demasiadas solicitudes (rate limit) |
| 500    | Error interno del servidor       |