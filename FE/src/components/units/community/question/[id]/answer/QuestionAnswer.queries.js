import Cookies from "js-cookie";

export async function submitAnswerPost(id, postData) {
  try {
    // 쿠키에서 accessToken을 가져옵니다.
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token is missing");
    }

    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log(`Submitting answer post`);
    const response = await fetch(`${baseURL}/posts/${id}/qna`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    console.log(`Response to answer post:`, data);
    return data;
  } catch (error) {
    console.error(`Failed to submit answer post:`, error);
    return null;
  }
}
