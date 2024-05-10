const Router = require('koa-router');
const postsCtrl = require('./postsCtrl');
const checkLoggedIn = require('../../lib/checkLoggedIn')

const posts = new Router();

// 라우터: /api/posts
posts.get('/', postsCtrl.list);
posts.post('/', checkLoggedIn, postsCtrl.write);

// 라우터: /api/posts/:id
const post = new Router();
post.get('/', postsCtrl.read);
post.delete('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.remove);
post.patch('/', checkLoggedIn, postsCtrl.checkOwnPost, postsCtrl.update);

posts.use('/:id', postsCtrl.getPostById, post.routes());

module.exports = posts;
