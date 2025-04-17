import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

import ImageBox from "./SubComponents/ImageBox/ImageBox";
import InputBox from "./SubComponents/InputBox/InputBox";

import { getUser, updateAbout } from "../../../redux/actions/User";

const AboutDetails = () => {
  const [about, setAbout] = useState({});
  const [buttonText, setButtonText] = useState("Update");

  const { message, error, loading } = useSelector((state) => state.update);

  const dispatch = useDispatch();

  const handleAboutImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      // Validate file size (e.g., max 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        alert("File size should be less than 50MB");
        return;
      }

      const Reader = new FileReader();

      Reader.onload = () => {
        if (Reader.readyState === 2) {
          setAbout((prev) => ({ ...prev, avatar: Reader.result }));
        }
      };

      Reader.onerror = (error) => {
        alert("Error reading file: " + error);
      };

      Reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Updating...");
    await dispatch(updateAbout(about));
    dispatch(getUser());
    setButtonText("Updated");
    setTimeout(() => setButtonText("Update"), 2000);
  };

  // display messages and errors from backend in all components
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "CLEAR_ERROR" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "CLEAR_MESSAGE" });
    }
  }, [error, message, dispatch]);

  return (
    <section className="contact login adminpanelcontainer" id="connect">
      <h2>Manage About details</h2>

      <div className="adminpanel-form">
        <div className="admin-container-inputbox">
          <ImageBox
            label="Profile Picture"
            value={about.avatar}
            onChange={handleAboutImage}
          />
          <InputBox
            label="Fullname"
            value={about.fullName}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, fullName: e.target.value }))
            }
          />
          <InputBox
            label="Address"
            value={about.address}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, address: e.target.value }))
            }
          />
          <InputBox
            label="Birthday"
            value={about.dob}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, dob: e.target.value }))
            }
            isDate={true}
          />
          <InputBox
            label="Email"
            value={about.email}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, email: e.target.value }))
            }
          />
          <InputBox
            label="Phone Number"
            value={about.phoneNumber}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, phoneNumber: e.target.value }))
            }
          />
          <InputBox
            label="Freelancing"
            value={about.freeLancing}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, freeLancing: e.target.value }))
            }
            select={true}
          />
          <InputBox
            label="CV website Link"
            value={about.cvweblink}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, cvweblink: e.target.value }))
            }
          />
          <InputBox
            label="CV Drive Link (Light)"
            value={about.cvfileLinkLight}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, cvfileLinkLight: e.target.value }))
            }
          />
          <InputBox
            label="CV Drive Link (Dark)"
            value={about.cvfileLinkDark}
            onChange={(e) =>
              setAbout((prev) => ({ ...prev, cvfileLinkDark: e.target.value }))
            }
          />
        </div>
        <div className="btncontiner">
          <button type="submit" disabled={loading} onClick={handleSubmit}>
            {buttonText}
          </button>
          <NavLink to="/admin">
            <button disabled={loading}>Back</button>
          </NavLink>
        </div>
      </div>
    </section>
  );
};

export default AboutDetails;
