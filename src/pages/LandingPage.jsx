import logo from "../assets/ICON-1-2-1536x332.png";
import logo2 from "../assets/5260-high_school_class-1296x728-header.webp";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { BACKEND_BASE_URL } from "../config/base_url";

export default function LandingPage() {
  const { user } = useSelector((state) => state.user);
  const [test, setTest] = useState([])
  const getTest = async() => {
    const data = await fetch(`${BACKEND_BASE_URL}api/getUser` ,  mode: 'cors',
  headers: {
    'Access-Control-Allow-Origin':'*'
  }
);
    console.log("kont",data.json());
  }
  const nav = useNavigate();
  useEffect(() => {
    getTest();
    if (user) {
      nav("/home");
    }
  }, [user]);

  return (
    <div className="">
      <div className="w-full bg-[#155f95] ">
        <div className="w-11/12 mx-auto  bg-[#155f95] ">
          {/* navbar */}
          <div className="w-full h-[12vh]  flex justify-between">
            <div className="">
              <img
                src={logo}
                alt=""
                className=" object-contain my-auto h-[70px] w-[200px]"
              />
            </div>

            <div className="h-full my-auto">
              <Link to={"/login"}>
                <button className="font-abc text-white mt-4 bg-sky-600 py-2 px-3 rounded-md">
                  Login
                </button>
              </Link>
            </div>
          </div>
          {/* navbar */}
        </div>
      </div>
      <div className="w-full relative">
        <img
          src={logo2}
          className=" object-cover w-full mt-0 h-[73vh]"
          alt=""
        />
        <div className="absolute w-full  h-[73vh] top-0  bg-black opacity-70 flex items-center justify-center ">
          <div className="">
            <h1 className="font-abc lg:text-[30px] xl:text-[30px] md:text-[20px] text-[17px] text-center text-white opacity-100">
              Sistem Perizinan SMKN 1 Kabupaten Tangerang
            </h1>
          </div>
        </div>
        <div className="">

        </div>
      </div>
      <div className="w-full mx-auto  bg-[#155f95] ">
        {/* navbar */}
        <div className="w-full h-[15vh]  flex items-center mx-auto">
          <h1 className="font-abc text-center w-full text-white font-bold">
            © 2023 ICT SMKN 1
          </h1>
        </div>
        {/* navbar */}
      </div>
    </div>
  );
}
