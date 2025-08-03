import sharp from "sharp"
import cloudinary from "../utils/cloudinary.js"
import Post from "../models/post.model.js"
import User from "../models/user.model.js"
import Comment from "../models/comments.model.js"

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
            image: cloudResponse.secure_url,
            author: authorId
        });
        // Update the users post array
        const user = await User.findById(authorId);
        if (user) {
            user.post.push(post._id);
            await user.save();
        }
        //Populate the post author field (exluding password)
        await post.populate({ path: "author", select: "-password" });
        return res.status(201).json({
            message: 'New post added',
            post,
            success: true
        })
    } catch (error) {
        console.log('Unexpected error occurred', error)
        return res.status(500).json({
            message: "An Unexpected error occurred",
            error: error.message
        })
    }
};

//Get all posts logic
export const getAllPost = async (req, res) => {
    try {
        //Fetch posts with sorting and population
        const posts = await Post.find()
            .sort({
                createdAt: -1
            })
            .populate({
                path: 'author,',
                select: "username profilePicture"
            })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: 'author',
                    select: "username profilePicture"
                },
            });
        //return the fetched post
        return res.status(200).json({
            posts,
            success: true,
        });
    } catch (error) {
        console.error('Error fetching posts', error);
        return res.status(500).json({
            message: "An Unexpected error occurred while trying to fetch the posts",
            error: error.message,
            success: false,
        });
    }
}

// get individual user post logic
export const getUerPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createAt: -1 })
            .populate({
                path: 'author',
                select: "username profilePicture"
            }).populate({
                path: 'comments',
                sort: { createAt: -1 },
                populate: {
                    path: "author",
                    select: "username profilePicture"
                }
            })
        return res.status(200).json({
            posts,
            success: true
        });
    } catch (error) {
        console.error('Error fetching user posts:', error);
        return res.status(500).json({
            message: 'An Unexpected error occurred while fetching user posts',
            error: error.message,
            success: false
        })
    }
}

// Like  logic
export const likePost = async (req, res) => {
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            });
        }
        //Like logic
        await post.updateOne({
            $addToSet: {
                likes: likerId
            }
        })
        //Implement soket.io for real-time notification

        return res.status(200).json({
            message: "Post liked",
            success: true,
        });

    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({
            message: "An Unexpected error occurred while liking the post",
            error: error.message,
            success: true
        })
    }
}

// disLike  logic
export const disLikePost = async (req, res) => {
    try {
        const likerId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            });
        }
        //disLike logic
        await post.updateOne({
            $pull: {
                likes: likerId
            }
        })
        //Implement soket.io for real-time notification

        return res.status(200).json({
            message: "Post disliked",
            success: true,
        });

    } catch (error) {
        console.error('Error liking post:', error);
        return res.status(500).json({
            message: "An Unexpected error occurred while disliking the post",
            error: error.message,
            success: true
        })
    }
}

//##Add comment logic
//Create Comment
export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commenterId = req.id;

        const { text } = req.body;
        if (!text) {
            return res.status(400).json({
                message: "Text is required",
                success: false,
            })
        }
        //Check if post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        //Create a new post
        const comment = await Comment.create({
            text,
            author: commenterId,
            post: postId
        })
        //Populate the comment author
        await comment.populate({
            path: "author",
            select: "username profilePicture"
        });

        //Add the comment to the post's comment array
        Post.comments.push(comment._id);
        await post.save();
        return res.status(200).json({
            message: "Comment Added",
            comment,
            success: true,
        });
    } catch (error) {
        console.error('Error adding comment', error)
        return res.status(500).json({
            message: "Unexpected error occurred while trying to add the comment",
            success: false
        })
    }
}

//Get comments logic
export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        //check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            })
        }
        // Fetch comments for the given post
        const comments = await Comment.find({ post: postId }).populate(
            "author",
            "username profilePicture"
        );
        // If no comments found, return an empty array with a success message
        if (comments.length === 0) {
            return res.status(200).json({
                message: "No comments found for this post",
                success: true,
                comments: []
            })
        }
        // Return the comments if found
        return res.status(200).json({
            success: true,
            comments
        })
    } catch (error) {
        console.error('Error fetching comments', error)
        return res.status(500).json({
            message: 'An unexpected error occurred while fetching comments',
            error: error.message,
            success: false
        })
    }
}

//Delete Post Logic
export const deletePost = async (reg, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        //Find the post b Id
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false
            })
        }
        //Check if the logged in user is the owner of the post
        if (post.author.toString() !== authorId) {
            return res.status(403).json({
                message: "Unauthorized",
                success: false,
            })
        }
        //Delete post
        await post.findByIdAndDelete(postId);

        //Remove the postId from the users post list
        let user = await User.findById(authorId);
        if (user) {
            user.posts = user.posts.filter(id => id.toString() !== postId);
            await user.save();
        }

        //Delete associated Comments
        await Comment.deleteMany({ post: postId })
        return res.status(200).json({
            success: true,
            message: "Post deleted"
        });

    } catch (error) {
        console.error('Error deleting post', error);
        return res.status(500).json({
            message: 'An Unexpected error occurred while deleting the post',
            error: error.message,
            success: false
        })
    }
}
