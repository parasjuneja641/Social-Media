import express from 'express'
import jwt from 'jsonwebtoken'

const router = express.Router();
router.get('/user_details', (req, res) => {
    try {
        const AccessToken = req.headers;
        const userDetails = jwt.verify(AccessToken.authorization, 'green')
        if (userDetails) {
            res.status(200).json({ message: userDetails })
        }
        else {
            res.status(422).json({ message: 'Invalid Access Token' })
        }
    }
    catch (err) {
        res.status(422).json({ message: err.message })
    }
})
export default router;