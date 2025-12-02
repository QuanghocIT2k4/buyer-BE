const Brand = require('../models/Brand');

/**
 * Lấy tất cả brands (public API)
 */
const getBrands = async (req, res, next) => {
  try {
    const { page = 0, size = 10, sortBy = 'name', sortDirection = 'asc' } =
      req.query;

    const skip = parseInt(page) * parseInt(size);
    const sort = {};
    sort[sortBy] = sortDirection === 'desc' ? -1 : 1;

    const brands = await Brand.find()
      .sort(sort)
      .skip(skip)
      .limit(parseInt(size));

    const total = await Brand.countDocuments();

    res.json({
      success: true,
      data: brands,
      pagination: {
        page: parseInt(page),
        size: parseInt(size),
        total,
        totalPages: Math.ceil(total / parseInt(size)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Lấy brand theo ID (public API)
 */
const getBrandById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const brand = await Brand.findById(id);

    if (!brand) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy brand',
      });
    }

    res.json({
      success: true,
      data: brand,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBrands,
  getBrandById,
};

