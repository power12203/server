const Router = require('koa-router');
const posts = require('./posts');
const auth = require('./auth');

const api = new Router();
// /api/posts 경로에 대한 포스트 라우터 설정
api.use('/posts', posts.routes());
// /api/auth 경로에 대한 인증 라우터 설정
api.use('/auth', auth.routes());

module.exports = api;
