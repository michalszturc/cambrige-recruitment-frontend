import request from "./request";

export const getPromo = (code) =>
  request({
    url: `/api/promo-codes`,
    method: "post",
    data: {
      promoCode: code,
    },
  });
