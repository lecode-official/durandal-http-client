
///<amd-module name='Http/HttpClient'/>

// #region Import Directives

/// <reference path="../Typings/References.d.ts" />

import ContentType = require("Http/ContentType");
import HttpResponse = require("Http/HttpResponse");
import jquery = require("jquery");

// #endregion

/**
 * Represents a simpe HTTP client, which can be used to send HTTP requests via XHR to REST APIs.
 */
class HttpClient {

    // #region Constructors

    /**
     * Initializes a new HttpClient instance.
     * @param {string | undefined} baseUri The base URI that is to be used. If no base URI is given, the default URI is used.
     * @param {{ [key: string]: string; } | undefined} headers The headers that are to be used. If no headers are given, the default headers are used.
     */
    constructor(baseUri?: string, headers?: { [key: string]: string; }) {

        // Sets the base URI and the headers
        this.baseUri = baseUri || HttpClient.defaultBaseUri;
        this._headers = headers || HttpClient.defaultHeaders;
        
        // Adds the accept header to the request, that specifies, that only JSON data is accepted in the response
        this.headers["Accept"] = "application/json";

        // Sets up the AJAX API of jQuery, so that it does not cache anything that comes from the REST API and supports cross domain requests
        jquery.ajaxSetup({
            cache: false,
            crossDomain: true
        });
    }

    // #endregion

    // #region Public Static Properties

    /**
     * Gets or sets the default base URI that can be configured before any HTTP client instances are created.
     */
    public static defaultBaseUri: string = "";

    /**
     * Contains the default headers that can be configured before any HTTP client instances are created.
     */
    private static _defaultHeaders: { [key: string]: string; } = {};

    /**
     * Gets the default headers that can be configured before any HTTP client instances are created.
     */
    public static get defaultHeaders(): { [key: string]: string; } {
        return HttpClient._defaultHeaders;
    }

    // #endregion

    // #region Public Properties

    /**
     * Gets or sets the base URI, which is prepended to all requested URIs.
     */
    public baseUri: string;

    /**
     * Contains the headers that are sent along with each request.
     */
    private _headers: { [key: string]: string; };

    /**
     * Gets the headers that are sent along with each request.
     */
    public get headers(): { [key: string]: string; } {
        return this._headers;
    }

    // #endregion

    // #region Private Methods
    
    /**
     * Generates the MIME type string from the specified content type.
     * @param {ContentType} contentType The content type for which the MIME type string is to be generated.
     * @returns {string} Returns the MIME type string for the specified content type.
     */
    private generateMimeType(contentType: ContentType): string {

        // Gets the name of the content type based on the enumeration value
        var contentTypeString = "";
        if (contentType === ContentType.Blob) {
            contentTypeString = "octet-stream";
        } else if (contentType === ContentType.UrlFormEncoded) {
            contentTypeString = "x-www-form-urlencoded";
        } else {
            contentTypeString = "json";
        }

        // Composes the fill MIME type and returns it
        return `application/${contentTypeString}; charset=UTF-8`;
    }

    /**
     * Converts the data to the specified content type.
     * @param {any} data The data that is to be send with the request.
     * @param {ContentType} contentType The content type that is used to encode the information stored in the data parameter.
     * @returns {string} Returns the converted data in the specified content type.
     */
    private generateRequestData(data: any, contentType: ContentType): string {

        // Checks if the user specified any data, if not then the default value is returned (an empty string)
        if (!data) {
            return "";
        }

        // Checks if the user wants to encode the data as "application/json", if so then the JSON string is generated and returned
        if (contentType === ContentType.Json) {
            return JSON.stringify(data);
        }
        
        // Checks if the user wants to encode the data as "application/x-www-form-urlencoded", if so then the URL encoded parameter string is generated and returned
        if (contentType === ContentType.UrlFormEncoded) {
            return jquery.param(data);
        }

        // Checks if the user wants to send a blob as "application/octet-stream", if so, then nothing needs to be done, because the user should make sure, that data is a Blob object, therefore data is just returned
        if (contentType === ContentType.Blob) {
            return data;
        }

        // Since the content type was neither JSON nor URL form encoded, something must have gone wrong, therefore the default value is returned
        return "";
    }

    // #endregion

    // #region Public Methods

