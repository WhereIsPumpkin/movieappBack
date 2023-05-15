import { Schema, model } from "mongoose";

const emailTokenSchema = new Schema({
  token: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
  verified: {
    type: Schema.Types.Boolean,
    required: true,
  },
});

const EmailToken = model("EmailToken", emailTokenSchema);

export default EmailToken;
