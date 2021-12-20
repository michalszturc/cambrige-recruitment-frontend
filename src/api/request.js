import axios from "axios";

const request = async ({
  url,
  method,
  params,
  data,
  headers,
  body,
  responseType,
}) => {
  const config = {
    url: url,
    method: method,
    params: params,
    responseType: responseType,
    data: data,
    headers: headers,
    body: body,
  };

  const response = await axios(config)
    .then((result) => {
      const response = result.response || result;
      return {
        ok: response.status >= 200 && response.status < 400,
        status: response.status,
        ...response,
      };
    })
    .catch((error) => {
      const response = error.response || error;
      return {
        error: response.status > 400,
        status: response.status,
        ...response,
      };
    });

  return response;
};

export default request;
