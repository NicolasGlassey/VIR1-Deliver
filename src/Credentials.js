"use strict";

const KeyPairHelper = require("./KeyPairHelper");
const fs = require("fs");
const path = require("path");
const WindowsPasswordHelper = require("./WindowsPasswordHelper");

module.exports = class Credentials {
    //region private fields

    #outputDir;

    //endregion

    constructor(outputDir) {
        this.#outputDir = outputDir;
    }

    //region public methods

    /**
     * @brief Describe all Linux ssh keys
     * @returns {Promise<void>} Write the credentials in separate files
     */
    async describeLinuxSshKeys() {
        const keyPairs = await new KeyPairHelper().describe();
        this.#createOutputDirIfNotExists();
        this.#writeKeyPairsInFiles(keyPairs);
    }

    /**
     * @brief Describe all Windows passwords
     * @returns {Promise<void>} Write the credentials in separate files
     */
    async describeWindowsPasswords() {
        const passwords = await new WindowsPasswordHelper().describe();
        this.#createOutputDirIfNotExists();
        this.#writePasswordsInFiles(passwords);
    }

    //endregion

    //region private methods

    #createOutputDirIfNotExists() {
        if (!fs.existsSync(this.#outputDir))
            fs.mkdirSync(this.#outputDir);
    }

    #writeKeyPairsInFiles(keyPairs) {
        keyPairs.forEach(keyPair => {
            if (keyPair.PublicKey)
                fs.writeFileSync(path.join(this.#outputDir, keyPair.KeyPairId), keyPair.PublicKey);
        })
    }

    #writePasswordsInFiles(passwords) {
        passwords.forEach(password => {
            if (password.PasswordData)
                fs.writeFileSync(path.join(this.#outputDir, password.InstanceId), password.PasswordData);
        })
    }

    //endregion
}
