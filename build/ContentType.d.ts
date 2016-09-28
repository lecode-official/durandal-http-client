/**
 * Represents an enumeration with the content types that are supported by the HTTP client.
 */
declare enum ContentType {
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
