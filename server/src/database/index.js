import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    // logging: (msg) => logger.debug(msg),
    logging: false, //| 로그 완전 제거용
  }
);

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
