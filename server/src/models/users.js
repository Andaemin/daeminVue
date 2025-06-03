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
      // unique: true,
      allowNull: false,
      comment: "로그인용 사용자 ID",
    },
    email: {
      type: DataTypes.STRING,
      // unique: true,
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
    job: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "직책 (점주, 직원 등)",
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Solo Roaster",
      comment: "소속 브랜드 (없을 경우 Solo Roaster)",
    },
  },
  {
    tableName: "users",
    freezeTableName: true,
  }
);
export const associateUser = (models) => {
  User.hasMany(models.Post, { foreignKey: "userId", as: "posts" });
};
