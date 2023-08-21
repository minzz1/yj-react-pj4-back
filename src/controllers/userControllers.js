import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//회원가입 컨트롤러
export const postRegisterMember = async (req, res) => {
  try {
    const { username, password, email, name, mobile, address2 } = req.body;
    const address = address2;
    const user = await User.create({
      username,
      password,
      name,
      email,
      mobile,
      address,
      createdAt: Date.now(),
    });
    res.json({ ok: "true", user });
  } catch (error) {
    console.log(error);
  }
};

//로그인 컨트롤러
export const postUsernameSignIn = async (req, res) => {
  const { username, password } = req.body;
  // 에러처리
  if (username === "" || password === "") {
    res.json({
      ok: "false",
      message: "아이디와 패스워드는 반드시 입력해야 합니다.",
    });
  }

  //아이디 확인
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ ok: "false", message: "해당하는 유저가 없습니다." });
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(401).json({ ok: "false", message: "아이디/패스워드가 다릅니다." });
  }

  //쿠키 전송

  try {
    const accessToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.ACCESS_SECRET
    );
    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: false,
      sameSite: "None",
    });
    res.status(200).json({ ok: "true" });
  } catch (error) {
    console.log(error);
  }
};

//비동기방식! async
export const getLoginSuccess = async (req, res) => {
  try {
    const token = req.cookies?.accessToken;
    const data = jwt.verify(token, process.env.ACCESS_SECRET);
    const userData = await User.findOne({ _id: data.id });

    res.status(200).json({
      ok: "true",
      email: userData.email,
      name: userData.username,
      avatar: userData.avatarUrl,
    });
  } catch (error) {
    res.status(400).json({ ok: "false" });
    console.log(error);
  }
};

//로그아웃
export const logout = async (req, res) => {
  try {
    res.cookie("accessToken", "", {
      secure: true,
      httpOnly: false,
      sameSite: "None",
    });
    res.status(200).json({ ok: "true", message: "로그아웃 성공" });
  } catch (error) {
    console.log(error);
  }
};

//카카오 로그인
export const kakaoLogin = async (req, res) => {
  try {
    // 카카오 2단계 토큰 얻기
    const KAKAO_BASE_PATH = "https://kauth.kakao.com/oauth/token";
    const config = {
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_CLIENT_ID,
      redirect_uri: process.env.KAKAO_REDIRECT_URL,
      code: req.body.code,
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${KAKAO_BASE_PATH}?${params}`;

    const data = await fetch(finalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const tokenRequest = await data.json();
    console.log(tokenRequest.access_token);

    // 카카오 3단계 ....
    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;
      const userRequest = await fetch("https://kapi.kakao.com/v2/user/me", {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${access_token}`,
        },
      });
      const userData = await userRequest.json();
      // console.log(userData);

      // 로그인 로직
      const {
        kakao_account: {
          profile: { nickname, thumbnail_image_url },
          email,
        },
      } = userData;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        // 로그인
        try {
          const accessToken = jwt.sign(
            {
              id: existingUser._id,
            },
            process.env.ACCESS_SECRET
          );
          res.cookie("accessToken", accessToken, {
            secure: true,
            httpOnly: false,
            sameSite: "None",
          });
          res.status(200).json({ ok: "true" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ ok: "false" });
        }
      } else {
        // 회원가입
        const user = await User.create({
          name: nickname,
          username: nickname,
          email: email,
          avatarUrl: thumbnail_image_url,
          createdAt: Date.now(),
        });

        //회원가입 후 로그인
        try {
          const accessToken = jwt.sign(
            {
              id: user._id,
            },
            process.env.ACCESS_SECRET
          );
          res.cookie("accessToken", accessToken, {
            secure: true,
            httpOnly: false,
            sameSite: "None",
          });
          res.status(200).json({ ok: "true" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ ok: "false" });
        }
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ ok: "false" });
  }
};
