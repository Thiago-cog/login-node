const { Router } = require('express');
const authenticateToken = require('./middleware/authenticateToken.js');

const UserAuthorization = require('../component/user-authorization.js');
const UserRepository = require('../component/data/user-repository.js');

const router = Router();

const applyResult = (result, res) => {
    if (result.errors) {
        res.status(result.status);
        return res.send(result.errors);
    }
    res.status(result.status);
    return res.send(result.data);
};

router.post('/login', async (req, res) => {
    const userAuthorization = new UserAuthorization(new UserRepository());
    const userData = req.body;
    const result = await userAuthorization.login(userData);
    applyResult(result, res);
});

router.get('/decode-token', authenticateToken, async (req, res) => {
    const userAuthorization = new UserAuthorization(new UserRepository());
    const [, token] = req.headers.authorization.split(' ');
    const result = await userAuthorization.decodeToken(token);
    applyResult(result, res);
});

router.post('/register', async (req, res) => {
    const userAuthorization = new UserAuthorization(new UserRepository());
    const userData = req.body;
    const result = await userAuthorization.register(userData);
    applyResult(result, res);
});

router.put('/update-user', authenticateToken, async (req, res) => {
    const userAuthorization = new UserAuthorization(new UserRepository());
    const userData = req.body;
    const result = await userAuthorization.updateUser(userData);
    applyResult(result, res);
});

router.post('/confirm-email-token', async (req, res) => {
    const userAuthorization = new UserAuthorization(new UserRepository());
    const token = req.query.token;
    const result = await userAuthorization.confirmEmail(token);
    applyResult(result, res);
});

router.get('/get-email-token', async (req, res) => {
    const userAuthorization = new UserAuthorization(new UserRepository());
    const token = req.query.token;
    const result = await userAuthorization.getEmailByToken(token);
    applyResult(result, res);
});

router.post('/forgot-password', async (req, res) => {
    const userAuthorization = new UserAuthorization(new UserRepository());
    const email = req.query.email;
    const result = await userAuthorization.forgotPassword(email);
    applyResult(result, res);
});

module.exports = router;