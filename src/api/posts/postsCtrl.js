const Post = require('../../modules/post');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
const Joi = require('joi');
// 로그인한 사용자가 포스트 작성자인지 확인하는 미들웨어
exports.checkOwnPost = async (ctx, next) => {
  const { user, post } = ctx.state;
  // console.log(post.user.id.toString());
  // console.log(user.id);
  if (post.user.id.toString() !== user.id) {
    ctx.status = 403; // Forbiden
    return;
  }
  return next();
};
// 포스트 ID를 기반으로 포스트를 조회하고 ctx.state에 저장하는 미들웨어
exports.getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad Request
    return;
  }
  try {
    const post = await Post.findById(id);
    if (!post) {
      ctx.status = 404; //Not Found
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, 3);
  }
};
// 포스트 작성 API
exports.write = async (ctx) => {
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400; //Bad Reqeust
    ctx.body = result.error;
    return;
  }
  const { title, body, tags } = ctx.request.body;

  // postCollection
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save(); // 몽고디비 명령어
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
// 포스트 목록 조회 API
exports.list = async (ctx, next) => {
  const page = Number(ctx.query.page || '1');
  if (page < 1) {
    ctx.status = 400;
    return;
  }
  const { tag, username } = ctx.query;
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };
  console.log(query);
  try {
    // 몽고디비 명령어
    const showNum = 5;
    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(showNum)
      .skip((page - 1) * showNum)
      .lean()
      .exec();
    const postCnt = await Post.countDocuments(query).exec();
    ctx.set('last-page', Math.ceil(postCnt / showNum));
    ctx.body = posts.map((post) => ({
      ...post,
      body:
        post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
    }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
// 특정 포스트 조회 API
exports.read = async (ctx) => {
  const { id } = ctx.params;
  try {
    // 몽고디비 명령어
    const post = await Post.findById(id).exec();
    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
// 특정 포스트 삭제 API
exports.remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    // 몽고디비 명령어
    await Post.findByIdAndDelete(id).exec();
    ctx.status = 204; // No Comment
  } catch (e) {
    ctx.throw(500, e);
  }
};
exports.update = async (ctx) => {
  const { id } = ctx.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  try {
    // 몽고디비 명령어
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true,
    }).exec();

    if (!post) {
      ctx.status = 404; // Not Found
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
