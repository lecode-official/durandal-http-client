
///<amd-module name='durandal-http-client/HttpResponse'/>

/**
 * Represents a response from an HTTP client, that contains information about the status and the content.
 */
class HttpResponse<T> {

    // #region Public Properties

    /**
     * Gets or sets the status code of the request.
     */
    public statusCode: number;

    /**
     * Gets or sets the name of the status code of the request.
     */
    public statusText: string | null;

    /**
     * Gets or sets the URL of the entity if a new entity was created.
     */
    public location: string | null;

    /**
     * Gets or sets the content of the response.
     */
    public content: T | null;

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = HttpResponse;