const User = require('../models/User');

/**
 * Lấy thông tin profile của user hiện tại
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật thông tin profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, dateOfBirth } = req.body;

    // Validation
    if (!fullName || !phone || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: fullName, phone, dateOfBirth',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user',
      });
    }

    // Cập nhật thông tin
    user.fullName = fullName;
    user.phone = phone;
    user.dateOfBirth = new Date(dateOfBirth);

    await user.save();

    // Trả về user không có passwordHash
    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.json({
      success: true,
      message: 'Cập nhật profile thành công',
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

