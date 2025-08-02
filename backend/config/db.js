import mongoose from "mongoose";
// to avoid duplicate connections
let cachedDBConnection=null
const connectDB = async () => {
    try{
        if(cachedDBConnection){
            return cachedDBConnection;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected to "${conn.connection.name}" database`);
        cachedDBConnection = conn;
        return conn;
    } catch(error) {
        console.log(`ERROR ON DB CONNECTION ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
