import { Asset } from "../models/asset.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createAsset = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    street,
    pincode,
    city,
    state,
    price,
    description,
    assetUniqueId,
  } = req.body;

  const assetName = name;

  // 🔍 Validation
  if (!assetName || !type || !street || !pincode || !city || !state || !price || !description || !assetUniqueId) {
    throw new ApiError(400, "All required fields must be provided");
  }

  // ✅ Ensure type is valid
  if (!["Vehicle", "Property"].includes(type)) {
    throw new ApiError(400, "Invalid asset type. Must be either 'Vehicle' or 'Property'");
  }

  // 🔥 Handle file uploads
  const imageLocalPath = req.files?.images[0]?.path;
  const legalDocsLocalPath = req.files?.legalDocs[0]?.path;

  if (!imageLocalPath || !legalDocsLocalPath) {
    throw new ApiError(400, "Images and legal documents are required");
  }

  const imageObj=await uploadOnCloudinary(imageLocalPath);
  const legalDocsObj=await uploadOnCloudinary(legalDocsLocalPath);
  if(!imageObj?.secure_url || !legalDocsObj?.secure_url){
    throw new ApiError(400,"Something went wrong while uploading images or legal documents");
  }


  // 🏗️ Create asset entry in DB
  const asset = await Asset.create({
    ownerId: req.user._id,
    type,
    assetName,
    street,
    pincode,
    city,
    state,
    price,
    description,
    imagesUrl: imageObj.secure_url,
    isAvailable: true,
    assetUniqueId,
    legalDocsLink: legalDocsObj.secure_url,
  });

  return res.status(201).json(new ApiResponse(201, asset, "Asset created successfully"));
});


const updateAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const updateFields = req.body;

  // Verify asset exists and user owns it
  const asset = await Asset.findById(assetId);
  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  if (asset.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to update this asset");
  }

  // Validate type if provided
  if (updateFields.type && !["Vehicle", "Property"].includes(updateFields.type)) {
    throw new ApiError(400, "Invalid asset type. Must be either 'Vehicle' or 'Property'");
  }

  // Handle file uploads if any
  if (req.files) {
    if (req.files.images) {
      const newImageUrls = await Promise.all(
        req.files.images.map((file) => uploadOnCloudinary(file.path))
      );
      updateFields.imagesUrl = [...(asset.imagesUrl || []), ...newImageUrls];
    }

    if (req.files.legalDocs) {
      const newLegalDocsUrls = await Promise.all(
        req.files.legalDocs.map((file) => uploadOnCloudinary(file.path))
      );
      updateFields.legalDocsLink = [...(asset.legalDocsLink || []), ...newLegalDocsUrls];
    }
  }

  // Update asset
  const updatedAsset = await Asset.findByIdAndUpdate(
    assetId,
    { $set: updateFields },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAsset, "Asset updated successfully"));
});

const deleteAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  // Verify asset exists and user owns it
  const asset = await Asset.findById(assetId);
  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  if (asset.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to delete this asset");
  }

  // Delete asset
  await Asset.findByIdAndDelete(assetId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Asset deleted successfully"));
});

const getAllAssets = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    city,
    state,
    minPrice,
    maxPrice,
    isAvailable = true,
    sortBy = "createdAt",
    sortOrder = "desc"
  } = req.query;

  // Build query
  const query = { isAvailable };
  if (type) query.type = type;
  if (city) query.city = { $regex: city, $options: "i" };
  if (state) query.state = { $regex: state, $options: "i" };
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Execute query with pagination
  const assets = await Asset.find(query)
    .populate("ownerId", "name email")
    .populate("tenantId", "name email")
    .populate("contractID")
    .sort({ [sortBy]: sortOrder === "desc" ? -1 : 1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  // Get total count
  const count = await Asset.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      assets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalAssets: count
    }, "Assets retrieved successfully")
  );
});

const getAssetById = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  const asset = await Asset.findById(assetId)
    .populate("ownerId", "name email")
    .populate("tenantId", "name email")
    .populate("contractID");

  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, asset, "Asset retrieved successfully"));
});

const getAssetsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, role = "owner" } = req.query;

  const assets = await Asset.find({ ownerId: userId });


  return res.status(200).json(
    new ApiResponse(200, {
      assets,
    }, "User assets retrieved successfully")
  );
});

const rentAsset = asyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const { startDate, endDate, tenantId } = req.body;

  // Validate required fields
  if (!startDate || !endDate || !tenantId) {
    throw new ApiError(400, "Start date, end date and tenant ID are required");
  }

  // Verify asset exists
  const asset = await Asset.findById(assetId);
  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  // Check if asset is available
  if (!asset.isAvailable) {
    throw new ApiError(400, "Asset is not available for rent");
  }

  // Verify owner is not renting their own asset
  if (asset.ownerId.toString() === tenantId) {
    throw new ApiError(400, "Owner cannot rent their own asset");
  }

  // Update asset with tenant information
  const updatedAsset = await Asset.findByIdAndUpdate(
    assetId,
    {
      $set: {
        tenantId,
        isAvailable: false,
        rentalPeriod: {
          startDate: new Date(startDate),
          endDate: new Date(endDate)
        }
      }
    },
    { new: true }
  ).populate("tenantId", "name email");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAsset, "Asset rented successfully"));
});

const endRental = asyncHandler(async (req, res) => {
  const { assetId } = req.params;

  // Verify asset exists
  const asset = await Asset.findById(assetId);
  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  // Verify the request is from the owner
  if (asset.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to end rental");
  }

  // Check if asset is actually rented
  if (asset.isAvailable || !asset.tenantId) {
    throw new ApiError(400, "Asset is not currently rented");
  }

  // Update asset to end rental
  const updatedAsset = await Asset.findByIdAndUpdate(
    assetId,
    {
      $set: {
        isAvailable: true,
        tenantId: null,
        rentalPeriod: null
      }
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedAsset, "Rental ended successfully"));
});

const getRentalHistory = asyncHandler(async (req, res) => {
  const { assetId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  // Verify asset exists
  const asset = await Asset.findById(assetId);
  if (!asset) {
    throw new ApiError(404, "Asset not found");
  }

  // Verify the request is from the owner
  if (asset.ownerId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized to view rental history");
  }

  // Get rental history from the Contract model (assuming it exists)
  const rentalHistory = await Contract.find({ assetId })
    .populate("tenantId", "name email")
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Contract.countDocuments({ assetId });

  return res.status(200).json(
    new ApiResponse(200, {
      rentalHistory,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalEntries: count
    }, "Rental history retrieved successfully")
  );
});

export {
  createAsset,
  updateAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  getAssetsByUser,
  rentAsset,
  endRental,
  getRentalHistory
}; 