mDiscount = (function () {
    'use strict';
    var ret = {};
    var discount = 1;
    ret.getDiscountPay = function () {
        return discount;
    };
    ret.getDiscount = function () {
        return (1 - discount);
    };
    return ret;
})();