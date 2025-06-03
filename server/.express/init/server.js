import { connectDB } from "../../src/database/index.js";
import dotenv from "dotenv";
dotenv.config();

try {
  await connectDB();
  console.log("제대로 db 연결됨");
} catch (err) {
  console.error("에러러남", err);
  process.exit(1); // 실패하면 종료되는거임.
}
connectDB();
export const PORT = normalizePort(process.env.PORT || "3008");

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
