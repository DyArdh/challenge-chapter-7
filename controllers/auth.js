const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { Users } = require('../models');
const nodemailer = require('../utils/nodemailer');
const oauth2 = require('../utils/oauth');
const { JWT_SECRET_KEY } = process.env;

module.exports = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;

            if (!name) {
                return res.status(400).json({
                    status: false,
                    message: 'Field name is required!',
                    data: null,
                });
            }

            if (!email) {
                return res.status(400).json({
                    status: false,
                    message: 'Field email is required!',
                    data: null,
                });
            }

            if (!password) {
                return res.status(400).json({
                    status: false,
                    message: 'Field password is required!',
                    data: null,
                });
            }

            const findUser = await Users.findOne({ where: { email } });
            if (findUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is already registered!',
                    data: null,
                });
            }

            if (findUser && findUser.is_google == true) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is already registered, Please login with google!',
                    data: null,
                });
            }

            const hashPassword = await bcrypt.hash(password, 10);

            const addUser = await Users.create({
                name,
                email,
                password: hashPassword,
            });

            const payload = {
                id: addUser.id,
            };

            const token = await jwt.sign(payload, JWT_SECRET_KEY);
            const url = `${req.protocol}://${req.get('host')}/auth/activation-email?token=${token}`;

            const html = await nodemailer.getHtml('activation-email.ejs', {
                name: addUser.name,
                url,
            });

            nodemailer.sendMail(addUser.email, 'Account Activation', html);

            return res.status(201).json({
                status: true,
                message: 'Email activation has been sent, please check your email!',
                data: null,
            });
        } catch (error) {
            throw error;
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            if (!email) {
                return res.status(400).json({
                    status: false,
                    message: 'Field email is required!',
                    data: null,
                });
            }

            if (!password) {
                return res.status(400).json({
                    status: false,
                    message: 'Field password is required!',
                    data: null,
                });
            }

            const findUser = await Users.findOne({ where: { email } });
            if (!findUser) {
                return res.status(400).json({
                    status: false,
                    message: 'Email is not registered!',
                });
            }

            const checkPassword = await bcrypt.compare(password, findUser.password);

            if (!checkPassword) {
                return res.status(400).json({
                    status: false,
                    message: 'Password is not corrrect!',
                    data: null,
                });
            }

            if (findUser.is_active == false) {
                return res.status(401).json({
                    status: true,
                    message: 'Your account is not activated yet, please check your email for activation!',
                    data: null,
                });
            }

            const payload = {
                id: findUser.id,
                role: findUser.role,
            };

            const token = await jwt.sign(payload, JWT_SECRET_KEY, {
                expiresIn: '1d',
            });
            return res.status(200).json({
                status: true,
                message: 'Login success!',
                data: {
                    token: token,
                },
            });
        } catch (error) {
            throw error;
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await Users.findOne({ where: { email } });
            if (user) {
                const payload = {
                    id: user.id,
                };

                const token = await jwt.sign(payload, JWT_SECRET_KEY);
                const url = `${req.protocol}://${req.get('host')}/auth/reset-password?token=${token}`;

                const html = await nodemailer.getHtml('reset-password.ejs', {
                    name: user.name,
                    url,
                });

                nodemailer.sendMail(user.email, 'Reset Password', html);
            }

            return res.status(200).json({
                status: true,
                message: 'Email has been sent, please check your email!',
                data: null,
            });
        } catch (error) {
            throw error;
        }
    },

    resetPasswordPage: (req, res) => {
        const { token } = req.query;
        return res.render('auth/resetPassword', { token });
    },

    resetPassword: async (req, res) => {
        try {
            const { new_password, confirm_new_password } = req.body;

            const { token } = req.query;
            if (!token) {
                return res.status(401).json({
                    status: false,
                    message: 'Token is invalid!',
                    data: null,
                });
            }

            if (!new_password) {
                return res.status(400).json({
                    status: false,
                    message: 'Please create new password!',
                    data: null,
                });
            }

            if (new_password != confirm_new_password) {
                return res.status(400).json({
                    status: false,
                    message: 'Confirm Password does not match!',
                    data: null,
                });
            }

            const data = await jwt.verify(token, JWT_SECRET_KEY);

            const hashPassword = await bcrypt.hash(new_password, 10);
            const updatePassword = await Users.update({ password: hashPassword }, { where: { id: data.id } });

            if (updatePassword[0] == 0) {
                return res.status(400).json({
                    status: false,
                    message: 'Reset password failed!',
                    data: null,
                });
            }

            return res.status(201).json({
                status: true,
                message: 'Reset password success!',
                data: null,
            });
        } catch (error) {
            throw error;
        }
    },

    loginGoogle: async (req, res) => {
        try {
            const { code } = req.query;
            if (!code) {
                const googleLoginUrl = oauth2.generateAuthUrl();
                return res.redirect(googleLoginUrl);
            }

            await oauth2.setCreadentials(code);
            const { data } = await oauth2.getUserData();

            let user = await Users.findOne({ where: { email: data.email } });
            if (!user) {
                user = await Users.create({
                    name: data.name,
                    email: data.email,
                    is_google: true,
                    is_active: true,
                });
            }

            if (user.is_valid == false) {
                await Users.update({ is_active: true }, { where: { email: data.email } });
            }

            const payload = {
                id: user.id,
                role: user.role,
            };

            const token = await jwt.sign(payload, JWT_SECRET_KEY);

            return res.status(200).json({
                status: true,
                message: 'login success!',
                data: {
                    token: token,
                },
            });
        } catch (error) {
            console.log(error);
        }
    },

    verifyEmail: async (req, res) => {
        try {
            const { token } = req.query;
            if (!token) {
                return res.status(400).json({
                    status: true,
                    message: 'Token is invalid!',
                    data: null,
                });
            }

            const data = await jwt.verify(token, JWT_SECRET_KEY);
            const verify = await Users.update({ is_active: true }, { where: { id: data.id } });
            if (verify[0] == 0) {
                return res.status(400).json({
                    status: true,
                    message: 'Activation account failed!',
                    data: null,
                });
            }

            return res.status(200).json({
                status: false,
                message: 'Activation account success!',
                data: null,
            });
        } catch (error) {
            throw error;
        }
    },
};
