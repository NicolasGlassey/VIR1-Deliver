'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger')

const SecurityGroups = require("./SecurityGroup.js");
const Subnet = require('./Subnet.js');

const VpcNotFoundException = require('./exceptions/VpcNotFoundException.js');
const VPC_NOT_FOUND = 'InvalidVpcID.NotFound';

module.exports = class Vpc {
	//region private attributes
	#id;
	#ipRange;
	//endregion private attributes

	//region public methods

	constructor(id, ipRange) {
		this.#id = id;
		this.#ipRange = ipRange;
	}

	/**
	 * @brief Fetches the VPC with the given id from the AWS EC2 SDK
	 * @param id {string} Id of a VPC
	 * @returns {Promise<Vpc>} VPC with the given id
	 * @exception VpcNotFoundException is thrown if the vpc doesn't exist.
	 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
	 */
	static find(id) {
		return new Promise((resolve, reject) => {
			ec2.describeVpcs({ VpcIds: [id] }, async (err, data) => {
				if (err) {
					if (err.code === VPC_NOT_FOUND) {
						reject(new VpcNotFoundException(id));
					} else {
						reject(err);
					}
				} else {
					const vpc = data.Vpcs[0];

					Logger.info(`Describe VPC ${vpc.VpcId}`);
					resolve(new Vpc(vpc.VpcId, vpc.CidrBlock));
				}
			});
		});
	}

	get id() {
		return this.#id;
	}

	get ipRange() {
		return this.#ipRange;
	}

	get subnets() {
		return Subnet.find(this.id);
	}

	get securityGroups() {
		return SecurityGroups.all(this.id);
	}
};
