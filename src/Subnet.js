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
	 * @param vpcId {string} Id of a VPC
	 * @returns {Promise<Subnet[]>} Subnets of the given VPC
	 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSubnets-property
	 */
	static async all(vpcId) {
		const result = await ec2.describeSubnets({ Filters: [{ Name: 'vpc-id', Values: [vpcId] }] })
                                .promise();

		Logger.info(`Describe Subnets of VPC ${vpcId}`);
        return result.Subnets.map(subnet => new Subnet(subnet.SubnetId, subnet.CidrBlock));
	}

	get id() {
		return this.#id;
	}

	get ipRange() {
		return this.#ipRange;
	}
};
