require('dotenv').config(); // 환경 변수 설정을 위한 dotenv 모듈 호출
const Koa = require('koa'); // Koa 웹 프레임워크 호출
const Router = require('koa-router'); // Koa 라우터 호출
const bodyParser = require('koa-bodyparser'); // HTTP 요청 파싱을 위한 bodyParser 호출
const mongoose = require('mongoose'); // MongoDB 연결을 위한 mongoose 호출
const api = require('./api'); // API 라우터 호출
const jwtMiddleware = require('./lib/jwtMiddleware'); // JWT 미들웨어 호출

// 환경 변수 가져오기
const { PORT, MONGO_URI } = process.env;

// MongoDB 연결
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((e) => {
    console.error(e);
  });

// Koa 애플리케이션 생성
const app = new Koa();

// 라우터 설정
const router = new Router();
router.use('/api', api.routes()); // '/api'로 시작하는 모든 요청은 api 라우터에게 전달됩니다.
router.get('/', async (ctx) => {
  ctx.body = 'Hello from server'; // 루트 경로('/') 요청에 대한 응답입니다.
});

// Koa 애플리케이션 설정
app
  .use(bodyParser()) // HTTP 요청의 body 파싱을 위한 bodyParser 미들웨어 등록
  .use(jwtMiddleware) // JWT 미들웨어 등록: 인증된 사용자 확인을 위해 토큰을 검증합니다.
  .use(router.routes()) // 라우터 등록
  .use(router.allowedMethods()); // 허용된 HTTP 메서드 외의 요청에 대한 응답을 설정합니다.

const port = PORT || 4000; // 포트 설정: 환경 변수에서 가져오거나 기본값으로 4000 사용
app.listen(port, () => {
  console.log(`Listening to port ${port}`); // 서버 시작 메시지
});
