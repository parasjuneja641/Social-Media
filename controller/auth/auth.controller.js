import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../../db/models/UserSchema.js';
import { PasswordSchemas } from '../../db/models/PasswordSchema.js';
import { UserEmail } from '../../utils/sendEmail.js';
import { TokenSchema } from '../../db/models/TokenSchema.js';
import { uuidv4 } from '../../utils/Uuidv4Generator.js';

export const SigninUser = async (req, res) => {
    try {
        const { EmailId, Password } = req.body;
        const isExist = await User.findOne({ 'EmailId': EmailId })
        if (isExist) {
            if (isExist.isVerified) {
                const isPassword = await PasswordSchemas.findOne({ 'UserId': isExist.UserId, isActive: true })
                const correctPassword = await bcrypt.compare(Password, isPassword.Password)
                const jwtdata = {
                    userId: isExist.UserId,
                    UserName: `${isExist.FirstName} ${isExist.LastName}`,
                }
                const payload = {
                    user: {
                        jwtdata
                    },
                };
                if (correctPassword) {
                    jwt.sign(
                        {
                            userId: isExist.UserId,
                            UserName: `${isExist.FirstName} ${isExist.LastName}`
                        },
                        'green',
                        { expiresIn: '7 days' },
                        (err, token) => {
                            if (err) throw err;
                            res.status(200).json({ UserInfo: jwtdata, AccessToken: token, message: 'User Logged In Successfully' })
                        }
                    );
                }
                else {
                    res.status(422).json({ message: "Invalid Credentials" })
                }
            }
            else {
                res.status(422).json({ message: 'Please Verify your Email Id' })
            }

        }
        else {
            res.status(422).json({ message: "User Doesn't Exist" })
        }
    }
    catch (err) {
        res.status(400).json({ message: err.message })
    }
}
export const SignupUser = async (req, res) => {
    try {
        const { FirstName, LastName, EmailId, MobileNo, Password, RePassword, UserId } = req.body;
        console.log(req.body)
        const UserSchema = new User({
            FirstName,
            LastName,
            EmailId,
            MobileNo,
            UserId,
            isDeleted: false,
            isVerified: false,
        })
        const isEmail = await User.findOne({ "EmailId": EmailId });
        console.log('isEmail =>', isEmail)
        if (isEmail) {
            res.status(422).json({ message: 'This Email Already Exist' })
        }
        else if (Password === RePassword || isEmail === null) {
            let userData = await UserSchema.save()
            if (userData) {
                let userInfo = new PasswordSchemas({
                    UserId: UserId,
                    EmailId: EmailId,
                    isActive: true,
                    Password: await bcrypt.hash(Password, 12)
                })
                let passwordStore = await userInfo.save()
                if (passwordStore) {
                    let data = new TokenSchema({
                        token_id: uuidv4(),
                        user_id: UserId,
                        created_at: new Date()
                    })
                    let tokenData = await data.save()
                    if (tokenData) {
                        let Email = UserEmail(EmailId, "Verify Email", `${tokenData.token_id}/${UserId}`, false)
                        if (Email) {
                            res.status(200).json({ message: 'Please Verify your EmailId, verification link send to your EmailId' })

                        }
                        else {
                            console, log('inside Condition')
                            res.status(422).json({ message: err.message })
                        }

                    }


                }
            }

        }
        else {
            res.status(422).json({ message: 'Something went wrong' })
        }
    }
    catch (err) {
        console.log('inside Condition')
        res.status(422).json({ message: err.message })
    }
}

export const HandleAuthorization = async (req, res) => {
    try {
        let authorization = req.headers.authorization;
        let IsValid = jwt.verify(authorization, 'green')
        return IsValid
    }
    catch (err) {
        return false
    }
}

export const handleEmail = async (userId, email, subject, text, reset, req, res) => {
    try {
        const jwtData = {
            userId: userId
        }
        jwt.sign(jwtData, 'green', { expiresIn: '10m' },
            (err, token) => {
                if (err) throw err;
                UserEmail(email, subject, `${token}/${userId}`, reset).then((response) => {
                    if (response) {
                        return response
                    }
                }).catch(err)
                {
                    return err
                }
            })

    }
    catch (err) {
        res.status(422).json({ message: err.message })
    }
}

