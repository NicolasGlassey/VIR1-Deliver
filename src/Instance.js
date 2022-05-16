'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger')
const KeyPair = require('./KeyPair')

const InstanceNotFoundException = require('./exceptions/InstanceNotFoundException.js');

module.exports = class Instance {
	//region private attributes
	#id;
	#name;
	#keyName;
	#platform;
	//endregion private attributes

	//region public methods

	constructor(id, name, keyName, platform) {
		this.#id = id;
		this.#name = name;
		this.#keyName = keyName;
		this.#platform = platform;
	}

	static async findById(id) {
		return await this.#findBy('instance-id', id);
	}

	/**
	 * @brief Fetches an instanced based on one of its properties
	 * @returns {Promise<Instance>}
	 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
	 */
	static async #findBy(filter, value) {
		let params = { Filters: [{ Name: filter, Values: [value] }] };

		// describe instances returns empty reservations if no instance was found
		const result = await ec2.describeInstances(params)
                                .promise()
		
		const reservations = result.Reservations;
		if (reservations.length < 1) {
			throw new InstanceNotFoundException();
		}
		const instance = result.Reservations[0].Instances[0];

		Logger.info(`Describe Instance ${instance.InstanceId}`);
		return new Instance(instance.InstanceId, instance.Tags[0].Value, instance.KeyName, instance.PlatformDetails);
	}

	get id() {
		return this.#id;
	}

	get name() {
		return this.#name;
	}

	get keyName() {
		return this.#keyName;
	}

	get platform() {
		return this.#platform;
	}

	/**
	 * @brief Fetches the keypair of the current instance
	 * @returns {Promise<KeyPair>}
	 */
	getKeyPair() {
		return KeyPair.findByName(this.keyName);
	}
};
