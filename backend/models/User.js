import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
            unique: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
        },
        password:{
            type: String,
            required: true,
        },
        phone:{
            type: String,
            required: true,
        },
        // future case you can add roles here for admin and user ...etc
        // don't forget to create a model for it and connect using sechema type object id
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', UserSchema);