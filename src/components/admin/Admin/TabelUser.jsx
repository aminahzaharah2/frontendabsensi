import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { BiEditAlt } from "react-icons/bi";
import { BsEye, BsTrash3 } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import Spinner from "../../layout/Spinner";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACKEND_BASE_URL, BASE_URL } from "../../../config/base_url";

export default function TabelUser({ data, children }) {
    const nav = useNavigate();
    const { user } = useSelector((state) => state.user);
    const [editBarang, setEditBarang] = useState(false);
    const [pengadaanBarang, setPengadaanBarang] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [filterBulan, setFilterBulan] = useState("");
    const [filterTahun, setFilterTahun] = useState("");
    const [status, setStatus] = useState("");
    const bulan = [
        "Januari",
        "Febuari",
        "Maret",
        "April",
        "Mei",
        "Juni",
        "Juli",
        "Agustus",
        "September",
        "Oktober",
        "November",
        "Desember",
    ];
    let tahunSekarang = new Date().getFullYear() + 1;
    const tahun = [];
    const [gridKey, setGridKey] = useState(0);
    const [filter, setFilter] = useState("");

    for (let i = 0; i < 10; i++) {
        tahun.push(tahunSekarang - 1);
        tahunSekarang = tahunSekarang - 1;
    }

    let row = [];

    const [dataUser, setDataUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        noHP: ""
    })

    const [err, setErr] = useState({
        name: "",
        email: "",
        password: "",
        role: "",
        noHP: ""
    })

    useEffect(() => {
        fetchData();
        console.log(data.length);
    }, []);

    const fetchData = async () => {
        const getMapel = await axios.get(`${BACKEND_BASE_URL}/api/getUser`);
        setAllUser(getMapel.data.results);
    };

    const deletePetugas = async (id) => {
        try {
            const res = await axios.delete(`${BACKEND_BASE_URL}/api/deleteUser/${id}`)

            if (res.status == 200) {
                window.location.reload();
            }
        } catch (err) {
            console.log(err);
        }
    }

    const tambahUser = async () => {
        try {
            const res = await axios.post(`${BACKEND_BASE_URL}/api/Register`, data);

            if (res.status === 200) {
                nav("/owner/petugas");
            }
        } catch (err) {
            console.log(err);
            setErr({
                name: err.response.data.errors.name,
                email: err.response.data.errors.email,
                password: err.response.data.errors.password,
                role: err.response.data.errors.role,
                noHP: err.response.data.errors.noHP
            })
        }
    }

    const showUser = () => {
        data
            .filter(
                (item) =>
                    (filterBulan === "" ||
                        new Date(item.created_at).getMonth() === Number(filterBulan)) &&
                    (filterTahun === "" ||
                        new Date(item.created_at).getFullYear() === Number(filterTahun))
            )
            .forEach((a, index) => {
                row.push({
                    id: a.id,
                    nama: a.name,
                    email: a.email,
                    role: a.role,
                    nohp: a.noHP,
                });
            });
    };

    showUser();

    const columns = [
        { field: "id", headerName: "ID", minWidth: 50, flex: 0.2 },
        {
            field: "nama",
            headerName: "Nama Petugas",
            minWidth: 150,
            flex: 0.7,
        },

        {
            field: "email",
            headerName: "Email",
            minWidth: 100,
            flex: 0.7,
        },
        {
            field: "role",
            headerName: "Role",
            minWidth: 100,
            flex: 0.7,
        },
        {
            field: "nohp",
            headerName: "No HP",
            minWidth: 100,
            flex: 0.7,
        },
        {
            field: "aksi",
            headerName: "Aksi",
            flex: 1,
            minWidth: 150,

            sortable: false,
            renderCell: (params) => {
                return (
                    <div className="flex">
                        <button onClick={() => deletePetugas(params.id)} className="mr-4">
                            <BsTrash3 color="red" size={20} />
                        </button>
                        <button
                            className=""
                            onClick={() => nav(`/EditUser/${params.id}`)}
                        >
                            <BiEditAlt color="blue" size={20} />
                        </button>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <div className="bg-white w-[96%] mt-3  mb-[200px]  mx-auto p-3 rounded-lg">

                {pengadaanBarang ? (<div className="w-[80%] mx-auto mt-10">
                    <div className="w-full mt-4">
                        <h1 className="font-abc pb-2">Nama Lengkap</h1>
                        <input
                            type="text"
                            name="name"
                            onChange={(e) => changeDataHandler(e)}
                            className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                        />
                        {err.name ?
                            <p>{err.name}</p> : null
                        }
                    </div>
                    <div className="w-full mt-4">
                        <h1 className="font-abc pb-2">Email</h1>
                        <input
                            type="email"
                            name="email"
                            onChange={(e) => changeDataHandler(e)}
                            className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                        />
                        {err.email ?
                            <p>{err.email}</p> : null
                        }
                    </div>
                    <div className="w-full mt-4">
                        <h1 className="font-abc pb-2">Password</h1>
                        <input
                            type="password"
                            name="password"
                            onChange={(e) => changeDataHandler(e)}
                            className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                        />
                        {err.password ?
                            <p>{err.password}</p> : null
                        }
                    </div>
                    <div className="w-full mt-4">
                        <h1 className="font-abc pb-2">No HP</h1>
                        <input
                            type="number"
                            name="noHP"
                            onChange={(e) => changeDataHandler(e)}
                            className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                        />
                        {err.noHP ?
                            <p>{err.noHP}</p> : null
                        }
                    </div>
                    <div className="w-full mt-4">
                        <h1 className="font-abc pb-2 ">Role</h1>
                        <select
                            name="role"
                            className=" border-2 border-slate-500 rounded-xl pl-3 w-full h-[30px]"
                            onChange={(e) => changeDataHandler(e)}
                        >
                            <option value="4">Admin</option>
                            <option value="">Pilih Role</option>
                            <option value="1">Siswa</option>
                            <option value="2">Guru Pengajar</option>
                            <option value="3">Guru Piket</option>
                        </select>
                        {err.role ?
                            <p>{err.role}</p> : null
                        }
                    </div>
                    <div className="w-full justify-center mt-12 mb-12 flex items-center">
                        <button
                            onClick={tambahUser}
                            className="bg-[#7B2CBF] px-3 py-1 w-[140px] rounded-md text-[#E5D5F2] font-abc"
                        >
                            Simpan
                        </button>
                        <button
                            onClick={() => nav("/owner/petugas")}
                            className="bg-[#E5D5F2] px-3 py-1 w-[140px] rounded-md ml-2  text-[#7B2CBF] font-abc"
                        >
                            Batal
                        </button>
                    </div>
                </div>) : null}

                {!pengadaanBarang && !editBarang ? (
                    <div className="">
                        <div className="bg-white w-[96%] mt-3 mb-[200px]  mx-auto  rounded-lg">
                            <div className="lg:flex xl:flex block justify-between">
                                <div className="">
                                    {user.role == 1 ?
                                        <button
                                            onClick={() => setPengadaanBarang(!pengadaanBarang)}
                                            className="bg-[#7B2CBF] mt-1 mb-3 px-3 text-center py-1 xl:w-[200px] lg:w-[200px] w-full md:w-[200px] rounded-md text-[#E5D5F2] font-abc"
                                        >
                                            Ajukan Izin +
                                        </button> : null
                                    }
                                </div>
                                <div className="mt-1 mb-3 px-3">
                                    <form className="block lg:flex xl:flex md:block   md:mt-[0px] lg:mt-0 xl:mt-0  ">
                                        <div className="flex">
                                            <div className="">
                                                <select
                                                    name=""
                                                    id="bulan"
                                                    onChange={(e) => setFilterBulan(e.target.value)}
                                                    className="border h-[34px] rounded-xl w-[100px] pl-2 "
                                                >
                                                    <option value="">Bulan</option>
                                                    {bulan.map((item, index) => {
                                                        return <option value={index}>{item}</option>;
                                                    })}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex">
                                            <div className="">
                                                <select
                                                    name=""
                                                    id="tahun"
                                                    onChange={(e) => setFilterTahun(e.target.value)}
                                                    className="border h-[34px] rounded-xl w-[100px] pl-2 "
                                                >
                                                    <option value="">Tahun</option>
                                                    {tahun.map((item, index) => {
                                                        return <option value={item}>{item}</option>;
                                                    })}
                                                </select>
                                            </div>
                                            <div className="">
                                                <select
                                                    name=""
                                                    id="statuss"
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    className="border h-[34px] rounded-xl w-[100px] pl-2 "
                                                >
                                                    <option value="">Status</option>
                                                    <option value="pending">Pending</option>
                                                    <option value="accept">Acc</option>
                                                    <option value="">All</option>
                                                </select>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {data ? (
                                <DataGrid
                                    key={gridKey}
                                    disableRowSelectionOnClick
                                    autoHeight
                                    columns={columns}
                                    rows={row}
                                    data={row}
                                />
                            ) : (
                                <Spinner />
                            )}
                        </div>
                    </div>
                ) : null}
            </div>
        </>
    );
}
