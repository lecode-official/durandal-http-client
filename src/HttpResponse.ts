
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
    public statusText: string;

    /**
     * Gets or sets the error message, if an error occurred during the execution of the request.
     */
    public errorMessage: string;

    /**
     * Gets or sets details about the error.
     */
    public errorDetails: Array<string> = new Array<string>();

    /**
     * Gets or sets the model state errors.
     */
    public modelState: { [key: string]: Array<string>; } = {};

    /**
     * Gets or sets the URL of the entity if a new entity was created.
     */
    public location: string;

    /**
     * Gets or sets the content of the response.
     */
    public content: T;

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = HttpResponse;