import mongoose from "mongoose";


const DB = async () => {
    try{
        await mongoose.connect(process.env.MONGOURL);
        console.log('DB Connected Successfully')
    }catch(error){
        console.error('Something error to Connect DB')
    }
};

export default DB;