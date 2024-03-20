import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import multer from "multer"
import CommonApi from './routes/common.js'
import { AuthRoute, UserRoute } from "./routes/index.js"


const DB = 'mongodb+srv://ParasJuneja12:ParasJUNEJA@cluster0.otufr.mongodb.net/'
const Port = 9000
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.listen(Port, console.log(`app is listening on port ${Port}`));
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

mongoose.connect(DB).then((response) => {
    console.log('Mongo Db connected Successfully')
}).catch((err) => console.log('Err =>', err))

app.use('/auth', AuthRoute)
app.use('/user', UserRoute)