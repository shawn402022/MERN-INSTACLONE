import  {User} from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cloudinary from '../utils/cloudinary.js';
import getDataUri from "../utils/datauri.js";

//Registration logic
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        //Basic validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields re required',
                success: false,
            })
        }
        //Check if the user already exists by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                message: 'User already exists',
                success: false,
            })
        }

        //Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        //Create new User
        await User.create({
            username,
            email,
            password: hashedPassword
        });
        return res.status(201).json({
            message: ' User registered successfully',
            success: true,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' })
    }
};

//login Logic
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        //Basic validation
        if (!email || !password) {
            return res.status(400).json({
                message: 'Email and password are required',
                success: false,
            })
        }
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                message: "invalid email or password",
                success: false,
            })
        }
        // Check if the password is correct
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                message: "Invalid email or password",
                success: false
            })
        }

        // Generate a JWT token
        const token = await jwt.sign(
            {
                userId: user._id
            }, process.env.SECRET_KEY,
            {
                expiresIn: '1d'
            }
        );

        //Populate each post id ni the post array
        const populatedPosts = await Promise.all(
            user.posts.map(async(postId) => {
                const post = await Post.findById(postId)
                if(post.author.equals(user._id)) {
                    return post
                }
                return null;
            })
        )
        // Exclude the password from the return user object
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,

        }


        return res.cookie('token', token, {
            httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000,
        }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" })
    }
};

//Logout logic
export const logout = async (_, res) => {
    try {
        //clear the cookies that holds the JWT token
        return res.cookie('token', "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Get User Profile Logic
export const getProfile = async (req, res) => {
    try {
        // use req.params.id to get the User ID from the route parameter
        const userId = req.params.id
        // Find user by userId
        const user = await User.findById(userId);
        //If user is not found, return 404 error
        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        // Return the user object if found
        return res.status(200).json({
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
        //Return a 500 server error response
        return res.status(500).json({
            message: "Server error",
            success: false
        })

    }
};

//Edit profile logic
export const editProfile = async (req, res) => {
    try {
        // Retrieved from the authenticated middleware
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.files && req.files[0];
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture)
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        //update fields if provided in the request
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;

        // update profile picture url
        if (profilePicture) {
            user.profilePicture = cloudResponse.secure_url;
        }
        await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
        //Return a 500 server error response
        return res.status(500).json({
            message: "Server error",
            success: false
        })

    }
};

// Suggested users login
export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers || suggestedUsers.length === 0) {
            return res.status(400).json({
                message: "Currently do not have any users"
            })
        }
        //Return the suggested users
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "An error occurred while fetching suggested users"
        })
    }
}

//Follow and Unfollow logic
export const followOrUnfollow = async (req, res) => {
    try {
        const follower = req.id // shawn
        const followee = req.params.id //bouchra
        if (follower === followee) {
            return res.status(400).json({
                message: "You cannot follow.unfollow yourself",
                success: false
            })
        }
        const user = await User.findById(follower);
        const targetUser = await User.findById(followee);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            });
        }
        // I will check wether to follow or unfollow
        const isFollowing = user.following.includes(followee);
        if (isFollowing) {
            //Logic to unfollow user
            await Promise.all([User.updateOne({ _id: follower }, { $pull: { following: followee } })
            ])
            await Promise.all([User.updateOne({ _id: followee }, { $pull: { followers: follower } })
            ])
            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true
            });
        } else {
            //logic to follow the user.
            await Promise.all([User.updateOne({ _id: follower }, { $push: { following: followee } })
            ])
            await Promise.all([User.updateOne({ _id: followee }, { $push: { followers: follower } })
            ])
            return res.status(200).json({
                message: "followed successfully",
                success: true
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "server errors"
        })
    }
}
