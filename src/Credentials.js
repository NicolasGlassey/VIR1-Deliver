"use strict";

const KeyPairHelper = require("./KeyPairHelper");
const fs = require("fs");
const path = require("path");

module.exports = class Credentials {
    //region public methods

    /**
     * @brief Describe different credentials of the instance
     * @returns {Promise<void>} Write the credentials in separate files
     */
    async describeLinuxSshKeys() {
        const keyPairs = await new KeyPairHelper().describe();

        const outputDir = 'output';
        if (!fs.existsSync(outputDir))
            fs.mkdirSync(outputDir);

        keyPairs.forEach(keyPair => {
            if (keyPair.PublicKey)
                fs.writeFileSync(path.join(outputDir, keyPair.KeyPairId), keyPair.PublicKey);
        })
    }

    //endregion
}
