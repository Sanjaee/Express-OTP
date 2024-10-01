const prisma = require("../utils/prismaClient");

const findByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

const createUser = async (
  username,
  email,
  hashedPassword,
  verificationToken
) => {
  return await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      verificationToken,
    },
  });
};

const verifyUser = async (email) => {
  return await prisma.user.update({
    where: { email },
    data: { isVerified: true, verificationToken: null },
  });
};

const updateVerificationToken = async (email, verificationToken) => {
  return await prisma.user.update({
    where: { email },
    data: { verificationToken },
  });
};

const findByOTP = async (otp) => {
  return await prisma.user.findFirst({
    where: { verificationToken: otp },
  });
};

const updatePassword = async (userId, hashedPassword) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword, verificationToken: null },
  });
};

module.exports = {
  findByEmail,
  createUser,
  verifyUser,
  updateVerificationToken,
  findByOTP,
  updatePassword,
};
