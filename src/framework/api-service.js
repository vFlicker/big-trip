/**
 * @enum {string} List of possible HTTP methods
 */
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

/**
 * Class for sending requests to the server
 */
export class ApiService {
  #endPoint = null;
  #authorization = null;

  /**
   * @param {string} endPoint server address
   * @param {string} authorization authorization token
   */
  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  /**
   * Method for sending a request to the server
   * @param {Object} config object with settings
   * @param {string} config.url server-relative address
   * @param {string} [config.method] [config.method] request method
   * @param {string} [config.body] [config.body] request body
   * @param {Headers} [config.headers] [config.headers] request headers
   * @returns {Promise<Response>}
   */
  async _load ({
    url,
    method = HttpMethod.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      { method, body, headers }
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  /**
   * Method for processing response
   * @param {Response} response response object
   * @returns {Promise<JSON>}
   */
  static parseResponse(response) {
    return response.json();
  }


  /**
   * Method for checking the response
   * @param {Response} response response object
   */
  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Error handling method
   * @param {Error} err error object
   */
  static catchError(err) {
    throw err;
  }
}
