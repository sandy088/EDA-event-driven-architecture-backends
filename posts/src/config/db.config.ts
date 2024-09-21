import mongoose from "mongoose";

export const connect = () => {
    mongoose.connect(Bun.env.DB_URL!).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log('Failed to connect to MongoDB', err);
        process.exit(1);
    });
};