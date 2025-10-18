## 📅 2025-06-24

### 🧠 Pensamientos del día

- Tener que hacer una memoria de los avances respecto al clean arquithecture

### 🛠️ Lo que hice

- Empecé a registrar mis ideas con estructura.
- Vi que Markdown es más útil que `.txt` puro.
- En el domain cree la carpeta entities donde tengo alojado la entidad de `user`
- En dicha entidad tengo un metodo para el registro que verifica los campos necesarios (proximo paso seria quitar esta responsabilidad y darselo a un DTO)
- En `infraestructure` --> tengo la carpeta de mongo donde alojé el modelo de user.
- Cree el `repository` de domain para user, los repository serian `contratos` que pueden ser interfaces o abstract class definiendo qué métodos existen, qué parámetros aceptan y qué devuelven.
- `use-cases/**`: Acciones que se pueden ejecutar dentro del sistema (crear usuario, registrar producto, etc.).
- Ya se encuentra implementado el repositorio de presentation.
- Se encuentra funcionando las rutas de auth y controladores.

### 💡 Tareas a realizar

- Mover validaciones de UserEntity a DTOs
- Implementar sistema de órdenes/pedidos
- Agregar paginación a productos
- Sistema de imágenes (upload)
- Tests unitarios e integración

---

## 📅 2025-10-18

### 🧠 Estado del Proyecto

**Branch actual**: `feature/entitie-cart` (con cambios sin commitear)

### 🎯 Arquitectura Implementada

El proyecto sigue **Clean Architecture** con 4 capas:

1. **Domain** - Entidades, contratos de repositorios y datasources
2. **Application** - Casos de uso y DTOs con validación Zod
3. **Infrastructure** - Implementaciones con MongoDB, Bcrypt, JWT
4. **Presentation** - Controllers, Routes, Middlewares (Express)

### ✅ Funcionalidades Completas

#### 1. **Autenticación (AUTH)**

- ✅ `POST /auth/register` - Registro con hash bcrypt
- ✅ `POST /auth/login` - Login con JWT
- ✅ Middleware de autenticación JWT implementado
- ✅ DTOs con validación Zod

#### 2. **Usuarios (USERS)**

- ✅ CRUD completo con validaciones
- ✅ `GET /users` - Listar con paginación opcional
- ✅ `GET /users/:id` - Obtener por ID
- ✅ `PATCH /users/:id` - Actualización parcial
- ✅ `DELETE /users/:id` - Eliminar
- ✅ Roles: admin, customer, employee

#### 3. **Productos (PRODUCTS)**

- ✅ CRUD completo implementado
- ✅ Sistema de descuentos (has_discount, discount_percentage)
- ✅ Gestión de stock, imágenes, categorías
- ✅ Soporte para tallas y géneros (arrays)
- ✅ DTOs para create, update, getAll

### 🚧 En Desarrollo

#### 4. **Carrito de Compras (CART)**

**Archivos creados** (sin commit):

```
✅ src/domain/entities/cart.entity.ts
✅ src/domain/datasources/cart.datasource.ts
✅ src/domain/repositories/cart.repository.ts
✅ src/application/use-cases/cart/
   ├── add.item.cart.use.cases.ts
   ├── get.cart.use.cases.ts
   ├── delete.cart.use.cases.ts
   └── index.ts
✅ src/infraestructure/database/cart.datasource.impl.ts
✅ src/infraestructure/database/mongo/models/cart.model.ts
✅ src/infraestructure/repositories/cart.repository.impl.ts
✅ src/presentation/controllers/cart.controller.ts
✅ src/presentation/routes/cart.routes.ts
✅ src/presentation/middlewares/auth.middleware.ts
```

**Funcionalidad del CartEntity**:

- `addItem()` - Agrega producto con cálculo automático de descuentos
- `updateQuantity()` - Modifica cantidad de un ítem
- `removeItem()` - Elimina producto del carrito
- `updateTotals()` - Recalcula totales automáticamente

**Integración**: El carrito consulta ProductRepository para validar productos y obtener precios.

### ⚠️ Pendientes Críticos

#### Backend - Antes de integrar con Frontend

- [ ] **Registrar rutas de Cart en `routes.ts`**

    ```typescript
    import { Cartroutes } from './cart.routes';
    router.use('/cart', Cartroutes.routes);
    ```

- [ ] **Aplicar middleware de auth a rutas protegidas**

    - Cart routes necesitan autenticación
    - Users routes necesitan autenticación
    - Products routes (create, update, delete) necesitan autenticación

- [ ] **Crear DTOs para Cart**

    - add-item.cart.dto.ts
    - update-quantity.cart.dto.ts
    - Validación con Zod

- [ ] **Corregir método getCart en controller**

    - Actualmente usa `id` por parámetro
    - Debería usar `userId` del token JWT

- [ ] **Hacer commit de la funcionalidad del carrito**

#### Frontend - Para integración futura

- [ ] Crear servicio de autenticación
- [ ] Implementar almacenamiento de tokens (localStorage/cookies)
- [ ] Crear contexto de autenticación (React/Vue)
- [ ] Agregar interceptor para peticiones autenticadas
- [ ] Implementar rutas protegidas en el frontend
- [ ] Manejar expiración de tokens
- [ ] Crear componentes de carrito

### 🛠️ Stack Tecnológico

**Backend:**

- Express 5.1.0
- TypeScript 5.8.3
- MongoDB 6.0.6 (Docker)
- Mongoose 8.16.0
- Bcrypt 6.0.0
- JWT 9.0.2
- Zod 3.25.67

**Herramientas:**

- ts-node-dev (hot reload)
- Prettier (formateo)
- Docker Compose

### 📊 Estado del Repositorio

- **Último commit**: `71ed73a` - "optimice: auth and user files"
- **Archivos modificados**: 8 (índices de exportación)
- **Archivos nuevos**: 10 (funcionalidad cart completa)
- **Estado**: Listo para commit y merge después de pruebas

### 🎯 Próximos Pasos

1. Completar pendientes del carrito en backend
2. Hacer commit de la feature
3. Revisar sistema de auth antes de integrar con frontend
4. Documentar endpoints con ejemplos de peticiones
5. Preparar documentación para el frontend

---
