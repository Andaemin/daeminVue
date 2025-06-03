import { User } from "../models/users.js";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { userId, password } = req.body;

  try {
    const user = await User.findOne({ where: { userId } });
    if (!user) {
      return res.status(400).json({ message: "존재하지 않는 아이디" });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: "비밀번호가 틀렸습니다" });
    }

    const token = jwt.sign(
      { id: user.id, userId: user.userId, nickname: user.nickname },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.status(200).json({
      message: "로그인 성공",
      token,
      user: {
        id: user.id,
        userId: user.userId,
        nickname: user.nickname,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("로그인 오류나유", err);
    res.status(500).json({ message: "로그인 중 에러 발생" });
  }
};
