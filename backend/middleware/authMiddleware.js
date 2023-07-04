const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const admin = require('firebase-admin');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token
      token = req.headers.authorization.split(' ')[1];

      // Verify Token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get User from token
      const userSnapshot = await admin.firestore().collection('users').doc(decoded.id).get();
      const userData = userSnapshot.data();

      if (userData) {
        // Attach user data to the request
        req.user = {
          id: decoded.id,
          email: userData.email,
          // Include any other relevant user properties
        };

        next();
      } else {
        res.status(401);
        throw new Error('User not found');
      }
    } catch (error) {
      console.log(error);
      res.status(401);
      throw new Error('Not authorized');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized');
  }
});

module.exports = { protect };
