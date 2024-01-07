import Sidebar from "../../components/layout/Sidebar.jsx";
import TopBar from "../../components/layout/TopBar.jsx";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, BACKEND_BASE_URL } from "../../config/base_url.jsx";
import TabelIzinGuru from "../../components/admin/Tabel/TabelIzinGuru.jsx";
import TableIzin from "../../components/admin/Tabel/TabelIzin.jsx";
import { useSelector } from "react-redux";

export default function PermintaanIzinSiswa() {
  const [Izin, setIzin] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `${BACKEND_BASE_URL}api/getIzinByKurikulumId/${user.id}`
      );
      setIzin(result.data.results);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 milliseconds
    } catch (err) {
      console.log(err);
    }
  };

  const [addIzin, setAddIzin] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-[100vh] flex">
      <div className={``}>
        <Sidebar setSidebar={2} width={open} setWidth={setOpen} />
      </div>
      <div className={`w-11/12 mx-auto`}>
        <TopBar>{"Permintaan Izin Dari Siswa"}</TopBar>

        <div className="w-[95%] opacity-25 mx-auto mt-0 h-[1px] bg-slate-600"></div>

        {!addIzin ? <TableIzin data={Izin} /> : null}
      </div>
    </div>
  );
}
