import React, { useState, useEffect } from "react";
import Sidebar from "../components/layout/Sidebar";
import TopBar from "../components/layout/TopBar";
import { useSelector } from "react-redux";
import Indikator from "../components/admin/home/Indikator";

export default function HomePage() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.user);

  return (
    <div>
      <div className="w-full min-h-screen xl:mb-[100px] md:mb-[100px] mb-[500px] lg:mb-[100px]">
        <div className={`transition-all`}>
          <Sidebar setSidebar={1} width={open} setWidth={setOpen} />
        </div>
        <div className={`w-11/12 mx-auto`}>
          <TopBar>
            {user?.role === 1
              ? "Dashboard Siswa"
              : user?.role === 2
              ? "Dashboard Guru"
              : user?.role === 4
              ? "Dashboard Admin"
              : "Dashboard Kurikulum"}
          </TopBar>
          <div className="w-full mt-2 h-[50px] ">
            <div className="">
              <h1 className="text-[17px] font-abc ml-6 ">
                Selamat datang{" "}
                <span className="font-[500]">, {user?.name} </span>
              </h1>
              <div className="mt-4 w-[95%] opacity-25 mx-auto  h-[1px] bg-slate-600"></div>
            </div>
            <Indikator />
          </div>
        </div>
      </div>
    </div>
  );
}
