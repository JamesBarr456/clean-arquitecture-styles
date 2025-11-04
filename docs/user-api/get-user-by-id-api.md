# Get User By ID API

## Endpoint: Get User By ID

**URL:** `GET /users/:id`

**Descripción:** Obtiene la información detallada de un usuario específico mediante su ID único.

**Autenticación:** No requerida

---

### URL Parameters

- **id**: `string` - ID único del usuario (UUID)

### Request Headers

```
Content-Type: application/json
```

---

### Response Examples

#### Success Response (200 OK)

```json
{
    "message": "User found",
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
            "country_code": "+54"
        },
        "avatar": "https://example.com/avatar.jpg",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-20T14:45:00.000Z",
        "last_login": "2024-01-20T09:15:00.000Z"
    }
}
```

#### Error Responses

**404 Not Found - Usuario no encontrado**

```json
{
    "message": "User not found"
}
```

**400 Bad Request - ID inválido**

```json
{
    "error": "Invalid user ID format"
}
```

---

### cURL Example

```bash
curl -X GET http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

---

### Flujo de Proceso

1. **Validación de parámetros**: Verificar formato válido del ID
2. **Búsqueda en BD**: Buscar usuario por ID único
3. **Verificación de existencia**: Confirmar que el usuario existe
4. **Respuesta**: Retornar información del usuario (sin datos sensibles)

---

### Notas de Seguridad

- ✅ No se expone información sensible como contraseñas
- ✅ No se exponen tokens de recuperación de contraseña
- ✅ ID debe ser un UUID válido
- ⚠️ Endpoint público - considerar autenticación según requerimientos

### Estados HTTP

| Código | Descripción                    |
| ------ | ------------------------------ |
| 200    | Usuario encontrado exitosamente |
| 400    | ID de usuario inválido         |
| 404    | Usuario no encontrado          |
| 500    | Error interno del servidor     |