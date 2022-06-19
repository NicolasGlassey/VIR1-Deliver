'use strict';

const VpcHelper = require("./VpcHelper");
const { Logger } = require("vir1-core");

module.exports = class SecurityGroupHelper {
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
     * @brief Fetch all security groups of a vpc from the AWS EC2 SDK.
     * @param {string} vpcName The VPC name of the vpc to fetch the security groups from.
     * @param {string} securityGroupName The name of the security group to filter by.
     * @returns {Promise<AWS.EC2.SecurityGroupList>} The security groups of the vpc.
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeSecurityGroups-property
     */
    async describe(vpcName, securityGroupName = "") {
        const securityGroups = securityGroupName
            ? await this.#describeWithVpcAndSecurityGroup(
                  vpcName,
                  securityGroupName
              )
            : await this.#describeWithVpc(vpcName);

        for (const securityGroup of securityGroups)
            await this.#setSecurityGroupRules(securityGroup);

        return securityGroups;
    }

    //endregion

    //region private methods

    async #describeWithVpcAndSecurityGroup(vpcName, securityGroupName) {
        const vpcId = await new VpcHelper(this.#client)
            .describe(vpcName)
            .then((vpc) => vpc.VpcId);
        const result = await this.#client
            .describeSecurityGroups({
                Filters: [
                    { Name: "vpc-id", Values: [vpcId] },
                    { Name: "group-name", Values: [securityGroupName] },
                ],
            })
            .promise()
            .catch(this.#handleError);

        Logger.info(
            `Describe security group : ${securityGroupName}, from VPC : ${vpcName}`
        );
        return result.SecurityGroups;
    }

    async #describeWithVpc(vpcName) {
        const vpcId = await new VpcHelper(this.#client)
            .describe(vpcName)
            .then((vpc) => vpc.VpcId);
        const result = await this.#client
            .describeSecurityGroups({
                Filters: [{ Name: "vpc-id", Values: [vpcId] }],
            })
            .promise()
            .catch(this.#handleError);

        Logger.info(`Describe security groups from VPC : ${vpcName}`);
        return result.SecurityGroups;
    }

    async #setSecurityGroupRules(securityGroup) {
        const result = await this.#client
            .describeSecurityGroupRules({
                Filters: [
                    { Name: "group-id", Values: [securityGroup.GroupId] },
                ],
            })
            .promise()
            .catch(this.#handleError);

        securityGroup.InboundSecurityRules =
            securityGroup.InboundSecurityRules ?? [];
        securityGroup.OutboundSecurityRules =
            securityGroup.OutboundSecurityRules ?? [];
        result.SecurityGroupRules.forEach((rule) => {
            let portRange =
                rule.FromPort !== rule.ToPort
                    ? `${rule.FromPort} - ${rule.ToPort}`
                    : rule.FromPort;
            const inboundSecurityRule = {
                RuleName: rule.Tags.find((tag) => tag?.Key === "Name")?.Value,
                Type: rule.ToPort,
                Protocole: rule.IpProtocol,
                PortRange: portRange,
                Source: rule.GroupId,
                Description: rule.Description,
            };

            rule.IsEgress
                ? securityGroup.OutboundSecurityRules.push(inboundSecurityRule)
                : securityGroup.InboundSecurityRules.push(inboundSecurityRule);
        });

        Logger.info(
            `Set security group rules to security group : ${securityGroup.GroupName}`
        );
    }

    #handleError(error) {
        Logger.error(error.message);
        throw error;
    }

    //endregion
};
