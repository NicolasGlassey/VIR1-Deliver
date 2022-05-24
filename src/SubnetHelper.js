'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger');

module.exports = class SubnetHelper {
    //region public methods

    /**
     * @brief Fetches the Subnets of a given VPC from the AWS EC2 SDK
     * @param vpcId {string} Id of a VPC
     * @returns {Promise<Object[]>} Subnets of the given VPC
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSubnets-property
     */
    static async describe(vpcId) {
        const result = await ec2.describeSubnets({ Filters: [{ Name: 'vpc-id', Values: [vpcId] }] })
                                .promise();

        Logger.info(`Describe Subnets of VPC ${vpcId}`);
        return result.Subnets;
    }
};
