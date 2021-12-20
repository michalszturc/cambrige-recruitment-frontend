import request from "./request";

export const createDraft = (form) =>
  request({
    url: `/api/order/draft`,
    method: "post",
    data: {
      productId: form.productId,
      requestQuantity: form.quantity,
      email: form.email,
      promotionCode: form.promoCode,
    },
  });

export const createOrder = (form) =>
  request({
    url: `/api/order`,
    method: "post",
    data: {
      productId: form.productId,
      requestQuantity: form.quantity,
      email: form.email,
      promotionCode: form.promoCode,
    },
  });
