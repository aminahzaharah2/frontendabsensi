import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import TopBar from "../../components/layout/TopBar";
import { useSelector } from "react-redux";
import { BACKEND_BASE_URL } from "../../config/base_url";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function DetailUser() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const [izin, setIzin] = useState();
  const [dataUser, setDataUser] = useState({
    id: "",
    name: "",
    email: "",
    noHP: "",
    role: "",
  });

  const GetUserById = async () => {
    try {
      const res = await axios.get(`${BACKEND_BASE_URL}api/getUserById/${id}`);
      await axios
        .get(`${BACKEND_BASE_URL}api/DashboardGuru/${id}`)
        .then((res) => {
          setIzin(res?.data);
        });
      console.log(izin);
      setDataUser({
        id: res.data.results.id,
        name: res.data.results.name,
        email: res.data.results.email,
        noHP: res.data.results.noHP,
        role: res.data.results.role,
        fotoprofile: res.data.results.fotoprofile,
        kelas: res.data.results.kelas,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserById();
  }, [id]);

  return (
    <div>
      <div className="w-full min-h-screen xl:mb-[100px] md:mb-[100px] mb-[500px] lg:mb-[100px]">
        <div className={` `}>
          <Sidebar setSidebar={4} width={open} setWidth={setOpen} />
        </div>
        <div className={`w-11/12 mx-auto`}>
          <TopBar>{"Detail User"}</TopBar>

          <div className="w-full mx-auto">
            <div className="xl:flex lg:flex md:flex sm:block gap-4   block justify-center mx-auto  w-[90%]">
              <div className=" xl:w-[70%] lg:w-[70%] md:w-[70%] sm:w-full w-full">
                <div className="w-full mt-6">
                  <h1 className="font-abc font-[500]">Nama</h1>
                  <input
                    type="text"
                    name="name"
                    value={dataUser.name}
                    disabled={true}
                    className="w-full h-[35px] border-[1px] pl-2 border-slate-500 rounded-md"
                  />
                </div>
                {dataUser?.role === 1 ? (
                  <div className="w-full mt-6">
                    <h1 className="font-abc font-[500]">Kelas</h1>
                    <input
                      type="text"
                      name="name"
                      value={dataUser?.kelas}
                      disabled={true}
                      className="w-full h-[35px] border-[1px] pl-2 border-slate-500 rounded-md"
                    />
                  </div>
                ) : null}

                <div className="w-full mt-6">
                  <h1 className="font-abc font-[500]">Email</h1>
                  <input
                    type="text"
                    name="email"
                    value={dataUser.email}
                    disabled={true}
                    className="w-full h-[35px] border-[1px] pl-2 border-slate-500 rounded-md"
                  />
                </div>
                <div className="w-full mt-6">
                  <h1 className="font-abc font-[500]">No Telephone</h1>
                  <input
                    type="text"
                    name="noHP"
                    disabled={true}
                    value={dataUser.noHP}
                    className="w-full h-[35px] border-[1px] pl-2 border-slate-500 rounded-md"
                  />
                </div>
              </div>
              <div className="xl:w-[30%] lg:w-[30%] md:w-[30%] sm:w-full w-full justify-end  xl:ml-[50px] lg:ml-[50px] md:ml-[50px]   mt-12">
                <div className="">
                  <div className="w-[90%] ">
                    <img
                      src={dataUser?.fotoprofile}
                      className="w-[150px] border-2 mt-4 object-cover h-[150px] rounded-full"
                      alt="none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-[90%] mx-auto">
            <div className="mt-10  w-full mx-auto  rounded-lg h-[40vh]  block lg:flex xl:flex md:flex ">
              <div className=" grid grid-cols-3 gap-4  mx-auto w-full ">
                <div className="h-[120px] pl-3 pt-6 relative z-30 rounded-md w-[100%] bg-[#155f95]">
                  <h1 className=" text-white font-[500] text-[20px]">
                    {izin?.masuk}
                  </h1>
                  <h1 className=" text-white font-[500] text-[16px]">
                    Izin Masuk
                  </h1>
                </div>

                <div className="h-[120px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#FDB022]">
                  <h1 className=" text-white font-[500] text-[20px]">
                    {izin?.keluar}
                  </h1>
                  <h1 className=" text-white font-[500] text-[16px]">
                    Izin Keluar
                  </h1>
                </div>

                <div className="h-[120px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#36BFFA]">
                  <h1 className=" text-white font-[500] text-[20px]">
                    {izin?.pulang}
                  </h1>
                  <h1 className=" text-white font-[500] text-[16px]">
                    Izin Pulang
                  </h1>
                </div>

                <div className=" pl-3 pt-6 h-[120px] relative rounded-md w-[100%] bg-[#32D583] ">
                  <h1 className=" text-white font-[500] text-[20px]">
                    {izin?.diizinkan}
                  </h1>
                  <h1 className=" text-white font-[500] text-[16px]">
                    Izin Diterima
                  </h1>
                </div>

                <div className="h-[120px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#F04438]">
                  <h1 className=" text-white font-[500] text-[20px]">
                    {izin?.ditolak}
                  </h1>
                  <h1 className=" text-white font-[500] text-[16px]">
                    Izin Ditolak
                  </h1>
                </div>

                <div className="h-[120px] pl-3 pt-6 relative rounded-md w-[100%] bg-[#000]">
                  <h1 className=" text-white font-[500] text-[20px]">
                    {izin?.masuk + izin?.keluar + izin?.pulang}
                  </h1>
                  <h1 className=" text-white font-[500] text-[16px]">
                    Total Izin
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
