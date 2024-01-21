import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";

import { store } from "./redux/store";
import { loadUser } from "./redux/actions/user";
import { useSelector } from "react-redux";
import SemuaIzinGuru from "./pages/Kurikulum/Izin";
import SemuaIzin from "./pages/Siswa/SemuaIzin";
import IzinGuru from "./pages/Guru/Izin";
import DetailIzin from "./pages/DetailIzin";
import PermissionGuruPengajar from "./pages/Guru/PermissionGuruPengajar";
import AllUser from "./pages/Admin/User/AllUser";
import AddUser from "./pages/Admin/User/AddUser";
import EditUser from "./pages/Admin/User/EditUser";
import AddMapel from "./pages/Admin/MataPelajaran/AddMapel";
import MapelSiswa from "./pages/Admin/MataPelajaran/MapelSiswa";
import EditProfilePage from "./pages/EditProfilePage";
import ChangePassword from "./pages/Admin/User/ChangePassword";
import LandingPage from "./pages/LandingPage";
import PermintaanIzinSiswa from "./pages/Kurikulum/PermintaanIzinSiswa";
import NotfoundPage from "./pages/NotfoundPage";
import NfPage from "./pages/NfPage";
import DetailUser from "./pages/Kurikulum/DetailUser";
import IzinByUser from "./pages/Kurikulum/IzinByUser";

function App() {
  const { isLogin, user } = useSelector((state) => state.user);
  useEffect(() => {
    store.dispatch(loadUser());
  }, [isLogin === true]);

  return (
    <>
      <BrowserRouter>
        {user === undefined ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<NfPage />} />
          </Routes>
        ) : user?.role === 2 ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/home"
              element={user === undefined ? <NfPage /> : <HomePage />}
            />
            <Route path="*" element={<NotfoundPage />} />
            <Route
              path="/PermintaanIzin"
              element={<PermissionGuruPengajar />}
            />
            <Route path="/PermintaanIzinGuru" element={<IzinGuru />} />
            <Route path="/Detail/:id/:role" element={<DetailIzin />} />
            <Route path="/Profile" element={<EditProfilePage />} />
          </Routes>
        ) : user?.role === 4 ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/AllUsers" element={<AllUser />} />
            <Route path="/AddUser" element={<AddUser />} />
            <Route path="/EditUser/:id" element={<EditUser />} />
            <Route path="/MataPelajaran" element={<MapelSiswa />} />
            <Route path="/AddMapel" element={<AddMapel />} />
            <Route path="/ChangePassword/:id" element={<ChangePassword />} />
            <Route path="/Profile" element={<EditProfilePage />} />
            <Route path="*" element={<NotfoundPage />} />
          </Routes>
        ) : user?.role == 5 ? (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/DetailUser/:id" element={<DetailUser />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/AllUsers" element={<AllUser />} />
            <Route path="/PermintaanIzin" element={<SemuaIzinGuru />} />
            <Route path="/IzinByUser/:iduser/:role/:tipe/:statusFilter" element={<IzinByUser/>}/>
            <Route
              path="/PermintaanIzinSiswa"
              element={<PermintaanIzinSiswa />}
            />
            <Route path="/Detail/:id/:role" element={<DetailIzin />} />
            <Route path="/Profile" element={<EditProfilePage />} />
            <Route path="*" element={<NotfoundPage />} />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/Izin" element={<SemuaIzin />} />
            <Route path="/Detail/:id/:role" element={<DetailIzin />} />
            <Route path="/Profile" element={<EditProfilePage />} />
            <Route path="*" element={<NotfoundPage />} />
          </Routes>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
