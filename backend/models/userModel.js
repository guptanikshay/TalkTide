const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    pic: {
      type: String,
      default:
        "https://www.wallpics.net/wp-content/uploads/2019/05/Deadpool-High-Definition-scaled.jpg",
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: Number },
    otpExpires: { type: Date },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  console.log(enteredPassword);
  console.log(this.password);
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log("Password in pre middleware: ", this.password);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
