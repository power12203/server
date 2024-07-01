const jwt = require('jsonwebtoken');
const User = require('../modules/user');

const jwtMiddleware = async (ctx, next) => {
  const token = ctx.cookies.get('access_token');
  // 쿠키에서 access_token을 가져옵니다.
  if (!token) return next();
  // 토큰이 존재하지 않으면 다음 미들웨어를 실행합니다.
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // JWT를 해석하여 유효성을 검증합니다.
    ctx.state.user = {
      id: decoded._id,
      username: decoded.username,
    };
    // 해석된 JWT에서 사용자 정보를 추출하여 ctx.state.user에 저장합니다.
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp - now < 60 * 60 * 24 * 3.5) {
      const user = await User.findById(decoded._id);
      const token = user.generateToken();
      // JWT의 유효 기간이 남은 시간이 3.5일보다 적으면 새로운 토큰을 발급합니다.
      ctx.cookies.set('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7, //7일
        httpOnly: true,
      });
    }
    return next();
    // 다음 미들웨어를 호출하여 요청 처리를 계속합니다.
  } catch (e) {
    return next();
    // JWT 해석이 실패한 경우 다음 미들웨어를 호출하여 요청 처리를 계속합니다.
  }
};

module.exports = jwtMiddleware;
