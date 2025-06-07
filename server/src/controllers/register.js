import { User } from "../models/users.js";
import { checkAndAwardBadges } from "./badge.js";

export const register = async (req, res) => {
  const { userId, email, password, name, nickname, agreeDongil, job, brand } = req.body;

  if (!agreeDongil) {
    return res.status(400).json({ message: "동의 안함." });
  }

  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    return res.status(400).json({ message: "이메일 형식 틀림." });
  }

  try {
    const userIdFind = await User.findOne({ where: { userId } });
    const emailFind = await User.findOne({ where: { email } });

    if (emailFind) {
      return res.status(400).json({ message: "이미 등록된 이메일입니다." });
    }
    if (userIdFind) {
      return res.status(400).json({ message: "이미 아이디 사용중임." });
    }

    const createUser = await User.create({
      userId,
      email,
      password,
      name,
      nickname,
      agreeDongil,
      job,
      brand: brand || "Solo Roaster", // 기본값 처리
    });

    await checkAndAwardBadges(createUser.id);

    res.status(201).json({
      message: "success register",
      user: {
        id: createUser.id,
        email: createUser.email,
        userId: createUser.userId,
        nickname: createUser.nickname,
      },
    });
  } catch (err) {
    console.error("회원가입 에러", err);
    const errMsg = `${err.message} 암튼 이래서 에러임`;
    res.status(500).json({ error: errMsg });
  }
};
