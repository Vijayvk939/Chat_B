const { users } = require('../models');
const { to, ReE, ReS } = require('../services/util.service');

const getUsers = async function (req, res) {
    let activeData = [];
    [err, activeData] = await to(
        users.findAll({
            order: [["id", "ASC"]],
        })
    );
    if (err) TE(err.message);
    return ReS(res, {
        activeData: activeData,
    });
};
module.exports.getUsers = getUsers;

const create = async function (req, res) {
    const { firstName, lastName, email, phoneNumber } = req.body;

    if (!firstName || !lastName || !email || !phoneNumber) {
        return res.json({ error: 'Please provide firstName, lastName, email, and phoneNumber.' });
    }

    try {
        const newUser = await users.create({ firstName, lastName, email, phoneNumber });
        return res.json({
            message: 'User created successfully',
            userId: newUser.id,
            user: newUser.toWeb(),
            token: newUser.getJWT(),
        });
    } catch (error) {
        return res.json({ error: error.message });
    }
};

module.exports.create = create;

const login = async function (req, res) {
    const { email, phoneNumber } = req.body;
    let err, user;

    [err, user] = await to(users.authenticate(email, phoneNumber));
    if (err) return ReE(res, err, 422);

    return ReS(res, { access_token: user.getJWT(), user: user.toWeb() });
};

module.exports.login = login;
