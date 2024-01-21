import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useSelector } from "react-redux";

export default function DetailCard() {
  const { user } = useSelector((state) => state.user);
  const originalDate = new Date(user?.created_at);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = originalDate.toLocaleDateString("id-ID", options);

  return (
    <div className="w-[100%] border-[1px] border-slate-400 h-[500px] rounded-lg mt-4 bg-white justify-center items-center flex-col">
      <div className="w-full mx-auto flex-col pt-[70px]">
        <img
          src={user?.fotoprofile}
          className="mx-auto w-[120px] border-2 border-black object-cover shadow-lg h-[120px] mb-5 rounded-full"
          alt={user?.name}
        />
        <div className="text-center  font-abc w-full">
          <h1 className="">{user?.name}</h1>
          <h3 className="text-[13px] font-[300]  ">{user?.email}</h3>
        </div>
      </div>
      <div className="w-[80%] mx-auto text-center mt-8 justify-between flex">
        <h1 className="font-abc font-[300] ">Tanggal Daftar</h1>
        <h1 className="font-abc font-[500] text-[#155f95]">{formattedDate}</h1>
      </div>
      <div className="w-[80%] mx-auto h-[1px] mt-3 bg-[#CDD5DF]"></div>
      <div className="w-[80%] mx-auto text-center mt-8 justify-between flex">
        <h1 className="font-abc font-[300] ">Level</h1>
        <h1 className="font-abc font-[500] text-[#155f95]">
          {user?.role == 1
            ? "Siswa"
            : user?.role == 2
            ? "Guru Pengajar"
            : user?.role == 4
            ? "Admin"
            : "Kurikulum"}
        </h1>
      </div>
      <div className="w-[80%] mx-auto h-[1px] mt-3 bg-[#CDD5DF]"></div>
    </div>
  );
}
