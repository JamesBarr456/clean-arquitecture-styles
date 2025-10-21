/**
 * Define los roles disponibles en el sistema.
 * Un usuario puede tener múltiples roles simultáneamente.
 * - admin: Acceso completo al sistema
 * - customer: Cliente regular
 * - seller: Vendedor con acceso a gestión de ventas
 * - cashier: Cajero con acceso a operaciones de caja
 * - warehouse: Acceso a gestión de inventario
 */
export type UserRole = 'admin' | 'customer' | 'seller' | 'cashier' | 'warehouse';

/**
 * Define los estados posibles de una cuenta de usuario
 */
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'blocked';
