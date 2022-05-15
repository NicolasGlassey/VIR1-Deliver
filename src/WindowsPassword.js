'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });

module.exports = class WindowsPassword {
    #instanceId
    #password
    #timestamp

    constructor(instanceId, password, timestamp) {
        this.#instanceId = instanceId;
        this.#password = password;
        this.#timestamp = timestamp;
    }

    /**
     * @brief Fetch the Windows password of an instance.
     * @param instanceId {string} The instance ID.
     * @returns {Promise<WindowsPassword>}
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getPasswordData-property
     */
    static async find(instanceId) {
        const result = await ec2.getPasswordData({
            InstanceId: instanceId,
        }).promise()

        return new WindowsPassword(result.InstanceId, result.PasswordData, result.Timestamp);
    }

    /**
     * @brief Get the instance ID.
     * @returns {string}
     */
    get instanceId() {
        return this.#instanceId;
    }

    /**
     * @brief Get the password.
     * @returns {string}
     */
    get password() {
        return this.#password;
    }

    /**
     * @brief Get the timestamp.
     * @returns {Date}
     */
    get timestamp() {
        return this.#timestamp;
    }
};
