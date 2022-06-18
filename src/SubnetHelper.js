"use strict";

const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });
const { Logger } = require("vir1-core");

const VpcHelper = require("./VpcHelper");

module.exports = class SubnetHelper {
    //region public methods

    /**
     * @brief Fetches the Subnets of a given VPC from the AWS EC2 SDK
     * @param vpc {string} name of a VPC
     * @returns {Promise<Object[]>} Subnets of the given VPC
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSubnets-property
     */
    async describe(vpc) {
        const id = await new VpcHelper().describe(vpc).then((vpc) => vpc.VpcId);
        const result = await ec2
            .describeSubnets({ Filters: [{ Name: "vpc-id", Values: [id] }] })
            .promise();

        const subnets = result.Subnets;
        for (let subnet of subnets) {
            subnet.Name = subnet.Tags.find((tag) => tag.Key === "Name").Value;
            await this.#setRouteTables(subnet);
        }

        Logger.info(`Describe Subnets of VPC ${vpc}`);
        return subnets;
    }

    async #setRouteTables(subnet) {
        const result = await ec2
            .describeRouteTables({
                Filters: [
                    {
                        Name: "association.subnet-id",
                        Values: [subnet.SubnetId],
                    },
                ],
            })
            .promise();

        subnet.RouteTables = result.RouteTables;
        Logger.info(`Describe RouteTables of Subnet ${subnet.SubnetId}`);
    }

    //endregion public methods
};
