import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import userRoute from './routes/user.route.js'
import postRoute from './routes/post.route.js'
import messageRoute from './routes/message.route.js'


dotenv.config({})

//Define the port
const PORT = process.env.PORT || 8000;


//Create Express App
const app = express();

//Middleware
app.use(express.json());// Parses JSON payloads
app.use(cookieParser()); // parses cookies
app.use(express.urlencoded({ extended: true }))// parses URL encoded payloads

//CORS configuration
const corsOptions = {
    origin: "http://localhost:5173", //Allow request from this origin
    credentials: true, //Allow credentials to be sent with the request
};
app.use(cors(corsOptions));

//SimpleRoutes
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello world",
        success: true,
    });
});

app.use('/api/v1/user', userRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/message', messageRoute)

//Start the Server
const listen = async () => {
    const conn = await connectDB();
    if (conn) {
        app.listen(PORT, () => {
            connectDB();
            console.log(`Server is running on port ${PORT}`)
        })
    }
};
listen();