export const handleVerify = async (req, res) => {
    try {
        const { user_id, token_id } = req.body
        const userData = await User.findOne({ UserId: user_id })
        const checkVerified = await User.findOne({ UserId: user_id, isVerified: true })
        if (checkVerified) {
            res.status(200).json({ message: 'your Email id verified already, you can login' })
        }
        else {
            let data = await TokenSchema.findOne({ 'user_id': user_id, 'token_id': token_id })
            if (data) {
                const updatedData = {
                    isVerified: true
                }
                const updateVerify = await User.findOneAndUpdate({ 'UserId': user_id, 'isVerified': false }, updatedData)
                if (updateVerify) {
                    res.status(200).json({ message: 'Your Email id verified Successfully' })
                }
            }
            else {
                let data = new TokenSchema({
                    token_id: uuidv4(),
                    user_id: user_id,
                    created_at: new Date()
                })
                let tokenData = await data.save()
                if (tokenData) {
                    let Email = UserEmail(userData.Email, "Verify Email", `${tokenData.token_id}/${user_id}`, false)
                    if (Email) {
                        res.status(200).json({ message: 'Please Verify your EmailId, verification link send to your EmailId' })
                    }
                    else {
                        res.status(422).json({ message: err })
                    }

                }
            }
        }
    }
    catch (err) {

    }
}

export const updatePassword = async (req, res) => {
    try {
        console.log(req.body)
        const { EmailId } = req.body
        const userInfo = await User.findOne({ 'EmailId': EmailId })
        if (userInfo) {
            const token = new TokenSchema({
                user_id: userInfo.UserId,
                token_id: uuidv4(),
                created_at: new Date()
            })
            const tokenSave = await token.save()
            if (tokenSave) {
                const HandleEmail = UserEmail(userInfo.EmailId, 'Email Verify', `${token.token_id}/${userInfo.UserId}`, true)
                if (HandleEmail) {
                    res.status(200).json({ message: 'Password Reset Link send to your email-id' })
                }
                else {
                    res.status(422).json({ message: 'Something Went wrong' })
                }
            }
            else {
                res.status(422).json({ message: "Something Went wrong" })
            }

        }
        else {
            res.status(422).json({ message: 'Please Enter Valid Email-id' })
        }
    }
    catch (err) {
        res.status(422).json({ message: err.message })
    }
}

export const verifyToken = async (req, res) => {
    try {
        const { token_id, user_id } = req.body;
        console.log(token_id, user_id)
        const isVerify = await TokenSchema.findOne({ 'token_id': token_id, 'user_id': user_id })
        console.log('IsVerify =>', isVerify)
        if (isVerify) {
            res.status(200).json({ message: 'Token Verified Successfully' })
        }
        else {
            res.status(422).json({ message: 'Invalid Token' })
        }
    }
    catch (err) {
        res.status(422).json({ message: err.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { user_id, Password, RePassword } = req.body;
        if (Password === RePassword) {
            const userInfo = await User.findOne({ 'UserId': user_id })
            const setActive = await PasswordSchemas.updateMany({ 'UserId': user_id }, { isActive: false })
            if (setActive) {
                const data = new PasswordSchemas({
                    UserId: user_id,
                    EmailId: userInfo.EmailId,
                    isActive: true,
                    Password: await bcrypt.hash(Password, 12)
                })
                const SaveData = await data.save();
                if (SaveData) {
                    res.status(200).json({ message: 'Password Updated Successfully' })
                }
                else {
                    res.status(422).json({ message: "Something went wrong" })
                }
            }
            else {
                res.status(422).json({ message: 'Something went wrong' })
            }
        }
        else {
            res.status(422).json({ message: 'Password and Confirm Password must be same' })
        }
    }
    catch (err) {
        res.status(422).json({ message: err.message })
    }
}
