'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger')

const VpcNotFoundException = require('./exceptions/vpc/VpcNotFoundException.js');

module.exports = class VpcHelper {
    //region public methods

    /**
     * @brief Check if the given name exists from the AWS EC2 SDK
     * @param name {string} name of a VPC
     * @returns {Promise<boolean>} true if the VPC exists, false otherwise
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
     */
    async exists(name) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2
            .describeVpcs({ Filters: [{ Name: "tag:Name", Values: [name] }] })
            .promise()
            .catch(handleError);

        Logger.info(`Describe Vpc ${name} to check if it exists`);
        return result.Vpcs.length !== 0;
    }

    /**
     * @brief Fetches the VPC with the given name from the AWS EC2 SDK
     * @param name {string} name of a VPC
     * @returns {Promise<EC2.Vpc>} VPC with the given name
     * @exception VpcNotFoundException is thrown if the there is no instance with that name
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
     */
    async describe(name) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2
            .describeVpcs({ Filters: [{ Name: "tag:Name", Values: [name] }] })
            .promise()
            .catch(handleError);

        if (result.Vpcs.length === 0)
            throw new VpcNotFoundException(`VPC with name ${name} not found`);

        let vpc = result.Vpcs[0];
        vpc.Name = vpc.Tags.find((tag) => tag.Key === "Name").Value;

        Logger.info(`Describe Vpc ${vpc.Name}`);
        return vpc;
    }

    //endregion public methods
};
