'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

module.exports = class Vpc {
	//region private attributes
	#id;
	#ipRange;
	//endregion private attributes

	//region public methods

	/**
	 * @brief Constructor of the class Vpc, which instantiates a Vpc.
	 * @param distinct : boolean a distinct constraint
	 * @returns {void}
	 * @exception NonExistingVpcException is thrown if the vpc doesn't exist.
	 * @link https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
	 */
	constructor(id, ipRange) {
		this.#id = id;
		this.#ipRange = ipRange;
	}

	static find(id) {
		return new Promise((resolve, reject) => {
			ec2.describeVpcs({ VpcIds: [id] }, (err, data) => {
				if (err) {
					console.log(err);
				} else {
					const vpc = new Vpc(
						data.Vpcs[0].VpcId,
						data.Vpcs[0].CidrBlock
						// TODO: Implement subnets
					);
					resolve(vpc);
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
