import jwt from 'jsonwebtoken'
import { User } from '../../db/models/UserSchema.js';
import { HandleAuthorization } from '../auth/auth.controller.js';

export const userDetails = async (req, res) => {
    try {
        HandleAuthorization(req).then(async (response) => {
            if (response) {
                const userID = response.user.jwtdata.userId;
                const userData = await User.findOne({ 'UserId': userID })
                res.status(200).json({ message: 'User Details Fetched Successfully', user_details: userData })
            }
            else {
                res.status(422).json({ message: 'Invalid Signature' })
            }
        })
    }
    catch (err) {
        res.status(422).json({ message: err })
    }
}

export const updateUserDetails = async (req, res) => {
    try {
        HandleAuthorization(req).then(async (response) => {
            if (response) {
                const { id } = req.params
                console.log(id)
                const { FirstName, LastName, EmailId, MobileNo } = req.body;
                const updatedData = {
                    FirstName,
                    LastName,
                    EmailId,
                    MobileNo
                }
                const UserData = await User.findOneAndUpdate({ 'UserId': id }, updatedData)
                if (UserData) {
                    res.status(200).json({ message: 'Data Updated Successfully' })
                }
                else {
                    res.status(422).json({ message: 'Something went wrong' })
                }
            }
            else {
                res.status(422).json({ message: 'Invalid Signature' })
            }
        })

    }
    catch (err) {
        res.status(422).json({ message: err })
    }
}

export const deActivateAccount = async (req, res) => {
    try {
        const { password } = req.body;

        HandleAuthorization(req).then((response) => {
            if (response) {
                res.status(422).json({ message: response })
            }
            else {
                res.status(422).json({ message: 'Invalid Signature' })
            }
        })
    }
    catch (err) {
        res.status(422).json({ message: err.message })
    }
}