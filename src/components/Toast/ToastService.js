/* Global ToastService that can be imported in any component to open the Toast component */
/* Toast: function that opens the Toast. The Toast will auto close itself or can be closed from the X button.
* @param {object} parameters object containing params to pass to the Toast
*** @param {string} icon selects icon in Toast by key name; styling is also applied by the icon selected
*** @param {string} message the display message that is shown in the Toast
*** @param {integer} duration the time in milliseconds before Toast automatically closes
* @param {function} cb optional callback that runs after the Toast is finished
* */
const ToastService = {
    reset: function() {
        this.Toast = ({ icon, message, duration }, cb) => {}
    }
}
ToastService.reset();

export default ToastService;
