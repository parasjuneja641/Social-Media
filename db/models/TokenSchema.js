import mongoose from "mongoose";

const Token = mongoose.Schema({
    token_id: {
        type: 'string',
        required: true,
        expireIn: '10m'
    },
    user_id: {
        type: 'string',
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }
})
export const TokenSchema = mongoose.model('TokenSchema', Token)
