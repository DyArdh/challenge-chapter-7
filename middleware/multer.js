const multer = require('multer');

module.exports = {
    image: multer({
        fileFilter: (req, file, callback) => {
            if (
                file.mimetype == 'image/png' ||
                file.mimetype == 'image/jpg' ||
                file.mimetype == 'image/jpeg'
            ) {
                callback(null, true);
            } else {
                const error = new Error(
                    'Only png, jpg, and jpeg allowed to upload!'
                );
                callback(error, false);
            }
        },

        onError: (error) => {
            throw error;
        },
    }),
};
