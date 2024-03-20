import mongoose from "mongoose";

const PasswordSchema = mongoose.Schema({
    UserId: {
        type: 'string',
        ref: 'User'
    },
    EmailId: {
        type: 'String',
        required: true
    },
    isActive: {
        type: 'Boolean',
        required: true
    },
    Password: {
        type: 'String',
        required: true
    }
})

export const PasswordSchemas = mongoose.model("PasswordSchemas", PasswordSchema);
