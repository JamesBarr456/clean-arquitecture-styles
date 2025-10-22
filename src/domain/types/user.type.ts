export type UserRole = 'admin' | 'customer' | 'seller' | 'cashier' | 'warehouse';
export type UserStatus = 'active' | 'inactive' | 'suspended';
export type UserPhone = { number: string; country_code: string }; 