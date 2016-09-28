/**
 * Represents a response from an HTTP client, that contains information about the status and the content.
 */
declare class HttpResponse<T> {
    /**
     * Gets or sets the status code of the request.
     */
    statusCode: number;
    /**
     * Gets or sets the name of the status code of the request.
     */
    statusText: string | null;
    /**
     * Gets or sets the error message, if an error occurred during the execution of the request.
     */
    errorMessage: string | null;
    /**
     * Gets or sets details about the error.
     */
    errorDetails: Array<string>;
    /**
     * Gets or sets the model state errors.
     */
    modelState: {
        [key: string]: Array<string>;
    };
    /**
     * Gets or sets the URL of the entity if a new entity was created.
     */
    location: string | null;
    /**
     * Gets or sets the content of the response.
     */
    content: T | null;
}
export = HttpResponse;
