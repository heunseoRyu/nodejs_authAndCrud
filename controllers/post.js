const { Post, Hashtag } = require('../models');

exports.afterUploadImage = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
};

exports.uploadPost = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user.id,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

exports.deletePost = async (req, res,next) => {
  try {
    const postId = req.params.id; // 삭제할 게시물 ID
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).send('no post');
    }
    // 게시글 삭제
    await post.destroy();
    res.send('게시물이 삭제되었습니다.');
  } catch (error) {
    console.error(error);
    next(error);
  }
};