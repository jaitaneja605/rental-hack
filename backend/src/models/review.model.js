import mongoose from "mongoose";

const reviewSchema = new Schema(
    {
        fromUserId: {
            type: Schema.Types.ObjectId,
            ref: "User", // References the User model
            required: true,
        },
        aboutUserId: {
            type: Schema.Types.ObjectId,
            ref: "User", // References the User model
            required: true,
        },
        comment: {
            type: String,
            trim: true,
        },
        score: {
            type: Number,
            required: true,
            min: 1, // Minimum score is 1
            max: 10, // Maximum score is 10
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
