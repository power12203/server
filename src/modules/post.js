const mongoose = require('mongoose');
const { Schema } = mongoose;

// console.log('user', mongoose.Types.ObjectId);
const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    id: mongoose.Types.ObjectId,
    username: String,
  },
});

const Post = mongoose.model('Post', PostSchema, 'postCollection');

module.exports = Post;
