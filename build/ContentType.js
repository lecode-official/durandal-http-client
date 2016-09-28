define(["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Represents an enumeration with the content types that are supported by the HTTP client.
     */
    var ContentType;
    (function (ContentType) {
        /**
         * The content type "application/json" is used to encode the data that is send with the request.
         */
        ContentType[ContentType["Json"] = 0] = "Json";
        /**
         * The content type "application/x-www-form-urlencoded" is used to encode the data that is send with the request.
         */
        ContentType[ContentType["UrlFormEncoded"] = 1] = "UrlFormEncoded";
        /**
         * The content type "application/octet-stream" is used for the data that is send with the request.
         */
        ContentType[ContentType["Blob"] = 2] = "Blob";
    })(ContentType || (ContentType = {}));
    return ContentType;
});
