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
  verified: {
    type: Schema.Types.Boolean,
  },
  avatar: {
    type: Schema.Types.String,
  },
  bookmarks: {
    type: Schema.Types.Array,
  },
});

const User = model("User", userSchema);

export default User;
