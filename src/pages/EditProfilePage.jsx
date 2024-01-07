import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../config/base_url";

import { Link, useNavigate } from "react-router-dom";
import TopBar from "../components/layout/TopBar";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function EditProfilePage({ children }) {
  const nav = useNavigate();
  const [img, setImg] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    noHP: "",
    role: 0,
    fotoprofile: "",
    kelas: "",
  });

  const [err, setErr] = useState({
    name: "",
    email: "",
    noHP: "",
    fotoprofile: "",
  });

  useEffect(() => {
    setDataUser({
      name: user?.name,
      email: user?.email,
      noHP: user?.noHP,
      role: user?.role,
      kelas: user?.kelas,
    });
  }, [user]);

  const changeDataHandler = (e) => {
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value,
    });
  };

  const UpdateUser = async (e) => {
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

        const res1 = await axios.post(
          "https://api.cloudinary.com/v1_1/dkt6ysk5c/image/upload",
          foto,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        dataUser.fotoprofile = res1?.data?.secure_url;
      }
      const res = await axios.put(
        `${BACKEND_BASE_URL}api/updateDataUser/${user?.id}`,
        dataUser
      );
      Swal.fire({
        title: "Berhasil mengupdate foto",
        showConfirmButton: false,
        timer: 1000,
        icon: "success",
        didClose: () => {
          nav("/home");
        },
      });
    } catch (e) {
      console.log(e);
      swalLoading.close();
      setErr({
        name: e.response.data.error.name,
        noHP: e.response.data.error.noHP,
      });
    }
  };
  return (
    <div className="w-full h-[160vh] flex">
      <div className={``}>
        <Sidebar setSidebar={1} width={open} setWidth={setOpen} />
      </div>
      <div className={`w-11/12 mx-auto`}>
        <TopBar>{`${
          user?.role === 4 ? `Profile ${user?.name}` : `Profile ${user?.name}`
        } `}</TopBar>
        {children}
        <div className="w-[94%] mx-auto gap-2 justify-between p-4 ">
          <div className="xl:flex lg:flex md:flex sm:block gap-4  block justify-center  w-full">
            <div className=" xl:w-[70%] lg:w-[70%] md:w-[70%] sm:w-full w-full">
              <div className="w-full mt-6">
                <h1 className="font-abc font-[500]">Nama</h1>
                <input
                  type="text"
                  name="name"
                  value={dataUser.name}
                  disabled={true}
                  onChange={(e) => changeDataHandler(e)}
                  className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
                />
                {err.name ? <p>{err.name}</p> : null}
              </div>
              {user?.role === 1 ? (
                <div className="w-full mt-6">
                  <h1 className="font-abc font-[500]">Kelas</h1>
                  <input
                    type="text"
                    name="name"
                    value={dataUser?.kelas}
                    disabled={true}
                    onChange={(e) => changeDataHandler(e)}
                    className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
                  />
                  {err.name ? <p>{err.name}</p> : null}
                </div>
              ) : null}

              <div className="w-full mt-6">
                <h1 className="font-abc font-[500]">Email</h1>
                <input
                  type="text"
                  name="email"
                  value={dataUser.email}
                  onChange={(e) => changeDataHandler(e)}
                  disabled={true}
                  className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
                />
              </div>
              <div className="w-full mt-6">
                <h1 className="font-abc font-[500]">No Telephone</h1>
                <input
                  type="text"
                  name="noHP"
                  disabled={true}
                  value={dataUser.noHP}
                  onChange={(e) => changeDataHandler(e)}
                  className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
                />
                {err.noHP ? <p>{err.noHP}</p> : null}
              </div>
            </div>
            <div className="xl:w-[30%] lg:w-[30%] md:w-[30%] sm:w-full w-full justify-end  xl:ml-[50px] lg:ml-[50px] md:ml-[50px]   mt-12">
              <div className="w-full">
                <input
                  type="file"
                  id="fotoprofile"
                  name="fotoprofile"
                  onChange={(e) => setImg(e.target.files[0])}
                  className="  border-slate-500 rounded-xl mx-auto  w-[50%] h-[30px]"
                />
              </div>

              <div className="">
                {img ? (
                  <div className="w-[90%] ">
                    <img
                      src={URL.createObjectURL(img)}
                      className="w-[150px] border-2 mt-4 object-cover h-[150px] rounded-full"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="w-[90%] ">
                    <img
                      src={user?.fotoprofile}
                      className="w-[150px] border-2 mt-4 object-cover h-[150px] rounded-full"
                      alt=""
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-5">
            <button
              onClick={(e) => UpdateUser(e)}
              className="px-3 py-2 text-white font-abc rounded-md bg-[#155f95]"
            >
              Simpan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
