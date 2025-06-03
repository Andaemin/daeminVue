import { User, associateUser } from "./users.js";
import { Post, associatePost } from "./post.js";

const models = { User, Post };

associateUser(models);
associatePost(models);

export default models;
