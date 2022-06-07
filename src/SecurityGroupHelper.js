'use strict';

const AWS = require('aws-sdk');
const { Logger } = require("vir1-core");
const VpcHelper = require('./VpcHelper');
const ec2 = new AWS.EC2({region: 'eu-west-3'});

module.exports = class SecurityGroup {

    /**
     * @brief Fetch all security groups of a vpc from the AWS EC2 SDK.
     * @param {string} vpcName The VPC name to filter the security groups by.
     * @returns {Promise<AWS.EC2.SecurityGroupList>}
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
     */
    static async describe(vpcName) {
        const vpcId = await VpcHelper.describe(vpcName).then(vpc => vpc.VpcId);

        const result = await ec2.describeSecurityGroups(
            {Filters: [{Name: 'vpc-id', Values: [vpcId]}]}).promise();

        Logger.info(`Describe security groups from VPC : ${vpcName}`);
        return result.SecurityGroups;
    }
};
