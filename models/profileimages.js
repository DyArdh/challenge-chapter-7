'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ProfileImages extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ProfileImages.belongsTo(models.Users, {
                foreignKey: 'user_id',
            });
        }
    }
    ProfileImages.init(
        {
            file_id: DataTypes.STRING,
            url: DataTypes.STRING,
            user_id: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'ProfileImages',
        }
    );
    return ProfileImages;
};
