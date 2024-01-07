import { useEffect, useState } from "react";

import Frame4 from "../../../assets/Frame(4).png";
import axios from "axios";
import { useSelector } from "react-redux";
import DetailCard from "./DetailCard";
import { Link } from "react-router-dom";
import { BACKEND_BASE_URL } from "../../../config/base_url";

export default function Indikator() {
  const { user } = useSelector((state) => state.user);
  const [kurikulum, setKurikulum] = useState();
  const [guru, setGuru] = useState();
  const [siswa, setSiswa] = useState();
  const [admin, setAdmin] = useState();

  const dashboard = async () => {
    await axios
      .get(`${BACKEND_BASE_URL}api/DashboardKurikulum/${user?.id}`)
      .then((res) => {
        setKurikulum(res?.data);
      });
    await axios.get(`${BACKEND_BASE_URL}api/DashboardAdmin`).then((res) => {
      setAdmin(res?.data);
    });
    await axios
      .get(`${BACKEND_BASE_URL}api/DashboardSiswa/${user?.id}`)
      .then((res) => {
        setSiswa(res?.data);
      });
    await axios
      .get(`${BACKEND_BASE_URL}api/DashboardGuru/${user?.id}`)
      .then((res) => {
        setGuru(res?.data);
      });
  };

  useEffect(() => {
    dashboard();
  }, [user?.id]);

  return (
    <div className="">
      {user?.role === 1 ? (
        <div className="mt-3 p-3 w-full mx-auto bg-white rounded-lg h-[40vh]  block lg:flex xl:flex md:flex ">
          <div className=" grid grid-cols-2 gap-4  mx-auto lg:w-[50%] xl:w-[50%] md:w-[50%] w-full  px-4">
            <Link to={"/Izin"}>
              <div className="h-[100px] pl-3 pt-6 relative z-30 rounded-md w-[100%] bg-[#155f95]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {siswa?.masuk}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Masuk
                </h1>
              </div>
            </Link>
            <Link to={"/Izin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-slate-500">
                <h1 className=" text-white font-[500] text-[20px]">
                  {siswa?.keluar}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Keluar
                </h1>
              </div>
            </Link>

            <Link to={"/Izin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#36BFFA]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {siswa?.pulang}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Pulang
                </h1>
              </div>
            </Link>
            <Link to={"/Izin"}>
              <div className=" pl-3 pt-6 h-[100px] relative rounded-md w-[100%] bg-[#32D583] ">
                <h1 className=" text-white font-[500] text-[20px]">
                  {siswa?.diizinkan}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Diterima
                </h1>
              </div>
            </Link>
            <Link to={"/Izin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#F04438]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {siswa?.pulang}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Ditolak
                </h1>
              </div>
            </Link>
            <Link to={"/Izin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#FDB022]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {siswa?.pending}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Menunggu Persetujuan
                </h1>
              </div>
            </Link>
            <Link to={"/Izin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-purple-500">
                <h1 className=" text-white font-[500] text-[20px]">
                  {siswa?.masuk + siswa?.keluar + siswa?.pulang}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Total Izin
                </h1>
              </div>
            </Link>
          </div>

          <div className=" lg:w-[50%] xl:w-[50%] md:w-[50%] w-full  xl:px-10 lg:px-10 md:px-10 px-3 xl:-mt-3 lg:-mt-3 md:-mt-3 mt-10">
            <DetailCard />
          </div>
        </div>
      ) : user?.role === 4 ? (
        <div className="mt-3 p-3 w-full mx-auto bg-white rounded-lg h-[40vh] md:flex  lg:flex xl:flex">
          <div className=" grid grid-cols-1 gap-4 md:w-[50%] lg:w-[50&] xl:w-[50%] w-full mx-auto  md:grid-cols-1 lg:grid-cols-1 ">
            <Link to={"/AllUsers"}>
              <div className="h-[100px] pl-3 pt-6 relative z-30 rounded-md w-[100%] bg-[#155f95]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {admin?.siswa}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">Siswa</h1>
              </div>
            </Link>
            <Link to={"/AllUsers"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#FDB022]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {admin?.guru}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">Guru</h1>
              </div>
            </Link>
            <Link to={"/AllUsers"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-red-500">
                <h1 className=" text-white font-[500] text-[20px]">
                  {admin?.admin}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">Admin</h1>
              </div>
            </Link>
            <Link to={"/AllUsers"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-green-500">
                <h1 className=" text-white font-[500] text-[20px]">
                  {admin?.admin}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Kurikulum
                </h1>
              </div>
            </Link>
          </div>

          <div className=" lg:w-[50%] xl:w-[50%] md:w-[50%] w-full  xl:px-10 lg:px-10 md:px-10 px-3 xl:-mt-3 lg:-mt-3 md:-mt-3 mt-10">
            <DetailCard />
          </div>
        </div>
      ) : user?.role === 2 ? (
        <div className="mt-3 p-3 w-full mx-auto bg-white rounded-lg h-[40vh]  block lg:flex xl:flex md:flex ">
          <div className=" grid grid-cols-2 gap-4  mx-auto lg:w-[50%] xl:w-[50%] md:w-[50%] w-full ">
            <Link to={"/PermintaanIzinGuru"}>
              <div className="h-[100px] pl-3 pt-6 relative z-30 rounded-md w-[100%] bg-[#155f95]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.masuk}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Masuk
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzinGuru"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#FDB022]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.keluar}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Keluar
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzinGuru"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#36BFFA]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.pulang}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Pulang
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzinGuru"}>
              <div className=" pl-3 pt-6 h-[100px] relative rounded-md w-[100%] bg-[#32D583] ">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.diizinkan}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Diterima
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzinGuru"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#F04438]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.ditolak}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Izin Ditolak
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-black">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.totalSiswa}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Total Izin Seluruh Siswa
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzinGuru"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-yellow-400">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.menungguPersetujuan}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Menunggu Persetujuan
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-purple-400">
                <h1 className=" text-white font-[500] text-[20px]">
                  {guru?.pengajuanSiswa}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Pengajuan Siswa
                </h1>
              </div>
            </Link>
          </div>

          <div className=" lg:w-[50%] xl:w-[50%] md:w-[50%] w-full  xl:px-10 lg:px-10 md:px-10 px-3 xl:-mt-3 lg:-mt-3 md:-mt-3 mt-10">
            <DetailCard />
          </div>
        </div>
      ) : user?.role === 5 ? (
        <div className="mt-3 p-3 w-full mx-auto bg-white rounded-lg h-[40vh]  block lg:flex xl:flex md:flex ">
          <div className=" grid grid-cols-2 gap-4  mx-auto lg:w-[50%] xl:w-[50%] md:w-[50%] w-full ">
            <Link to={"/AllUsers"}>
              <div className="h-[100px] pl-3 pt-6 relative z-30 rounded-md w-[100%] bg-[#155f95]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {kurikulum?.siswa}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Daftar Siswa
                </h1>
              </div>
            </Link>
            <Link to={"/AllUsers"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#FDB022]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {kurikulum?.guru}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Daftar Guru
                </h1>
              </div>
            </Link>
            <Link to={"/AllUsers"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#32D583]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {kurikulum?.admin}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Daftar Admin
                </h1>
              </div>
            </Link>

            <Link to={"/AllUsers"}>
              <div className=" pl-3 pt-6 h-[100px] relative rounded-md w-[100%] bg-[#F04438]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {kurikulum?.kurikulum}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Daftar Kurikulum
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzin"}>
              <div className="h-[100px] pl-3 pt-6 relative rounded-md w-[100%] bg-purple-500">
                <h1 className=" text-white font-[500] text-[20px]">
                  {kurikulum?.guruWaiting}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Permintaan Izin Dari Guru
                </h1>
              </div>
            </Link>
            <Link to={"/PermintaanIzinSiswa"}>
              <div className=" pl-3 pt-6 h-[100px] relative rounded-md w-[100%] bg-[#000]">
                <h1 className=" text-white font-[500] text-[20px]">
                  {kurikulum?.siswaWaiting}
                </h1>
                <h1 className=" text-white font-[500] text-[16px]">
                  Permintaan Izin Dari Siswa
                </h1>
              </div>
            </Link>
          </div>

          <div className=" lg:w-[50%] xl:w-[50%] md:w-[50%] w-full  xl:px-10 lg:px-10 md:px-10 px-3 xl:-mt-3 lg:-mt-3 md:-mt-3 mt-10">
            <DetailCard />
          </div>
        </div>
      ) : null}
    </div>
  );
}
