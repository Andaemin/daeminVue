// server/src/database/index.js (수정된 버전)
import { sequelize } from "./connection.js";
import models from "../models/index.js"; // default import 사용

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("데이터베이스 연결이 성공적으로 설정되었습니다.");

    // 개발 환경에서만 동기화 (주의: 프로덕션에서는 사용하지 말 것)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true });
      console.log("모든 모델이 동기화되었습니다.");
    }
  } catch (error) {
    console.error("데이터베이스 연결에 실패했습니다:", error);
    process.exit(1);
  }
};

export { connectDB, sequelize };
export default models;
