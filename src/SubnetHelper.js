'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger');

const VpcHelper = require('./VpcHelper');

module.exports = class SubnetHelper {
    //region public methods

    /**
     * @brief Fetches the Subnets of a given VPC from the AWS EC2 SDK
     * @param vpc {string} name of a VPC
     * @returns {Promise<Object[]>} Subnets of the given VPC
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSubnets-property
     */
    async describe(vpc) {
        const id = await new VpcHelper().describe(vpc).then((vpc) => vpc.VpcId);
        const result = await ec2.describeSubnets({ Filters: [{ Name: "vpc-id", Values: [id] }] })
                                .promise();

        Logger.info(`Describe Subnets of VPC ${vpc}`);
        return result.Subnets;
    }

    //endregion public methods
};
