import { CustomError } from '../errors/custom.error';

export class UserEntity {
    constructor(
        public first_name: string,
        public last_name: string,
        public email: string,
        public password: string,
        public dni?: string,
        public number_phone?: string,
        public created_at?: Date,
        public updated_at?: Date,
        public id?: string,
        public avatar?: string,
        public status: 'admin' | 'customer' | 'employee' = 'customer'
    ) {}

    static createFromRegister(data: {
        first_name: string;
        last_name: string;
        email: string;
        password: string;
    }): UserEntity {
        const { first_name, last_name, email, password } = data;

        // 🔒 Validaciones mínimas de dominio
        if (!first_name) throw CustomError.badRequest('First name is required');
        if (!last_name) throw CustomError.badRequest('Last name is required');
        if (!email) throw CustomError.badRequest('Email is required');
        if (!password) throw CustomError.badRequest('Password is requiered');

        return new UserEntity(first_name, last_name, email, password);
    }
}
