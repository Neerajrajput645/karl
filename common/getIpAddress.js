const getIpAddress = (req) => {
  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.connection.remoteAddress;

  // If the IP address is a comma-separated list, use the first one
  const firstIpAddress = clientIp ? clientIp.split(",")[0] : null;

  return firstIpAddress;
};

module.exports = getIpAddress;
