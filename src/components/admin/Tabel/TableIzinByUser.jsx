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

export default function TabelIzinByUser({ data,role, tipe, statusFilter, children }) {
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

  if (role == 2) {
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
        headerName: "Guru Pengaju",
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
                    nav("/Detail/" + params.id+`/0`);
                  }}
                >
                  <BsEye size={20} />
                </button>
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
            console.log(params.row)
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
                <button
                    className="mr-4"
                    onClick={() => {
                      nav("/Detail/" + params.id+"/0");
                    }}
                  >
                    <BsEye size={20} />
                </button>
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
          (tipe === "no" || item.typeIzin === tipe) &&
          (statusFilter === "no"|| item.statusPengajuan === statusFilter)
      )
      .forEach((a, index) => {
        const pushMapel = mapel.filter(
          (item) => item.kodePelajaran == a.idMapel
        );
        const pushSiswa = AllUser.filter((item) => item.id == a.idUser);
        if (role == 2 ||role == 5) {
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
          if (pushSiswa[0] != undefined) {
            if (pushMapel[0] == undefined) {
                pushMapel[0] = { namaPelajaran: a.idMapel };
              }
            console.log("bwahaha : ", data);
            row.push({
              id: a.id,
              no: index + 1,
              idUser: pushSiswa[0].name,
              idMapel: pushMapel[0].namaPelajaran,
              guruPengajar:a.guruPengajar,
              statusPengajuan:a.statusPengajuan,
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
