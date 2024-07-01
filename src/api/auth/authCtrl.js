const User = require('../../modules/user');
const Joi = require('joi');
// 입력 데이터 검증 스키마 정의
exports.register = async (ctx) => {
  const schema = Joi.object().keys({
    username: Joi.string()
      .regex(/^[a-zA-Z0-9!@#$%^*]+$/)
      .min(3)
      .max(20)
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9!@#$%^*]+$/)
      .min(3)
      .max(20)
      .required(),
  });
  // 입력 데이터 검증
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; // Not Found
    ctx.body = result.error;
    return;
  }

  const { username, password } = ctx.request.body; // client(frontend)에서 던져주는 데이터(post)
  try {
    // 몽고디비 명령어
    // User 클래스 정적 함수
    const exists = await User.findByUsername(username); //몽고디비에서 명령어 findOne
    if (exists) {
      ctx.status = 409; // Conflict
      return;
    }
    // 객체 선언
    const user = new User({
      username,
    });
    // 객체 user 메소드 함수
    await user.setPassword(password);
    await user.save();

    const data = user.toJSON();
    delete data.hashedPassword;
    ctx.body = data; // client(frontend)에게 던져 주는 것(auth)

    // 쿠키 만들기
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true, // 이부분 false
    });
  } catch (e) {
    throw (500, e);
  }
};

exports.login = async (ctx) => {
  const { username, password } = ctx.request.body;
  if (!username || !password) {
    ctx.status = 401; // unauthorized
    return;
  }

  try {
    // 몽고디비 명령어
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401; // unauthorized
      return;
    }
    const valid = await user.checkPassword(password);
    if (!valid) {
      ctx.status = 401; // unauthorized
      return;
    }
    const data = user.toJSON();
    delete data.hashedPassword;
    ctx.body = data; // client(frontend)에게 던져 주는 것(auth)

    // 쿠키 만들기
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, //7일
      httpOnly: true, // 이부분 false
    });
  } catch (e) {
    throw (500, e);
  }
};

exports.check = async (ctx) => {
  const { user } = ctx.state;
  if (!user) {
    ctx.status = 401; //Unauthorized
    return;
  }
  ctx.body = user;
};

exports.logout = async (ctx) => {
  ctx.cookies.set('access_token'); // cookies 삭제
  ctx.status = 204; // No Content
};
