import Sidebar from "../../components/layout/Sidebar.jsx";
import TopBar from "../../components/layout/TopBar.jsx";
import TableTambahBarang from "../../components/admin/pengadaanbarang/TabelBarang.jsx";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BsTrash3 } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { data } from "autoprefixer";
import { BASE_URL, BACKEND_BASE_URL } from "../../config/base_url.jsx";
import TabelIzinGuru from "../../components/admin/pengadaanbarang/TabelIzinGuru.jsx";
import { useSelector } from "react-redux";

export default function IzinGuru() {
  const [Izin, setIzin] = useState([]);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `${BACKEND_BASE_URL}/api/getIzinGuruById/${user.id}`
      );
      setIzin(result.data.results);
      console.log(result.data.results);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 milliseconds
    } catch (err) {
      console.log(err);
    }
  };

  const [addIzin, setAddIzin] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full min-h-screen mb-[50px] flex">
      <div className={``}>
        <Sidebar setSidebar={3} width={open} setWidth={setOpen} />
      </div>
      <div className={`w-11/12 mx-auto`}>
        <TopBar>{"Permintaan Izin Saya"}</TopBar>

        {!addIzin ? <TabelIzinGuru data={Izin} /> : null}
      </div>
    </div>
  );
}
