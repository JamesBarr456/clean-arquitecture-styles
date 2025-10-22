import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    dni: {
        type: String,
        default: '',
    },
    phone: {
        country_code: {
            type: String,
            default: '',
        },
        number: {
            type: String,
            default: '',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: '',
    },
    roles: {
        type: [String],
        enum: ['admin', 'customer', 'seller', 'cashier', 'warehouse'],
        default: ['customer'],
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended', 'blocked'],
        default: 'active',
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    updated_at: {
        type: Date,
        default: Date.now,
    },
    last_login: {
        type: Date,
        default: null,
    },
    reset_password_token: {
        type: String,
        default: null,
    },
    reset_password_expires: {
        type: Date,
        default: null,
    },
});

export const UserModel = mongoose.model('User', userSchema);
