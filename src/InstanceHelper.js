'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const { Logger } = require("vir1-core");

const InstanceNotFoundException = require('./exceptions/instance/InstanceNotFoundException.js');

module.exports = class InstanceHelper {
    //region public methods

    /**
     * @brief Check if the given name exists from the AWS EC2 SDK
     * @param name {string} name of an Instance
     * @returns {boolean} true if the Instance exists, false otherwise
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
     * @brief Fetch an instance from its name
     * @param name {string} name of an Instance
     * @returns {Promise<AWS.EC2.Instance>}
     * @exception InstanceNotFound is thrown if the there is no instance with that name
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
     */
    async describe(name) {
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

        const reservations = result.Reservations;
        if (reservations.length === 0) {
            throw new InstanceNotFoundException();
        }
        Logger.info(`Describe instance ${name}`);

        return reservations[0].Instances[0];
    }

    //endregion public methods
};
