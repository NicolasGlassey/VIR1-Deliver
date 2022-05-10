'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Subnet = require('./Subnet.js');

const VpcNotFoundException = require('./exceptions/VpcNotFoundException.js');

module.exports = class Vpc {
	//region private attributes
	#id;
	#ipRange;
	#subnets;
	//endregion private attributes

	//region public methods

	constructor(id, ipRange, subnets) {
		this.#id = id;
		this.#ipRange = ipRange;
		this.#subnets = subnets;
	}

	/**
	 * @brief Fetches the VPC with the given id from the AWS EC2 SDK and returns a Vpc object
	 * @returns {void}
	 * @exception VpcNotFoundException is thrown if the vpc doesn't exist.
	 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
	 */
	static find(id) {
		return new Promise((resolve, reject) => {
			ec2.describeVpcs({ VpcIds: [id] }, (err, data) => {
				if (err) {
					if (err.code === 'InvalidVpcID.NotFound') {
						reject(new VpcNotFoundException(id));
					} else {
						reject(err);
					}
				} else {
					const vpc = new Vpc(data.Vpcs[0].VpcId, data.Vpcs[0].CidrBlock, null);
					resolve(vpc);
				}
			});
		}).then((vpc) => {
			return new Promise((resolve, reject) => {
				ec2.describeSubnets(
					{ Filters: [{ Name: 'vpc-id', Values: [vpc.id] }] },
					(err, data) => {
						if (err) {
							reject(err);
						} else {
							const subnets = data.Subnets.map((subnet) => {
								return new Subnet(subnet.SubnetId);
							});
							vpc.subnets = subnets;
							resolve(vpc);
						}
					}
				);
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
