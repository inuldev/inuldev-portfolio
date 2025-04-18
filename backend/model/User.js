import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: String,
  userName: {
    type: String,
    unique: true,
    required: [true, "Please Enter UserName"],
  },
  password: {
    type: String,
    required: [true, "Please Enter Password"],
    select: false, // Tidak diselect secara default untuk keamanan
    minlength: [6, "Password should be at least 6 characters"],
  },

  home: {
    detail: String,
    quote: String,
    banner_img: {
      public_id: String,
      url: String,
    },
    background: {
      public_id: String,
      url: String,
    },
  },

  about: {
    fullName: String,
    dob: Date,
    address: String,
    email: String,
    phoneNumber: String,
    freeLancing: String,
    cvweblink: String,
    cvfileLinkLight: String,
    cvfileLinkDark: String,
    avatar: {
      public_id: String,
      url: String,
    },
  },
  languagesKnown: [
    {
      name: String,
    },
  ],

  educationTimeline: [
    {
      title: String,
      description: String,
      startdate: Date,
      enddate: Date,
    },
  ],

  workTimeline: [
    {
      title: String,
      description: String,
      startdate: Date,
      enddate: Date,
    },
  ],

  skillsCubeImg: {
    image1: {
      public_id: String,
      url: String,
    },
    image2: {
      public_id: String,
      url: String,
    },
    image3: {
      public_id: String,
      url: String,
    },
    image4: {
      public_id: String,
      url: String,
    },
    image5: {
      public_id: String,
      url: String,
    },
    image6: {
      public_id: String,
      url: String,
    },
  },

  skills: [
    {
      name: String,
    },
  ],

  frontendProjects: [
    {
      title: String,
      techstack: String,
      image: {
        public_id: String,
        url: String,
      },
      gitLink: String,
      demoLink: String,
    },
  ],
  fullstackProjects: [
    {
      title: String,
      techstack: String,
      image: {
        public_id: String,
        url: String,
      },
      gitLink: String,
      demoLink: String,
    },
  ],
  backendProjects: [
    {
      title: String,
      techstack: String,
      image: {
        public_id: String,
        url: String,
      },
      gitLink: String,
      demoLink: String,
    },
  ],

  socialLinks: [
    {
      name: String,
      link: String,
      color: String,
      icon: {
        public_id: String,
        url: String,
      },
    },
  ],

  feedbacks: [
    {
      name: String,
      email: String,
      message: String,
    },
  ],
});

// Middleware untuk hash password sebelum disimpan
userSchema.pre("save", async function (next) {
  // Hanya hash password jika password dimodifikasi
  if (!this.isModified("password")) return next();

  try {
    // Generate salt dengan cost factor 10
    const salt = await bcrypt.genSalt(10);
    // Hash password dengan salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method untuk membandingkan password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    // Gunakan bcrypt untuk membandingkan password
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

export const User = mongoose.model("User", userSchema);
