const API_URL = process.env.REACT_APP_REST_ENDPOINT;

export const GET = (url: string, params: any = {}, base_url = API_URL) => {
  return query("GET", base_url + url, params);
};

export const getToken = () => {
  return localStorage.getItem("t");
};

const redirectToLogin = () => {
  if (window.location.pathname !== "/login") {
    localStorage.removeItem("t");
    localStorage.removeItem("r");
    window.location.href = "/login";
  }
};

const query = (method: string, url: string, params: any = {}, headers = {}) => {
  let query_options: any = {
    method,
    headers: new Headers({ ...headers, "content-type": "application/json" }),
  };

  if (method === "GET") {
    if (Object.keys(params).length) {
      url += "?";

      Object.keys(params).forEach((param_name) => {
        if (params[param_name]) {
          if (typeof params[param_name] === "object") {
            Object.values(params[param_name]).forEach((item) => {
              url += param_name + "[]=" + item + "&";
            });
          } else {
            url += param_name + "=" + params[param_name] + "&";
          }
        }
      });

      // Remove last `&`
      url = url.slice(0, -1);
    }
  } else {
    query_options["body"] = JSON.stringify(params);
  }

  return fetch(url, query_options).then((response) => {
    response.status !== 401 || redirectToLogin();

    const contentType = response.headers.get("content-type");

    if (contentType) {
      if (contentType.indexOf("application/json") !== -1) {
        return response
          .json()
          .then((body) => ({ status: response.status, body }));
      } else if (contentType.indexOf("application/octet-stream") !== -1) {
        return response
          .blob()
          .then((body) => ({ status: response.status, body }));
      }
    }

    return response.text().then((body) => ({ status: response.status, body }));
  });
};
