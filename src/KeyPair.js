'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger')

const KeyPairNotFoundException = require('./exceptions/KeyPairNotFoundException.js');
const KEY_PAIR_NOT_FOUND = 'InvalidKeyPair.NotFound';

module.exports = class KeyPair {
    //region private attributes
    #id;
    #name;
    //endregion private attributes

    //region public methods

    constructor(id, name) {
        this.#id = id;
        this.#name = name;
    }

    /**
     * @brief Fetch a keypair from an id
     * @returns {Promise}
     * @exception KeyPairNotFoundException is thrown if the there is no keypair with that id
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
     */
    static findById(id) {
        return this.#findBy('KeyPairIds', id);
    }

    /**
     * @brief Fetch a keypair from a name
     * @returns {Promise}
     * @exception KeyPairNotFoundException is thrown if the there is no keypair with that name
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
     */
    static findByName(name) {
        return this.#findBy('KeyNames', name);
    }

    static async #findBy(filter, value) {
        let params = {};
        params[filter] = [value];

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
        return new KeyPair(key.KeyPairId, key.KeyName)
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }
}
