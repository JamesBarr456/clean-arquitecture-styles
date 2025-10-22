import { UserPhone, UserRole, UserStatus } from '../types/user.type';

import { randomUUID } from 'crypto';

export class UserEntity {
    constructor(
        public first_name: string,
        public last_name: string,
        public email: string,
        public password: string,
        public roles: UserRole[],
        public status: UserStatus,
        public readonly user_id?: string,
        public dni?: string,
        public phone?: UserPhone,
        public avatar?: string,
        public readonly created_at?: Date,
        public updated_at?: Date,
        public last_login?: Date,
        public reset_password_token?: string,
        public reset_password_expires?: Date
    ) {}
    // Métodos de negocio
    hasRole(role: UserRole): boolean {
        return this.roles.includes(role);
    }
    private touch(): void {
        this.updated_at = new Date();
    }
    addRole(role: UserRole): void {
        if (!this.hasRole(role)) {
            this.roles.push(role);
            this.touch();
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

    // Métodos para manejo de reset password
    setResetPasswordToken(token: string, expiresInMinutes: number = 60): void {
        this.reset_password_token = token;
        this.reset_password_expires = new Date(Date.now() + expiresInMinutes * 60 * 1000);
        this.touch();
    }

    clearResetPasswordToken(): void {
        this.reset_password_token = undefined;
        this.reset_password_expires = undefined;
        this.touch();
    }

    isResetPasswordTokenValid(token: string): boolean {
        if (!this.reset_password_token || !this.reset_password_expires) {
            return false;
        }

        return this.reset_password_token === token && this.reset_password_expires > new Date();
    }

    // Factory method
    static create(props: {
        email: string;
        password: string;
        first_name?: string;
        last_name?: string;
        dni?: string;
        roles?: UserRole[];
        status?: UserStatus;
        phone?: UserPhone;
        avatar?: string;
    }): UserEntity {
        return new UserEntity(
            props.first_name || '',
            props.last_name || '',
            props.email,
            props.password,
            props.roles || ['customer'], // Por defecto es customer
            props.status || 'active', // Por defecto es active
            randomUUID(),
            props.dni || '',
            props.phone || { country_code: '', number: '' },
            props.avatar || '',
            new Date(), // created_at
            new Date(), // updated_at
            undefined // last_login
        );
    }
}
