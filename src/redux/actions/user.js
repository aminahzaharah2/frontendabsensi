import axios from "axios";
import { BACKEND_BASE_URL } from "../../config/base_url";

export const loadUser = () => async (dispatch) => {
  const token = localStorage.getItem("token");
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const { data } = await axios.get(`${BACKEND_BASE_URL}api/user`, {
      headers,
      withCredentials: true,
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error,
    });
  }
};
