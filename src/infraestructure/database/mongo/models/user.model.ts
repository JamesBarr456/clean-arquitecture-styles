import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: 
        {
            type: String,
            required: true  
    },
    dni: {
        type: String,
        default: ""
    },
    number_phone: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
})

export const UserModel = mongoose.model("User", userSchema)