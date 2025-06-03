import { User } from "../models/users.js";

export const register = async (req, res) => {
  const { userId, email, password, name, nickname, agreeDongil } = req.body;
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
      res.status(400).json({ message: "이미 등록된 이메일입니다." });
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
    });

    res.status(201).json({
      message: "success resister",
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
