# Delete User API

## Endpoint: Delete User

**URL:** `DELETE /users/:id`

**Descripción:** Elimina permanentemente un usuario específico del sistema mediante su ID único.

**Autenticación:** No requerida (considerar implementar según requerimientos)

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
    "message": "User deleted"
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
curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

---

### Flujo de Proceso

1. **Validación de parámetros**: Verificar formato válido del ID
2. **Verificación de existencia**: Confirmar que el usuario existe
3. **Eliminación**: Remover usuario de la base de datos
4. **Confirmación**: Verificar que la eliminación fue exitosa
5. **Respuesta**: Confirmar eliminación

---

### Consideraciones Importantes

#### ⚠️ Eliminación Permanente
- Esta operación es **IRREVERSIBLE**
- Se recomienda implementar soft delete en lugar de eliminación física
- Considerar backup antes de eliminaciones masivas

#### ⚠️ Integridad Referencial
- Verificar referencias a este usuario en otras entidades
- Considerar qué hacer con datos relacionados:
  - Órdenes del usuario
  - Historiales de actividad
  - Comentarios o reviews
  - Sesiones activas

#### ⚠️ Seguridad
- **MUY IMPORTANTE**: Implementar autenticación y autorización
- Solo administradores deberían poder eliminar usuarios
- Considerar confirmación adicional para cuentas importantes
- Auditar todas las eliminaciones

---

### Mejores Prácticas Recomendadas

#### Soft Delete (Recomendado)
En lugar de eliminar físicamente, considerar:
```json
{
    "status": "deleted",
    "deleted_at": "2024-01-21T16:45:00.000Z",
    "deleted_by": "admin_user_id"
}
```

#### Confirmación de Eliminación
Implementar endpoint de confirmación:
```bash
# Paso 1: Solicitar eliminación
POST /users/:id/delete-request

# Paso 2: Confirmar con token
DELETE /users/:id/confirm?token=deletion_token
```

#### Backup de Datos
Antes de eliminar, respaldar información:
```json
{
    "backup_id": "backup_uuid",
    "user_data": { ... },
    "deleted_at": "timestamp",
    "deleted_by": "admin_id"
}
```

---

### Implementación de Seguridad Sugerida

```bash
# Con autenticación de administrador
curl -X DELETE http://localhost:3000/users/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer admin_jwt_token" \
  -H "Content-Type: application/json" \
  -H "X-Confirm-Delete: true"
```

---

### Estados HTTP

| Código | Descripción                    |
| ------ | ------------------------------ |
| 200    | Usuario eliminado exitosamente |
| 400    | ID de usuario inválido         |
| 401    | No autorizado (sin token)      |
| 403    | Prohibido (sin permisos)       |
| 404    | Usuario no encontrado          |
| 409    | Conflicto (referencias activas) |
| 500    | Error interno del servidor     |

---

### Notas de Seguridad

- 🔴 **CRÍTICO**: Implementar autenticación obligatoria
- 🔴 **CRÍTICO**: Verificar permisos de administrador
- 🔴 **CRÍTICO**: Auditar todas las eliminaciones
- ⚠️ Considerar soft delete en lugar de eliminación física
- ⚠️ Implementar confirmación adicional para operaciones críticas
- ⚠️ Verificar integridad referencial antes de eliminar
- ✅ Validar formato de UUID antes de procesar