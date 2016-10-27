
///<amd-module name='TypeScriptHttpClient/ContentType'/>

/**
 * Represents an enumeration with the content types that are supported by the HTTP client.
 */
enum ContentType {

    /**
     * The content type "application/json" is used to encode the data that is send with the request.
     */
    Json,

    /**
     * The content type "application/x-www-form-urlencoded" is used to encode the data that is send with the request.
     */
    UrlFormEncoded,

    /**
     * The content type "application/octet-stream" is used for the data that is send with the request.
     */
    Blob
}

// Exports the module, so that it can be loaded via Require
export = ContentType;