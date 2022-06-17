'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const { Logger } = require("vir1-core");
const InstanceHelper = require('./InstanceHelper');

module.exports = class WindowsPasswordHelper {
    //region public methods

    /**
     * @brief Fetch the Windows password of an instance by its name.
     * @returns {Promise<AWS.EC2.GetPasswordDataResult[]>}
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getPasswordData-property
     */
    async describe() {
        const handleError = err => {
            Logger.error(err.message);
            throw err;
        }

        const instancesIds = (await new InstanceHelper().describeWindowsInstances()).map(instance => instance.InstanceId);
        const passwordsData = await Promise.all(instancesIds.map(async instanceId => {
            return await ec2.getPasswordData({ InstanceId: instanceId }).promise().catch(handleError);
        }));

        Logger.info(`Password for all windows instances fetched`);
        return passwordsData;
    }

    //endregion
};
