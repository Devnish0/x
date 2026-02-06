const generateOTP = (length = 6) => {
  const max = 10 ** length;
  const n = Math.floor(Math.random() * max);
  return n.toString().padStart(length, "0");
};

export { generateOTP };
