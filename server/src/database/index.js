// database/index.js
import { sequelize } from "./connection.js";
import models from "../models/index.js";

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB 연결");
    await sequelize.sync({ alter: true });
    console.log("이거 뜨면 동기화 된거임");
  } catch (error) {
    console.error("❌ 실패:", error);
  }
};

export { sequelize, models };
