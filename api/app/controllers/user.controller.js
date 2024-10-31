exports.protectedResource = (req, res) => {
  res
    .status(200)
    .send("If you want to see the sunshine, you have to weather the storm.");
};
