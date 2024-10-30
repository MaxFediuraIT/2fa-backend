import {
  createUser,
  findUserByEmail,
  findUserById,
  updateUser,
  updateToken,
  comparePassword,
} from "./repositories.js";
import speakeasy from "speakeasy";
import jwt from "jsonwebtoken";

import QRCode from "qrcode";
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        code: 409,
        message: "Email in use",
      });
    }

    const user = await createUser({ name, email, password });
    const expiresIn = 86400;
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: expiresIn });
    await updateToken(user._id, token);
    const savedUser = user.save()
    res.status(201).json({
      status: "success",
      code: 201,
      savedUser
    });
  } catch (error) {
    res.status(409).json({
      status: "error",
      code: 409,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is wrong",
      });
    }
    const comparedPassword = await comparePassword(password, user.password);
    if (!comparedPassword) {
      return res.status(401).json({
        status: "error",
        code: 401,
        message: "Email or password is wrong",
      });
    }

    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });
    await updateUser(user._id, token);
    res.status(200).json({
      status: "success",
      code: 200,
      data: {
        token,
      },
    });
  } catch (error) {
    res.status(409).json({
      status: "error",
      code: 409,
      message: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const { _id } = req.user;

    await updateToken(_id, null);
    res.status(204).json();
  } catch (error) {
    res.status(409).json({
      status: "error",
      code: 409,
      message: error.message,
    });
  }
};



export const generateOTP = async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ length: 20 });
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    res.send(`
    <div>
      <h2>Scan the QR Code with a TOTP App</h2>
      <img src="${qrCodeUrl}" alt="QR Code">
      <p><strong>Secret:</strong> ${secret.base32}</p>
    </div>
  `);
  } catch (error) {
    res.status(409).json({
      status: "error",
      code: 409,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { token, user_id } = req.body;

    const user = await findUserById(user_id);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "user doesn't exist",
      });
    }

    const { base32: secret } = user.userSecret;

    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
    });

    if (verified) {
      await updateUser(user_id, { otp_enabled: true });
      res.send({
        status: "success",
        message: "Two-Factor Authentication successful!",
      });
    } else {
      res.send({
        status: "error",
        message: "Invalid token. Please try again.",
      });
    }
  } catch (error) {
    res.status(409).json({
      status: "error",
      code: 409,
      message: error.message,
    });
  }
};

export const disavleOTP = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await findUserById(user_id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "user doesn't exist",
      });
    }

    await updateUser(user_id, { otp_enabled: false });
    res.send({
      status: "success",
      message: "Two-Factor Authentication disabled!",
    });
  } catch (error) {
    res.status(409).json({
      status: "error",
      code: 409,
      message: error.message,
    });
  }
};
