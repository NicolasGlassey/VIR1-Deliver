'use strict';

const AWS = require('aws-sdk');
const Logger = require("./FileLogger");
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

module.exports = class SecurityGroup {

    #id;
    #description;

    constructor(id, description) {
        this.#id = id;
        this.#description = description;
    }

    get id() {
        return this.#id;
    }

    get description() {
        return this.#description;
    }

    /**
     * @brief Fetch all security groups from the AWS EC2 SDK.
     * @param {string} vpcId The VPC ID to filter the security groups by.
     * @returns {Promise<SecurityGroup[]>}
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
     */
    static async all(vpcId) {
        const result = await ec2.describeSecurityGroups({ Filters: [{ Name: 'vpc-id', Values: [vpcId] }] })
                                .promise();

        Logger.info(`DescribeSecurityGroups ${vpcId}`);
        return result.SecurityGroups.map(sg => new SecurityGroup(sg.GroupId, sg.Description));
    }
};
