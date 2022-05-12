'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

const KeyPairNotFoundException = require('./exceptions/KeyPairNotFoundException.js');
const keyPairNotFound = 'InvalidKeyPair.NotFound';

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
		return this.#findBy('KeyPairIds', id);
	}

	/**
	 * @brief Fetch a keypair from a name
	 * @returns {void}
	 * @exception KeyPairNotFoundException is thrown if the there is no keypair with that name
	 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeKeyPairs-property
	 */
	static findByName(name) {
		return this.#findBy('KeyNames', name);
	}

	static #findBy(filter, value) {
		let params = {};
		params[filter] = [value];

		return new Promise((resolve, reject) => {
			ec2.describeKeyPairs(params, (err, data) => {
				if (err) {
					if (err.code === keyPairNotFound) {
						reject(new KeyPairNotFoundException(value));
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