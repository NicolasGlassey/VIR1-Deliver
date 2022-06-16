"use strict";

const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });
const { Logger } = require("vir1-core");

module.exports = class InstanceHelper {
    //region public methods

    /**
     * @brief Check if the given name exists from the AWS EC2 SDK
     * @param name {string} name of an Instance
     * @returns {Promise<boolean>} true if the Instance exists, false otherwise
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
     */
    async exists(name) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2
            .describeInstances({
                Filters: [{ Name: "tag:Name", Values: [name] }],
            })
            .promise()
            .catch(handleError);

        Logger.info(`Describe instance ${name} to check if it exists`);
        return result.Reservations.length !== 0;
    }

    /**
     * @brief Fetch an instance from a VPC id
     * @param vpcId {string} id of a VPC
     * @returns {Promise<AWS.EC2.InstanceList>} Instances of the given VPC
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
     */
    async describe(vpcId) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2
            .describeInstances({
                Filters: [{ Name: "vpc-id", Values: [vpcId] }],
            })
            .promise()
            .catch(handleError);

        Logger.info(`Describe instance of vpc ${vpcId}`);
        return result.Reservations.map((reservation) => reservation.Instances[0]);
    }

    //endregion public methods
};
