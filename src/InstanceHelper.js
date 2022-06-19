"use strict";

const { Logger } = require("vir1-core");
const VpcHelper = require("./VpcHelper");

module.exports = class InstanceHelper {
    //region private fields

    #client;

    //endregion

    // region constructor

    constructor(client) {
        this.#client = client;
    }

    //endregion

    //region public methods

    /**
     * @brief Fetch an instance from a VPC id
     * @param vpcName {string} NAme of a VPC
     * @returns {Promise<AWS.EC2.InstanceList>} Instances of the given VPC
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeInstances-property
     */
    async describe(vpcName) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const vpcId = await new VpcHelper(this.#client).describe(vpcName).then(vpc => vpc.VpcId);
        const result = await this.#client
                                 .describeInstances({
                                     Filters: [{ Name: "vpc-id", Values: [vpcId] }],
                                 })
                                 .promise()
                                 .catch(handleError);

        Logger.info(`Describe instance of vpc ${vpcId}`);
        return result.Reservations.map(
            (reservation) => reservation.Instances[0]
        );
    }

    /**
     * @brief Fetch all Windows instances from the AWS EC2 SDK
     * @returns {Promise<AWS.EC2.InstanceList>}
     */
    async describeWindowsInstances() {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await this.#client
            .describeInstances({
                Filters: [{ Name: "platform", Values: ["windows"] }],
            })
            .promise()
            .catch(handleError);

        Logger.info(`Describe windows instances`);
        return result.Reservations.map(
            (reservation) => reservation.Instances[0]
        );
    }

    //endregion public methods
};
