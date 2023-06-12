import { Api } from "../Api";
import { getCookie } from "./getCookie";

export async function userPing(userLogin) {
    const cookie = getCookie("csrftoken");
    if (cookie) {
        const response = await Api.ping();
        if (response && response?._json?.status === true) {
            userLogin(response._json.user);
            // set user group here
            return true;
        }
    }
    return false;
}
