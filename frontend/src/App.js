import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { clearAuthCookies, hasTokenCookie } from "./utils/authUtils";
import { ToastContainer } from "react-toastify";

import Bottombar from "./components/BottomBar/Bottombar";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import ProgressBar from "./components/ProgressBar/ProgressBar";
import PreLoader from "./components/PreLoader/PreLoader";
import DynamicTitle from "./components/SubComponents/DynamicTitle";

import HomePage from "./components/Pages/HomePage";
import AboutMePage from "./components/Pages/AboutMePage";
import EducationWorkPage from "./components/Pages/EducationWorkPage";
import SkillPage from "./components/Pages/SkillPage";
import ProjectPage from "./components/Pages/ProjectPage";
import ContactPage from "./components/Pages/ContactPage";
import LoginPage from "./components/Pages/LoginPage";
import VisitorStat from "./components/VisitorStat/VisitorStat";
import ProtectedRoutes from "./components/ProtectedRoutes/ProtectedRoutes";

import AdminPanel from "./components/AdminPanel/AdminPanel";
import EducationTimeLine from "./components/AdminPanel/Components/EducationTimeLine";
import WorkTimeLine from "./components/AdminPanel/Components/WorkTimeLine";
import Skill from "./components/AdminPanel/Components/Skill";
import KnownLanguage from "./components/AdminPanel/Components/KnownLanguage";
import FrontendProject from "./components/AdminPanel/Components/FrontendProject";
import FullstackProject from "./components/AdminPanel/Components/FullstackProject";
import BackendProject from "./components/AdminPanel/Components/BackendProject";
import LoginDetails from "./components/AdminPanel/Components/LoginDetails";
import AboutDetails from "./components/AdminPanel/Components/AboutDetails";
import SkillImages from "./components/AdminPanel/Components/SkillImage";
import HomeDetails from "./components/AdminPanel/Components/HomeDetails";
import Feedbacks from "./components/AdminPanel/Components/Feedbacks";
import SocialMediaLinks from "./components/AdminPanel/Components/SocialMediaLinks";

import { getUser, loadUser } from "./redux/actions/User";
import { incVisitCount } from "./redux/actions/visitorActions";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useSelector((state) => state.login);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  /**
   * Fungsi untuk menghapus cookie token yang mungkin tertinggal
   * Dijalankan saat aplikasi dimuat untuk membersihkan cookie yang tidak valid
   */
  const clearOrphanedCookies = () => {
    // Cek apakah user sudah login dengan memeriksa localStorage
    const hasAuthToken = !!localStorage.getItem("authToken");
    console.log(
      "Checking for orphaned cookies, auth token exists:",
      hasAuthToken
    );

    // Jika tidak ada token di localStorage tapi ada cookie token, hapus cookie
    if (!hasAuthToken && hasTokenCookie()) {
      console.log("Detected orphaned token cookie, clearing it");
      clearAuthCookies();
      console.log("Cleared orphaned token cookie");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Hapus cookie yang mungkin tertinggal
        clearOrphanedCookies();

        await dispatch(getUser());
        await dispatch(loadUser());
        await dispatch(incVisitCount());
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [dispatch]);

  return (
    <Router>
      {loading ? (
        <PreLoader />
      ) : (
        <>
          <DynamicTitle />
          <ProgressBar />

          <NavBar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-me" element={<AboutMePage user={user} />} />
            <Route
              path="/education-work"
              element={<EducationWorkPage user={user} />}
            />
            <Route path="/skills" element={<SkillPage user={user} />} />
            <Route path="/projects" element={<ProjectPage user={user} />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/admin" /> : <LoginPage />
              }
            />
            <Route
              element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}
            >
              <Route path="/admin" element={<AdminPanel />} />

              <Route path="/update/login-details" element={<LoginDetails />} />
              <Route path="/update/home-details" element={<HomeDetails />} />
              <Route path="/update/about-details" element={<AboutDetails />} />
              <Route path="/update/skill-images" element={<SkillImages />} />
              <Route
                path="/update/education-timeline"
                element={<EducationTimeLine />}
              />
              <Route path="/update/work-timeline" element={<WorkTimeLine />} />
              <Route path="/update/skills" element={<Skill />} />
              <Route
                path="/update/known-language"
                element={<KnownLanguage />}
              />
              <Route
                path="/update/frontend-project"
                element={<FrontendProject />}
              />
              <Route
                path="/update/fullstack-project"
                element={<FullstackProject />}
              />
              <Route
                path="/update/backend-project"
                element={<BackendProject />}
              />
              <Route
                path="/update/social-link"
                element={<SocialMediaLinks />}
              />

              <Route path="/view/feedbacks" element={<Feedbacks />} />
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          <Footer user={user} />
          <Bottombar />
          <VisitorStat />

          <ToastContainer
            theme="colored"
            position="bottom-right"
            style={{ fontSize: "14px" }}
            autoClose={2000}
          />
        </>
      )}
    </Router>
  );
};

export default App;
