import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({
                message: "Image required"
            });
        }

        //Validation caption
        if (
            !caption ||
            typeof caption !== 'string' ||
            caption.trim().length === 0
        ) {
            return res.status(400).json({
                message: "Caption is required and should be non empty string "
            })
        }

        // Ensure the file is an image
        if (
            !image.mimitype.startsWith('image/')
        ) {
            return res.status(400).json({
                message: "Upload file must be an image"
            })
        }

        //Image Optimization
        let optimizedImageBuffer;
        try {
            optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: 'inside' }).toFormat('jpeg', { quality: 80 }).toBuffer()
        } catch (error) {
            console.log('Error processing image with sharp', error);
            return res.status(500).json({
                message: 'Error processing image',
                error: error.message
            })
        }

        // Convert bugger to data URI
        const fileUri = `data:image/jpeg;base64, ${optimizedImageBuffer.toString('base64')}`;

        //Upload to Cloudinary
        let cloudResponse;

        try {
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        } catch (error) {
            console.log('Error uploading image to cloudinary', error)
            return res.status(500).json({
                message: "Error uploading image",
                error: error.message
            })
        }
        //Create post in the database
        const post = await Post.create({
            caption,
            image:cloudResponse.secure_url,
            author:authorId
        });
        // Update the users post array
        const user = await User.findById(authorId);
        if(user) {
            user.post.push(post._id);
            await user.save();
        }
        //Populate the post author field (exluding password)
        await post.populate({path: "author", select: "-password"});
        return res.status(201).json({
            message: 'New post added',
            post,
            success:true
        })
    } catch (error) {
        console.log('Unexpected error occurred', error)
        return res.status(500).json({
            message: "An Unexpected error occurred",
            error:error.message
        })
    }
}
