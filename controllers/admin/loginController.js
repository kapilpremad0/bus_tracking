const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Show login page
exports.showLoginPage = (req, res) => {
  res.render('admin/login', { error: null });
};

// Handle login form submission
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }); // Sequelize: findOne({ where: { email } })
    if (!user || user.role !== 'admin') {
      return res.render('admin/login', { error: "Invalid admin credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('admin/login', { error: "Invalid admin credentials" });
    }

    // Generate token (if you’re using JWT for APIs)
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // For now redirect to admin dashboard
    res.redirect('/admin/home');
  } catch (err) {
    console.error(err);
    res.render('admin/login', { error: "Something went wrong" });
  }
};
