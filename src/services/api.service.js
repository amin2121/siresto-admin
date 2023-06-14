import axios from "axios";
import JwtService from "./jwt.service";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";

const ApiService = {
  init() {
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_DOMAIN;
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken()}`;
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios.defaults.headers.common["Source"] =
      "https://dev.siresto.awandigital.id";
  },

  reInitAuthorization() {
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_DOMAIN;
    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${JwtService.getToken}`;
  },

  reInitBaseURL() {
    axios.defaults.baseURL = process.env.REACT_APP_BACKEND_DOMAIN;
  },

  setHeaderMultipartFormData() {
    axios.defaults.headers.post["Content-Type"] = "multipart/form-data";
  },

  resetHeader() {
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
  },

  query(resource) {
    return axios.get(resource);
  },

  get(resource, params) {
    return axios
      .get(`${resource}`, {
        params:
          params !== undefined ? snakecaseKeys(params, { deep: true }) : params,
        transformResponse: [
          (data) => {
            try {
              return camelcaseKeys(JSON.parse(data), { deep: true });
            } catch (error) {
              console.log(error);
            }
          },
        ],
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.purgeAuth();
          throw new Error("Somethings Wrong");
        }
        throw err;
      });
  },

  getFile(resource, params) {
    return axios
      .get(`${resource}`, {
        params:
          params !== undefined ? snakecaseKeys(params, { deep: true }) : params,
        responseType: "blob",
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.purgeAuth();
          throw new Error("Somethings Wrong");
        }
        throw err;
      });
  },

  post(resource, params) {
    return axios
      .post(`${resource}`, snakecaseKeys(params, { deep: true }), {
        transformResponse: [
          (data) => {
            try {
              return camelcaseKeys(JSON.parse(data), { deep: true });
            } catch (error) {
              console.log(error);
            }
          },
        ],
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.purgeAuth();
          throw new Error("Somethings Wrong");
        }
        throw err;
      });
  },

  update(resource, slug, params) {
    return axios.put(`${resource}/${slug}`, params);
  },

  put(resource, params) {
    return axios
      .put(
        `${resource}`,
        params ? snakecaseKeys(params, { deep: true }) : null,
        {
          transformResponse: [
            (data) => {
              try {
                return camelcaseKeys(JSON.parse(data), { deep: true });
              } catch (error) {
                console.log(error);
              }
            },
          ],
        }
      )
      .catch((err) => {
        if (err.response.status === 401) {
          this.purgeAuth();
          throw new Error("Somethings Wrong");
        }
        throw err;
      });
  },

  delete(resource, params) {
    return axios
      .delete(resource, {
        params: params ? snakecaseKeys(params, { deep: true }) : null,
        transformResponse: [
          (data) => {
            try {
              return camelcaseKeys(JSON.parse(data), { deep: true });
            } catch (error) {
              console.log(error);
            }
          },
        ],
      })
      .catch((err) => {
        if (err.response.status === 401) {
          this.purgeAuth();
          throw new Error("Somethings Wrong");
        }
        throw err;
      });
  },

  purgeAuth() {
    // state.loggedIn = false
    // state.user = {}
    // state.errors = {}
    JwtService.destroyToken();
    // router.push({ path: '/auth/login' })
  },
};

export default ApiService;
