import { useState, useEffect } from "react";
import { Navbar, Container } from "react-bootstrap";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

import { RiUserSharedFill, RiAdminFill } from "react-icons/ri";
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/actions/User";

import "./NavBar.css";

const navVariant = {
  hidden: { opacity: 0, x: "-100vh" },
  visible: { opacity: 1, x: 0, transition: { delay: 0.2 } },
};

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);

  const { isAuthenticated } = useSelector((state) => state.login);

  const dispatch = useDispatch();

  const backToTop = () => {
    window.scrollTo({ top: 0 });
  };

  /**
   * Handle logout dari navbar
   * Memanggil action logout dari redux yang akan menangani semua proses logout
   */
  const logOutHandle = (e) => {
    e.preventDefault(); // Mencegah navigasi default

    // Hapus token dari localStorage terlebih dahulu
    localStorage.removeItem("authToken");

    // Hapus cookie token dengan berbagai cara
    const domain = window.location.hostname;
    const isSecure = window.location.protocol === "https:";

    // Opsi dasar
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Dengan domain
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain};`;

    // Dengan secure dan sameSite jika https
    if (isSecure) {
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure; samesite=none;";
      document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}; secure; samesite=none;`;
    }

    // Panggil action logout dari redux
    // Action logout akan menangani:
    // 1. Menghapus token dari localStorage
    // 2. Menghapus cookie
    // 3. Memanggil API logout
    // 4. Redirect ke homepage
    dispatch(logout());
  };

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Navbar expand="md" className={scrolled ? "scrolled" : ""}>
      <Container>
        <motion.div
          variants={navVariant}
          initial="hidden"
          animate="visible"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <NavLink to={"/?redirect=false"} onClick={backToTop}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.8 }}>
              <span className="logo">INUL DEV</span>
            </motion.div>
          </NavLink>
          {isAuthenticated ? (
            <div>
              <NavLink to={"/logout"} onClick={logOutHandle}>
                <BiLogOutCircle />
              </NavLink>
              <NavLink to={"/admin"} style={{ marginLeft: "20px" }}>
                <RiAdminFill />
              </NavLink>
            </div>
          ) : (
            <NavLink to={"/login"} onClick={backToTop}>
              <RiUserSharedFill />
            </NavLink>
          )}
        </motion.div>
      </Container>
    </Navbar>
  );
};

export default NavBar;
