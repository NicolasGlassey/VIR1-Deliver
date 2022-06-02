'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger')

const KeyPairNotFoundException = require('./exceptions/key_pair/KeyPairNotFoundException.js');
const KEY_PAIR_NOT_FOUND = 'InvalidKeyPair.NotFound';

module.exports = class KeyPairHelper {
    /**
     * @brief Check if the given name exists from the AWS EC2 SDK
     * @param name {string} name of a KeyPair
     * @returns {boolean} true if the KeyPair exists, false otherwise
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
     */
     static async exists(name) {
        let params = {};
        params['KeyNames'] = [name];

        const handleError = err => {
            Logger.error(err.message);
            if (err.code === KEY_PAIR_NOT_FOUND) {
                return false;
            }
            throw err;
        };

        const result = await ec2.describeKeyPairs(params)
                              .promise()
                              .catch(handleError);

        Logger.info(`Describe Keypair ${name} to check if it exists`);
        if (result) {
            return result.KeyPairs.length !== 0;
        } else {
            return false;
        }
    }

    /**
     * @brief Fetch a keypair from a name
     * @returns {Promise}
     * @exception KeyPairNotFoundException is thrown if the there is no keypair with that name
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
     */
    static async describe(name) {
        let params = {};
        params['KeyNames'] = [name];

        const handleError = err => {
            Logger.error(err.message);
            if (err.code === KEY_PAIR_NOT_FOUND) {
                throw new KeyPairNotFoundException(err.message);
            }
            throw err;
        };

        const keys = await ec2.describeKeyPairs(params)
                              .promise()
                              .catch(handleError);
        const key = keys.KeyPairs[0];

        Logger.info(`Describe Keypair ${key.KeyName}`);
        return key;
    }
}
