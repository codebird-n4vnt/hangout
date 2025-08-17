import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/token.js";
import cloudinary from "../config/cloudinary.js";

export const signup = async (req, res) => {
  try {
    let { username, email, password, profilePicture } = req.body;
    if(!username || !email || !password) return res.status(400).json({message: `All fields are required`});
    if(password.length < 6) return res.status(400).json({message: ` Password must be atleast 6 characters long`});
    let existingUser = await User.findOne({ email: email});
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `${existingUser.email} already exists` });
    }
    let hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashPassword, profilePicture});
    let token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT === "development",
      sameSite: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: `Signup error ${err}` });
  }
};

export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    if(password.length < 6) return res.status(404).json({message: ` Password must be atleast 6 characters long`});
    let user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(400)
        .json({ message: `User does not exist, please login first` });
    }
    let matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res.status(400).json({ message: `Entered password is incorrect` });
    }

    let token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true, // prevent XSS attacks cross-site scriptinng attacks
      secure: process.env.NODE_ENVIRONMENT === "production",  // https --> here 's' stands for secure ; http --> used in production mode
      sameSite: "strict", //CSRF attacks cross-site request forgery attacks
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: `Login error ${err}` });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "",{maxAge:0});
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    res.status(202).json({message: `Cookie cleared successfully`})
  } catch (err) {
    res.status(400).json({message:`Logout error ${err}`})
  }
};


export const updateProfile = async ( req,res) =>{
  try {
    const {profilePic} = req.body
    let userId = req.user._id


    if(!profilePic){
      return res.status(400).json({message: "Profile pic is required"})
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(userId, {profilePic:uploadResponse.secure_url}, {new:true})
    if(!updatedUser){
        return res.status(400).json({message:'Unable to upload image - user not found'});
    }

    return res.status(200).json(updatedUser)
  } catch (err) {
    return res.status(500).json({message: `updateProfile err ${err}`});
  }
}


export const checkAuth = (req,res) =>{
  try {
    return res.status(200).json(req.user)
  } catch (err ) {
    return res.status(500).json({message:`checkAuth err ${err}`})
  }
}