///<amd-module name='TypeScriptHttpClient/HttpResponse'/>
define("TypeScriptHttpClient/HttpResponse", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Represents a response from an HTTP client, that contains information about the status and the content.
     */
    var HttpResponse = (function () {
        function HttpResponse() {
            /**
             * Gets or sets details about the error.
             */
            this.errorDetails = new Array();
            /**
             * Gets or sets the model state errors.
             */
            this.modelState = {};
        }
        return HttpResponse;
    }());
    return HttpResponse;
});
