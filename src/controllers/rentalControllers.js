import res from "express/lib/response.js";
import Notice from "../models/notice.js";

export const rentalNoticeWrite = async (req, res) => {
  const { title, description, writer } = req.body;
  console.log(title, description, writer);

  try {
    const notice = await Notice.create({
      title,
      description,
      writer,
      createdAt: Date.now(),
    });
    res.json({ ok: "true", notice });
  } catch (error) {
    res.json({ ok: "false", error });
  }
};

export const rentalNotice = async (req, res) => {
  try {
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    const count = await Notice.count();
    res.json({ ok: "ture", notices, count });
  } catch (error) {
    res.json({ ok: "false", error });
  }
};

// 게시판 디테일
export const rentalNoticeDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const detail = await Notice.findById(id);
    res.json({ ok: "true", detail });
  } catch (error) {
    res.json({ ok: "false", error });
  }
};