    /**
     * Generates a URI from the specified components.
     * @param {string | undefined} relativePath The path of the URI (e.g. "path/to/entity"), which is added to the base URI. The path may contain parameters, which are replaced by their values from the parameters bag (e.g. "path/to/entity/{id}" => "path/to/entity/42", if parameters.id === 42).
     * @param {{ [key: string]: any; } | undefined} parameters The parameters bag, which contains parameters that are included in the URI. The parameters are added to the path. If there are any remaining parameters that could not be added to the path, then they are added as query parameters.
     * @returns {string} Returns the generated URI.
     */
    public generateUri(relativePath?: string, parameters?: { [key: string]: any; }): string {

        // Validates the parameters
        relativePath = relativePath || "";
        parameters = parameters || {};

        // Removes the tailing and leading slashes from URI and path respectively (this is needed, so that we can make sure that the base URI and the path are separated by exactly 1 slash)
        var baseUri = this.baseUri.charAt(this.baseUri.length - 1) == "/" ? this.baseUri.substr(0, this.baseUri.length - 1) : this.baseUri;
        relativePath = relativePath.charAt(0) == "/" ? relativePath.substr(1) : relativePath;

        // Adds all the path parameters (the user may specify a path parameter with a mustache-like syntax, e.g. "/path/to/entity/{id}", these parameters are substituted with the values from the parameters bag)
        relativePath = relativePath.replace(/{[a-zA-Z_][0-9a-zA-Z_]*}/g, parameter => {

            // Removes the mustaches to get the actual parameter name (e.g. "{id}" => "id")
            var parameterName = parameter.substr(1, parameter.length - 2);

            // Gets the value of the parameter from the parameters bag, and removes it, so that it is not added again as a query parameter
            parameters = parameters || {};
            var replacement = parameters[parameterName];
            delete parameters[parameterName];

            // URI encodes the value and fills it into the path
            return encodeURIComponent(replacement);
        });

        // Adds all the query parameters (all the path parameters have been removed from the parameters bag, the remaining parameters are added as query parameters to the URI)
        var queryParameters = new Array<string>();
        for (var parameter in parameters) {
            if (parameters[parameter] != null) {
                queryParameters.push(parameter + "=" + encodeURIComponent(parameters[parameter]));
            }
        }

        // Checks if the relative path is actually relative, if not, then the base URI does not need to be attached
        var uri = "";
        if (/^([a-z]+:\/\/|\/\/)/i.test(relativePath)) {
            uri = relativePath;
        } else {
            uri = baseUri + "/" + relativePath;
        }

        // Generates the URI by combining all the components and returns it
        return uri + (queryParameters.length > 0 ? "?" + queryParameters.join("&") : "");
    }

    /**
     * Makes a request to a URL.
     * @param {string} httpMethod The HTTP method (e.g. GET or POST) that is to be used for the request.
     * @param {string | undefined} relativePath The relative path of the ressource to which the request is being sent.
     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being sent to the server.
     * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public request<T>(httpMethod: string, relativePath?: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {

        // Builds the request URI
        var requestUri = this.generateUri(relativePath, parameters);

        // Specifies JSON as the default content type
        contentType = contentType || ContentType.Json;

        // Converts the specified data into the requested content type (e.g. JSON or URL form encoded)
        var requestData = this.generateRequestData(data, contentType);

        // Creates the promise, that is returned to the caller
        var promise: JQueryDeferred<HttpResponse<T>> = jquery.Deferred();

        // Makes a call to the REST API in order to retrieve the requested resource
        var xhr = jquery.ajax(requestUri, {
            type: httpMethod,
            data: requestData,
            contentType: this.generateMimeType(contentType),
            processData: false,
            headers: this.headers,
            xhr: () => {
                var customXhr: JQueryXHR = jquery.ajaxSettings.xhr();
                customXhr.onprogress = event => promise.notify(event.lengthComputable ? event.loaded / event.total : -1);
                return customXhr;
            }
        });

        // Attaches the done and the failed event handlers that evaluate the information that comes back from the server and serve them to the promise that is returned to the user
        xhr.then(value => {
            
            // Returns the created model
            var result = new HttpResponse<T>();
            result.statusCode = xhr.status;
            result.content = value;
            result.location = xhr.getResponseHeader("location");
            
            // Triggers the done callback of the promise that is being returned to the user
            promise.resolve(result);
        }, reasons => {

            // Returns the error
            var result = new HttpResponse<T>();
            result.statusCode = xhr.status;
            result.statusText = xhr.statusText;
            result.errorMessage = "";
            if (xhr.responseJSON && xhr.responseJSON.errorMessage) {
                result.errorMessage = xhr.responseJSON.errorMessage;
            } else if (xhr.responseJSON && xhr.responseJSON.message) {
                result.errorMessage = xhr.responseJSON.message;
            } else if (xhr.responseText) {
                result.errorMessage = xhr.responseText;
            }
            result.errorDetails = xhr.responseJSON ? xhr.responseJSON.errorDetails : {};
            result.modelState = xhr.responseJSON ? xhr.responseJSON.modelState : {};

            // Triggers the failed callback of the promise that is being returned to the user
            promise.reject(result);
        });

        // Returns the promise to the user
        return promise;
    }

    /**
     * Makes a request to the specified path using the GET verb.
     * @param {string} relativePath The relative path of the ressource that is being queried.
     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public get<T>(relativePath: string, parameters?: { [key: string]: any; }): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("GET", relativePath, parameters);
    }

    /**
   * Makes a request to the specified path using the PUT verb.
   * @param {string} relativePath The relative path of the resource to which the data is being put.
   * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
   * @param {any} data The data that is being put to the specified path.
   * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
   * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
   */
    public put<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("PUT", relativePath, parameters, data, contentType);
    }

    /**
     * Makes a request to the specified path using the POST verb.
     * @param {string} relativePath The relative path of the resource to which the data is being posted.
     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being posted to the specified path.
     * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public post<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("POST", relativePath, parameters, data, contentType);
    }

    /**
     * Makes a request to the specified path using the PATCH verb.
     * @param {string} relativePath The relative path of the resource which is to be patched.
     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being sent to the specified path.
     * @param {ContentType | undefined} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public patch<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("PATCH", relativePath, parameters, data, contentType);
    }

    /**
     * Makes a request to the specified path using the DELETE verb.
     * @param {string} relativePath The relative path of the resource which is to be deleted.
     * @param {{ [key: string]: any; } | undefined} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being sent to the specified path.
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public delete<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("DELETE", relativePath, parameters, data);
    }

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = HttpClient;