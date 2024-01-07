import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/layout/Sidebar";
import TopBar from "../../../components/layout/TopBar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../../../config/base_url";
import Swal from "sweetalert2";

export default function EditUser() {
  const nav = useNavigate();
  const { id } = useParams();
  const [userSelected, setUserSelected] = useState({
    id: "",
    name: "",
    email: "",
    noHP: "",
    role: "",
  });
  const [err, setErr] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    noHP: "",
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GetUserById();
  }, [id]);

  const GetUserById = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}api/getUserById/${id}`);
      setUserSelected({
        id: res.data.results.id,
        name: res.data.results.name,
        email: res.data.results.email,
        noHP: res.data.results.noHP,
        role: res.data.results.role,
      });
    } catch (e) {
      console.log(e);
    }
  };

  const changeDataHandler = (e) => {
    setUserSelected({
      ...userSelected,
      [e.target.name]: e.target.value,
    });
  };

  const UpdateUser = async () => {
    try {
      const res = await axios.put(
        `${BACKEND_BASE_URL}api/updateDataUser/${userSelected?.id}`,
        userSelected
      );
      if (res.status === 200) {
        Swal.fire({
          title: "Berhasil mengupdate pengguna",
          showConfirmButton: false,
          timer: 1000,
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
      }
    } catch (e) {
      console.log("wkwk error :", e);
      setErr({
        name: e.response.data.error.name,
        noHP: e.response.data.error.noHP,
        role: e.response.data.error.role,
      });
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className={``}>
        {/* <button onClick={(e) => setOpen(1)}>buka</button> */}
        {/* {open === 1 ? <Sidebar setSidebar={1} open={setOpen} /> : null} */}
        <Sidebar setSidebar={5} width={open} setWidth={setOpen} />
      </div>
      <div className={`w-11/12 mx-auto`}>
        <TopBar>{"Edit User"}</TopBar>
        <div className="w-[94%] mx-auto">
          <div className="w-full mt-6">
            <h1 className="font-abc font-[500]">Nama</h1>
            <input
              type="text"
              name="name"
              onChange={(e) => changeDataHandler(e)}
              value={userSelected?.name}
              className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
            />
            {err.name ? <p>{err.name}</p> : null}
          </div>
          <div className="w-full mt-6">
            <h1 className="font-abc font-[500]">Email</h1>
            <input
              type="text"
              name="email"
              onChange={(e) => changeDataHandler(e)}
              value={userSelected?.email}
              className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
            />
            {err.email ? <p>{err.email}</p> : null}
          </div>
          <div className="w-full mt-6">
            <h1 className="font-abc font-[500]">No Telephone</h1>
            <input
              type="number"
              name="noHP"
              onChange={(e) => changeDataHandler(e)}
              value={userSelected.noHP}
              className="w-full h-[35px] border-2 pl-2 border-slate-500 rounded-md"
            />
            {err.noHP ? <p>{err.noHP}</p> : null}
          </div>
          <div className="w-full mt-4">
            <h1 className="font-abc pb-2 ">Role</h1>
            <select
              name="role"
              value={userSelected.role}
              className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
              onChange={(e) => changeDataHandler(e)}
            >
              <option value="">Pilih Role</option>
              {userSelected.role == "4" ? (
                <option value="4" selected>
                  Admin
                </option>
              ) : (
                <option value="4">Admin</option>
              )}
              {userSelected.role == "1" ? (
                <option value="1" selected>
                  Siswa
                </option>
              ) : (
                <option value="1">Siswa</option>
              )}
              {userSelected.role == "2" ? (
                <option value="2" selected>
                  Guru Pengajar
                </option>
              ) : (
                <option value="2">Guru Pengajar</option>
              )}
              {userSelected.role == "3" ? (
                <option value="5" selected>
                  Kurikulum
                </option>
              ) : (
                <option value="5">Kurikulum</option>
              )}
            </select>
            {err.role ? <p>{err.role}</p> : null}
          </div>
          <div className="w-full mt-6">
            <button
              onClick={() => nav(`/ChangePassword/${id}`)}
              className="bg-[#155f95] px-3 py-1 w-[240px] rounded-md text-[#E5D5F2] font-abc"
            >
              Ubah Password
            </button>
          </div>
          <div className="w-full mt-6 justify-center mb-7 flex items-center">
            <button
              onClick={UpdateUser}
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
