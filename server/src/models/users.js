// const usersModel = new (class UsersModel {
//   #users = [
//     { name: "tj", title: "the man who created Express.js", github: "https://github.com/tj" },
//     { name: "Dalufishe", title: "haha! this is me", github: "https://github.com/Dalufishe" },
//   ];

//   getUsers() {
//     return this.#users;
//   }
// })();

// export default usersModel;

import { DataTypes } from "sequelize";
import { sequelize } from "../database/index.js";

export const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    comment: "로그인용 사용자 ID",
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nickname: {
    type: DataTypes.STRING,
  },
  agreePersonalInfo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
