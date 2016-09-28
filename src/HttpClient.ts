
// #region Import Directives

/// <reference path="../bower_components/DefinitelyTyped/jquery/jquery.d.ts" />

import ContentType = require("ContentType");
import HttpResponse = require("HttpResponse");
import jquery = require("jquery");

// #endregion

/**
 * Represents a client to send HTTP requests via XHR.
 */
class HttpClient {

    // #region Constructors

    /**
     * Initializes a new HttpClient instance.
     * @param {string} baseUri The base URI that is to be used. If no base URI is given, the default URI is used.
     * @param {{ [key: string]: string; }} headers The headers that are to be used. If no headers are given, the default headers are used.
     */
    constructor(baseUri?: string, headers?: { [key: string]: string; }) {

        // Sets the base URI and the headers
        this.baseUri = !!baseUri ? baseUri : HttpClient.defaultBaseUri;
        this._headers = !!headers ? headers : HttpClient.defaultHeaders;
        
        // Adds the accept header to the request, that specifies, that only JSON data is accepted in the response
        this.headers["Accept"] = "application/json";

        // Sets up the AJAX API of jQuery, so that it does not cache anything that comes from the Web API and supports cross domain requests
        jquery.ajaxSetup({
            cache: false,
            crossDomain: true
        });
    }

    // #endregion

    // #region Private Static Fields
    
    /**
     * Contains the default headers that can be configured before the HTTP client instances are created.
     */
    private static _defaultHeaders: { [key: string]: string; } = {};

    // #endregion

    // #region Private Fields
    
    /**
     * Contains the headers that are sent along with each request.
     */
    private _headers: { [key: string]: string; };

    // #endregion

    // #region Public Static Properties

    /**
     * Gets or sets the default base Uri that can be configured before the HTTP client instances are created.
     */
    public static defaultBaseUri: string;

    /**
     * Gets the default headers that can be configured before the HTTP client instances are created.
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
     * Gets the headers that are sent along with each request.
     */
    public get headers(): { [key: string]: string; } {
        return this._headers;
    }

    // #endregion

    // #region Private Methods
    
