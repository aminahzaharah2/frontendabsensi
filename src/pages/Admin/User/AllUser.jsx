import Sidebar from "../../../components/layout/Sidebar.jsx";
import TopBar from "../../../components/layout/TopBar.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { BASE_URL, BACKEND_BASE_URL } from "../../../config/base_url.jsx";
import TabelUser from "../../../components/admin/Admin/TabelUser.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AllUser() {
  const [users, setUsers] = useState([]);
  const { user } = useSelector((state) => state.user);
  const nav = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get(`${BACKEND_BASE_URL}api/getUser`);
      setUsers(result.data.results);

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1000 milliseconds
    } catch (err) {
      console.log(err);
    }
  };

  const [addIzin, setAddIzin] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full min-h-screen mb-[100px] flex">
      <div className={``}>
        <Sidebar
          setSidebar={user?.role === 5 ? 4 : 2}
          width={open}
          setWidth={setOpen}
        />
      </div>
      <div className={`w-11/12 mx-auto`}>
        <TopBar>{"Semua Pengguna"}</TopBar>
        <div className="w-[95%] h-[80px] lg:justify-between justify-center xl:justify-between mx-auto flex">
          {user?.role === 5 ? null : (
            <div className="">
              <button
                onClick={() => nav("/AddUser")}
                className="bg-[#155f95] mt-5 px-3 text-center py-1 w-[200px] rounded-md text-[#E5D5F2] font-abc"
              >
                Tambah Pengguna +
              </button>
            </div>
          )}
        </div>
        <div className="w-[95%] opacity-25 mx-auto mt-0 h-[1px] bg-slate-600"></div>

        {!addIzin ? <TabelUser data={users} /> : null}
      </div>
    </div>
  );
}
