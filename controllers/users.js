const imageKit = require('../utils/imageKit');

const { Users, ProfileImages } = require('../models');

module.exports = {
    getUser: async (req, res) => {
        try {
            const { id } = req.user;
            const user = await Users.findOne({ where: { id } });

            return res.status(200).json({
                status: true,
                message: 'Success',
                data: user,
            });
        } catch (error) {
            throw error;
        }
    },

    uploadProfileImg: async (req, res) => {
        try {
            const file = req.file.buffer.toString('base64');

            const uploadFile = await imageKit.upload({
                fileName: req.file.originalname,
                folder: 'chapter-7',
                file: file,
            });

            const { id } = req.user;

            const getImgProfile = await ProfileImages.findOne({
                where: { user_id: id },
            });

            if (!getImgProfile) {
                await ProfileImages.create({
                    file_id: uploadFile.fileId,
                    url: uploadFile.url,
                    user_id: id,
                });

                return res.status(201).json({
                    status: true,
                    message: 'Profile image is uploaded!',
                    data: null,
                });
            }

            imageKit.deleteFile(getImgProfile.file_id, (error) => {
                if (error) {
                    throw error;
                }
            });

            await ProfileImages.update(
                { file_id: uploadFile.fileId, url: uploadFile.url },
                { where: { user_id: id } }
            );

            return res.status(201).json({
                status: true,
                message: 'Profile image is uploaded!',
                data: null,
            });
        } catch (error) {
            throw error;
        }
    },
};
