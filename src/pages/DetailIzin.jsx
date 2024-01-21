import React, { useEffect, useState } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import TopBar from "../components/layout/TopBar.jsx";
import TableIzin from "../components/admin/Tabel/TabelIzin.jsx";
import axios from "axios";
import { BACKEND_BASE_URL, BASE_URL } from "../config/base_url.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

export default function DetailIzin() {
  const { id, role } = useParams();
  const nav = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [open, setOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [izin, setIzin] = useState([]);
  const [mapel, setMapel] = useState([]);
  const [guruPengajar, setGuruPengajar] = useState("");
  const [kurikulum, setKurikulum] = useState("");
  const [pengaju, setPengaju] = useState("");

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (izin != undefined && allUser.length != 0) {
      const filterUser = allUser.filter((item) => item.id == izin[0]?.idUser);
      const filterGuruPengajar = allUser.filter(
        (item) => item.id == izin[0]?.guruPengajar
      );
      const filterKurikulum = allUser.filter(
        (item) => item.id == izin[0]?.kurikulum
      );

      setPengaju(filterUser[0]?.name);
      setGuruPengajar(filterGuruPengajar[0]?.name);
      setKurikulum(filterKurikulum[0]?.name);
    }
  }, [izin]);

  const BeriIzin = async (e) => {
    try {
      Swal.fire({
        title: `Apakah kamu yakin ingin mengizinkan?, ${pengaju}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const add = axios.put(
            `${BACKEND_BASE_URL}api/BeriIzin/${id}/${user?.role}`
          );
          Swal.fire({
            title: "Mengizinkan",
            text: "Behasil mengizinkan",
            icon: "success",
            timer: 1000,
            didClose: () => {
              // Fungsi ini akan dipanggil setelah SweetAlert ditutup
              window.location.href =
                user?.role === 5
                  ? `${BASE_URL}/Detail/${id}`
                  : `${BASE_URL}/PermintaanIzin`;
            },
          });
        }
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
      });
    }
  };

  const TolakPermintaan = async () => {
    try {
      Swal.fire({
        title: `Apakah kamu yakin ingin menolak izin dari?, ${pengaju}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          const update = axios.put(
            `${BACKEND_BASE_URL}api/TolakPengajuan/${id}/${user?.role}`
          );

          Swal.fire({
            title: "Berhasil menolak izin",
            showConfirmButton: false,
            timer: 1000,
            icon: "success",
            didClose: () => {
              window.location.href =
                user?.role === 5
                  ? `${BASE_URL}/Detail/${id}`
                  : `${BASE_URL}/PermintaanIzin`;
            },
          });
        }
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
      });
    }
  };

  const fetchData = async () => {
    const getAllUser = await axios.get(`${BACKEND_BASE_URL}api/getUser`);
    const getIzinById = await axios.get(
      `${BACKEND_BASE_URL}api/getIzinById/${id}`
    );

    setAllUser(getAllUser.data.results);
    setIzin(getIzinById.data.results);
  };

  const BatalkanIzin = async (id) => {
    try {
      const res = await axios.put(
        `${BACKEND_BASE_URL}api/Batalkan/${id}/${user?.role}`
      );

      if (res.status == 200) {
        if (user?.role == 2) {
          Swal.fire({
            title: "Berhasil membatalkan izin",
            showConfirmButton: false,
            timer: 1000,
            icon: "success",
            didClose: () => {
              window.location.href = "/PermintaanIzinGuru";
            },
          });
        } else {
          Swal.fire({
            title: "Berhasil membatalkan izin",
            showConfirmButton: false,
            timer: 1000,
            icon: "success",
            didClose: () => {
              window.location.href = "/Izin";
            },
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const originalDate = new Date(izin[0]?.created_at);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = originalDate.toLocaleDateString("id-ID", options);

  return (
    <div className="w-full min-h-screen  flex">
      <div className={` `}>
        <Sidebar setSidebar={3} width={open} setWidth={setOpen} />
      </div>
      <div
        className={`w-11/12 mx-auto sm:mb-[200px] mb-[200px] md:mb-[80px] lg:mb-[80px] xl:mb-[80px]`}
      >
        <TopBar>
          {"Detail Izin " + izin[0]?.typeIzin + " " + formattedDate}
        </TopBar>

        {izin ? (
          <div className="w-[95%] mx-auto  mb-[80px]  flex">
            <div className="block w-full font-abc">
              {izin[0]?.foto ? (
                <img
                  className="w-[60%] h-[60%] mt-[50px] mb-[40px] rounded-lg mx-auto object-contain"
                  src={izin[0]?.foto}
                  alt=""
                />
              ) : null}
              <div className="flex w-full ">
                <div className="w-[20%]">
                  {" "}
                  <h1 className="my-3">Nama</h1>
                </div>
                <div className="w-[5%]">
                  {" "}
                  <h1 className="my-3">:</h1>
                </div>
                <div className="w-[65%]">
                  {" "}
                  <h1 className="my-3">{pengaju}</h1>
                </div>
              </div>

              {izin[0]?.typeIzin == "Keluar" ? (
                <>
                  <div className="flex w-full ">
                    <div className="w-[20%]">
                      {" "}
                      <h1 className="my-3">Jam Keluar</h1>
                    </div>
                    <div className="w-[5%]">
                      {" "}
                      <h1 className="my-3">:</h1>
                    </div>
                    <div className="w-[65%]">
                      {" "}
                      <h1 className="my-3">{izin[0]?.jamKeluar}</h1>
                    </div>
                  </div>
                  <div className="flex w-full ">
                    <div className="w-[20%]">
                      {" "}
                      <h1 className="my-3">Jam Masuk</h1>
                    </div>
                    <div className="w-[5%]">
                      {" "}
                      <h1 className="my-3">:</h1>
                    </div>
                    <div className="w-[65%]">
                      {" "}
                      <h1 className="my-3">{izin[0]?.jamMasuk}</h1>
                    </div>
                  </div>
                </>
              ) : izin[0]?.typeIzin == "Pulang" ? (
                <div className="flex w-full ">
                  <div className="w-[20%]">
                    {" "}
                    <h1 className="my-3">Jam Keluar</h1>
                  </div>
                  <div className="w-[5%]">
                    {" "}
                    <h1 className="my-3">:</h1>
                  </div>
                  <div className="w-[65%]">
                    {" "}
                    <h1 className="my-3">{izin[0]?.jamKeluar}</h1>
                  </div>
                </div>
              ) : izin[0]?.typeIzin == "Masuk" ? (
                <div className="flex w-full ">
                  <div className="w-[20%]">
                    {" "}
                    <h1 className="my-3">Jam Masuk</h1>
                  </div>
                  <div className="w-[5%]">
                    {" "}
                    <h1 className="my-3">:</h1>
                  </div>
                  <div className="w-[65%]">
                    {" "}
                    <h1 className="my-3">{izin[0]?.jamMasuk}</h1>
                  </div>
                </div>
              ) : null}
              <div className="flex w-full ">
                <div className="w-[20%]">
                  {" "}
                  <h1 className="my-3">Tanggal</h1>
                </div>
                <div className="w-[5%]">
                  {" "}
                  <h1 className="my-3">:</h1>
                </div>
                <div className="w-[65%]">
                  {" "}
                  <h1 className="my-3">{formattedDate}</h1>
                </div>
              </div>

              <div className="flex w-full ">
                <div className="w-[20%]">
                  {" "}
                  <h1 className="my-3">Status Pengajuan</h1>
                </div>
                <div className="w-[5%]">
                  {" "}
                  <h1 className="my-3">:</h1>
                </div>
                <div className="w-[65%]">
                  {" "}
                  <h1 className="my-3">{izin[0]?.statusPengajuan}</h1>
                </div>
              </div>
              <div className="flex w-full ">
                <div className="w-[20%]">
                  {" "}
                  <h1 className="my-3">Keterangan</h1>
                </div>
                <div className="w-[5%]">
                  {" "}
                  <h1 className="my-3">:</h1>
                </div>
                <div className="w-[65%]">
                  {" "}
                  <h1 className="my-3">{izin[0]?.keterangan}</h1>
                </div>
              </div>

              {user?.role == 2 || user?.role == 5 ? (
                (user?.role == 2 &&
                  izin[0]?.responGuruPengajar == "pending" &&
                  izin[0]?.idUser != user.id) ||
                (user?.role == 5 &&
                  izin[0]?.responKurikulum == "pending" &&
                  izin[0]?.statusPengajuan == "pending" &&
                  izin[0].guruPengajar != null &&
                  izin[0].responGuruPengajar == "Diizinkan" &&
                  izin[0]?.idUser != user.id) ||
                (user?.role == 5 &&
                  izin[0]?.responKurikulum == "pending" &&
                  izin[0]?.statusPengajuan == "pending" &&
                  izin[0].guruPengajar == null &&
                  izin[0].responGuruPengajar == null &&
                  izin[0]?.idUser != user.id && role != 0) ? (
                  <div className="w-full justify-center mt-12 mb-[100px] flex items-center ">
                    <button
                      onClick={(e) => BeriIzin(e)}
                      className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                    >
                      Izinkan
                    </button>
                    <button
                      onClick={() => TolakPermintaan()}
                      className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                    >
                      Tolak
                    </button>
                  </div>
                ) : izin[0]?.idUser == user?.id &&
                  user?.role == 1 &&
                  izin[0]?.responGuruPengajar == "pending" &&
                  izin[0]?.responKurikulum == "pending" &&
                  izin[0]?.statusPengajuan == "pending" ? (
                  <div className="w-full justify-center mt-12 mb-12 flex items-center">
                    <button
                      onClick={() => BatalkanIzin(izin[0]?.id)}
                      className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                    >
                      Batalkan
                    </button>
                  </div>
                ) : izin[0]?.idUser == user?.id &&
                  user?.role == 2 &&
                  izin[0]?.responKurikulum == "pending" &&
                  izin[0]?.statusPengajuan == "pending" ? (
                  <div className="w-full justify-center mt-12 mb-12 flex items-center">
                    <button
                      onClick={() => BatalkanIzin(izin[0]?.id)}
                      className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                    >
                      Batalkan
                    </button>
                  </div>
                ) : null
              ) : izin[0]?.statusPengajuan == "pending" ? (
                <div className="w-full justify-center mt-12 mb-12 flex items-center">
                  <button
                    onClick={() => BatalkanIzin(izin[0]?.id)}
                    className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                  >
                    Batalkan
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div>
            <p>please wait...</p>
          </div>
        )}
      </div>
    </div>
  );
}
