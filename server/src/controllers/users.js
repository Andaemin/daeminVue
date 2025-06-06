import { User } from "../models/users.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (err) {
    const errMsg = `${err.message} 사용자 목록 조회 중 오류 발생`;
    res.status(500).json({ message: "사용자 데이터를 불러올 수 없습니다.", error: errMsg });
  }
};

export const oneUser = async (req, res) => {
  try {
    const userOne = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!userOne) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }
    res.json(userOne);
  } catch (err) {
    const errMsg = `${err.message} 사용자 조회 중 오류 발생`;
    res.status(500).json({ message: "사용자 조회 중 오류가 발생했습니다.", error: errMsg });
  }
};

export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, email, nickname } = req.body;

    const userUpdate = await User.findByPk(userId);
    if (!userUpdate) {
      // 수정: !userUpdate로 변경 (기존에 잘못된 조건이었음)
      return res.status(404).json({ message: "수정할 사용자를 찾을 수 없습니다." });
    }

    await userUpdate.update({ name, email, nickname });

    // 수정된 사용자 정보 반환
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    res.json({
      message: "사용자 정보가 성공적으로 수정되었습니다.",
      user: updatedUser,
    });
  } catch (err) {
    const errMsg = `${err.message} 사용자 수정 중 오류 발생`;
    res.status(500).json({ message: "사용자 정보 수정 중 오류가 발생했습니다.", error: errMsg });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userDelete = await User.destroy({ where: { id: req.params.id } });

    if (!userDelete) {
      return res.status(404).json({ message: "삭제할 사용자를 찾을 수 없습니다." });
    }

    res.status(200).json({ message: "사용자가 성공적으로 삭제되었습니다." });
  } catch (err) {
    const errMsg = `${err.message} 사용자 삭제 중 오류 발생`;
    res.status(500).json({ message: "사용자 삭제 중 오류가 발생했습니다.", error: errMsg });
  }
};

// 프로필 이미지 업데이트 (오타 수정)
export const updateProfileImage = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id); // 수정: req, params.id → req.params.id
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "업로드할 이미지 파일이 없습니다." });
    }

    const imagePath = `/uploads/profile/${req.file.filename}`;
    await user.update({ profileImage: imagePath });

    res.json({
      message: "프로필 이미지가 성공적으로 업데이트되었습니다.",
      profileImage: imagePath,
    });
  } catch (err) {
    res.status(500).json({ message: "이미지 업로드 중 오류가 발생했습니다.", error: err.message });
  }
};
