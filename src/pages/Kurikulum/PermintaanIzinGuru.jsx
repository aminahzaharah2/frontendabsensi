import Sidebar from "../../components/layout/Sidebar.jsx";
import TopBar from "../../components/layout/TopBar.jsx";
import TableIzin from "../../components/admin/Tabel/TabelIzin.jsx";
import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BsTrash3 } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";
import { data } from "autoprefixer";
import { BASE_URL, BACKEND_BASE_URL } from "../../config/base_url.jsx";
import { useSelector } from "react-redux";

export default function PermintaanIzinGuru() {
  const { user } = useSelector((state) => state.user);
  const [Izin, setIzin] = useState([]);
  const [izinSearch, setIzinSearch] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const onChangeSearch = (e) => {
    if (e.target.value == "") {
      setIzinSearch(Izin);
    } else {
      const filterIzin = Izin.filter(
        (item) =>
          item.idUser == e.target.value ||
          item.guruPengajar == e.target.value ||
          item.guruPiket == e.target.value
      );
      setIzinSearch(filterIzin);
    }
  };

  const fetchData = async () => {
    try {
      const result = await axios.get(
        `${BACKEND_BASE_URL}api/getIzinById/${user.id}`
      );
      setIzin(result.data.results);
      setIzinSearch(result.data.results);

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
        <Sidebar setSidebar={3} width={open} setWidth={setOpen} />
      </div>
      <div className={`w-11/12 mx-auto`}>
        <TopBar>{"Semua Izin"}</TopBar>
        <div className="w-[95%] h-[80px] lg:justify-between justify-center xl:justify-between mx-auto flex">
          <div className=""></div>
          {addIzin ? null : (
            <div className=" mt-5 px-3 py-1 w-[200px] h-[40px] rounded-md  font-abc">
              <input
                type="text"
                onChange={(e) => onChangeSearch(e)}
                className="w-full h-full pl-2 rounded-lg"
                placeholder="Search"
              />
            </div>
          )}
        </div>
        <div className="w-[95%] opacity-25 mx-auto mt-0 h-[1px] bg-slate-600"></div>

        {!addIzin ? <TableIzin data={izinSearch} /> : null}
      </div>
    </div>
  );
}
