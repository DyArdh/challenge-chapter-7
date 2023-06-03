'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert(
            'Users',
            [
                {
                    name: 'Admin',
                    email: 'admin@gmail.com',
                    password: await bcrypt.hash('12345', 10),
                    role: 'admin',
                    is_google: true,
                    is_active: true,
                },
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', null, {});
    },
};
