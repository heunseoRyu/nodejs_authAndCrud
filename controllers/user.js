const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.follow = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    if (user) { // req.user.id가 followerId, req.params.id가 followingId
      await user.addFollowing(parseInt(req.params.id, 10));
      res.send('success');
    } else {
      res.status(404).send('no user');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 팔로우 취소 엔드포인트
exports.unFollow = async (req, res,next) => {
  try {
    const myId = req.user.id; // 로그인한 사용자 ID
    const userId = req.params.id; // 팔로우 취소할 사용자 ID

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send('no user');
    }

    // 관계 삭제 (팔로우 취소)
    await user.removeFollower(myId);
    res.send('success');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.changePw = async (req, res, next) => {
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { 
      email:email,
      nick:nick } });
    if (!exUser) {
      return res.status(404).send('no user');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.update({
      password: hash}
      ,{where: {email:email}}
    );
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
};