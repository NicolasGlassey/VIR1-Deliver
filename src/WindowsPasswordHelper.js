'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const InstanceNotFoundException = require("./exceptions/instance/InstanceNotFoundException.js");
const UnavailableInstancePasswordException = require("./exceptions/instance/UnavailableInstancePasswordException.js");
const { Logger } = require("vir1-core");
const InstanceHelper = require('./InstanceHelper');

module.exports = class WindowsPasswordHelper {
    /**
     * @brief Fetch the Windows password of an instance by its name.
     * @param instanceName {string} The instance name.
     * @returns {Promise<AWS.EC2.GetPasswordDataResult>}
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getPasswordData-property
     */
    async describe(instanceName) {
        const handleError = err => {
            Logger.error(err.message);
            if (err.code.includes('InvalidInstanceID')) {
                throw new InstanceNotFoundException(err.message);
            }
            throw err;
        };

        const instanceId = await new InstanceHelper().describe(instanceName).then(instance => instance.InstanceId);
        const passwordDataResult = await ec2.getPasswordData({ InstanceId: instanceId }).promise().catch(handleError);

        if (!passwordDataResult.PasswordData) {
            Logger.error(`Unavailable password for instance ${instanceId}`);
            throw new UnavailableInstancePasswordException(
                `The password of instance ${instanceId} is not available.`);
        }

        Logger.info(`Password for instance ${instanceId} fetched`);
        return passwordDataResult;
    }
};
