import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { BiEditAlt } from "react-icons/bi";
import { BsEye, BsTrash3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Spinner from "../../layout/Spinner";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACKEND_BASE_URL } from "../../../config/base_url";
import Swal from "sweetalert2";

export default function TabelIzinGuru({ data, children }) {
  const nav = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [editBarang, setEditBarang] = useState(false);
  const [pengadaanBarang, setPengadaanBarang] = useState(false);
  const [img, setImg] = useState(null);
  const [isBukti, setIsBukti] = useState(false);
  const [izinEdit, setIzinEdit] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [idIzin, setIdIzin] = useState();
  const [kurikulum, setKurikulum] = useState([]);
  const [AllUser, setAllUser] = useState([]);
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

  const [izin, setIzin] = useState({
    idUser: user.id,
    kurikulum: "",
    foto: null,
    jamKeluar: "",
    jamMasuk: "",
    keterangan: "",
    typeIzin: "Masuk",
    responKurikulum: "pending",
  });

  const [errIzin, setErrorIzin] = useState({
    kurikulum: "",
    jamKeluar: "",
    jamMasuk: "",
    keterangan: "",
    typeIzin: "",
    responKurikulum: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  let columns = [];

  if (user?.role == 2) {
    columns = [
      {
        field: "no",
        headerName: "No",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 50,
        flex: 0.5,
      },
      {
        field: "idUser",
        headerName: "Pengaju",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
      },
      {
        field: "kurikulum",
        headerName: "Kurikulum",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
      },
      {
        field: "typeIzin",
        headerName: "Type Izin",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
      },
      {
        field: "tanggal",
        headerName: "Tanggal",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
      },
      {
        field: "statusPengajuan",
        headerName: "Responss",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
        sortable: false,
        renderCell: (params) => {
          return (
            <div
              className={`${
                params.row.statusPengajuan === "pending"
                  ? "bg-yellow-400 text-white"
                  : params.row.statusPengajuan === "Diizinkan"
                  ? "bg-green-500"
                  : params.row.statusPengajuan === "Ditolak"
                  ? "bg-red-600"
                  : "bg-gray-700"
              } h-full text-center pt-3 text-white font-abc w-full `}
            >
              {params.row.statusPengajuan}
            </div>
          );
        },
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
              <>
                <button
                  className="mr-4"
                  onClick={() => {
                    nav("/Detail/" + params.id);
                  }}
                >
                  <BsEye size={20} />
                </button>

                {user?.role === 2 &&
                  params.row.statusPengajuan === "pending" && (
                    <button
                      className=""
                      onClick={() => {
                        EditIzinFunc(params.id);
                        resetError();
                      }}
                    >
                      <BiEditAlt color="blue" size={20} />
                    </button>
                  )}
              </>
            </div>
          );
        },
      },
    ];
  } else {
    columns = [
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
        field: "typeIzin",
        headerName: "Type Izin",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
      },
      {
        field: "tanggal",
        headerName: "Tanggal",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
      },
      {
        field: "statusPengajuan",
        headerName: "Status Pengajuan",
        headerClassName: "bg-slate-200 text-center font-abc",
        minWidth: 100,
        flex: 0.7,
        sortable: false,
        renderCell: (params) => {
          return (
            <div
              className={`${
                params.row.statusPengajuan === "pending"
                  ? "bg-yellow-400 text-white"
                  : params.row.statusPengajuan === "Diizinkan"
                  ? "bg-green-500"
                  : params.row.statusPengajuan === "Ditolak"
                  ? "bg-red-600"
                  : "bg-gray-700"
              } h-full text-center pt-3 text-white font-abc w-full `}
            >
              {params.row.statusPengajuan}
            </div>
          );
        },
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
              {params.row.status == "pending" ? (
                params.row.idAdmin == user?.id ? (
                  <>
                    <button
                      className="mr-4"
                      onClick={() => DeletePengadaan(params.id)}
                    >
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
                  </>
                ) : (
                  <></>
                )
              ) : (
                <>
                  <button
                    className="mr-4"
                    onClick={() => {
                      nav("/Detail/" + params.id);
                    }}
                  >
                    <BsEye size={20} />
                  </button>
                </>
              )}
            </div>
          );
        },
      },
    ];
  }

  const fetchData = async () => {
    const getKurikulum = await axios.get(`${BACKEND_BASE_URL}api/getKurikulum`);
    const getAllUser = await axios.get(`${BACKEND_BASE_URL}api/getUser`);

    setAllUser(getAllUser.data.results);
    setKurikulum(getKurikulum.data.results);
  };

  const resetError = () => {
    setErrorIzin({
      idMapel: "",
      kelas: "",
      kurikulum: "",
      jamKeluar: "",
      jamMasuk: "",
      keterangan: "",
      typeIzin: "",
      responKurikulum: "",
    });
  };

  const changeIzinHandler = (e) => {
    setIzin({
      ...izin,
      [e.target.name]: e.target.value,
    });
  };

  const changeIzinEditHandler = (e) => {
    setIzinEdit({
      ...izinEdit,
      [e.target.name]: e.target.value,
    });
  };

  const ajukanIzin = async (e) => {
    e.preventDefault();

    // Menampilkan Swal.fire loading
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
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "digikostDemoApp");
        data.append("cloud_name", "dkt6ysk5c");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkt6ysk5c/image/upload",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        izin.foto = res.data.secure_url;
      }

      if (izin?.typeIzin === "Keluar") {
        if (izin?.jamMasuk < izin?.jamKeluar) {
          swalLoading.close();
          setErrorIzin({
            jamMasuk: `Jam masuk tidak boleh kurang dari jam ${izin.jamKeluar}`,
          });
          return;
        }
      }
      const response = await axios.post(
        `${BACKEND_BASE_URL}api/requestIzinGuru/`,
        izin
      );

      Swal.fire({
        icon: "success",
        title: "Izin berhasil diajukan!",
        showConfirmButton: false,
        timer: 1500,
      });

      window.location.reload();
    } catch (err) {
      console.log(err);
      swalLoading.close();
      setErrorIzin(err.response.data.error);

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Terjadi kesalahan.",
      });
    }
  };

  const EditIzinFunc = async (id) => {
    try {
      setIdIzin(id);
      setEditBarang(!editBarang);
      const res = await axios.get(`${BACKEND_BASE_URL}api/getIzinById/${id}`);
      setIzinEdit(res.data.results[0]);
    } catch (err) {
      console.log(err);
      // setErrorIzin(err.response.data.error);
    }
  };

  const EditIzin = async (e) => {
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
        const data = new FormData();
        data.append("file", img);
        data.append("upload_preset", "digikostDemoApp");
        data.append("cloud_name", "dkt6ysk5c");

        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/dkt6ysk5c/image/upload",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        izinEdit.foto = res.data.secure_url;
        const response = await axios.put(
          `${BACKEND_BASE_URL}api/EditIzinGuru/${idIzin}`,
          izinEdit
        );
        Swal.fire({
          title: "Berhasil mengedit izin",
          showConfirmButton: false,
          timer: 1000,
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
      } else {
        const response = await axios.put(
          `${BACKEND_BASE_URL}api/EditIzinGuru/${idIzin}`,
          izinEdit
        );
        Swal.fire({
          title: "Berhasil mengedit izin",
          showConfirmButton: false,
          timer: 1000,
          icon: "success",
          didClose: () => {
            window.location.reload();
          },
        });
      }
    } catch (err) {
      console.log(err);
      swalLoading.close();
      setErrorIzin(err.response.data.error);
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
            new Date(item.created_at).getFullYear() === Number(filterTahun)) &&
          (status === "" || item.statusPengajuan === status) &&
          (user?.role == 5
            ? item.kurikulum === user?.id
            : item.idUser === user?.id)
      )
      .forEach((a, index) => {
        const pushMapel = mapel.filter(
          (item) => item.kodePelajaran == a.idMapel
        );
        const pushSiswa = AllUser.filter((item) => item.id == a.idUser);
        if (user?.role == 2 || user?.role == 5) {
          const pushKurikulum = AllUser.filter(
            (item) => item.id == a.kurikulum
          );
          if (
            pushMapel[0] != undefined &&
            pushKurikulum[0] != undefined &&
            pushSiswa[0] != undefined &&
            pushKurikulum[0] != undefined
          ) {
            row.push({
              id: a.id,
              no: index + 1,
              idUser: pushSiswa[0].name,
              idMapel: pushMapel[0].namaPelajaran,
              kelas: a.kelas,
              kurikulum: pushKurikulum[0].name,
              jamMasuk: a.jamMasuk,
              jamKeluar: a.jamKeluar,
              keterangan: a.keterangan,
              typeIzin: a.typeIzin,
              tanggal: new Date(a.created_at).toLocaleDateString(),
              responKurikulum: a.responKurikulum,
              statusPengajuan: a.statusPengajuan,
            });
          } else if (pushMapel[0] == undefined && a.kelas == null) {
            const pushKurikulum = AllUser.filter(
              (item) => item.id == a.kurikulum
            );
            if (pushKurikulum[0] != undefined) {
              row.push({
                id: a.id,
                no: index + 1,
                idUser: pushSiswa[0].name,
                kurikulum: pushKurikulum[0].name,
                jamMasuk: a.jamMasuk,
                jamKeluar: a.jamKeluar,
                keterangan: a.keterangan,
                typeIzin: a.typeIzin,
                tanggal: new Date(a.created_at).toLocaleDateString(),
                responKurikulum: a.responKurikulum,
                statusPengajuan: a.statusPengajuan,
              });
            }
          }
        } else {
          if (pushMapel[0] != undefined && pushSiswa[0] != undefined) {
            row.push({
              id: a.id,
              no: index + 1,
              idUser: pushSiswa[0].name,
              idMapel: pushMapel[0].namaPelajaran,
              kelas: a.kelas,
              jamMasuk: a.jamMasuk,
              jamKeluar: a.jamKeluar,
              keterangan: a.keterangan,
              typeIzin: a.typeIzin,
              tanggal: new Date(a.created_at).toLocaleDateString(),
            });
          }
        }
      });
  };

  showBarang();

  return (
    <>
      <div className="bg-white w-[96%] mt-3  mb-[200px]  mx-auto p-3 rounded-lg">
        {pengadaanBarang ? (
          <div className="w-[95%] mx-auto min-h-screen bg-white rounded-xl">
            <div action="" className="w-[95%] mx-auto mt-2 p-3">
              <button
                type="button"
                onClick={() => setIzin({ ...izin, typeIzin: "Masuk" })}
                className={
                  izin.typeIzin == "Masuk"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Masuk
              </button>
              <button
                type="button"
                onClick={() =>
                  setIzin({ ...izin, typeIzin: "Keluar", foto: null })
                }
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
                onClick={() =>
                  setIzin({ ...izin, typeIzin: "Pulang", foto: null })
                }
                className={
                  izin.typeIzin == "Pulang"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Pulang
              </button>
              {img && izin.typeIzin == "Masuk" ? (
                <div className="w-full ">
                  <img
                    className="w-[60%] h-[60%] rounded-lg mx-auto object-contain"
                    src={URL.createObjectURL(img)}
                    alt=""
                  />
                </div>
              ) : null}
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Kurikulum</h1>
                <select
                  name="kurikulum"
                  onChange={(e) => changeIzinHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Kurikulum -</option>

                  {kurikulum.map((item, index) => {
                    return (
                      <option key={index} value={`${item.id}`}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
                {errIzin?.kurikulum ? (
                  <p className="text-sm text-red-500">*{errIzin?.kurikulum}</p>
                ) : null}
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
                    {errIzin.jamKeluar ? (
                      <p className="text-sm text-red-500">
                        *{errIzin.jamKeluar}
                      </p>
                    ) : null}
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
                    {errIzin.jamMasuk ? (
                      <p className="text-sm text-red-500">
                        *{errIzin.jamMasuk}
                      </p>
                    ) : null}
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
                    {errIzin.jamKeluar ? (
                      <p className="text-sm text-red-500">
                        *{errIzin.jamKeluar}
                      </p>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Masukkkkkk</h1>
                    <input
                      type="time"
                      value={izin.jamMasuk}
                      name="jamMasuk"
                      onChange={(e) => changeIzinHandler(e)}
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {errIzin.jamMasuk ? (
                      <p className="text-sm text-red-500">
                        *{errIzin.jamMasuk}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex items-center mt-4 mb-4">
                    <input
                      onChange={() => setIsBukti(!isBukti)}
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Upload Bukti
                    </label>
                  </div>
                </>
              )}
              {isBukti && izin.typeIzin == "Masuk" ? (
                <div className="w-full mt-4">
                  <label
                    htmlFor="buktiNota"
                    className="border-2 border-slate-500 px-2 py-1 text-sm font-abc rounded-md"
                  >
                    Pilih Foto
                  </label>
                  <input
                    type="file"
                    name="buktiNota"
                    id="buktiNota"
                    onChange={(e) => setImg(e.target.files[0])}
                    className="hidden border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                  />
                </div>
              ) : null}
              <div className="w-full mt-4">
                <textarea
                  name="keterangan"
                  required
                  onChange={(e) => changeIzinHandler(e)}
                  id="comment"
                  rows="4"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-black focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Keterangan"
                ></textarea>
              </div>
              {errIzin.keterangan ? (
                <p className="text-sm text-red-500">*{errIzin.keterangan}</p>
              ) : null}
              <div className="w-full justify-center mt-12 mb-12 flex items-center">
                <button
                  onClick={(e) => ajukanIzin(e)}
                  className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setPengadaanBarang(!pengadaanBarang);
                    setIsBukti(false);
                    setImg(null);
                  }}
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
                onClick={() => {
                  setIzinEdit({
                    ...izinEdit,
                    jamKeluar: "",
                    jamMasuk: "",
                    typeIzin: "Masuk",
                  });
                }}
                className={
                  izinEdit.typeIzin == "Masuk"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Masuk
              </button>
              <button
                type="button"
                onClick={() => {
                  setIzinEdit({
                    ...izinEdit,
                    jamKeluar: "",
                    jamMasuk: "",
                    typeIzin: "Keluar",
                  });
                }}
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
                onClick={() => {
                  setIzinEdit({
                    ...izinEdit,
                    jamKeluar: "",
                    jamMasuk: "",
                    typeIzin: "Pulang",
                  });
                }}
                className={
                  izinEdit.typeIzin == "Pulang"
                    ? "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                    : "py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                }
              >
                Izin Pulang
              </button>
              {izinEdit.typeIzin == "Masuk" ? (
                img == null && izinEdit.foto != null ? (
                  <div className="w-full ">
                    <img
                      className="w-[60%] rounded-lg mx-auto object-contain"
                      src={izinEdit.foto}
                      alt=""
                    />
                  </div>
                ) : img != null ? (
                  <div className="w-full ">
                    <img
                      className="w-[60%] rounded-lg mx-auto object-contain"
                      src={URL.createObjectURL(img)}
                      alt=""
                    />
                  </div>
                ) : null
              ) : null}
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Kurikulum</h1>
                <select
                  name="kurikulum"
                  onChange={(e) => changeIzinEditHandler(e)}
                  id=""
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                >
                  <option value="">- Select Kurikulum -</option>

                  {kurikulum.map((item, index) => {
                    if (item.id == izinEdit.kurikulum) {
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
                    {errIzin.jamKeluar ? (
                      <p className="text-sm text-red-500">
                        *{errIzin.jamKeluar}
                      </p>
                    ) : null}
                  </div>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Masukkk</h1>
                    <input
                      type="time"
                      value={izinEdit.jamMasuk}
                      name="jamMasuk"
                      onChange={(e) =>
                        setIzinEdit({ ...izinEdit, jamMasuk: e.target.value })
                      }
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {errIzin.jamMasuk ? (
                      <p className="text-sm text-red-500">
                        *{errIzin.jamMasuk}
                      </p>
                    ) : null}
                  </div>
                </>
              ) : izinEdit.typeIzin == "Pulang" ? (
                <>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Keluar</h1>
                    <input
                      type="time"
                      name="jamKeluar"
                      value={izinEdit.jamKeluar}
                      onChange={(e) =>
                        setIzinEdit({ ...izinEdit, jamKeluar: e.target.value })
                      }
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {errIzin.jamKeluar ? (
                      <p className="text-sm text-red-500">
                        *{errIzin.jamKeluar}
                      </p>
                    ) : null}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full mt-4">
                    <h1 className="font-abc pb-2">Jam Masukkkkk</h1>
                    <input
                      type="time"
                      value={izinEdit.jamMasuk}
                      name="jamMasuk"
                      onChange={(e) => changeIzinEditHandler(e)}
                      className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                    />
                    {errIzin?.jamMasuk ? (
                      <p className="text-sm text-red-500">
                        *{errIzin?.jamMasuk}
                      </p>
                    ) : null}
                  </div>
                  {isBukti && izinEdit.typeIzin == "Masuk" ? (
                    <div className="w-full mt-4">
                      <label
                        htmlFor="buktiNota"
                        className="border-2 border-slate-500 px-2 py-1 text-sm font-abc rounded-md"
                      >
                        Pilih Foto
                      </label>
                      <input
                        type="file"
                        name="buktiNota"
                        id="buktiNota"
                        onChange={(e) => setImg(e.target.files[0])}
                        className="hidden border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                      />
                    </div>
                  ) : null}
                  <div className="flex items-center mt-4 mb-4">
                    <input
                      onChange={() => setIsBukti(!isBukti)}
                      id="default-checkbox"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-checkbox"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Upload Bukti
                    </label>
                  </div>
                </>
              )}
              <div className="w-full mt-4">
                <textarea
                  value={izinEdit.keterangan}
                  name="keterangan"
                  onChange={(e) => changeIzinEditHandler(e)}
                  id="comment"
                  rows="4"
                  className="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-gray-800 focus:ring-0 dark:text-white dark:placeholder-gray-400"
                  placeholder="Keterangan"
                  required
                ></textarea>
              </div>
              {errIzin?.keterangan ? (
                <p className="text-sm text-red-500">*{errIzin?.keterangan}</p>
              ) : null}
              <div className="w-full justify-center mt-12 mb-12 flex items-center">
                <button
                  onClick={(e) => EditIzin(e)}
                  className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    setEditBarang(!editBarang);
                    setIsBukti(false);
                    setImg(null);
                  }}
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
                  {user?.role == 2 ? (
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
                    </div>

                    <div className="flex">
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
                          <option value="Diizinkan">Diizinkan</option>
                          <option value="Ditolak">Ditolak</option>
                          <option value="Batalkan">Batalkan</option>
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
