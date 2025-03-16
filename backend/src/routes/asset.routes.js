import { Router } from "express";
import {
  createAsset,
  updateAsset,
  deleteAsset,
  getAllAssets,
  getAssetById,
  getAssetsByUser,
  rentAsset,
  endRental,
  getRentalHistory
} from "../controllers/asset.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Create a new asset (protected route)
router.route("/create").post(
  verifyJWT,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "legalDocs", maxCount: 3 }
  ]),
  createAsset
);

// Update an asset (protected route)
router.route("/update/:assetId").patch(
  verifyJWT,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "legalDocs", maxCount: 3 }
  ]),
  updateAsset
);

// Delete an asset (protected route)
router.route("/delete/:assetId").delete(verifyJWT, deleteAsset);

// Get all assets (public route with filters)
router.route("/all").get(getAllAssets);

// Rent an asset (protected route)
router.route("/:assetId/rent").post(verifyJWT, rentAsset);

// End rental (protected route, owner only)
router.route("/:assetId/end-rental").post(verifyJWT, endRental);

// Get rental history (protected route, owner only)
router.route("/:assetId/rental-history").get(verifyJWT, getRentalHistory);

// Get asset by ID (public route)
router.route("/:assetId").get(getAssetById);

// Get assets by user ID (protected route)
router.route("/user/:userId").get(getAssetsByUser);

export default router; 