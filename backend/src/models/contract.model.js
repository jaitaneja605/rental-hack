import mongoose from "mongoose";

const contractSchema = new Schema(
    {
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "User", // References the Tenant (User)
            required: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User", // References the Owner (User)
            required: true,
        },
        assetId: {
            type: Schema.Types.ObjectId,
            ref: "Asset", // References the Asset model
            required: true,
        },
        terms: {
            type: String, // Stores contract terms
            required: true,
            trim: true,
        },
        duration: {
            type: Number, // Contract duration in months
            required: true,
            min: 1,
        },
        riskRate: {
            type: Number,
            min: 1,
            max: 10, // Scale of 1 to 10
            required: true,
        },
        signUrlTenant: {
            type: String, // URL to tenant's signed contract
            required: true,
            trim: true,
        },
        signUrlOwner: {
            type: String, // URL to owner's signed contract
            required: true,
            trim: true,
        },
        pdfUrl: {
            type: String, // Link to the final contract PDF
            required: true,
            trim: true,
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Contract = mongoose.model("Contract", contractSchema);

export default Contract;
