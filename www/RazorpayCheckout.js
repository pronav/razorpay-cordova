/*global cordova, module*/

var upiTurbo = module.exports = {
    /*getLinkedUpiAccounts : function(customerMobile, successCallback, errorCallback){
        cordova.exec(
            successCallback,
            errorCallback,
            'Checkout',
            'getLinkedUpiAccounts',
            [
                customerMobile
            ]
        )
    },*/

    linkNewUpiAccount: function (customerMobile, color, successCallback, errorCallback){
        cordova.exec(successCallback, errorCallback, 'Checkout', 'linkNewUpiAccount', [customerMobile, color])
    },

    manageUpiAccounts: function(customerMobile, color, errorCallBack){
            cordova.exec(null, errorCallBack, 'Checkout', 'manageUpiAccount', [customerMobile, color])
        }

}

var RazorpayCheckout = module.exports = {
    upiTurbo,
    initUpiTurbo: function (key){
        cordova.exec(null, null, 'Checkout', 'initUpiTurbo',[key])
    },

    open: function (options, successCallback, errorCallback) {
        if (successCallback) {
            RazorpayCheckout.callbacks['payment.success'] = successCallback;
            }

        if (errorCallback) {
            RazorpayCheckout.callbacks['payment.cancel'] = errorCallback;
        }

        cordova.exec(
            RazorpayCheckout.pluginCallback,
            RazorpayCheckout.pluginCallback,
            'Checkout',
            'open',
            [
                JSON.stringify(options)
            ]
        );
    },

    pluginCallback: function(response){
        if('razorpay_payment_id' in response){
            RazorpayCheckout.callbacks['payment.success'](response);
        }
        else if('external_wallet_name' in response){
            RazorpayCheckout.callbacks['payment.external_wallet'](response);
        }
        else if('code' in response || 'errorCode' in response){
            RazorpayCheckout.callbacks['payment.cancel'](response);
        }
    },

    callbacks: {},

    on: function(event, callback) {
        if (typeof event === 'string' && typeof callback === 'function') {
            RazorpayCheckout.callbacks[event] = callback;
        }
    },

    onResume: function(event) {
        if(event.pendingResult && event.pendingResult.pluginServiceName === 'Checkout'){
            RazorpayCheckout.pluginCallback(event.pendingResult.result);
        }
    },

};
