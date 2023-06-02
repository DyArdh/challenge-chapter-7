const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    auth: async (req, res, next) => {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                return res.status(401).json({
                    status: false,
                    message: 'Token is invalid!',
                    data: null,
                });
            }

            const data = jwt.verify(authorization, JWT_SECRET_KEY);
            req.user = {
                id: data.id,
            };
            next();
        } catch (error) {
            throw error;
        }
    },
};
