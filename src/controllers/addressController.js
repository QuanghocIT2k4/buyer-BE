const Address = require('../models/Address');

/**
 * Lấy tất cả địa chỉ của user hiện tại
 */
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ userId: req.user.id }).sort({
      isDefault: -1,
      createdAt: -1,
    });

    res.json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Tạo địa chỉ mới
 */
const createAddress = async (req, res, next) => {
  try {
    const { province, ward, homeAddress, phone, suggestedName } = req.body;

    // Validation
    if (!province || !ward || !homeAddress || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: province, ward, homeAddress, phone',
      });
    }

    // Nếu đây là địa chỉ đầu tiên, tự động set làm default
    const existingAddresses = await Address.countDocuments({
      userId: req.user.id,
    });
    const isDefault = existingAddresses === 0;

    const address = await Address.create({
      userId: req.user.id,
      province,
      ward,
      homeAddress,
      phone,
      suggestedName: suggestedName || '',
      isDefault,
    });

    res.status(201).json({
      success: true,
      message: 'Tạo địa chỉ thành công',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cập nhật địa chỉ
 */
const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;
    const { province, ward, homeAddress, phone, suggestedName, isDefault } =
      req.body;

    const address = await Address.findOne({
      _id: addressId,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ',
      });
    }

    // Nếu set làm default, bỏ default của các địa chỉ khác
    if (isDefault === true) {
      await Address.updateMany(
        { userId: req.user.id, _id: { $ne: addressId } },
        { isDefault: false }
      );
    }

    // Cập nhật thông tin
    if (province) address.province = province;
    if (ward) address.ward = ward;
    if (homeAddress) address.homeAddress = homeAddress;
    if (phone) address.phone = phone;
    if (suggestedName !== undefined) address.suggestedName = suggestedName;
    if (isDefault !== undefined) address.isDefault = isDefault;

    await address.save();

    res.json({
      success: true,
      message: 'Cập nhật địa chỉ thành công',
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Xóa địa chỉ
 */
const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOne({
      _id: addressId,
      userId: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy địa chỉ',
      });
    }

    await Address.findByIdAndDelete(addressId);

    // Nếu xóa địa chỉ default, set địa chỉ đầu tiên làm default
    if (address.isDefault) {
      const firstAddress = await Address.findOne({ userId: req.user.id }).sort({
        createdAt: 1,
      });
      if (firstAddress) {
        firstAddress.isDefault = true;
        await firstAddress.save();
      }
    }

    res.json({
      success: true,
      message: 'Xóa địa chỉ thành công',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Kiểm tra user có địa chỉ không
 */
const checkHasAddress = async (req, res, next) => {
  try {
    const count = await Address.countDocuments({ userId: req.user.id });

    res.json({
      success: true,
      hasAddress: count > 0,
      count,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  checkHasAddress,
};

