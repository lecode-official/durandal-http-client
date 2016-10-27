declare module 'TypeScriptHttpClient/ContentType' {
	 enum ContentType {
	    /**
	     * The content type "application/json" is used to encode the data that is send with the request.
	     */
	    Json = 0,
	    /**
	     * The content type "application/x-www-form-urlencoded" is used to encode the data that is send with the request.
	     */
	    UrlFormEncoded = 1,
	    /**
	     * The content type "application/octet-stream" is used for the data that is send with the request.
	     */
	    Blob = 2,
	}
	export = ContentType;

}

/// <reference path="../../bower_components/DefinitelyTyped/jquery/jquery.d.ts" />
declare module 'TypeScriptHttpClient/HttpClient' {
	/// <reference path="../Typings/References.d.ts" />
	import ContentType = require("TypeScriptHttpClient/ContentType");
	import HttpResponse = require("TypeScriptHttpClient/HttpResponse"); class HttpClient {
	    /**
	     * Initializes a new HttpClient instance.
	     * @param {string | undefined} baseUri The base URI that is to be used. If no base URI is given, the default URI is used.
	     * @param {{ [key: string]: string; } | undefined} headers The headers that are to be used. If no headers are given, the default headers are used.
	     */
	    constructor(baseUri?: string, headers?: {
	        [key: string]: string;
	    });
	    /**
	     * Gets or sets the default base URI that can be configured before any HTTP client instances are created.
	     */
	    static defaultBaseUri: string;
	    /**
	     * Contains the default headers that can be configured before any HTTP client instances are created.
	     */
	    private static _defaultHeaders;
	    /**
	     * Gets the default headers that can be configured before any HTTP client instances are created.
	     */
	    static readonly defaultHeaders: {
	        [key: string]: string;
	    };
	    /**
	     * Gets or sets the base URI, which is prepended to all requested URIs.
	     */
	    baseUri: string;
	    /**
	     * Contains the headers that are sent along with each request.
	     */
	    private _headers;
	    /**
	     * Gets the headers that are sent along with each request.
	     */
	    readonly headers: {
	        [key: string]: string;
	    };
	    /**
	     * Generates the MIME type string from the specified content type.
	     * @param {ContentType} contentType The content type for which the MIME type string is to be generated.
	     * @returns {string} Returns the MIME type string for the specified content type.
	     */
	    private generateMimeType(contentType);
	    /**
	     * Converts the data to the specified content type.
	     * @param {any} data The data that is to be send with the request.
	     * @param {ContentType} contentType The content type that is used to encode the information stored in the data parameter.
	     * @returns {string} Returns the converted data in the specified content type.
	     */
	    private generateRequestData(data, contentType);
	    /**
	     * Generates a URI from the specified components.
	     * @param {string | undefined} relativePath The path of the URI (e.g. "path/to/entity"), which is added to the base URI. The path may contain parameters, which are replaced by their values from the parameters bag (e.g. "path/to/entity/{id}" => "path/to/entity/42", if parameters.id === 42).
	     * @param {{ [key: string]: any; } | undefined} parameters The parameters bag, which contains parameters that are included in the URI. The parameters are added to the path. If there are any remaining parameters that could not be added to the path, then they are added as query parameters.
	     * @returns {string} Returns the generated URI.
	     */
	    generateUri(relativePath?: string, parameters?: {
	        [key: string]: any;
	    }): string;
	    /**
	     * Makes a request to a URL.
	     * @param {string} httpMethod The HTTP method (e.g. GET or POST) that is to be used for the request.
	     * @param {string | undefined} relativePath The relative path of the ressource to which the request is being sent.
	     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
	     * @param {any} data The data that is being sent to the server.
	     * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
	     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
	     */
	    request<T>(httpMethod: string, relativePath?: string, parameters?: {
	        [key: string]: any;
	    }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>>;
	    /**
	     * Makes a request to the specified path using the GET verb.
	     * @param {string} relativePath The relative path of the ressource that is being queried.
	     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
	     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
	     */
	    get<T>(relativePath: string, parameters?: {
	        [key: string]: any;
	    }): JQueryPromise<HttpResponse<T>>;
	    /**
	   * Makes a request to the specified path using the PUT verb.
	   * @param {string} relativePath The relative path of the resource to which the data is being put.
	   * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
	   * @param {any} data The data that is being put to the specified path.
	   * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
	   * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
	   */
	    put<T>(relativePath: string, parameters?: {
	        [key: string]: any;
	    }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>>;
	    /**
	     * Makes a request to the specified path using the POST verb.
	     * @param {string} relativePath The relative path of the resource to which the data is being posted.
	     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
	     * @param {any} data The data that is being posted to the specified path.
	     * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
	     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
	     */
	    post<T>(relativePath: string, parameters?: {
	        [key: string]: any;
	    }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>>;
	    /**
	     * Makes a request to the specified path using the PATCH verb.
	     * @param {string} relativePath The relative path of the resource which is to be patched.
	     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
	     * @param {any} data The data that is being sent to the specified path.
	     * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
	     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
	     */
	    patch<T>(relativePath: string, parameters?: {
	        [key: string]: any;
	    }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>>;
	    /**
	     * Makes a request to the specified path using the DELETE verb.
	     * @param {string} relativePath The relative path of the resource which is to be deleted.
	     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
	     * @param {any} data The data that is being sent to the specified path.
	     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
	     */
	    delete<T>(relativePath: string, parameters?: {
	        [key: string]: any;
	    }, data?: any): JQueryPromise<HttpResponse<T>>;
	}
	export = HttpClient;

}
declare module 'TypeScriptHttpClient/HttpResponse' {
	 class HttpResponse<T> {
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

}
