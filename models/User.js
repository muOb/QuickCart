import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: stringify, required: true },
    name: { type: stringify, required: true },
    email: { type: string, required: true, unique: true },
    imageUrl: { type: string, reuired: true },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false }
);
const User = mongoose.models.user || mongoose.model("user", userSchema); //if there a user in db ,if not create a new one
export default User;
