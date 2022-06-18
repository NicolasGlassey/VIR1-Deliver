'use strict';

const InstanceHelper = require("./InstanceHelper");
const { Logger } = require("vir1-core");

module.exports = class WindowsPasswordHelper {
    //region private fields

    #client;

    //endregion

    // region constructor
    constructor(client) {
        this.#client = client;
    }
    // endregion

    //region public methods

    /**
     * @brief Fetch the Windows password of an instance by its name.
     * @returns {Promise<AWS.EC2.GetPasswordDataResult[]>}
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#getPasswordData-property
     */
    async describe() {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const instancesIds = (
            await new InstanceHelper(this.#client).describeWindowsInstances()
        ).map((instance) => instance.InstanceId);
        const passwordsData = await Promise.all(
            instancesIds.map(async (instanceId) => {
                return await this.#client
                    .getPasswordData({ InstanceId: instanceId })
                    .promise()
                    .catch(handleError);
            })
        );

        Logger.info(`Password for all windows instances fetched`);
        return passwordsData;
    }

    //endregion
};
