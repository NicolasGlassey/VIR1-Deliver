"use strict";

const VpcHelper = require("./VpcHelper.js");
const SubnetHelper = require("./SubnetHelper.js");
const SecurityGroupHelper = require("./SecurityGroupHelper.js");
const InstanceHelper = require("./InstanceHelper.js");
const KeypairHelper = require("./KeypairHelper.js");

module.exports = class DescribeInfra {
    //region public methods

    /**
     * @brief Describe the infrastructure
     * @param name {string} name of a VPC
     * @returns Promise<string>
     */
    async describe(name) {
        const subnetHelper = new SubnetHelper();

        const vpc = await new VpcHelper().describe(name);
        const subnets = await subnetHelper.describe(name);
        const securityGroups = await new SecurityGroupHelper().describe(vpc.Name);
        const keyPairs = await new KeypairHelper().describe();
        const instances = await new InstanceHelper().describe(vpc.VpcId);

        const result = {
            vpcName: vpc.Name,
            vpcCidr: vpc.CidrBlock,
            igwName: vpc.Igw?.Name,
            subnets: await Promise.all(subnets.map(async (subnet) => {
                return {
                    subnetName: subnet.Tags.find((tag) => tag.Key === "Name")
                        .Value,
                    subnetCidr: subnet.CidrBlock,
                    availabilityZone: subnet.AvailabilityZone,
                    routeTables: await subnetHelper.routeTables(subnet),
                };
            })),
            securityGroups: securityGroups.map((securityGroup) => {
                return {
                    securityGroupName: securityGroup.GroupName,
                    inboundSecurityRules: securityGroup.InboundSecurityRules,
                    outboundSecurityRules: securityGroup.OutboundSecurityRules,
                };
            }),
            keyPairs: keyPairs.map((keypair) => {
                return {
                    keyPairsName: keypair.KeyName,
                    type: keypair.KeyType,
                };
            }),
            instances: instances.map((instance) => {
                return {
                    instanceName: instance.Tags.find((tag) => tag.Key === "Name").Value,
                    instancePublicIp: instance.PublicIpAddress || "",
                    instancePrivateIp: instance.PrivateIpAddress,
                    instanceType: instance.InstanceType,
                    plateform: instance.PlatformDetails,
                    amiId: instance.ImageId,
                    terminationProtection: "",
                    usageOperation: instance.UsageOperation,
                    SecurityGroupsName: instance.SecurityGroups.map(
                        (securityGroup) => {
                            return securityGroup.GroupName;
                        }
                    ),
                    keyName: instance.KeyName,
                };
            }),
        };

        return JSON.stringify(result, null, 4);
    }

    //endregion public methods
};
