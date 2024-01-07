import React, { useState } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import TopBar from "../../../components/layout/TopBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL } from "../../../config/base_url";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Swal from "sweetalert2";

export default function AddUser() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const [hiddenPass, setHiddenPass] = useState(false);
  const [img, setImg] = useState(null);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    noHP: "",
    kelas: "",
    fotoprofile: "",
  });

  const [err, setErr] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    noHP: "",
    kelas: "",
    fotoprofile: "",
  });
  const tambahPetugas = async (e) => {
    e.preventDefault();
    const swalLoading = Swal.fire({
      title: "Memproses...",
      html: "Mohon tunggu...",
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    try {
      if (img != null) {
        const foto = new FormData();
        foto.append("file", img);
        foto.append("upload_preset", "digikostDemoApp");
        foto.append("cloud_name", "dkt6ysk5c");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkt6ysk5c/image/upload",
          foto,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        data.fotoprofile = res?.data?.secure_url;
      }

      const res2 = await axios.post(`${BACKEND_BASE_URL}api/Register`, data);

      Swal.fire({
        title: "Berhasil menambahkan user",
        showConfirmButton: false,
        timer: 1000,
        icon: "success",
        didClose: () => {
          nav("/AllUsers");
        },
      });
    } catch (err) {
      console.log(err);
      swalLoading.close();
      // setErr(err?.response?.data?.error);
    }
  };

  const changeDataHandler = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="w-full px-3 min-h-screen mb-[100px]">
      <div className={``}>
        <Sidebar setSidebar={5} width={open} setWidth={setOpen} />
      </div>
      <div className={` `}>
        <div className="w-[98%] mx-auto">
          <TopBar>{"Pendaftaran Pengguna"}</TopBar>
          <div className="w-[95%] h-[80px] justify-between flex mx-auto">
            <div className="w-[80%] mx-auto mt-10">
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2">Nama Lengkap</h1>
                <input
                  type="text"
                  name="name"
                  onChange={(e) => changeDataHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
                {err.name ? (
                  <p className="text-sm text-red-500">*{err.name}</p>
                ) : null}
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2">Email</h1>
                <input
                  type="email"
                  name="email"
                  onChange={(e) => changeDataHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
                {err.email ? (
                  <p className="text-sm text-red-500">*{err.email}</p>
                ) : null}
              </div>
              <div className="w-full mt-4 relative">
                <h1 className="font-abc pb-2">Password</h1>
                <input
                  type={hiddenPass ? "text" : "password"}
                  name="password"
                  onChange={(e) => changeDataHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
                {hiddenPass ? (
                  <AiOutlineEyeInvisible
                    onClick={() => setHiddenPass(false)}
                    className="absolute right-[10px] top-[34px]"
                    size={24}
                  />
                ) : (
                  <AiOutlineEye
                    onClick={() => setHiddenPass(true)}
                    className="absolute right-[10px] top-[34px]"
                    size={24}
                  />
                )}
                {err.password ? (
                  <p className="text-sm text-red-500">*{err.password}</p>
                ) : null}
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2">No HP</h1>
                <input
                  type="number"
                  name="noHP"
                  onChange={(e) => changeDataHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
                {err.noHP ? (
                  <p className="text-sm text-red-500">*{err.noHP}</p>
                ) : null}
              </div>
              <div className="w-full mt-4">
                <label
                  htmlFor="fotoprofile"
                  className="border-2 border-slate-500 px-2 py-1 text-sm font-abc rounded-md"
                >
                  Pilih Foto
                </label>
              </div>
              <div className="w-full mt-4 hidden">
                <h1 className="font-abc pb-2">Poto Profile</h1>
                <input
                  type="file"
                  id="fotoprofile"
                  name="fotoprofile"
                  onChange={(e) => setImg(e.target.files[0])}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
              </div>
              {img ? (
                <div className="w-[50%] mt-3 ">
                  <img
                    className="w-[300px] h-[300px] border-2  rounded-full mx-auto object-contain"
                    src={URL.createObjectURL(img)}
                    alt=""
                  />
                </div>
              ) : null}

              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Role</h1>
                <select
                  name="role"
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                  onChange={(e) => changeDataHandler(e)}
                >
                  <option value="">Pilih Role</option>
                  <option value="4">Admin</option>
                  <option value="5">Kurikulum</option>
                  <option value="1">Siswa</option>
                  <option value="2">Guru Pengajar</option>
                  <option value="3">Guru Piket</option>
                </select>
                {err.role ? (
                  <p className="text-sm text-red-500">*{err.role}</p>
                ) : null}
              </div>
              {data.role === "1" ? (
                <div className="w-full mt-4">
                  <h1 className="font-abc pb-2">Kelas</h1>
                  <input
                    type="text"
                    name="kelas"
                    onChange={(e) => changeDataHandler(e)}
                    className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                  />
                  {err.kelas ? (
                    <p className="text-sm text-red-500">*{err.kelas}</p>
                  ) : null}
                </div>
              ) : null}
              <div className="w-full justify-center mt-12 mb-12 flex items-center">
                <button
                  onClick={(e) => tambahPetugas(e)}
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
      </div>
    </div>
  );
}
