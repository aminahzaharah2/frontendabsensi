import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import TopBar from "../../../components/layout/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../../../config/base_url";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

export default function ChangePassword() {
  const nav = useNavigate();
  const { id } = useParams();
  const [hiddenPass, setHiddenPass] = useState(false);
  const [hiddenPass2, setHiddenPass2] = useState(false);
  const [data, setData] = useState({
    password: "",
    konfirmPassword: "",
  });

  const [err, setErr] = useState({
    konfirmPassword: "",
  });

  const [open, setOpen] = useState(false);

  const changeDataHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const UpdatePassword = async () => {
    try {
      if (data.password == data.konfirmPassword) {
        const res = await axios.put(
          `${BACKEND_BASE_URL}api/ChangePassword/${id}`,
          data
        );
        Swal.fire({
          title: "Berhasil mengubah password",
          showConfirmButton: false,
          timer: 1000,
          icon: "success",
        });
        if (res.status === 200) {
          setTimeout(() => {
            window.location.href = `${BASE_URL}/AllUsers`;
          }, 1000);
        }
      } else {
        setErr({ konfirmPassword: "Konfirmasi Password Tidak Sama" });
      }
    } catch (e) {
      console.log("wkwk error :", e);
    }
  };

  return (
    <div className="w-full h-[160vh] flex">
      <div className={``}>
        <Sidebar setSidebar={5} width={open} setWidth={setOpen} />
      </div>
      <div className={`w-11/12 mx-auto`}>
        <TopBar>{"Edit Petugas"}</TopBar>
        <div className="w-[94%] mx-auto">
          <div className="w-full mt-6 relative">
            <h1 className="font-abc font-[500]">Password</h1>
            <input
              type={hiddenPass2 ? "text" : "password"}
              name="password"
              onChange={(e) => changeDataHandler(e)}
              value={data.password}
              className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
            />
            {hiddenPass2 ? (
              <AiOutlineEyeInvisible
                onClick={() => setHiddenPass2(false)}
                className="absolute right-[10px] top-[29px]"
                size={24}
              />
            ) : (
              <AiOutlineEye
                onClick={() => setHiddenPass2(true)}
                className="absolute right-[10px] top-[29px]"
                size={24}
              />
            )}
          </div>
          <div className="w-full mt-6 relative">
            <h1 className="font-abc font-[500]">Konfirmasi Password</h1>
            <input
              type={hiddenPass ? "text" : "password"}
              name="konfirmPassword"
              onChange={(e) => changeDataHandler(e)}
              value={data.konfirmPassword}
              className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
            />
            {hiddenPass ? (
              <AiOutlineEyeInvisible
                onClick={() => setHiddenPass(false)}
                className="absolute right-[10px] top-[29px]"
                size={24}
              />
            ) : (
              <AiOutlineEye
                onClick={() => setHiddenPass(true)}
                className="absolute right-[10px] top-[29px]"
                size={24}
              />
            )}
            {err.konfirmPassword ? (
              <p className="text-sm text-red-500">*{err.konfirmPassword}</p>
            ) : null}
          </div>
          <div className="w-full mt-6 justify-center mb-7 flex items-center">
            <button
              onClick={UpdatePassword}
              className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
            >
              Simpan
            </button>
            <button
              onClick={() => nav("/AllUsers")}
              className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
            >
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
