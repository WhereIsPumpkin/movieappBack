import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  id: {
    type: Schema.Types.String,
  },
});

const User = model("User", userSchema);

export default User;