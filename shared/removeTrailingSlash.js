/**
 * Remove trailing slashes from an URL path.
 * 
 * @param {string} string - The string to be parsed 
 * @returns {string}
 */
function removeTrailingSlash(string) {
    return string.replace(/\/*$/g, '').replace(/^\/*/g, '')
}

module.exports.removeTrailingSlash = removeTrailingSlash;