    /**
     * Converts the data to the specified content type.
     * @param {any} data The data that is to be send with the request.
     * @param {ContentType} contentType The content type that is used to encode the information stored in the data parameter.
     * @returns {string} Returns the converted data in the specified content type.
     */
    private generateRequestData(data: any, contentType: ContentType): string {

        // Checks if the user specified any data or a content type, if not then the default value is returned (an empty string)
        if (!data || typeof (contentType) === "undefined") {
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

        // Since the content type was neither JSON nor URL form encoded, something must have gone wrong, therefore the default value is returned
        return "";
    }

    // #endregion

    // #region Public Methods

    /**
     * Generates a URI from the specified components.
     * @param {string} relativePath The path of the URI (e.g. "path/to/entity"), which is added to the base URI. The path may contain parameters, which are replaced by their values from the paramters bag (e.g. "path/to/entity/{id}" => "path/to/entity/42", if parameters.id === 42).
     * @param {any} parameters The paramters bag, which contains parameters that are included in the URI. The parameters are added to the path. All remaining paramters are added as query parameters.
     * @returns {string} Returns the generated URI.
     */
    public generateUri(relativePath: string, parameters: { [key: string]: any; }): string {

        // Validates the parameters
        var baseUri = !!this.baseUri ? this.baseUri : "";
        relativePath = !!relativePath ? relativePath : "";
        parameters = !!parameters ? parameters : {};

        // Removes the tailing and leading slashes from URI and path respectively (this is needed, so that we can make sure that the base URI and the path are separated by exactly 1 slash)
        baseUri = baseUri.charAt(baseUri.length - 1) == "/" ? baseUri.substr(0, baseUri.length - 1) : baseUri;
        relativePath = relativePath.charAt(0) == "/" ? relativePath.substr(1) : relativePath;

        // Adds all the path parameters (the user may specify a path parameter with a mustache-like syntax, e.g. "/path/to/entity/{id}", these parameters are substituted with the values from the parameters bag)
        relativePath = relativePath.replace(new RegExp("{[a-zA-Z_][0-9a-zA-Z_]*}", "g"), parameter => {

            // Removes the mustaches to get the actual parameter name (e.g. "{id}" => "id")
            var parameterName = parameter.substr(1, parameter.length - 2);

            // Gets the value of the parameter from the parameters bag, and removes it, so that it is not added again as a query parameter
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
        if (relativePath.substr(0, baseUri.length).toUpperCase() == baseUri.toUpperCase()) {
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
     * @param {string} relativePath The relative path of the ressource to which the request is being sent.
     * @param {{ [key: string]: any; }} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being sent to the server.
     * @param {ContentType} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public request<T>(httpMethod: string, relativePath: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {

        // Builds the request URI
        var requestUri = this.generateUri(relativePath, parameters);

        // Specifies JSON as the default content type
        contentType = contentType || ContentType.Json;

        // Converts the specified data into the requested content type (e.g. JSON or URL form encoded)
        var requestData = this.generateRequestData(data, contentType);

        // Creates the promise, that is returned to the caller
        var promise: JQueryDeferred<HttpResponse<T>> = jquery.Deferred();

        // Makes a call to the Web API in order to retrieve the requested resource
        var xhr = jquery.ajax(requestUri, {
            type: httpMethod,
            data: requestData,
            contentType: contentType == ContentType.Json ? "application/json; charset=UTF-8" : "application/x-www-form-urlencoded; charset=UTF-8",
            processData: false,
            headers: this.headers,
            xhr: () => {
                var customXhr: JQueryXHR = jquery.ajaxSettings.xhr();
                customXhr.onprogress = event => {
                    
                    // Calculates the progress and notifies it
                    promise.notify(event.lengthComputable ? event.loaded / event.total : -1);
                };
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
     * @param {{ [key: string]: any; }} parameters The parameters that are added to the path and the query string.
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public get<T>(relativePath: string, parameters?: { [key: string]: any; }): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("GET", relativePath, parameters, null);
    }

    /**
   * Makes a request to the specified path using the PUT verb.
   * @param {string} relativePath The relative path of the resource to which the data is being put.
   * @param {{ [key: string]: any; }} parameters The parameters that are added to the path and the query string.
   * @param {any} data The data that is being put to the specified path.
   * @param {ContentType} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
   * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
   */
    public put<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("PUT", relativePath, parameters, data, contentType);
    }

    /**
     * Makes a request to the specified path using the POST verb.
     * @param {string} relativePath The relative path of the resource to which the data is being posted.
     * @param {{ [key: string]: any; }} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being posted to the specified path.
     * @param {ContentType} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public post<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("POST", relativePath, parameters, data, contentType);
    }

    /**
     * Makes a request to the specified path using the PATCH verb.
     * @param {string} relativePath The relative path of the resource which is to be patched.
     * @param {{ [key: string]: any; }} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being sent to the specified path.
     * @param {ContentType} contentType The content type that is used to encode the information stored in the data parameter (if files are uploaded, then the actual content type will be overridden with "multipart/form-data").
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public patch<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any, contentType?: ContentType): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("PATCH", relativePath, parameters, data, contentType);
    }

    /**
     * Makes a request to the specified path using the DELETE verb.
     * @param {string} relativePath The relative path of the resource which is to be deleted.
     * @param {{ [key: string]: any; }} parameters The parameters that are added to the path and the query string.
     * @param {any} data The data that is being sent to the specified path.
     * @returns {JQueryPromise<HttpResponse<T>>} Returns a promise, that resolves with the result of the request.
     */
    public delete<T>(relativePath: string, parameters?: { [key: string]: any; }, data?: any): JQueryPromise<HttpResponse<T>> {
        return this.request<T>("DELETE", relativePath, parameters, data);
    }

    /**
     * Uploads a file to the Microsoft Azure Block Blob Storage.
     * @param {string} sharedAccessSignatureUri The URI to which the file is to be uploaded. The URI must contain a SAS (shared access signature), because direct upload is not supported (since a direct upload needs the storage account credentials it is advised not to use direct upload in websites).
     * @param {Blob} file The file that is to be uploaded.
     * @returns {JQueryPromise<HttpResponse<{}>>} Returns a promise, that resolves when the file has been uploaded or an error occurred. The promise can also be used to observe the upload progress.
     */
    public uploadToAzureBlockBlob(sharedAccessSignatureUri: string, file: Blob): JQueryPromise<HttpResponse<{}>> {

        // Creates the promise, that is returned to the caller
        var promise: JQueryDeferred<HttpResponse<{}>> = jquery.Deferred();
        
        // Makes a call to the Web API in order to retrieve the requested resource
        var xhr = jquery.ajax(sharedAccessSignatureUri, {
            type: "PUT",
            data: file,
            processData: false,
            headers: {
                "x-ms-date": new Date().toUTCString().replace('UTC', 'GMT'),
                "x-ms-version": '2014-02-14',
                "x-ms-blob-type": "BlockBlob"
            },
            xhr: () => {
                var customXhr: JQueryXHR = jquery.ajaxSettings.xhr();
                customXhr.upload.onprogress = event => {
                    
                    // Calculates the progress and notifies it
                    promise.notify(event.lengthComputable ? event.loaded / event.total : -1);
                };
                return customXhr;
            }
        });

        // Attaches the done and the failed event handlers that evaluate the information that comes back from the server and serve them to the promise that is returned to the user
        xhr.then(value => {
            
            // Returns the created model
            var result = new HttpResponse<{}>();
            result.statusCode = xhr.status;
            result.location = xhr.getResponseHeader("location");
            
            // Triggers the done callback of the promise that is being returned to the user
            promise.resolve(result);
        }, reasons => {

            // Returns the error
            var result = new HttpResponse<{}>();
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

            // Triggers the failed callback of the promise that is being returned to the user
            promise.reject(result);
        });

        // Returns the promise to the user
        return promise;
    }

    // #endregion
}

// Exports the module, so that it can be loaded by Require
export = HttpClient;