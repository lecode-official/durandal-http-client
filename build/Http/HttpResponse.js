///<amd-module name='Http/HttpResponse'/>
define("Http/HttpResponse", ["require", "exports"], function (require, exports) {
    "use strict";
    /**
     * Represents a response from an HTTP client, that contains information about the status and the content.
     */
    var HttpResponse = (function () {
        function HttpResponse() {
            // #region Public Properties
            /**
             * Gets or sets details about the error.
             */
            this.errorDetails = new Array();
            /**
             * Gets or sets the model state errors.
             */
            this.modelState = {};
            // #endregion
        }
        return HttpResponse;
    }());
    return HttpResponse;
});
