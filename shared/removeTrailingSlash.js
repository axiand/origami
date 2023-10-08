function removeTrailingSlash(string) {
    return string.replace(/\/*$/g, '').replace(/^\/*/g, '')
}

module.exports.removeTrailingSlash = removeTrailingSlash;