import { UserPhone, UserRole, UserStatus } from "../types/user.type";


export class UserEntity {
    constructor(
        public first_name: string,
        public last_name: string,
        public email: string,
        public password: string,
        public roles: UserRole[],
        public status: UserStatus,
        public readonly id?: string,
        public dni?: string,
        public phone?: UserPhone,
        public avatar?: string,
        public readonly created_at?: Date,
        public updated_at?: Date,
        public last_login?: Date
    ) {}
// Métodos de negocio
  hasRole(role: UserRole): boolean {
    return this.roles.includes(role);
  }

  addRole(role: UserRole): void {
    if (!this.hasRole(role)) {
      this.roles.push(role);
      this.updated_at = new Date();
    }
  }

  removeRole(role: UserRole): void {
    this.roles = this.roles.filter(r => r !== role);
    this.updated_at = new Date();
  }

  getPassword(): string {
    return this.password;
  }

  updatePassword(newPassword: string): void {
    this.password = newPassword;
    this.updated_at = new Date();
  }

  getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  // Factory method
  static create(props: {
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    password: string;
    roles?: UserRole[];
    status?: UserStatus;
    phone?: UserPhone;
    avatar?: string;
  }): UserEntity {
    return new UserEntity(
      props.first_name,
      props.last_name,
      props.email,
      props.password,
      props.roles || ['customer'], // Por defecto es customer
      props.status || 'active',    // Por defecto es active
      undefined,                   // id será generado por MongoDB
      props.dni,
      props.phone,
      props.avatar,
      undefined,                  // created_at
      undefined                   // updated_at
    );
  }
}
