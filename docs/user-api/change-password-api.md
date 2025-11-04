# Change Password API

## Endpoint: Change Password

**URL:** `PUT /auth/change-password`

**Descripción:** Permite a un usuario autenticado cambiar su contraseña actual por una nueva.

**Autenticación:** Requerida (Bearer Token)

---

### Request Headers

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
    "currentPassword": "string",
    "newPassword": "string",
    "confirmPassword": "string"
}
```

#### Validaciones del Request Body

- **currentPassword**: Requerido, string no vacío
- **newPassword**: Requerido, debe cumplir:
    - Mínimo 8 caracteres
    - Al menos una letra minúscula
    - Al menos una letra mayúscula
    - Al menos un número
    - Al menos un carácter especial (!@#$%^&\*)
    - Debe ser diferente a la contraseña actual
- **confirmPassword**: Requerido, debe coincidir exactamente con newPassword

---

### Response Examples

#### Success Response (200 OK)

```json
{
    "message": "Contraseña actualizada exitosamente"
}
```

#### Error Responses

**401 Unauthorized - Token no proporcionado**

```json
{
    "error": "Token no proporcionado"
}
```

**401 Unauthorized - Token inválido**

```json
{
    "error": "Token inválido"
}
```

**400 Bad Request - Validación fallida**

```json
{
    "error": "Las contraseñas no coinciden"
}
```

**400 Bad Request - Contraseña actual incorrecta**

```json
{
    "error": "Contraseña actual incorrecta"
}
```

**400 Bad Request - Contraseña débil**

```json
{
    "error": "La nueva contraseña debe tener al menos 8 caracteres.; Debe contener al menos una letra mayúscula."
}
```

**404 Not Found - Usuario no encontrado**

```json
{
    "error": "Usuario no encontrado"
}
```

---

### cURL Example

```bash
curl -X PUT http://localhost:3000/auth/change-password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "MyOldPassword123!",
    "newPassword": "MyNewSecurePassword456@",
    "confirmPassword": "MyNewSecurePassword456@"
  }'
```

---

### Flujo de Proceso

1. **Autenticación**: Verificar JWT token válido
2. **Validación de entrada**: Validar formato y reglas de contraseña
3. **Búsqueda de usuario**: Encontrar usuario por ID del token
4. **Verificación**: Comparar contraseña actual con la hasheada almacenada
5. **Encriptación**: Hashear la nueva contraseña
6. **Actualización**: Guardar nueva contraseña hasheada en BD
7. **Respuesta**: Confirmar cambio exitoso

---

### Notas de Seguridad

- ✅ La contraseña actual debe ser verificada antes del cambio
- ✅ Las contraseñas se almacenan hasheadas con bcrypt
- ✅ La nueva contraseña debe cumplir políticas de seguridad
- ✅ Requiere autenticación JWT válida
- ✅ Se actualiza timestamp de modificación del usuario
- ✅ No se expone información sensible en respuestas de error

### Estados HTTP

| Código | Descripción                                 |
| ------ | ------------------------------------------- |
| 200    | Contraseña cambiada exitosamente            |
| 400    | Error de validación o contraseña incorrecta |
| 401    | No autenticado o token inválido             |
| 404    | Usuario no encontrado                       |
| 500    | Error interno del servidor                  |
