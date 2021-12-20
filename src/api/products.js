import request from "./request";

export const getProducts = () =>
  request({
    url: `/api/products`,
    method: "get",
  });
