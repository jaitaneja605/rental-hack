import mongoose, { Schema } from "mongoose";

const assetSchema = new Schema(
    {
        assetName: {
            type: String,
            trim:true,
            required: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User", // References the User model
            required: true,
        },
        tenantId: {
            type: Schema.Types.ObjectId,
            ref: "User", // References the User model
        },
        type: {
            type: String,
            enum: ["Vehicle", "Property"], // Restrict values to "Vehicle" or "Property"
            required: true,
        },
        street: {
            type: String,
            required: true,
            trim: true,
        },
        pincode: {
            type: String,
            required: true,
            trim: true,
        },
        city: {
            type: String,
            required: true,
            trim: true,
        },
        state: {
            type: String,
            required: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0, // Monthly price should be non-negative
        },
        description: {
            type: String,
            trim: true,
        },
        imagesUrl: 
            {
                type: String,
                trim: true,
            }
        ,
        isAvailable: {
            type: Boolean,
            default: true,
        },
        hiddenCharges: {
            type: Number,
            default: 0, // Default hidden charges to 0
            min: 0,
        },
        riskRate: {
            type: Number,
            min: 1,
            max: 10, // Scale of 1 to 10
        },
        contractID: {
            type: Schema.Types.ObjectId,
            ref: "Contract", // Assuming a Contract model exists
        },
        assetUniqueId: {
            type: String,
            required: true,
            unique: true, // Ensures each asset has a unique identifier
            trim: true,
        },
        legalDocsLink:
            {
                type: String,
                trim: true,
            },
        rentalPeriod: {
            startDate: {
                type: Date,
            },
            endDate: {
                type: Date,
            }
        },
        rentalHistory: [{
            tenantId: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date,
                required: true
            },
            contractId: {
                type: Schema.Types.ObjectId,
                ref: "Contract"
            }
        }]
    },
    { timestamps: true } // Adds createdAt and updatedAt fields
);

const Asset = mongoose.model("Asset", assetSchema);

export { Asset };
