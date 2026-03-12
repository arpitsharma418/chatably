import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    isGuest: {
        type: Boolean,
        default: false,
    },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

export default User;
