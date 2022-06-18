'use strict';

const VpcNotFoundException = require("./exceptions/vpc/VpcNotFoundException.js");
const { Logger } = require("vir1-core");

module.exports = class VpcHelper {
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

        const result = await this.#client
            .describeVpcs({ Filters: [{ Name: "tag:Name", Values: [name] }] })
            .promise()
            .catch(handleError);

        Logger.info(`Describe Vpc ${name} to check if it exists`);
        return result.Vpcs.length !== 0;
    }

    /**
     * @brief Fetches the VPC with the given name from the AWS EC2 SDK
     * @param vpcName {string} name of a VPC
     * @returns {Promise<AWS.EC2.Vpc>} VPC with the given name
     * @exception VpcNotFoundException is thrown if the there is no instance with that name
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
     */
    async describe(vpcName) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await this.#client
                                 .describeVpcs({ Filters: [{ Name: "tag:Name", Values: [vpcName] }] })
                                 .promise()
                                 .catch(handleError);

        if (result.Vpcs.length === 0)
            throw new VpcNotFoundException(`VPC with name ${vpcName} not found`);

        let vpc = result.Vpcs[0];
        vpc.Name = vpc.Tags.find((tag) => tag.Key === "Name").Value;
        vpc.Igw = await this.#getInternetGateway(vpc.VpcId);

        Logger.info(`Describe Vpc ${vpc.Name}`);
        return vpc;
    }

    //endregion public methods

    //region private methods

    async #getInternetGateway(vpcId) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await this.#client
            .describeInternetGateways({
                Filters: [{ Name: "attachment.vpc-id", Values: [vpcId] }],
            })
            .promise()
            .catch(handleError);

        const igw = result.InternetGateways[0];
        if (igw) igw.Name = igw.Tags.find((tag) => tag.Key === "Name").Value;

        Logger.info(`Describe InternetGateway of Vpc ${vpcId}`);
        return igw;
    }

    //endregion private methods
};
