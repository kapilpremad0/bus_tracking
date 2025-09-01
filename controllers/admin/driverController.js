const Driver = require('../../models/User');

exports.getAllDrivers = async (req, res) => {
  const drivers = await Driver.find();
  res.json(drivers);
};
