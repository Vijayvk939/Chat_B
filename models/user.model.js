'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { TE, to } = require('../services/util.service');
const CONFIG = require('../config/config');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('users', {
        firstName: { type: DataTypes.STRING, allowNull: false },
        lastName: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        phoneNumber: { type: DataTypes.STRING, allowNull: false },
        isOnline:     { type: DataTypes.BOOLEAN, defaultValue: false }
    });

    Model.prototype.getJWT = function () {
        let expiration_time = parseInt(CONFIG.jwt_expiration);
        return "Bearer " + jwt.sign({ user_id: this.id }, CONFIG.jwt_encryption, { expiresIn: expiration_time });
    };

    Model.prototype.toWeb = function () {
        return this.toJSON();
    };

    Model.authenticate = async function (email, phoneNumber) {
        let err, user;
        [err, user] = await to(this.findOne({ where: { email, phoneNumber } }));
        if (err) TE(err.message, true);
        if (!user) TE('User not found', true);
        return user;
    };

    return Model;
};