import mongoose from "mongoose";


const UserSchema = mongoose.Schema({
    UserId: {
        type: 'string',
        ref: 'PasswordSchemas'
    },
    FirstName: {
        type: 'string',
        required: true
    },
    LastName: {
        type: 'string',
        required: true
    },
    EmailId: {
        type: 'string',
        required: true,

    },
    MobileNo: {
        type: 'string',
        required: true
    },
    isVerified: {
        type: 'boolean',
        required: true
    },
    isDeleted: {
        type: 'boolean',
        required: true
    }
})

export const User = mongoose.model("User", UserSchema)
