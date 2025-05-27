import { User } from "../models/users";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (err) {
    const errMsg = `${err.message} 암튼 이래서 에러임.`;
    res.status(500).json({ message: " 유저 데이터 못불러옴.", error: errMsg });
  }
};

export const oneUsers = async (req, res) => {
  try {
    // const users = await User.
  } catch (err) {
    const errMsg = `${err.message} 암튼 이래서 에러임.`;
    res.status(500).json({ message: " 에러임 ", error: errMsg });
  }
};
