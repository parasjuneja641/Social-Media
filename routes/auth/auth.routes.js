import express from 'express';
import { SigninUser, SignupUser, handleVerify, resetPassword, updatePassword, verifyToken } from '../../controller/auth/auth.controller.js';
const router = express.Router()

router.post('/signin', async (req, res) => {
    return await SigninUser(req, res)

})
router.post('/signup', async (req, res) => {
    return await SignupUser(req, res)

})
router.patch('/verify_user', async (req, res) => {
    return await handleVerify(req, res)
})
router.patch('/update_password', async (req, res) => {
    return await updatePassword(req, res)
})
router.post('/token_check', async (req, res) => {
    return await verifyToken(req, res)
})
router.post('/reset_password', async (req, res) => {
    return await resetPassword(req, res)
})

// router.
export default router;