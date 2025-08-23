import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    members: {
        type: [mongoose.Schema.Types.ObjectId],
        required: true,
        ref: "User",
        validate: {
            validator: (v) => {
                return v.length === 2;
            }
        }
    },
    messages: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Message",
        validate: {
            validator: (v) => {
                return v.length < 50;
            }
        }
    }
}, {timestamps: true});

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;