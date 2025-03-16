import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

// import {
//   googleLogin,
//   googleLoginCallback,
//   fetchUserData,
// } from "../utils/passport-setup.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "aadhaar", maxCount: 1 },{ name: "pan", maxCount: 1 }]), registerUser);// router.route("/fetch-user-data").post(fetchUserData);
router.route("/login").post(loginUser);
// router.route("/search-user").post(verifyJWT, searchUser);
router.route("/logout").post(verifyJWT, logoutUser);
// router
//   .route("/update-profile")
//   .post(
//     verifyJWT,
//     upload.fields([{ name: "avatar", maxCount: 1 }]),
//     updateAccountDetails
//   );


// router.route("/refresh-access-token").post(refreshAccessToken);
router.route("/current-user").post(verifyJWT, getUserProfile);
// router.route("/check-username-exists").post(checkUsernameExists);
router.route("/get-user-profile").post(verifyJWT, getUserProfile);
router.route("/:username").post(verifyJWT, getUserProfile);

export default router;
