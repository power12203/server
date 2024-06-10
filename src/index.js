require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const api = require('./api');
const jwtMiddleware = require('./lib/jwtMiddleware');

// 환경 파일 가져오기
const { PORT, MONGO_URI } = process.env;

//몽고디비 연결
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((e) => {
    console.error(e);
  });

// server
const app = new Koa();
// 라우터 설정
const router = new Router();
router.use('/api', api.routes());
router.get('/', async (ctx) => {
  ctx.body = 'Hello from server'; // 클라이언트가 요구하는 형태로 응답할 수 있음
});

app
  .use(bodyParser())
  .use(jwtMiddleware) // cookies 가져오기
  .use(router.routes())
  .use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
