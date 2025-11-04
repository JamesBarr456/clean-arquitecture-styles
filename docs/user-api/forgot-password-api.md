# Forgot Password API

## Endpoint: Forgot Password

**URL:** `POST /auth/forgot-password`

**Descripción:** Permite a un usuario solicitar un restablecimiento de contraseña cuando la haya olvidado. Genera un token temporal que puede ser usado para restablecer la contraseña.

**Autenticación:** No requerida (endpoint público)

---

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
    "email": "string"
}
```

#### Validaciones del Request Body

- **email**: Requerido, debe ser un formato de email válido
- Se normaliza automáticamente (trim, lowercase)

---

### Response Examples

#### Success Response (200 OK)

```json
{
    "message": "Si el email está registrado, recibirás un enlace para restablecer tu contraseña"
}
```

**Nota de Desarrollo:** En modo desarrollo/testing se incluye el token:

```json
{
    "message": "Si el email está registrado, recibirás un enlace para restablecer tu contraseña",
    "token": "a3f5e2"
}
```

#### Error Responses

**400 Bad Request - Email inválido**

```json
{
    "error": "Formato de email inválido"
}
```

**400 Bad Request - Email requerido**

```json
{
    "error": "Email requerido"
}
```

---

### cURL Example

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

---

### Flujo de Proceso

1. **Validación de entrada**: Verificar formato de email y normalizar
2. **Búsqueda de usuario**: Buscar usuario por email en la base de datos
3. **Verificación de estado**: Confirmar que el usuario esté activo
4. **Generación de token**: Crear token de 6 caracteres hexadecimales
5. **Establecer expiración**: Token válido por 60 minutos
6. **Actualización BD**: Guardar token y fecha de expiración
7. **Respuesta**: Mensaje genérico por seguridad

---

### Características de Seguridad

#### 🔒 **Protecciones Implementadas**

- ✅ **Respuesta genérica**: Siempre devuelve el mismo mensaje exitoso
- ✅ **No revela información**: No indica si el email existe o no
- ✅ **Solo usuarios activos**: Solo genera tokens para usuarios con status 'active'
- ✅ **Token temporal**: Expira automáticamente en 60 minutos
- ✅ **Token único**: Se genera nuevo token en cada solicitud
- ✅ **Normalización**: Email se convierte a lowercase y trim automáticamente

#### 📧 **En Producción**

- El token debería enviarse por email al usuario
- No devolver el token en la respuesta
- Implementar rate limiting para prevenir spam
- Considerar CAPTCHA para prevenir ataques automatizados

---

### Casos de Uso

| Escenario                        | Comportamiento                   |
| -------------------------------- | -------------------------------- |
| Email existente y usuario activo | Genera token y actualiza BD      |
| Email no registrado              | Devuelve mensaje genérico        |
| Usuario inactivo/suspendido      | Devuelve mensaje genérico        |
| Email con formato inválido       | Error 400 con mensaje específico |
| Email vacío                      | Error 400 con mensaje específico |

### Estados HTTP

| Código | Descripción                            |
| ------ | -------------------------------------- |
| 200    | Solicitud procesada (mensaje genérico) |
| 400    | Error de validación                    |
| 500    | Error interno del servidor             |

---

### Datos Almacenados

En la base de datos se actualizan los siguientes campos del usuario:

```typescript
{
    reset_password_token: "a3f5e2",           // Token de 6 caracteres hex
    reset_password_expires: "2024-10-22T15:30:00Z",  // Fecha de expiración
    updated_at: "2024-10-22T14:30:00Z"       // Timestamp de actualización
}
```

### Próximo Paso

Después de recibir el token (por email en producción), el usuario puede usar el endpoint `POST /auth/reset-password` para establecer una nueva contraseña.
