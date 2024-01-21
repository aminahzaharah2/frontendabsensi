import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineEye } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsEye, BsTrash3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Spinner from "../../layout/Spinner";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACKEND_BASE_URL, BASE_URL } from "../../../config/base_url";
import Swal from "sweetalert2";

export default function TabelUser({ data, children }) {
  const nav = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [editBarang, setEditBarang] = useState(false);
  const [pengadaanBarang, setPengadaanBarang] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");
  const bulan = [
    "Januari",
    "Febuari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  let tahunSekarang = new Date().getFullYear() + 1;
  const tahun = [];
  const [gridKey, setGridKey] = useState(0);
  const [filter, setFilter] = useState("");

  for (let i = 0; i < 10; i++) {
    tahun.push(tahunSekarang - 1);
    tahunSekarang = tahunSekarang - 1;
  }

  let row = [];

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    noHP: "",
  });

  const [err, setErr] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    noHP: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const getMapel = await axios.get(`${BACKEND_BASE_URL}api/getUser`);
    setAllUser(getMapel.data.results);
  };

  const deletePetugas = async (id, name) => {
    try {
      Swal.fire({
        title: `Apakah kamu yakin ingin menghapus?, ${name}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const res = axios.delete(`${BACKEND_BASE_URL}api/deleteUser/${id}`);
          if(res){
            Swal.fire({
              title: "Terhapus",
              text: "User berhasil dihapus",
              icon: "success",
              showConfirmButton: false,
              timer: 1000,
              didClose: () => {
                window.location.reload();
              },
            });
          }
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Gagal menghapus",
        showCancelButton: false,
        timer: 1000,
      });
    }
  };

  const tambahUser = async () => {
    try {
      const res = await axios.post(`${BACKEND_BASE_URL}api/Register`, data);

      if (res.status === 200) {
        nav("/home");
      }
    } catch (err) {
      console.log(err);
      setErr({
        name: err.response.data.errors.name,
        email: err.response.data.errors.email,
        password: err.response.data.errors.password,
        role: err.response.data.errors.role,
        noHP: err.response.data.errors.noHP,
      });
    }
  };

  const showUser = () => {
    data
      .filter(
        (item) =>
          (filterBulan === "" ||
            new Date(item.created_at).getMonth() === Number(filterBulan)) &&
          (filterTahun === "" ||
            new Date(item.created_at).getFullYear() === Number(filterTahun)) &&
          (keyword === "" ||
            item.name.toLowerCase().includes(keyword.toLowerCase()) ||
            item.email.toLowerCase().includes(keyword.toLowerCase()) ||
            item.noHP.toLowerCase().includes(keyword.toLowerCase())) &&
          (role === "" || item.role.toString() === role)
      )
      .forEach((a, index) => {
        row.push({
          id: a.id,
          nama: a.name,
          email: a.email,
          role: a.role,
          nohp: a.noHP,
        });
      });
  };

  showUser();

  const columns = [
    { field: "id", headerName: "ID", minWidth: 50, flex: 0.2 },
    {
      field: "nama",
      headerName: "Nama Petugas",
      minWidth: 150,
      flex: 0.7,
    },

    {
      field: "email",
      headerName: "Email",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 100,
      flex: 0.7,
      renderCell: (params) => {
        return (
          <div className="flex">
            {params?.row?.role == 1? "Siswa":
            params?.row?.role == 2?"Guru Pengajar":
            params?.row?.role == 4?"Admin":"Kurikulum"
            }
          </div>
        );
      },
    },
    {
      field: "nohp",
      headerName: "No HP",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "aksi",
      headerName: "Aksi",
      flex: 1,
      minWidth: 150,

      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex">
            {user?.role === 5 ? (
              <button
                className="ml-3"
                onClick={() => nav(`/DetailUser/${params.id}`)}
              >
                <AiOutlineEye color="" size={20} />
              </button>
            ) : <>
                        <button
              onClick={() => deletePetugas(params.id, params?.row?.nama)}
              className="mr-4"
            >
              <BsTrash3 color="red" size={20} />
            </button>
            <button className="" onClick={() => nav(`/EditUser/${params.id}`)}>
              <BiEditAlt color="blue" size={20} />
            </button>
            </>}
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white w-[96%] mt-3  mb-[200px]  mx-auto p-3 rounded-lg">
        {pengadaanBarang ? (
          <div className="w-[80%] mx-auto mt-10">
            <div className="w-full mt-4">
              <h1 className="font-abc pb-2">Nama Lengkap</h1>
              <input
                type="text"
                name="name"
                onChange={(e) => changeDataHandler(e)}
                className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
              />
              {err.name ? <p>{err.name}</p> : null}
            </div>
            <div className="w-full mt-4">
              <h1 className="font-abc pb-2">Email</h1>
              <input
                type="email"
                name="email"
                onChange={(e) => changeDataHandler(e)}
                className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
              />
              {err.email ? <p>{err.email}</p> : null}
            </div>
            <div className="w-full mt-4">
              <h1 className="font-abc pb-2">Password</h1>
              <input
                type="password"
                name="password"
                onChange={(e) => changeDataHandler(e)}
                className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
              />
              {err.password ? <p>{err.password}</p> : null}
            </div>
            <div className="w-full mt-4">
              <h1 className="font-abc pb-2">No HP</h1>
              <input
                type="number"
                name="noHP"
                onChange={(e) => changeDataHandler(e)}
                className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
              />
              {err.noHP ? <p>{err.noHP}</p> : null}
            </div>
            <div className="w-full mt-4">
              <h1 className="font-abc pb-2 ">Role</h1>
              <select
                name="role"
                className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                onChange={(e) => changeDataHandler(e)}
              >
                <option value="4">Admin</option>
                <option value="">Pilih Role</option>
                <option value="1">Siswa</option>
                <option value="2">Guru Pengajar</option>
                <option value="3">Guru Piket</option>
              </select>
              {err.role ? <p>{err.role}</p> : null}
            </div>
            <div className="w-full justify-center mt-12 mb-12 flex items-center">
              <button
                onClick={tambahUser}
                className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
              >
                Simpan
              </button>
              <button
                onClick={() => nav("/home")}
                className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
              >
                Batal
              </button>
            </div>
          </div>
        ) : null}

        {!pengadaanBarang && !editBarang ? (
          <div className="">
            <div className="bg-white w-[96%] mt-3 mb-[200px]  mx-auto  rounded-lg">
              <div className="lg:flex xl:flex block ">
                <div className="">
                  {user?.role == 1 ? (
                    <button
                      onClick={() => setPengadaanBarang(!pengadaanBarang)}
                      className="bg-[#155f95] mt-1 mb-3 px-3 text-center py-1 xl:w-[200px] lg:w-[200px] w-full md:w-[200px] rounded-md text-[#E5D5F2] font-abc"
                    >
                      Ajukan Izin +
                    </button>
                  ) : null}
                </div>
                <div className="flex">
                  <div className="">
                    <select
                      name=""
                      id="statuss"
                      onChange={(e) => setRole(e.target.value)}
                      className="border h-[34px] rounded-xl mt-2 w-[100px] pl-2 "
                    >
                      <option value="">Role</option>
                      <option value="4">Admin</option>
                      <option value="2">Guru</option>
                      <option value="1">Siswa</option>
                      <option value="5">Kurikulum</option>
                    </select>
                  </div>
                  <div className="mt-1 mb-3 px-3">
                    <form className="block lg:flex xl:flex md:block   md:mt-[0px] lg:mt-0 xl:mt-0  ">
                      <div className="flex">
                        <input
                          type="text"
                          onChange={(e) => {
                            setKeyword(e.target.value);
                          }}
                          placeholder="cari pengguna"
                          className="h-[40px] pl-3 rounded-md w-full border-2 "
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {data ? (
                <DataGrid
                  key={gridKey}
                  disableRowSelectionOnClick
                  autoHeight
                  columns={columns}
                  rows={row}
                  data={row}
                />
              ) : (
                <Spinner />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
