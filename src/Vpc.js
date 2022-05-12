'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

const Subnet = require('./Subnet.js');

const VpcNotFoundException = require('./exceptions/VpcNotFoundException.js');
const VPC_NOT_FOUND = 'InvalidVpcID.NotFound';

module.exports = class Vpc {
	//region private attributes
	#id;
	#ipRange;
	#subnets;
	//endregion private attributes

	//region public methods

	constructor(id, ipRange, subnets = []) {
		this.#id = id;
		this.#ipRange = ipRange;
		this.#subnets = subnets;
	}

	/**
	 * @brief Fetches the VPC with the given id from the AWS EC2 SDK
	 * @returns {Promise<Vpc>}
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
					const subnets = await Subnet.findByVpc(id);
					resolve(new Vpc(vpc.VpcId, vpc.CidrBlock, subnets));
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
		return this.#subnets;
	}

	set subnets(subnets) {
		this.#subnets = subnets;
	}
};
