const Router = require('koa-router');
const postsCtrl = require('./postsCtrl');
const checkLoggedIn = require('../../lib/checkLoggedIn');

const posts = new Router();

// 라우터: /api/posts
posts.get('/', postsCtrl.list); // 포스트 목록 조회
posts.post('/', checkLoggedIn, postsCtrl.write); // 포스트 작성

// 라우터: /api/posts/:id
const post = new Router();
post.get('/', postsCtrl.read); // 특정 포스트 조회
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove); // 특정 포스트 삭제
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update); // 특정 포스트 수정

// /api/posts/:id 하위 라우트 설정
posts.use('/:id', postsCtrl.getPostById, post.routes());

module.exports = posts;
