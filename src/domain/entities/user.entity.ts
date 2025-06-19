import { CustomError } from "../errors/custom.error";

export class UserEntity {
    constructor(
        public first_name: string,
        public last_name: string,
        public email: string,
        public password: string,
        public dni?: string,
        public number_phone?: string,
        public created_at?: Date,
        public update_at? : Date,
        public id?: string,
        public avatar?: string,
    ){}

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
        if (!password || password.length < 6)
          throw CustomError.badRequest('Password must be at least 6 characters');

    
        return new UserEntity(
          first_name,
          last_name,
          email,
          password,            // aún sin hashear, lo podés hacer luego
        );
      }

}