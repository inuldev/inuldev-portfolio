import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

import { User } from "../model/User.js";
import { sendMail } from "../middlewares/sendMail.js";

export const login = async (req, res) => {
  try {
    console.log("Login attempt for:", req.body.userName);
    console.log("Request headers:", {
      origin: req.headers.origin,
      referer: req.headers.referer,
      "user-agent": req.headers["user-agent"],
    });

    const { userName, password } = req.body;
    const user = await User.findOne({ userName, password });

    if (!user) {
      console.log("Login failed: Invalid credentials for", userName);
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }

    console.log("Login successful for user:", user._id);
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

    // Konfigurasi cookie yang lebih sederhana dan kompatibel dengan cross-domain
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/", // Pastikan cookie tersedia di seluruh aplikasi
      // Hapus domain untuk menghindari masalah cross-domain
    };

    console.log("Setting cookie with options:", cookieOptions);

    res.status(200).cookie("token", token, cookieOptions).json({
      success: true,
      message: "Logged In Successfully",
      // Kirim token juga dalam respons untuk fallback jika cookie gagal
      token: token,
    });

    console.log("Login response sent successfully");
  } catch (error) {
    console.error("Login error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    console.log("Logout attempt");
    console.log("Request headers:", {
      origin: req.headers.origin,
      referer: req.headers.referer,
      "user-agent": req.headers["user-agent"],
    });

    // Hapus cookie dengan berbagai opsi untuk memastikan terhapus di semua browser dan kondisi

    // 1. Hapus dengan clearCookie default
    res.clearCookie("token");

    // 2. Hapus dengan path / dan tanpa domain
    res.clearCookie("token", { path: "/" });

    // 3. Hapus dengan berbagai opsi SameSite
    const baseOptions = {
      expires: new Date(0),
      httpOnly: true,
      path: "/",
    };

    // Kombinasi secure dan sameSite
    res.cookie("token", "", { ...baseOptions, secure: true, sameSite: "none" });
    res.cookie("token", "", { ...baseOptions, secure: true, sameSite: "lax" });
    res.cookie("token", "", {
      ...baseOptions,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("token", "", { ...baseOptions, secure: false });

    // 4. Hapus dengan domain yang berbeda
    if (process.env.NODE_ENV === "production") {
      // Hapus dengan domain vercel
      const domain =
        req.headers.host.indexOf("vercel.app") > -1 ? ".vercel.app" : undefined;
      if (domain) {
        res.clearCookie("token", { domain });
        res.cookie("token", "", {
          ...baseOptions,
          secure: true,
          sameSite: "none",
          domain,
        });
      }

      // Hapus dengan domain dari origin header jika ada
      if (req.headers.origin) {
        try {
          const originDomain = new URL(req.headers.origin).hostname;
          res.clearCookie("token", { domain: originDomain });
          res.cookie("token", "", {
            ...baseOptions,
            secure: true,
            sameSite: "none",
            domain: originDomain,
          });
        } catch (e) {
          console.log("Error parsing origin:", e);
        }
      }
    }

    // 5. Set header untuk menghapus cookie dari browser
    res.setHeader("Set-Cookie", [
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
      "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=None",
    ]);

    console.log("Cookies cleared with multiple approaches");
    res.status(200).json({ success: true, message: "Logged Out Successfully" });

    console.log("Logout response sent successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// this function is called when website is loaded
export const getUser = async (req, res) => {
  try {
    //finds very first user without username and password
    const user = await User.findOne().select("-userName -password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const myProfile = async (req, res) => {
  try {
    // finds first user with specified id
    const user = await User.findById(req.user._id);

    res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const data = await sendMail(name, email, message);

    // finds very first user
    const user = await User.findOne().select("-userName -password");

    user.feedbacks.push({ name, email, message });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Feedback Recorded!",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne().select("-userName -password");

    const newfeedbacks = user.feedbacks.filter((item) => item._id != id);
    user.feedbacks = newfeedbacks;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Feedback Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// update all objects in db once...
// export const updateUser = async (req, res) => {
//     try {
//         //finds very first user without username and password
//         const user = await User.findById(req.user._id);

//         // extract all new details and will use new function for arrays
//         const { name, userName, password, about, skillsCubeImg } = req.body;

//         if (name) {
//             user.name = name;
//         }
//         if (userName) {
//             user.userName = userName;
//         }
//         if (password) {
//             user.password = password;
//         }
//         if (about) {
//             if(about.fullName) {
//                 user.about.fullName = about.fullName;
//             }
//             if(about.dob) {
//                 user.about.dob = about.dob;
//             }
//             if(about.address) {
//                 user.about.address = about.address;
//             }
//             if(about.email) {
//                 user.about.email = about.email;
//             }
//             if(about.phoneNumber) {
//                 user.about.phoneNumber = about.phoneNumber;
//             }
//             if(about.freeLancing) {
//                 user.about.freeLancing = about.freeLancing;
//             }
//             if(about.cvweblink) {
//                 user.about.cvweblink = about.cvweblink;
//             }
//             if(about.cvfileLink) {
//                 user.about.cvfileLink = about.cvfileLink;
//             }

//             if (about.avatar) {
//                 // deletes old image before uploading a new image
//                 await cloudinary.v2.uploader.destroy(
//                     user.about.avatar.public_id
//                 );

//                 const myCloud = await cloudinary.v2.uploader.upload(
//                     about.avatar,
//                     { folder: "portfolio" }
//                 );

//                 user.about.avatar = {
//                     public_id: myCloud.public_id,
//                     url: myCloud.secure_url,
//                 };
//             }
//         }
//         if (skillsCubeImg) {
//             if (skillsCubeImg.image1) {
//                 await cloudinary.v2.uploader.destroy(
//                     user.skillsCubeImg.image1.public_id
//                 );

//                 const myCloud = await cloudinary.v2.uploader.upload(
//                     skillsCubeImg.image1,
//                     { folder: "portfolio" }
//                 );

//                 user.skillsCubeImg.image1 = {
//                     public_id: myCloud.public_id,
//                     url: myCloud.secure_url,
//                 };
//             }
//             if (skillsCubeImg.image2) {
//                 await cloudinary.v2.uploader.destroy(
//                     user.skillsCubeImg.image2.public_id
//                 );

//                 const myCloud = await cloudinary.v2.uploader.upload(
//                     skillsCubeImg.image2,
//                     { folder: "portfolio" }
//                 );

//                 user.skillsCubeImg.image2 = {
//                     public_id: myCloud.public_id,
//                     url: myCloud.secure_url,
//                 };
//             }
//             if (skillsCubeImg.image3) {
//                 await cloudinary.v2.uploader.destroy(
//                     user.skillsCubeImg.image3.public_id
//                 );

//                 const myCloud = await cloudinary.v2.uploader.upload(
//                     skillsCubeImg.image3,
//                     { folder: "portfolio" }
//                 );

//                 user.skillsCubeImg.image3 = {
//                     public_id: myCloud.public_id,
//                     url: myCloud.secure_url,
//                 };
//             }
//             if (skillsCubeImg.image4) {
//                 await cloudinary.v2.uploader.destroy(
//                     user.skillsCubeImg.image4.public_id
//                 );

//                 const myCloud = await cloudinary.v2.uploader.upload(
//                     skillsCubeImg.image4,
//                     { folder: "portfolio" }
//                 );

//                 user.skillsCubeImg.image4 = {
//                     public_id: myCloud.public_id,
//                     url: myCloud.secure_url,
//                 };
//             }
//             if (skillsCubeImg.image5) {
//                 await cloudinary.v2.uploader.destroy(
//                     user.skillsCubeImg.image5.public_id
//                 );

//                 const myCloud = await cloudinary.v2.uploader.upload(
//                     skillsCubeImg.image5,
//                     { folder: "portfolio" }
//                 );

//                 user.skillsCubeImg.image5 = {
//                     public_id: myCloud.public_id,
//                     url: myCloud.secure_url,
//                 };
//             }
//             if (skillsCubeImg.image6) {
//                 await cloudinary.v2.uploader.destroy(
//                     user.skillsCubeImg.image6.public_id
//                 );

//                 const myCloud = await cloudinary.v2.uploader.upload(
//                     skillsCubeImg.image6,
//                     { folder: "portfolio" }
//                 );

//                 user.skillsCubeImg.image6 = {
//                     public_id: myCloud.public_id,
//                     url: myCloud.secure_url,
//                 };
//             }
//         }

//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: "User Updated Successfully",
//         });
//     } catch (error) {
//         return res.status(400).json({ success: false, message: error.message });
//     }
// };

export const updateLoginDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // extract all new details and will use new function for arrays
    const { userName, password } = req.body;

    if (userName) {
      user.userName = userName;
    }
    if (password) {
      user.password = password;
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: "Login Credential Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateHome = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { home } = req.body;

    if (home.detail) {
      user.home.detail = home.detail;
    }
    if (home.quote) {
      user.home.quote = home.quote;
    }

    // Helper function untuk update gambar
    const updateImage = async (newImage, currentImage) => {
      if (currentImage && currentImage.public_id) {
        await cloudinary.v2.uploader.destroy(currentImage.public_id);
      }

      const myCloud = await cloudinary.v2.uploader.upload(newImage, {
        folder: "portfolio",
      });

      return {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    };

    if (home.banner_img) {
      user.home.banner_img = await updateImage(
        home.banner_img,
        user.home.banner_img
      );
    }

    if (home.background) {
      user.home.background = await updateImage(
        home.background,
        user.home.background
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Home Details Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const updateAbout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { about } = req.body;

    // Update text fields
    const textFields = [
      "fullName",
      "dob",
      "address",
      "email",
      "phoneNumber",
      "freeLancing",
      "cvweblink",
      "cvfileLinkLight",
      "cvfileLinkDark",
    ];

    textFields.forEach((field) => {
      if (about[field] !== undefined) {
        user.about[field] = about[field];
      }
    });

    // Update avatar if provided
    if (about.avatar) {
      try {
        // Delete old avatar if exists
        if (user.about.avatar && user.about.avatar.public_id) {
          await deleteImage(user.about.avatar.public_id);
        }

        // Upload new avatar
        const avatarData = await uploadImage(about.avatar);
        user.about.avatar = avatarData;
      } catch (imageError) {
        return res.status(400).json({
          success: false,
          message: "Error processing avatar image. Please try again.",
          error: imageError.message,
        });
      }
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "About Details Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update about details",
      error: error.message,
    });
  }
};

export const updateSkillImages = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { skillsCubeImg } = req.body;

    // Helper function untuk update gambar
    const updateImage = async (newImage, currentImage) => {
      if (currentImage && currentImage.public_id) {
        await cloudinary.v2.uploader.destroy(currentImage.public_id);
      }

      const myCloud = await cloudinary.v2.uploader.upload(newImage, {
        folder: "portfolio",
      });

      return {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    };

    // Update setiap gambar jika ada
    if (skillsCubeImg.image1) {
      user.skillsCubeImg.image1 = await updateImage(
        skillsCubeImg.image1,
        user.skillsCubeImg.image1
      );
    }

    if (skillsCubeImg.image2) {
      user.skillsCubeImg.image2 = await updateImage(
        skillsCubeImg.image2,
        user.skillsCubeImg.image2
      );
    }

    if (skillsCubeImg.image3) {
      user.skillsCubeImg.image3 = await updateImage(
        skillsCubeImg.image3,
        user.skillsCubeImg.image3
      );
    }

    if (skillsCubeImg.image4) {
      user.skillsCubeImg.image4 = await updateImage(
        skillsCubeImg.image4,
        user.skillsCubeImg.image4
      );
    }

    if (skillsCubeImg.image5) {
      user.skillsCubeImg.image5 = await updateImage(
        skillsCubeImg.image5,
        user.skillsCubeImg.image5
      );
    }

    if (skillsCubeImg.image6) {
      user.skillsCubeImg.image6 = await updateImage(
        skillsCubeImg.image6,
        user.skillsCubeImg.image6
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Skill Images Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addEducationTimeline = async (req, res) => {
  try {
    const { title, description, startdate, enddate } = req.body;

    // finds first user with specified id
    const user = await User.findById(req.user._id);

    // educationTimeline
    user.educationTimeline.push({ title, description, startdate, enddate });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Education Timeline Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addWorkTimeline = async (req, res) => {
  try {
    const { title, description, startdate, enddate } = req.body;

    const user = await User.findById(req.user._id);

    user.workTimeline.push({ title, description, startdate, enddate });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Work Timeline Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addSkill = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    user.skills.push({ name });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Skill Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addKnownLanguage = async (req, res) => {
  try {
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    user.languagesKnown.push({ name });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Known Language Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// Helper function untuk upload gambar yang bisa digunakan di semua handler
const uploadImage = async (image) => {
  try {
    console.log("Starting image upload...");
    const myCloud = await cloudinary.v2.uploader.upload(image, {
      folder: "portfolio",
      quality: "auto",
      fetch_format: "auto",
      crop: "scale",
    });
    console.log("Image uploaded successfully:", myCloud.public_id);
    return {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

// Helper function untuk delete gambar
const deleteImage = async (public_id) => {
  try {
    if (public_id) {
      await cloudinary.v2.uploader.destroy(public_id);
    }
  } catch (error) {
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

export const addFrontEndProject = async (req, res) => {
  try {
    const { title, techstack, image, gitLink, demoLink } = req.body;
    const user = await User.findById(req.user._id);

    const imageData = await uploadImage(image);

    user.frontendProjects.push({
      title,
      techstack,
      gitLink,
      demoLink,
      image: imageData,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Frontend Project Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addFullStackProject = async (req, res) => {
  try {
    const { title, techstack, image, gitLink, demoLink } = req.body;
    const user = await User.findById(req.user._id);

    const imageData = await uploadImage(image);

    user.fullstackProjects.push({
      title,
      techstack,
      gitLink,
      demoLink,
      image: imageData,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Full Stack Project Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addBackEndProject = async (req, res) => {
  try {
    const { title, techstack, image, gitLink, demoLink } = req.body;
    const user = await User.findById(req.user._id);

    const imageData = await uploadImage(image);

    user.backendProjects.push({
      title,
      techstack,
      gitLink,
      demoLink,
      image: imageData,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Backend Project Added Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addSocialLink = async (req, res) => {
  try {
    const { name, link, icon, color } = req.body;
    const user = await User.findById(req.user._id);

    // Gunakan helper function uploadImage yang sudah ada
    let iconData;
    try {
      iconData = await uploadImage(icon);
    } catch (imageError) {
      return res.status(400).json({
        success: false,
        message: "Error uploading icon image. Please try again.",
        error: imageError.message,
      });
    }

    user.socialLinks.push({
      name,
      link,
      color,
      icon: iconData,
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: "Social Link Added Successfully",
    });
  } catch (error) {
    // Jika terjadi error lain
    return res.status(400).json({
      success: false,
      message: "Failed to add social link",
      error: error.message,
    });
  }
};

export const deleteEducationTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    // finds firrst user with specified id
    const user = await User.findById(req.user._id);

    // educationTimeline
    const newEduTimeline = user.educationTimeline.filter(
      (item) => item._id != id
    );
    user.educationTimeline = newEduTimeline;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Education Timeline Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteWorkTimeline = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const newWorkTimeline = user.workTimeline.filter((item) => item._id != id);
    user.workTimeline = newWorkTimeline;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Work Timeline Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const newskills = user.skills.filter((item) => item._id != id);
    user.skills = newskills;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Skill Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteKnownLanguage = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(req.user._id);

    const newKnownLan = user.languagesKnown.filter((item) => item._id != id);
    user.languagesKnown = newKnownLan;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Language Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFrontEndProject = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const project = user.frontendProjects.find((project) => project._id == id);
    if (project && project.image) {
      await deleteImage(project.image.public_id);
    }

    user.frontendProjects = user.frontendProjects.filter(
      (project) => project._id != id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Frontend Project Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteFullStackProject = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const project = user.fullstackProjects.find((project) => project._id == id);
    if (project && project.image) {
      await deleteImage(project.image.public_id);
    }

    user.fullstackProjects = user.fullstackProjects.filter(
      (project) => project._id != id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Full Stack Project Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBackEndProject = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const project = user.backendProjects.find((project) => project._id == id);
    if (project && project.image) {
      await deleteImage(project.image.public_id);
    }

    user.backendProjects = user.backendProjects.filter(
      (project) => project._id != id
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Backend Project Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteSocialLink = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(req.user._id);

    const link = user.socialLinks.find((link) => link._id == id);

    // Gunakan helper function deleteImage
    if (link && link.icon) {
      try {
        await deleteImage(link.icon.public_id);
      } catch (imageError) {
        console.error("Error deleting image:", imageError);
        // Lanjutkan proses meski gagal menghapus gambar
      }
    }

    const newSocialLinks = user.socialLinks.filter((link) => link._id != id);
    user.socialLinks = newSocialLinks;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Social Link Deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to delete social link",
      error: error.message,
    });
  }
};

export const editEducationTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startdate, enddate } = req.body;

    const user = await User.findById(req.user._id);

    const itemToEdit = user.educationTimeline.filter((item) => item._id == id);

    if (title) {
      itemToEdit[0].title = title;
    }
    if (description) {
      itemToEdit[0].description = description;
    }
    if (startdate) {
      itemToEdit[0].startdate = startdate;
    }
    itemToEdit[0].enddate = enddate;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Education Timeline Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const editWorkTimeline = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, startdate, enddate } = req.body;

    const user = await User.findById(req.user._id);

    const itemToEdit = user.workTimeline.filter((item) => item._id == id);

    if (title) {
      itemToEdit[0].title = title;
    }
    if (description) {
      itemToEdit[0].description = description;
    }
    if (startdate) {
      itemToEdit[0].startdate = startdate;
    }
    itemToEdit[0].enddate = enddate;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Work Timeline Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const editKnownLanguage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    const knownlang = user.languagesKnown.filter((item) => item._id == id);

    knownlang[0].name = name;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Language Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const editSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const user = await User.findById(req.user._id);

    const skill = user.skills.filter((item) => item._id == id);

    skill[0].name = name;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Skill Updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
