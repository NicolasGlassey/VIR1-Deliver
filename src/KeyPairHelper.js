"use strict";

const { Logger } = require("vir1-core");

module.exports = class KeyPairHelper {
    //region private fields

    #client;

    //endregion

    // region constructor
    constructor(client) {
        this.#client = client;
    }
    // endregion

    //region public methods

    /**
     * @brief Fetch all key pairs
     * @returns {Promise<AWS.EC2.KeyPairList>} KeyPairs
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
     */
    async describe() {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await this.#client
            .describeKeyPairs({ IncludePublicKey: true })
            .promise()
            .catch(handleError);

        Logger.info(`Describe key pairs`);
        return result.KeyPairs;
    }

    //endregion
};
