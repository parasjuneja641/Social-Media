import express from 'express'
import { deActivateAccount, updateUserDetails, userDetails } from '../../controller/user/user.controller.js'

const router = express.Router()

router.get('/user_details', userDetails)
router.patch('/update/user_details/:id', updateUserDetails)
router.patch('/deActivate_account', deActivateAccount)

export default router