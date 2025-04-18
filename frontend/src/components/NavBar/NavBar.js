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

  const logOutHandle = () => {
    // Hapus token dari localStorage
    localStorage.removeItem("authToken");

    // Hapus cookie secara manual dari browser dengan berbagai opsi
    const clearCookie = (name) => {
      // Dapatkan domain saat ini
      const domain = window.location.hostname;
      const isLocalhost = domain === "localhost" || domain === "127.0.0.1";

      // Opsi dasar
      const options = [{ path: "/" }, { path: "/", domain: domain }];

      // Jika bukan localhost, coba dengan domain yang lebih luas
      if (!isLocalhost) {
        // Coba dengan domain level atas (misalnya dari sub.example.com ke example.com)
        const domainParts = domain.split(".");
        if (domainParts.length > 2) {
          const topDomain = domainParts.slice(-2).join(".");
          options.push({ path: "/", domain: topDomain });
        }

        // Coba dengan domain dengan titik di depan (untuk subdomain)
        options.push({ path: "/", domain: `.${domain}` });
      }

      // Tambahkan opsi secure dan sameSite
      options.forEach((opt) => {
        // Buat string cookie untuk setiap opsi
        let cookieStr = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;

        if (opt.path) cookieStr += ` path=${opt.path};`;
        if (opt.domain) cookieStr += ` domain=${opt.domain};`;

        // Set cookie tanpa secure/samesite
        document.cookie = cookieStr;
        console.log("Clearing cookie:", cookieStr);

        // Set cookie dengan secure
        document.cookie = `${cookieStr} secure;`;

        // Set cookie dengan secure dan berbagai samesite
        document.cookie = `${cookieStr} secure; samesite=none;`;
        document.cookie = `${cookieStr} secure; samesite=lax;`;
        document.cookie = `${cookieStr} secure; samesite=strict;`;
      });
    };

    // Hapus cookie token
    clearCookie("token");

    // Panggil API logout
    dispatch(logout());

    // Arahkan ke homepage setelah logout
    setTimeout(() => {
      window.location.href = "/";
    }, 300); // Beri waktu untuk API logout selesai
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
