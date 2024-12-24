const { User, Post, Hashtag } = require('../models');

exports.renderProfile = (req, res) => { // 내 정보 페이지 렌더링
  res.render('profile', { title: '내 정보 - NodeBird' });
};

exports.renderJoin = (req, res) => { // 회원 가입 페이지 렌더링
  res.render('join', { title: '회원가입 - NodeBird' });
};

exports.renderMain = async (req, res, next) => { // main 페이지 렌더링
  try {
    // 모든 게시글 목록 조회
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ['id', 'nick'],
      },
      order: [['createdAt', 'DESC']],
    });
    // 메인페이지 렌더링 및 twits(게시글 목록) 전달
    res.render('main', {
      title: 'NodeBird',
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

exports.renderHashtag = async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect('/');
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};