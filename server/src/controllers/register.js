import { User } from "../models/users.js";

export const register = async (res, req) => {
  const { userId, email, password, name, nickname, agreeDongil } = req.body;
  if (!agreeDongil) {
    return res.status(400).json({ message: "동의 안함." });
  }
  try {
    const emailFind = await User.findAll({ where: { email } });
    if (emailFind) {
      res.status(400).json({ message: "이메일 중복." });
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
    const errMsg = `${err.message} 암튼 이래서 에러임`;
    res.status(500).json({ error: errMsg });
  }
};
