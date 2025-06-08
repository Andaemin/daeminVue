// server/src/controllers/agora.js
import { Debate } from "../models/debate.js";
import { Vote } from "../models/vote.js";
import { User } from "../models/users.js";
import { Op } from "sequelize";
import jwt from "jsonwebtoken";

// JWT 토큰에서 사용자 정보 추출
const getUserFromToken = (token) => {
  try {
    if (!token) return null;
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

// 전체 토론 목록 조회
export const getAllDebates = async (req, res) => {
  try {
    const { category, page = 1, limit = 20, sort = "latest", active = "true" } = req.query;

    // 필터 조건 설정
    const whereConditions = {};

    if (active === "true") {
      whereConditions.isActive = true;
    }

    if (category && category !== "all") {
      whereConditions.category = category;
    }

    // 정렬 조건 설정
    let orderConditions;
    switch (sort) {
      case "popular":
        orderConditions = [
          ["totalVotes", "DESC"],
          ["createdAt", "DESC"],
        ];
        break;
      case "votes":
        orderConditions = [["totalVotes", "DESC"]];
        break;
      case "oldest":
        orderConditions = [["createdAt", "ASC"]];
        break;
      case "latest":
      default:
        orderConditions = [["createdAt", "DESC"]];
        break;
    }

    // 페이지네이션 계산
    const offset = (page - 1) * limit;

    const debates = await Debate.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "nickname", "profileImage", "job", "brand"],
        },
      ],
      order: orderConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    // 응답 데이터 포맷팅
    const formattedDebates = debates.rows.map((debate) => ({
      id: debate.id,
      title: debate.title,
      description: debate.description,
      optionA: debate.optionA,
      optionB: debate.optionB,
      votesA: debate.votesA,
      votesB: debate.votesB,
      totalVotes: debate.totalVotes,
      category: debate.category,
      author: debate.authorNickname || debate.authorName,
      authorId: debate.authorId,
      createdAt: debate.createdAt,
      updatedAt: debate.updatedAt,
      comments: debate.comments,
      isActive: debate.isActive,
      authorInfo: debate.author,
    }));

    res.json({
      debates: formattedDebates,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(debates.count / limit),
        totalItems: debates.count,
        itemsPerPage: parseInt(limit),
      },
    });
  } catch (error) {
    console.error("토론 목록 조회 실패:", error);
    res.status(500).json({
      message: "토론 목록을 불러오는 데 실패했습니다.",
      error: error.message,
    });
  }
};

// 특정 토론 상세 조회
export const getDebateById = async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    const user = getUserFromToken(authHeader);

    const debate = await Debate.findByPk(id, {
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "nickname", "profileImage", "job", "brand"],
        },
      ],
    });

    if (!debate) {
      return res.status(404).json({ message: "토론을 찾을 수 없습니다." });
    }

    // 사용자의 투표 여부 확인
    let userVote = null;
    if (user) {
      userVote = await Vote.findOne({
        where: {
          userId: user.id,
          debateId: debate.id,
        },
      });
    }

    // 응답 데이터 포맷팅
    const responseData = {
      id: debate.id,
      title: debate.title,
      description: debate.description,
      optionA: debate.optionA,
      optionB: debate.optionB,
      votesA: debate.votesA,
      votesB: debate.votesB,
      totalVotes: debate.totalVotes,
      category: debate.category,
      author: debate.authorNickname || debate.authorName,
      authorId: debate.authorId,
      createdAt: debate.createdAt,
      updatedAt: debate.updatedAt,
      comments: debate.comments,
      isActive: debate.isActive,
      endDate: debate.endDate,
      authorInfo: debate.author,
      userVote: userVote ? userVote.option : null,
      hasVoted: !!userVote,
    };

    res.json(responseData);
  } catch (error) {
    console.error("토론 상세 조회 실패:", error);
    res.status(500).json({
      message: "토론 정보를 불러오는 데 실패했습니다.",
      error: error.message,
    });
  }
};

// 새 토론 생성
export const createDebate = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const user = getUserFromToken(authHeader);

    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const { title, description, optionA, optionB, category = "general", endDate = null } = req.body;

    // 입력값 검증
    if (!title || !description || !optionA || !optionB) {
      return res.status(400).json({
        message: "제목, 설명, 두 개의 선택지는 필수입니다.",
      });
    }

    if (title.length < 5 || title.length > 200) {
      return res.status(400).json({
        message: "제목은 5자 이상 200자 이하로 입력해주세요.",
      });
    }

    if (description.length < 10 || description.length > 1000) {
      return res.status(400).json({
        message: "설명은 10자 이상 1000자 이하로 입력해주세요.",
      });
    }

    if (optionA.length > 100 || optionB.length > 100) {
      return res.status(400).json({
        message: "선택지는 각각 100자 이하로 입력해주세요.",
      });
    }

    if (optionA.trim() === optionB.trim()) {
      return res.status(400).json({
        message: "두 선택지는 서로 달라야 합니다.",
      });
    }

    // 작성자 정보 조회
    const author = await User.findByPk(user.id);
    if (!author) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 토론 생성
    const newDebate = await Debate.create({
      title: title.trim(),
      description: description.trim(),
      optionA: optionA.trim(),
      optionB: optionB.trim(),
      category,
      authorId: user.id,
      authorName: author.name,
      authorNickname: author.nickname,
      endDate: endDate ? new Date(endDate) : null,
    });

    // 생성된 토론 정보 반환
    const responseData = {
      id: newDebate.id,
      title: newDebate.title,
      description: newDebate.description,
      optionA: newDebate.optionA,
      optionB: newDebate.optionB,
      votesA: newDebate.votesA,
      votesB: newDebate.votesB,
      totalVotes: newDebate.totalVotes,
      category: newDebate.category,
      author: newDebate.authorNickname || newDebate.authorName,
      authorId: newDebate.authorId,
      createdAt: newDebate.createdAt,
      updatedAt: newDebate.updatedAt,
      comments: newDebate.comments,
      isActive: newDebate.isActive,
      endDate: newDebate.endDate,
    };

    res.status(201).json({
      message: "토론이 성공적으로 생성되었습니다.",
      debate: responseData,
    });
  } catch (error) {
    console.error("토론 생성 실패:", error);
    res.status(500).json({
      message: "토론 생성에 실패했습니다.",
      error: error.message,
    });
  }
};

