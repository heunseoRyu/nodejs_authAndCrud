const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { follow,unFollow,changePw } = require('../controllers/user');

const router = express.Router();

// POST /user/:id/follow
router.post('/:id/follow', isLoggedIn, follow);

router.delete('/:id/unfollow',isLoggedIn,unFollow);

router.post('/change-pw',isLoggedIn,changePw);

module.exports = router;
