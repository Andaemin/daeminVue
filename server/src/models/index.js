import { User, associateUser } from "./users.js";
import { Post, associatePost } from "./post.js";
import { Like, associateLike } from "./like.js"; // 추가

const models = { User, Post, Like }; // Like 추가

associateUser(models);
associatePost(models);
associateLike(models); // 추가

export default models;
