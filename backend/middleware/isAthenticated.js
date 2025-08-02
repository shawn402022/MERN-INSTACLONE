import jwt from 'jsonwebtoken'

const isAuthenticated = async (req, res, next) => {
    try {
        // Retrieve the token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        //verify the token using jwt.verify
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        // If token verification fails, response with an error
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        }
        //Attach the decoded user ID to the request object
        req.id = decode.userId;

        //Proceed to thew next middleware or route handles
        next();
    } catch (error) {
        console.log(error);
        // Return teh 500 status if an error occurs during the token verification
        return res.status(500).json({
            message:"Server Error",
            success: false,
        })
    }
};

export default isAuthenticated;
