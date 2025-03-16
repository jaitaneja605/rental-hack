import {User} from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email,phone,address, password} =
    req.body;
    console.log(req.body);
  if (
    [fullName, email,phone,address, password].some(
      (field) => field.trim() === ""
    )
  ) {
    throw new ApiError(400, "Please fill all fields");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, "Email already exists");
  }

  // const avatarLocalPath = req.files?.avatar[0]?.path;
  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar is required");
  // }
  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if (!avatar) {
  //   throw new ApiError(400, "Something went wrong while uploading avatar");
  // }

  const aadhaarLocalPath=req.files?.aadhaar[0]?.path;
  if(!aadhaarLocalPath){
    throw new ApiError(400,"Aadhaar is required");
  }
  const panLocalPath=req.files?.pan[0]?.path;
  if(!panLocalPath){
    throw new ApiError(400,"Pan is required");
  }
  const aadhaarUpload = await uploadOnCloudinary(aadhaarLocalPath);
  if (!aadhaarUpload?.secure_url) {
    throw new ApiError(400, "Something went wrong while uploading Aadhaar");
  }

  const panUpload = await uploadOnCloudinary(panLocalPath);
  if (!panUpload?.secure_url) {
    throw new ApiError(400, "Something went wrong while uploading PAN");
  }

  

  const user = await User.create({
    fullName,
    email,
    phone,
    aadhaarUrl: aadhaarUpload.secure_url, // ✅ Extract secure_url
    panUrl: panUpload.secure_url, // ✅ Extract secure_url
    address,
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "email fullName"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});


const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loggedInUser = await User.findById(user._id).select(
    "email fullName"
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
      "User logged In Successfully"
    )
  );
});


const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Successfully logged out"));
});

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const incomingRefreshToken = refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expired");
    }
    let accessToken;
    try {
      accessToken = user.generateAccessToken();
    } catch (error) {
      throw new ApiError(500, "Something went wrong while generating tokens");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, { accessToken }, "Access token refreshed"));
  } catch (error) {
    console.log(error);
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, req.user, "User details"));
});


const getUserProfile = asyncHandler(async (req, res) => {
  let userId;
  if (req.params.id) {
      userId = req.params.id;
  } else {
      userId = req.user.id;
  }
  const user = await User.findById(userId).select("-password");
      
      // return user;
      if(!user){
          return res.status(404).json(new ApiResponse(404, {}, "User not found"));
      }
      console.log("User found:", user);
      return res.status(200).json(new ApiResponse(200, user, "User details"));
});



export{
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getUserProfile
}