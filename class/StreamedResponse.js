/**
 * Represents a streamed response (which can be written in chunks, rather than at once)
 * 
 * @constructor
 * @param {ServerResponse} responseObject - The Node server response object
 * @param {RequestResponse} parent - The Origami response object that instantiated this StreamedResponse
 * @returns {StreamedResponse}
 */
class StreamedResponse {
    constructor(responseObject, parent) {
        /** @private */
        this._response = responseObject
        /** @private */
        this._parent = parent

        /** @private */
        this._readyForWrites = false

        /** @private */
        this._hasCommittedHeaders = false

        return this
    }

    /**
     * Commit the current headers, sending them with the response. Headers can only be committed once.
     * 
     * @returns {StreamedResponse}
     */
    commitHeaders = function() {
        if(this._hasCommittedHeaders == true) return;
        this._response.writeHead(this._parent.status, this._parent.headers)

        this._hasCommittedHeaders = true

        return this
    }

    /**
     * Write a chunk to the response body.
     * 
     * @param {Buffer} chunk - The buffer to write
     * @returns {StreamedResponse}
     */
    writeChunk = async function(chunk) {
        await this._response.write(chunk, () => {
            return this
        })
    }

    /**
     * End the response.
     * 
     * @returns {StreamedResponse}
     */
    end = function() {
        this._response.end()

        return this
    }
}

module.exports.StreamedResponse = StreamedResponse