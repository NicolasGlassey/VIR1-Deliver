'use strict';

const AWS = require('aws-sdk');
const Logger = require('./FileLogger');
const VpcHelper = require('./VpcHelper');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

module.exports = class SecurityGroup {
    /**
     * @brief Check if a security group exists.
     * @param securityGroupName The name of the security group.
     * @returns {Promise<boolean>} True if the security group exists, false otherwise.
     */
    async exists(securityGroupName) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2.describeSecurityGroups({
            Filters: [{ Name: 'group-name', Values: [securityGroupName] }]
        }).promise().catch(handleError);

        return result.SecurityGroups.length > 0;
    }

    /**
     * @brief Fetch all security groups of a vpc from the AWS EC2 SDK.
     * @param {string} vpcName The VPC name of the vpc to fetch the security groups from.
     * @param {string} securityGroupName The name of the security group to filter by.
     * @returns {Promise<AWS.EC2.SecurityGroupList>} The security groups of the vpc.
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
     */
    async describe(vpcName, securityGroupName) {
        const vpcId = await new VpcHelper().describe(vpcName).then(vpc => vpc.VpcId);

        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2.describeSecurityGroups({
            Filters: [
                { Name: 'vpc-id', Values: [vpcId] },
                { Name: 'group-name', Values: [securityGroupName] },
            ]
        }).promise().catch(handleError);

        Logger.info(`Describe security groups from VPC : ${vpcName}`);
        return result.SecurityGroups;
    }
};
