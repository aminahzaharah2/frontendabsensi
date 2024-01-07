import axios from "axios";
import logo from "../assets/20231121_094728_0000_2-removebg-preview 1.svg";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BACKEND_BASE_URL, BASE_URL } from "../config/base_url";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function LoginPage({ children }) {
  const [email, setEmail] = useState("");
  const { user } = useSelector((state) => state.user);

  const [password, setPassword] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [hiddenPass, setHiddenPass] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);

  const [errData, setErrData] = useState({
    email: "",
    password: "",
  });
  const [redirect, setRedirect] = useState(false);
  const nav = useNavigate();

  const changeHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
      const response = await axios.post(`${BACKEND_BASE_URL}api/login`, data);
=======

      const response = await axios.post(
        `${BACKEND_BASE_URL}/api/login`,
        data
      );

>>>>>>> a53e97aef8ccff674c24324685979e61273ee8d5

      localStorage.setItem("token", response.data.message);
      const content = response.data.message;
      Swal.fire({
        title: "Login berhasil",
        showConfirmButton: false,
        timer: 1000,
        icon: "success",
        didClose: () => {
          window.location.href = `${BASE_URL}/home`;
        },
      });

      setRedirect(true);
    } catch (e) {
      setErrData({
        email: e?.response?.data?.errors?.email,
        password: e?.response?.data?.errors?.password,
      });
      console.log(e?.response?.data?.message);
      Swal.fire({
        icon: "error",
        title: "Login Gagal",
        text: "Username atau Password Salah",
        showCancelButton: false,
      });
    }
  };

  useEffect(() => {
    if (user?.role !== undefined) {
      window.location.href = `${BASE_URL}`;
    }
  }, [user]);

  return (
    <div className="w-full h-[95vh]block md:flex lg:flex xl:flex justify-center  items-center">
      <div className="w-[100%] mt-8 md:w-[60%] lg:w-[50%] xl:w-[50%] relative h-full justify-center items-center ">
        <img
          src={logo}
          className="h-[100px] object-cover  mx-auto mt-6 w-[510px] hidden md:block lg:block xl:block"
          alt=""
        />
        <div className=" p-2 w-[100%]   mx-auto mt-4 pl-[8px] ">
          <form onSubmit={login}>
            <div className="w-[90%] -300 mx-auto justify-center items-center ">
              <h3 className="font-abc mt-[100px] md:mt-[10px] lg:mt-[10px] xl:mt-[10px] ml-8 text-2xl md:text-xl lg:text-[16px] xl:text-[16px]">
                Login dibawah untuk akses akunmu
              </h3>

              <div className="mt-8 ml-8">
                <h1 className="font-abc mb-1">Username</h1>
                <input
                  type="text"
                  name="email"
                  onChange={(e) => changeHandler(e)}
                  className="border-2  rounded-xl pl-3 w-[90%] h-[36px] font-abc text-[14px] border-slate-400"
                  placeholder="Masukan Username"
                />
                {errData.email ? (
                  <p className="text-sm text-red-500">*{errData.email}</p>
                ) : null}
              </div>
              <div className="mt-4 ml-8 relative">
                <h1 className="font-abc mb-1">Password</h1>
                <input
                  type={hiddenPass ? "text" : "password"}
                  name="password"
                  onChange={(e) => changeHandler(e)}
                  className="border-2  rounded-xl pl-3 w-[90%] h-[36px] font-abc text-[14px] border-slate-400"
                  placeholder="Masukan Password"
                />
                {hiddenPass ? (
                  <AiOutlineEyeInvisible
                    onClick={() => setHiddenPass(false)}
                    className="absolute right-[70px] top-[34px]"
                    size={24}
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() => setHiddenPass(true)}
                    className="absolute right-[70px] top-[34px]"
                    size={24}
                  />
                )}

                {errData.password ? (
                  <p className="text-sm text-red-500">*{errData.password}</p>
                ) : null}
              </div>
              <div className="mt-5 ml-8">
                <button
                  onClick={login}
                  type="submit"
                  className="rounded-xl  font-abc text-white w-[90%] h-[38px] bg-[#155f95] "
                >
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-full  text-[12px] mt-[80px] font-abc text-center ">
          2023. All Right Reserved{" "}
          <span className="ml-4">
            Sistem Perizinan SMKN 1 Kabupaten Tangerang{" "}
          </span>
        </div>
      </div>
    </div>
  );
}