// 토론 투표
export const voteDebate = async (req, res) => {
  try {
    const { id } = req.params;
    const { option } = req.body;
    const authHeader = req.headers.authorization;
    const user = getUserFromToken(authHeader);

    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    // 입력값 검증
    if (!option || !["A", "B"].includes(option)) {
      return res.status(400).json({
        message: "올바른 선택지를 선택해주세요. (A 또는 B)",
      });
    }

    // 토론 존재 확인
    const debate = await Debate.findByPk(id);
    if (!debate) {
      return res.status(404).json({ message: "토론을 찾을 수 없습니다." });
    }

    // 토론 활성화 상태 확인
    if (!debate.isActive) {
      return res.status(400).json({ message: "종료된 토론입니다." });
    }

    // 토론 종료일 확인
    if (debate.endDate && new Date() > debate.endDate) {
      return res.status(400).json({ message: "투표 기간이 종료되었습니다." });
    }

    // 기존 투표 확인
    const existingVote = await Vote.findOne({
      where: {
        userId: user.id,
        debateId: debate.id,
      },
    });

    if (existingVote) {
      return res.status(400).json({
        message: "이미 투표하셨습니다. 한 번만 투표할 수 있습니다.",
      });
    }

    // 투표 기록 생성
    await Vote.create({
      userId: user.id,
      debateId: debate.id,
      option,
      ipAddress: req.ip || req.connection.remoteAddress,
    });

    // 토론 투표 수 업데이트
    const updateData = {
      totalVotes: debate.totalVotes + 1,
    };

    if (option === "A") {
      updateData.votesA = debate.votesA + 1;
    } else {
      updateData.votesB = debate.votesB + 1;
    }

    await debate.update(updateData);

    // 업데이트된 토론 정보 반환
    const updatedDebate = await Debate.findByPk(id);

    res.json({
      message: "투표가 완료되었습니다.",
      debate: {
        id: updatedDebate.id,
        votesA: updatedDebate.votesA,
        votesB: updatedDebate.votesB,
        totalVotes: updatedDebate.totalVotes,
      },
      userVote: option,
    });
  } catch (error) {
    console.error("투표 실패:", error);
    res.status(500).json({
      message: "투표 처리 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
};

// 토론 수정 (작성자만)
export const updateDebate = async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    const user = getUserFromToken(authHeader);

    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const debate = await Debate.findByPk(id);
    if (!debate) {
      return res.status(404).json({ message: "토론을 찾을 수 없습니다." });
    }

    // 작성자 권한 확인
    if (debate.authorId !== user.id) {
      return res.status(403).json({ message: "토론을 수정할 권한이 없습니다." });
    }

    // 투표가 시작된 토론은 수정 제한
    if (debate.totalVotes > 0) {
      return res.status(400).json({
        message: "투표가 시작된 토론은 수정할 수 없습니다.",
      });
    }

    const { title, description, category, isActive, endDate } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (category !== undefined) updateData.category = category;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    await debate.update(updateData);

    res.json({
      message: "토론이 성공적으로 수정되었습니다.",
      debate: await Debate.findByPk(id),
    });
  } catch (error) {
    console.error("토론 수정 실패:", error);
    res.status(500).json({
      message: "토론 수정에 실패했습니다.",
      error: error.message,
    });
  }
};

// 토론 삭제 (작성자만)
export const deleteDebate = async (req, res) => {
  try {
    const { id } = req.params;
    const authHeader = req.headers.authorization;
    const user = getUserFromToken(authHeader);

    if (!user) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const debate = await Debate.findByPk(id);
    if (!debate) {
      return res.status(404).json({ message: "토론을 찾을 수 없습니다." });
    }

    // 작성자 권한 확인
    if (debate.authorId !== user.id) {
      return res.status(403).json({ message: "토론을 삭제할 권한이 없습니다." });
    }

    // 투표가 많이 진행된 토론은 삭제 대신 비활성화
    if (debate.totalVotes >= 10) {
      await debate.update({ isActive: false });
      return res.json({
        message: "투표가 진행된 토론은 비활성화되었습니다.",
      });
    }

    // 관련 투표 기록도 삭제
    await Vote.destroy({
      where: { debateId: debate.id },
    });

    await debate.destroy();

    res.json({ message: "토론이 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("토론 삭제 실패:", error);
    res.status(500).json({
      message: "토론 삭제에 실패했습니다.",
      error: error.message,
    });
  }
};
