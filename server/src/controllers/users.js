import { User } from "../models/users.js";

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

export const oneUser = async (req, res) => {
  try {
    const userOne = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!userOne) {
      return res.status(404).json({ message: "유저없음" });
    }
    res.json(userOne);
  } catch (err) {
    const errMsg = `${err.message} 유저찾기 에러임.`;
    res.status(500).json({ message: " 암튼 에러임 ", error: errMsg });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, nickname } = req.body;

    const userUpdate = await User.findByPk(userId);
    if (userUpdate) {
      return res.status(404).json({ messege: "수정할 유저 데이터 없음" });
    }
    await userUpdate.update({ name, email, nickname });
  } catch (err) {
    const errMsg = `${err.messege} 수정 에러임`;
    res.status(123).json({ messege: "엄튼 수정 에러났음", error: errMsg });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userDelete = await User.destroy({ where: { id: req.params.id } });

    if (!userDelete) {
      return res.status(404).json({ message: "삭제할 유저 없다" });
    }
  } catch (err) {
    const errMsg = `${err.messege} 삭제 이래서 에러임`;
    res.status(123).json({ messege: "암튼 삭제 에러났음", error: errMsg });
  }
};
