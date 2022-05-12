'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

const KeyPairNotFoundException = require('./exceptions/KeyPairNotFoundException.js');

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
	 * @returns {void}
	 * @exception KeyPairNotFoundException is thrown if the there is no keypair with that id
     * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
	 */
	static findById(id) {
		return new Promise((resolve, reject) => {
			ec2.describeKeyPairs({ KeyPairIds: [id] }, (err, data) => {
				if (err) {
					if (err.code === 'InvalidKeyPair.NotFound') {
						reject(new KeyPairNotFoundException(id));
					} else {
						reject(err);
					}
				} else {
                    const key = data.KeyPairs[0];
                    resolve(new KeyPair(key.KeyPairId, key.KeyName));
				}
			});
		});
	}
    
    /**
	 * @brief Fetch a keypair from a name
	 * @returns {void}
	 * @exception KeyPairNotFoundException is thrown if the there is no keypair with that name
     * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
	 */
	static findByName(name) {
		return new Promise((resolve, reject) => {
			ec2.describeKeyPairs({ KeyNames: [name] }, (err, data) => {
				if (err) {
					if (err.code === 'InvalidKeyPair.NotFound') {
						reject(new KeyPairNotFoundException(name));
					} else {
						reject(err);
					}
				} else {
                    const key = data.KeyPairs[0];
                    resolve(new KeyPair(key.KeyPairId, key.KeyName));
				}
			});
		});
	}

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }
}