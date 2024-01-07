import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEye, BsTrash3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Spinner from "../../layout/Spinner";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACKEND_BASE_URL } from "../../../config/base_url";

export default function TabelMapel({ data, children }) {
  const nav = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [editBarang, setEditBarang] = useState(false);
  const [pengadaanBarang, setPengadaanBarang] = useState(false);
  const [izinEdit, setIzinEdit] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [idIzin, setIdIzin] = useState();
  const [guruPengajar, setGuruPengajar] = useState([]);
  const [guruPiket, setGuruPiket] = useState([]);
  const [filterBulan, setFilterBulan] = useState("");
  const [filterTahun, setFilterTahun] = useState("");
  const [status, setStatus] = useState("");
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

  const [mapelSiswa, setMapelSiswa] = useState({
    idUser: "",
    idMapel: "",
  });

  const [errIzin, setErrorIzin] = useState({
    idUser: "",
    idMapel: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const getMapel = await axios.get(`${BACKEND_BASE_URL}api/getMataPelajaran`);
    setMapel(getMapel.data.results);
  };

  const changeIzinHandler = (e) => {
    setMapelSiswa({
      ...mapelSiswa,
      [e.target.name]: e.target.value,
    });
  };

  const ajukanIzin = async (e) => {
    e.preventDefault();
    try {
      const tambah = await axios.post(
        `${BACKEND_BASE_URL}api/requestIzin`,
        izin
      );

      if (tambah) {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const EditIzinFunc = async (id) => {
    try {
      setIdIzin(id);
      setEditBarang(!editBarang);
      const res = await axios.get(`${BACKEND_BASE_URL}api/getIzinById/${id}`);
      setIzinEdit(res.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  const EditIzin = async () => {
    try {
      const res = await axios.put(
        `${BACKEND_BASE_URL}api/EditIzin/${idIzin}`,
        izinEdit
      );
      if (res.status === 200) {
        window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const typeIzinChange = async (type) => {
    setIzinEdit({ ...izinEdit, typeIzin: type, jamKeluar: "", jamMasuk: "" });
  };

  const showBarang = () => {
    data
      .filter(
        (item) =>
          (filterBulan === "" ||
            new Date(item.created_at).getMonth() === Number(filterBulan)) &&
          (filterTahun === "" ||
            new Date(item.created_at).getFullYear() === Number(filterTahun))
      )
      .forEach((a, index) => {
        row.push({
          id: a.id,
          idUser: a.idUser,
          idMapel: a.idMapel,
        });
      });
  };

  showBarang();

  const columns = [
    {
      field: "no",
      headerName: "No",
      headerClassName: "bg-slate-200 text-center font-abc",
      minWidth: 50,
      flex: 0.5,
    },
    {
      field: "idUser",
      headerName: "Siswa",
      headerClassName: "bg-slate-200 text-center font-abc",
      minWidth: 100,
      flex: 0.7,
    },
    {
      field: "idMapel",
      headerName: "Mata Pelajaran",
      headerClassName: "bg-slate-200 text-center font-abc",
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: "aksi",
      headerName: "Aksi",
      headerClassName: "bg-slate-200 text-center font-abc",
      flex: 0.7,
      minWidth: 150,

      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex">
            <button className="mr-4" onClick={() => DeletePengadaan(params.id)}>
              <BsTrash3 color="red" size={20} />
            </button>
            <button
              className=""
              onClick={() => {
                EditIzinFunc(params.id);
              }}
            >
              <BiEditAlt color="blue" size={20} />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <div className="bg-white w-[96%] mt-3  mb-[200px]  mx-auto p-3 rounded-lg">
        {pengadaanBarang ? (
          <div className="w-[95%] mx-auto h-[130vh] bg-white rounded-xl">
            <div action="" className="w-[95%] mx-auto mt-2 p-3">
              <button
                type="button"
                onClick={() => setIzin({ ...izin, typeIzin: "Tidak Masuk" })}
                className={
                  izin.typeIzin == "Tidak Masuk"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Tidak Masuk
              </button>
              <button
                type="button"
                onClick={() => setIzin({ ...izin, typeIzin: "Keluar" })}
                className={
                  izin.typeIzin == "Keluar"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Keluar
              </button>
              <button
                type="button"
                onClick={() => setIzin({ ...izin, typeIzin: "Pulang" })}
                className={
                  izin.typeIzin == "Pulang"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Pulang
              </button>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Mata Pelajaran</h1>
                <select
                  name="idMapel"
                  onChange={(e) => changeIzinHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Mata Pelajaran -</option>

                  {mapel.map((item, index) => {
                    return (
                      <option key={index} value={`${item.kodePelajaran}`}>
                        {item.namaPelajaran}
                      </option>
                    );
                  })}
                </select>
                {errIzin.idMapel ? <p>{errIzin.idMapel}</p> : null}
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Guru Pengajar</h1>
                <select
                  name="guruPengajar"
                  onChange={(e) => changeIzinHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Guru Pengajar -</option>

                  {guruPengajar.map((item, index) => {
                    return (
                      <option key={index} value={`${item.id}`}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                {errIzin.guruPengajar ? <p>{errIzin.guruPengajar}</p> : null}
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Guru Piket</h1>
                <select
                  name="guruPiket"
                  onChange={(e) => changeIzinHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Guru Piket -</option>

                  {guruPiket.map((item, index) => {
                    return (
                      <option key={index} value={`${item.id}`}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                {errIzin.guruPiket ? <p>{errIzin.guruPiket}</p> : null}
              </div>
              {izin.typeIzin == "Keluar" ? (
                <>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Keluar</h1>
                    <input
                      type="time"
                      value={izin.jamKeluar}
                      name="jamKeluar"
                      onChange={(e) => changeIzinHandler(e)}
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {izin.jamKeluar ? <p>{izin.jamKeluar}</p> : null}
                  </div>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Masuk</h1>
                    <input
                      type="time"
                      value={izin.jamMasuk}
                      name="jamMasuk"
                      onChange={(e) => changeIzinHandler(e)}
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {izin.jamMasuk ? <p>{izin.jamMasuk}</p> : null}
                  </div>
                </>
              ) : izin.typeIzin == "Pulang" ? (
                <>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Keluar</h1>
                    <input
                      type="time"
                      name="jamKeluar"
                      onChange={(e) => changeIzinHandler(e)}
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {izin.jamKeluar ? <p>{izin.jamKeluar}</p> : null}
                  </div>
                </>
              ) : null}
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2">Tanggal Izin</h1>
                <input
                  type="date"
                  name="tanggal"
                  onChange={(e) => changeIzinHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
              </div>
              <div className="w-full mt-4">
                <textarea
                  name="keterangan"
                  onChange={(e) => changeIzinHandler(e)}
                  id="comment"
                  rows="4"
                  class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Keterangan"
                  required
                ></textarea>
              </div>
              <div className="w-full justify-center mt-12 mb-12 flex items-center">
                <button
                  onClick={(e) => ajukanIzin(e)}
                  className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setPengadaanBarang(!pengadaanBarang)}
                  className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {editBarang ? (
          <div className="w-[95%] mx-auto h-[130vh] bg-white rounded-xl">
            <div action="" className="w-[95%] mx-auto mt-2 p-3">
              <button
                type="button"
                onClick={() => typeIzinChange("TidakMasuk")}
                className={
                  izinEdit.typeIzin == "Tidak Masuk"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Tidak Masuk
              </button>
              <button
                type="button"
                onClick={() => typeIzinChange("Keluar")}
                className={
                  izinEdit.typeIzin == "Keluar"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Keluar
              </button>
              <button
                type="button"
                onClick={() => typeIzinChange("Pulang")}
                className={
                  izinEdit.typeIzin == "Pulang"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Pulang
              </button>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Mata Pelajaran</h1>
                <select
                  name="idMapel"
                  onChange={(e) => changeIzinEditHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Mata Pelajaran -</option>

                  {mapel.map((item, index) => {
                    if (item.kodePelajaran == izinEdit.idMapel) {
                      return (
                        <option
                          key={index}
                          value={`${item.kodePelajaran}`}
                          selected
                        >
                          {item.namaPelajaran}
                        </option>
                      );
                    } else {
                      return (
                        <option key={index} value={`${item.kodePelajaran}`}>
                          {item.namaPelajaran}
                        </option>
                      );
                    }
                  })}
                </select>
                {errIzin.idMapel ? <p>{errIzin.idMapel}</p> : null}
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Guru Pengajar</h1>
                <select
                  name="guruPengajar"
                  onChange={(e) => changeIzinEditHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Guru Pengajar -</option>

                  {guruPengajar.map((item, index) => {
                    if (item.id == izinEdit.guruPengajar) {
                      return (
                        <option key={index} value={`${item.id}`} selected>
                          {item.name}
                        </option>
                      );
                    } else {
                      return (
                        <option key={index} value={`${item.id}`}>
                          {item.name}
                        </option>
                      );
                    }
                  })}
                </select>
                {errIzin.guruPengajar ? <p>{errIzin.guruPengajar}</p> : null}
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Guru Piket</h1>
                <select
                  name="guruPiket"
                  onChange={(e) => changeIzinEditHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Guru Piket -</option>

                  {guruPiket.map((item, index) => {
                    if (item.id == izinEdit.guruPiket) {
                      return (
                        <option key={index} value={`${item.id}`} selected>
                          {item.name}
                        </option>
                      );
                    } else {
                      return (
                        <option key={index} value={`${item.id}`}>
                          {item.name}
                        </option>
                      );
                    }
                  })}
                </select>
                {errIzin.guruPiket ? <p>{errIzin.guruPiket}</p> : null}
              </div>
              {izinEdit.typeIzin == "Keluar" ? (
                <>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Keluar</h1>
                    <input
                      type="time"
                      value={izinEdit.jamKeluar}
                      name="jamKeluar"
                      onChange={(e) =>
                        setIzinEdit({ ...izinEdit, jamKeluar: e.target.value })
                      }
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {errIzin.jamKeluar ? <p>{errIzin.jamKeluar}</p> : null}
                  </div>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Masuk</h1>
                    <input
                      type="time"
                      value={izinEdit.jamMasuk}
                      name="jamMasuk"
                      onChange={(e) =>
                        setIzinEdit({ ...izinEdit, jamMasuk: e.target.value })
                      }
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {errIzin.jamMasuk ? <p>{errIzin.jamMasuk}</p> : null}
                  </div>
                </>
              ) : izinEdit.typeIzin == "Pulang" ? (
                <>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Keluar</h1>
                    <input
                      type="time"
                      name="jamKeluar"
                      onChange={(e) => changeIzinEditHandler(e)}
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {errIzin.jamKeluar ? <p>{errIzin.jamKeluar}</p> : null}
                  </div>
                </>
              ) : null}
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2">Tanggal Izin</h1>
                <input
                  type="date"
                  name="tanggal"
                  value={izinEdit.tanggal}
                  onChange={(e) => changeIzinEditHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
                {errIzin.tanggal ? <p>{errIzin.tanggal}</p> : null}
              </div>
              <div className="w-full mt-4">
                <textarea
                  value={izinEdit.keterangan}
                  name="keterangan"
                  onChange={(e) => changeIzinEditHandler(e)}
                  id="comment"
                  rows="4"
                  class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Keterangan"
                  required
                ></textarea>
              </div>
              <div className="w-full justify-center mt-12 mb-12 flex items-center">
                <button
                  onClick={(e) => EditIzin()}
                  className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setEditBarang(!editBarang)}
                  className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        ) : null}

        {!pengadaanBarang && !editBarang ? (
          <div className="">
            <div className="bg-white w-[96%] mt-3 mb-[200px]  mx-auto  rounded-lg">
              <div className="lg:flex xl:flex block justify-between">
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
                <div className="mt-1 mb-3 px-3">
                  <form className="block lg:flex xl:flex md:block   md:mt-[0px] lg:mt-0 xl:mt-0  ">
                    <div className="flex">
                      <div className="">
                        <select
                          name=""
                          id="bulan"
                          onChange={(e) => setFilterBulan(e.target.value)}
                          className="border h-[34px] rounded-xl w-[100px] pl-2 "
                        >
                          <option value="">Bulan</option>
                          {bulan.map((item, index) => {
                            return (
                              <option key={index} value={index}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="">
                        <select
                          name=""
                          id="tahun"
                          onChange={(e) => setFilterTahun(e.target.value)}
                          className="border h-[34px] rounded-xl w-[100px] pl-2 "
                        >
                          <option value="">Tahun</option>
                          {tahun.map((item, index) => {
                            return (
                              <option key={index} value={item}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="">
                        <select
                          name=""
                          id="statuss"
                          onChange={(e) => setStatus(e.target.value)}
                          className="border h-[34px] rounded-xl w-[100px] pl-2 "
                        >
                          <option value="">Status</option>
                          <option value="pending">Pending</option>
                          <option value="accept">Acc</option>
                          <option value="">All</option>
                        </select>
                      </div>
                    </div>
                  </form>
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
