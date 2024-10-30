export const createUser = (schema) => {
  const userSchema = new schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      secret: {
        type: String,
        default: null,
      },
      otp_enebled: {
        type: Boolean,
        default: false,
      }
    },
    { timestamps: true, versionKey: false }
  );
  return userSchema;
};
