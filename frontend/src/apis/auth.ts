import { instance, fileInstance } from "./instance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const kakaoLogin = async (access_code: string) => {
  const response = await instance.post("/members/login/kakao", {
    code: access_code,
  });
  if (response.data.statusCode === 200) {
    AsyncStorage.setItem("accessToken", response.data.data.accessToken);
  }
  return response.data;
};

export const kakaoProfile = async (access_Token: string) => {
  try {
    const response = await instance.get("/members/profile", {
      headers: {
        Authorization: `Bearer ${access_Token}`,
      },
    });
    // console.log("kakao1---------------------", response.data);
    if (response.data.statusCode == 200) {
      // console.log("kakao2---------------------", response.data);
      return response.data;
    } else if (response.data.statusCode == 401) {
      // console.log("kakao3---------------------", response.data);
      console.warn("회원 권한 없음");
    } else if (response.data.statusCode == 500) {
      // console.log("kakao4---------------------", response.data);
      console.warn("내부 서버 에러");
    }
  } catch (err) {
    // console.log("kakao5---------------------", err);
    console.log(err);
  }
};

export const kakaoDelete = async () => {
  try {
    const response = await instance.delete("/members/profile");
    if (response.data.statusCode === 200) {
      console.log("계정삭제성공");
    } else if (response.data.statusCode === 401) {
      console.log("회원 권한 없음");
    } else if (response.data.statusCode === 500) {
      console.log("내부 서버 에러");
    } else if (response.data.statusCode === 503) {
      console.log("카카오 연결 끊기 실패");
    }
  } catch (e) {
    console.log(e);
  }
export const editKakaoNickname = async (formData) => {
  const response = await fileInstance.put(
    "/members/profile/formData",
    formData
  );
  return response.data;
};
