import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      // ตรงนี้คือ ถ้าไม่ใส่ชื่อจะขึ้นข้อความ error ว่า Name is required
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 character long"],
      // ตรง minlength คือต้องมีขั้นต่ำ 6 ตัวอักษรถ้าไม่ถึงก็จะขึ้นข้อความข้างขวา
    },
    cart: [
      {
        quantity: {
          type: Number,
          default: 1,
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
      },
    ],
    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer",
    },
  },
  {
    timestamps: true,
  }
);

//Pre-save hook to hash password before saving to DB
userSchema.pre("save", async function (next) {
  // ตรงนี้คือ จะทำ async function (next) แล้วค่อยทำคำสั่ง userSchema.save()
  // ส่วนที่ต้องใส่ next ใน parameter เพื่อให้ฟังชั้นนี้รองรับการใช้ next()

  if (!this.isModified("password")) return next();
  // ตรงนี้คือ ถ้ามีการแก้ไขแค่ name หรือ email แต่ว่า password ไม่เปลี่ยนก็จะข้ามการ hashing 
  // เพื่อไม่ให้ password ถูก hashing 2 ครั้ง

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // เหตุผลที่ต้องใช้ salt ในการ hash ด้วยเพราะว่า ถ้ากรณีที่ user ตั้ง password เหมือนกันถ้าไม่มี salt
    // ค่า hash จะเหมือนกันแต่ พอเราเติม salt ในการ hash ไปด้วย password ที่มีการ hash แล้วจะไม่เหมือนกัน

    next();
  } catch (error) {
    next(error);
    // อันนี้คือถ้า hash แล้วมีปัญหามันจะส่งไปที่ฟังชันถัดไป
  }
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
