import axios, { all } from "axios";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BsTrash3 } from "react-icons/bs";
import { BiEditAlt } from "react-icons/bi";

import Sidebar from "../../../components/layout/Sidebar.jsx";
import TopBar from "../../../components/layout/TopBar.jsx";
import { BACKEND_BASE_URL, BASE_URL } from "../../../config/base_url.jsx";
import { useNavigate } from "react-router-dom";

export default function AddMapel() {
  const [barang, setBarang] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [allMapel, setAllMapel] = useState([]);
  const nav = useNavigate();
  const [mapel, setMapel] = useState({
    kodePelajaran: "",
    namaPelajaran: "",
  });

  const [mapelErrors, setMapelErrors] = useState({
    kodePelajaran: "",
    namaPelajaran: "",
  });

  const TambahMapel = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${BACKEND_BASE_URL}api/AddMataPelajaran`,
        mapel
      );
      if (res.statusCode === 200) {
        nav(`${BASE_URL}/MataPelajaran`);
      }
    } catch (err) {
      console.log(err);
      setMapelErrors({
        kodePelajaran: err.response.data.error.kodePelajaran,
        namaPelajaran: err.response.data.error.namaPelajaran,
      });
    }
  };

  const EditHandler = (kodePelajaran, namaPelajaran) => {
    setMapel((prevData) => ({
      ...prevData,
      kodePelajaran: kodePelajaran,
      namaPelajaran: namaPelajaran,
    }));

    setIsEdit(true);
  };

  const TambahHandler = () => {
    setMapel((prevData) => ({
      ...prevData,
      kodePelajaran: kodePelajaran,
      namaPelajaran: namaPelajaran,
    }));

    setIsEdit(false);
  };

  const UpdateMapel = async (id) => {
    try {
      const result = await axios.put(
        `${BACKEND_BASE_URL}api/UpdateMataPelajaran` + id,
        mapel
      );
      if (result) {
        nav(`${BASE_URL}/MataPelajaran`);
      }
    } catch (err) {
      console.log(err);
      setMapelErrors({
        kodePelajaran: err.response.data.error.kodePelajaran,
        namaPelajaran: err.response.data.error.namaPelajaran,
      });
    }
  };

  const DeleteMapel = async (id) => {
    const result = await axios.delete(
      `${BACKEND_BASE_URL}api/DeleteMapel/` + id
    );
    if (result) {
      window.location.reload();
    }
  };

  const changeKategoriHandler = (e) => {
    setMapel({
      ...mapel,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resultPelajaran = await axios.get(
        `${BACKEND_BASE_URL}api/getMataPelajaran`
      );
      setAllMapel(resultPelajaran.data.results);
    } catch (err) {
      console.log(err);
    }
  };

  const [addMapel, setAddMapel] = useState(false);
  const [open, setOpen] = useState(false);

  const columns = [
    { field: "id", headerName: "Kode Pelajaran", minWidth: 50, flex: 0.5 },

    {
      field: "namaPelajaran",
      headerName: "Nama Pelajaran",
      minWidth: 150,
      flex: 0.7,
    },

    {
      field: "aksi",
      headerName: "Aksi",
      flex: 0.7,
      minWidth: 150,

      sortable: false,
      renderCell: (params) => {
        return (
          <div className="flex">
            <button className="mr-4" onClick={() => DeleteKategori(params.id)}>
              <BsTrash3 color="red" size={20} />
            </button>
            <button
              className=""
              onClick={() => EditHandler(params.id, params.row.namaPelajaran)}
            >
              <BiEditAlt color="blue" size={20} />
            </button>
          </div>
        );
      },
    },
  ];

  const row = [];

  allMapel.forEach((a) => {
    row.push({
      id: a.kodePelajaran,
      namaPelajaran: a.namaPelajaran,
    });
  });

  return (
    <div className="w-full h-[100vh] flex">
      <div className={`${!open ? "w-[16%]" : "w-[5%]"} `}>
        <Sidebar setSidebar={2} width={open} setWidth={setOpen} />
      </div>
      <div className={`${!open ? "w-[84%]" : "w-[95%]"} `}>
        <TopBar>{"Pengadaan Barang"}</TopBar>
        <div className="w-[95%] h-[80px] justify-between flex mx-auto">
          <div className="">
            <button
              onClick={() => nav("/admin/pengadaan")}
              className="bg-[#155f95] mt-5 px-3 text-center py-1 w-[200px] rounded-md text-[#E5D5F2] font-abc"
            >
              {"<"} Kembali
            </button>
          </div>
        </div>
        <div className="w-[95%] opacity-25 mx-auto mt-0 h-[1px] bg-slate-600"></div>
        <div className="w-[95%] mx-auto h-[105vh] bg-white rounded-xl">
          {isEdit ? (
            <div className="w-[95%] mx-auto mt-6 p-3">
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Kode Pelajaran</h1>
                <input
                  type="text"
                  value={mapel.kodePelajaran}
                  name="kodePelajaran"
                  disabled
                  onChange={(e) => changeKategoriHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2">Nama Pelajaran</h1>
                <input
                  type="text"
                  value={mapel.namaPelajaran}
                  name="namaPelajaran"
                  onChange={(e) => changeKategoriHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
              </div>

              <div className="w-full justify-center mt-12 flex items-center">
                <button
                  onClick={(e) => UpdateMapel(mapel.kodePelajaran)}
                  className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                >
                  Simpan
                </button>
                <button
                  onClick={() => {
                    TambahHandler();
                  }}
                  className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                >
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="w-[95%] mx-auto mt-6 p-3">
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2 ">Kode Pelajaran</h1>
                <input
                  type="text"
                  value={mapel.kodePelajaran}
                  name="kodePelajaran"
                  onChange={(e) => changeKategoriHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
                {mapelErrors.kodePelajaran ? (
                  <p>{mapelErrors.kodePelajaran}</p>
                ) : null}
              </div>
              <div className="w-full mt-4">
                <h1 className="font-abc pb-2">Nama Pelajaran</h1>
                <input
                  type="text"
                  value={mapel.namaPelajaran}
                  name="namaPelajaran"
                  onChange={(e) => changeKategoriHandler(e)}
                  className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                />
                {mapelErrors.namaPelajaran ? (
                  <p>{mapelErrors.namaPelajaran}</p>
                ) : null}
              </div>

              <div className="w-full justify-center mt-12 flex items-center">
                <button
                  onClick={(e) => TambahMapel(e)}
                  className="bg-[#155f95] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                >
                  Simpan
                </button>
                <button
                  onClick={() => setAddMapel(!addMapel)}
                  className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#155f95] font-abc"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
          <div className="w-[95%] mx-auto mt-6 p-3 bg-white">
            <DataGrid
              className="w-full"
              disableRowSelectionOnClick
              autoHeight
              columns={columns}
              rows={row}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
