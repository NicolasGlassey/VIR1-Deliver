'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger');

module.exports = class Subnet {
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
	 * @brief Fetches the Subnets of a given VPC from the AWS EC2 SDK
	 * @param {string} : id of a VPC
	 * @returns {Promise<Subnet[]>} : Subnets of the given VPC
	 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSubnets-property
	 */
	static find(vpcId) {
		return new Promise((resolve, reject) => {
			ec2.describeSubnets({ Filters: [{ Name: 'vpc-id', Values: [vpcId] }] }, (err, data) => {
				if (err) {
					reject(err);
				} else {
					const subnets = data.Subnets.map((subnet) => {
						return new Subnet(subnet.SubnetId, subnet.CidrBlock);
					});

					Logger.info(`Describe Subnets of VPC ${vpcId}`);
					resolve(subnets);
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
};
