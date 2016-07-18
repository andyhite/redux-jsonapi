let reduxJsonApi = null;

class ReduxJsonApi {
  constructor() {
    if (!reduxJsonApi) {
      reduxJsonApi = this;
    }

    this.config = {
      processHeaders: (headers) => headers,
    };

    return reduxJsonApi;
  }

  configure(config) {
    this.config = {
      ...this.config,
      ...config,
    };
  }
}

export default new ReduxJsonApi();
