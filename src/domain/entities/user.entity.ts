import { UserRole, UserStatus } from "../types/user.type";


export class UserEntity {
    constructor(
        public first_name: string,
        public last_name: string,
        public email: string,
        public password: string,
        public role: UserRole = 'customer',
        public status: UserStatus = 'active',
        public id?: string,
        public dni?: string,
        public phone?: { number: string; country_code: string },
        public avatar?: string,
        public created_at?: Date,
        public updated_at?: Date,
        public last_login?: Date,
    ) {}

}
