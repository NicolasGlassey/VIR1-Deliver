"use strict";

const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });
const { Logger } = require("vir1-core");

const KeyPairNotFoundException = require("./exceptions/key_pair/KeyPairNotFoundException.js");
const KEY_PAIR_NOT_FOUND = "InvalidKeyPair.NotFound";

module.exports = class KeyPairHelper {
    /**
     * @brief Check if the given name exists from the AWS EC2 SDK
     * @param name {string} name of a KeyPair
     * @returns {Promise<boolean>} true if the KeyPair exists, false otherwise
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
     */
    async exists(name) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2
            .describeKeyPairs({ Filters: [{ Name: "key-name", Values: [name] }] })
            .promise()
            .catch(handleError);

        Logger.info(`Describe Keypair ${name} to check if it exists`);
        return result.KeyPairs.length !== 0;
    }

    /**
     * @brief Fetch a keypair from a name
     * @param name {string} name of a KeyPair
     * @returns {Promise<EC2.KeyPair>} KeyPair with the given name
     * @exception KeyPairNotFoundException is thrown if the there is no keypair with that name
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
     */
    async describe(name) {
        const handleError = (err) => {
            Logger.error(err.message);
            if (err.code === KEY_PAIR_NOT_FOUND) {
                throw new KeyPairNotFoundException(err.message);
            }
            throw err;
        };

        const keys = await ec2
            .describeKeyPairs({ KeyNames: [name] })
            .promise()
            .catch(handleError);
        const key = keys.KeyPairs[0];

        Logger.info(`Describe Keypair ${key.KeyName}`);
        return key;
    }
};
