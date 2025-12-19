const applyDiscount = (req, res, next) => {
  const coupon = req.query.coupon || req.body.coupon;
  let total = req.body.total || req.session.cartTotal || 0;

  if (coupon === 'SAVE10') {
    const discount = total * 0.1;
    req.discountedTotal = total - discount;
  } else {
    req.discountedTotal = total;
  }

  next();
};

module.exports = applyDiscount;