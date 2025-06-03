// 걍 기본 학습용 도멜 (기본으로 생성된것)
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

export const User = sequelize.define(
  "User",
  {
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
    agreeDongil: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "프로필 이미지 경로",
    },
  },
  {
    tableName: "users", // 실제 테이블명을 명시적으로 고정
    freezeTableName: true, // Sequelize가 자동 복수형 안 만들게
  }
);
