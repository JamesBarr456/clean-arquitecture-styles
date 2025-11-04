# Update User API

## Endpoint: Update User

**URL:** `PATCH /users/:id`

**Descripción:** Actualiza parcialmente la información de un usuario específico. Solo los campos proporcionados serán actualizados.

**Autenticación:** No requerida (considerar implementar según requerimientos)

---

### URL Parameters

- **id**: `string` - ID único del usuario (UUID)

### Request Headers

```
Content-Type: application/json
```

### Request Body

```json
{
    "first_name": "string (opcional)",
    "last_name": "string (opcional)",
    "email": "string (opcional)",
    "password": "string (opcional)",
    "dni": "string (opcional)",
    "number_phone": "string (opcional)",
    "avatar": "string (opcional)",
    "role": "admin|customer|seller|cashier|warehouse (opcional)",
    "status": "active|inactive|suspended (opcional)"
}
```

#### Validaciones del Request Body

- **first_name**: String no vacío (si se proporciona)
- **last_name**: String no vacío (si se proporciona)
- **email**: Debe ser un email válido (si se proporciona)
- **password**: Mínimo 6 caracteres (si se proporciona) - será encriptada automáticamente
- **dni**: String (si se proporciona)
- **number_phone**: String con formato de teléfono (si se proporciona)
- **avatar**: URL válida (si se proporciona)
- **role**: Uno de los roles permitidos: `admin`, `customer`, `seller`, `cashier`, `warehouse`
- **status**: Uno de los estados permitidos: `active`, `inactive`, `suspended`

---

### Response Examples

#### Success Response (200 OK)

```json
{
    "message": "User updated",
    "payload": {
        "user_id": "550e8400-e29b-41d4-a716-446655440000",
        "first_name": "Juan Carlos",
        "last_name": "Pérez",
        "email": "juan.carlos.perez@example.com",
        "roles": ["customer"],
        "status": "active",
        "dni": "12345678",
        "phone": {
            "number": "1234567890",
            "country_code": ""
        },
        "avatar": "https://example.com/new-avatar.jpg",
        "created_at": "2024-01-15T10:30:00.000Z",
        "updated_at": "2024-01-21T16:45:00.000Z",
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

**400 Bad Request - Validación fallida**

```json
{
    "error": "Invalid email"
}
```

**400 Bad Request - Múltiples errores de validación**

```json
{
    "error": "First name is required; Invalid email"
}
```

---

### cURL Examples

**Actualizar nombre y email:**
```bash
curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Juan Carlos",
    "email": "juan.carlos.perez@example.com"
  }'
```

**Actualizar contraseña:**
```bash
curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newSecurePassword123"
  }'
```

**Cambiar rol y estado:**
```bash
curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin",
    "status": "active"
  }'
```

**Actualizar información de contacto:**
```bash
curl -X PATCH http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{
    "number_phone": "1234567890",
    "avatar": "https://example.com/new-avatar.jpg"
  }'
```

---

### Flujo de Proceso

1. **Validación de parámetros**: Verificar formato válido del ID del usuario
2. **Validación de datos**: Validar campos usando Zod schema
3. **Mapeo de datos**: Convertir DTO a formato de entidad (incluyendo conversión de tipos)
4. **Encriptación**: Hashear contraseña si se proporciona
5. **Mapeo de campos**: Convertir `number_phone` a estructura `phone`, `role` a `roles[]`
6. **Actualización**: Guardar cambios en base de datos con timestamp actualizado
7. **Respuesta**: Retornar usuario actualizado

---

### Campos Especiales

#### password
- Se encripta automáticamente usando bcrypt antes de guardar
- No se retorna en la respuesta por seguridad

#### number_phone
- Se mapea internamente al campo `phone` con estructura:
  ```json
  {
    "number": "1234567890",
    "country_code": ""
  }
  ```

#### role
- Se convierte internamente a array `roles: [role]`
- Mapeo de roles:
  - `employee` → `seller`
  - Otros roles se mantienen igual

#### updated_at
- Se actualiza automáticamente con timestamp actual

---

### Notas de Seguridad

- ✅ Contraseñas se encriptan automáticamente con bcrypt
- ✅ Validación estricta de todos los campos de entrada
- ✅ Actualización segura solo de campos proporcionados
- ✅ Timestamp de modificación automático
- ⚠️ Considerar autenticación para operaciones sensibles
- ⚠️ Validar permisos antes de cambiar roles o estados

### Estados HTTP

| Código | Descripción                      |
| ------ | -------------------------------- |
| 200    | Usuario actualizado exitosamente |
| 400    | Error de validación de datos     |
| 404    | Usuario no encontrado            |
| 500    | Error interno del servidor       |