# Get All Users API

## Endpoint: Get All Users

**URL:** `GET /users`

**Descripción:** Obtiene una lista paginada de usuarios con opciones de filtrado y ordenamiento.

**Autenticación:** No requerida

---

### Query Parameters

- **status**: `string` (opcional) - Filtrar por estado: `admin`, `employee`, `customer`
- **first_name**: `string` (opcional) - Filtrar por nombre (búsqueda parcial)
- **last_name**: `string` (opcional) - Filtrar por apellido (búsqueda parcial)
- **page**: `number` (opcional) - Número de página (default: 1, min: 1)
- **sortBy**: `string` (opcional) - Campo por el cual ordenar (default: `createdAt`)
- **order**: `string` (opcional) - Orden: `asc` o `desc` (default: `asc`)

### Request Headers

```
Content-Type: application/json
```

---

### Response Examples

#### Success Response (200 OK)

```json
{
    "message": "Users found",
    "payload": [
        {
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
        },
        {
            "user_id": "550e8400-e29b-41d4-a716-446655440001",
            "first_name": "María",
            "last_name": "González",
            "email": "maria.gonzalez@example.com",
            "roles": ["admin"],
            "status": "active",
            "dni": "87654321",
            "phone": {
                "number": "0987654321",
                "country_code": "+54"
            },
            "avatar": null,
            "created_at": "2024-01-10T08:15:00.000Z",
            "updated_at": "2024-01-18T16:30:00.000Z",
            "last_login": "2024-01-21T07:45:00.000Z"
        }
    ]
}
```

#### Error Responses

**400 Bad Request - Parámetros inválidos**

```json
{
    "error": "Invalid query parameters"
}
```

**404 Not Found - No se encontraron usuarios**

```json
{
    "message": "Users not found"
}
```

---

### cURL Examples

**Obtener todos los usuarios (primera página):**
```bash
curl -X GET http://localhost:3000/users \
  -H "Content-Type: application/json"
```

**Filtrar usuarios por estado y ordenar por nombre:**
```bash
curl -X GET "http://localhost:3000/users?status=admin&sortBy=first_name&order=asc" \
  -H "Content-Type: application/json"
```

**Paginación - segunda página:**
```bash
curl -X GET "http://localhost:3000/users?page=2" \
  -H "Content-Type: application/json"
```

**Búsqueda por nombre y apellido:**
```bash
curl -X GET "http://localhost:3000/users?first_name=Juan&last_name=Pérez" \
  -H "Content-Type: application/json"
```

---

### Flujo de Proceso

1. **Validación de parámetros**: Validar query parameters usando Zod schema
2. **Construcción de filtros**: Crear objeto UserFilterOptions con defaults
3. **Consulta a BD**: Ejecutar consulta con filtros, paginación y ordenamiento
4. **Respuesta**: Retornar lista de usuarios (sin datos sensibles)

---

### Parámetros de Validación

#### status
- **Valores permitidos**: `admin`, `employee`, `customer`
- **Opcional**: Sí
- **Ejemplo**: `?status=admin`

#### first_name / last_name
- **Tipo**: String no vacío
- **Opcional**: Sí
- **Búsqueda**: Parcial/contiene
- **Ejemplo**: `?first_name=Juan`

#### page
- **Tipo**: Número positivo
- **Mínimo**: 1
- **Default**: 1
- **Ejemplo**: `?page=2`

#### sortBy
- **Tipo**: String
- **Default**: `createdAt`
- **Campos sugeridos**: `first_name`, `last_name`, `email`, `created_at`, `updated_at`
- **Ejemplo**: `?sortBy=first_name`

#### order
- **Valores permitidos**: `asc`, `desc`
- **Default**: `asc`
- **Ejemplo**: `?order=desc`

---

### Notas de Seguridad

- ✅ No se exponen contraseñas ni tokens sensibles
- ✅ Validación estricta de parámetros de entrada
- ✅ Paginación para evitar sobrecarga de datos
- ⚠️ Endpoint público - considerar autenticación según requerimientos
- ⚠️ Considerar límites de rate limiting para prevenir abuso

### Estados HTTP

| Código | Descripción                      |
| ------ | -------------------------------- |
| 200    | Usuarios encontrados exitosamente |
| 400    | Parámetros de consulta inválidos |
| 404    | No se encontraron usuarios       |
| 500    | Error interno del servidor       |