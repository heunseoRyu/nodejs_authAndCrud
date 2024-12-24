const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const {
  renderProfile, renderJoin, renderMain, renderHashtag,
} = require('../controllers/page'); 

const router = express.Router();

/*router.use로 모든 요청에서 실행될 미들웨어를 설정합니다. 
// (req, res, next) 콜백 함수에서 요청 객체(req), 
// 응답 객체(res), 그리고 다음 미들웨어로 넘어가는 함수(next)를 사용할 수 있습니다.*/
router.use((req, res, next) => {
  /**res.locals 객체는 템플릿 엔진에서 사용하는 로컬 변수를 저장하는 객체입니다. 
   * 여기서 res.locals.user에 req.user를 할당하여 템플릿에서 
   * 사용자 정보를 직접 사용할 수 있게 합니다. 
   * req.user는 사용자가 로그인했다면 로그인한 사용자 정보를, 로그인하지 않았다면 null 값을 가질 가능성이 큽니다. */
  res.locals.user = req.user;

  /**req.user?.Followers?.length로 
   * 사용자가 로그인한 상태에서 Followers 배열의 길이를 확인하고, 
   * 만약 사용자가 로그인하지 않았거나 Followers가 없는 경우 0을 기본값으로 설정합니다. */
  res.locals.followerCount = req.user?.Followers?.length || 0; // 팔로워 수 
  // 위와 비슷한데 팔로잉을 세는거야.
  res.locals.followingCount = req.user?.Followings?.length || 0; // 팔로잉 수
  /**
   * req.user?.Followings?.map(f => f.id)로 Followings 배열을 순회하여 
   * 각 팔로우 대상의 id 값을 가져오고, 값이 없으면 빈 배열 []을 기본값으로 설정합니다.
   */
  res.locals.followingIdList = req.user?.Followings?.map(f => f.id) || [];
  next();
});

// 1. 
router.get('/profile', isLoggedIn, renderProfile);

// 2.
router.get('/join', isNotLoggedIn, renderJoin);

// 3.
router.get('/', renderMain);

// 4.
router.get('/hashtag', renderHashtag);

module.exports = router;
