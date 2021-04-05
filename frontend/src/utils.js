/**
 * Is user session opened.
 */
export function loggedIn() {
    return !!window.localStorage.getItem('token');
}

/**
 * Get/set token in localStorage
 */
export function token(newValue) {
    if (!!newValue) {
        window.localStorage.setItem('token', newValue);
    }
    return window.localStorage.getItem('token');
}

/**
 * Get/set userName in localStorage.
 */
export function userName(newValue) {
    if (!!newValue) {
        window.localStorage.setItem('userName', newValue);
    }
    return window.localStorage.getItem('userName');
}

/**
 * Remove token/userName from localStorage.
 */
export function clearLoginInfo() {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('userName');
}
