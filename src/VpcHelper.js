'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({ region: 'eu-west-3' });
const Logger = require('./FileLogger')

const SecurityGroups = require("./SecurityGroup.js");
const Subnet = require('./SubnetHelper.js');
const Instance = require('./Instance.js');

const VpcNotFoundException = require('./exceptions/vpc/VpcNotFoundException.js');

module.exports = class VpcHelper {
    //region public methods

    /**
     * @brief Fetches the VPC with the given name from the AWS EC2 SDK
     * @param id {string} name of a VPC
     * @returns {Promise<Object>} VPC with the given name
     * @exception VpcNotFoundException is thrown if the vpc doesn't exist.
     * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html#describeVpcs-property
     */
    static async describe(name) {
        const handleError = (err) => {
            Logger.error(err.message);
            throw err;
        };

        const result = await ec2
            .describeVpcs({ Filters: [{ Name: "tag:Name", Values: [name] }] })
            .promise()
            .catch(handleError);

        if (result.Vpcs.length === 0)  throw new VpcNotFoundException(`VPC with name ${name} not found`);

        let vpc = result.Vpcs[0];
        vpc.Name = vpc.Tags.find((tag) => tag.Key === "Name").Value;
        vpc.Subnets = await Subnet.describe(vpc.VpcId);

        Logger.info(`Describe Vpc ${vpc.Name}`);
        return vpc;
    }

    get securityGroups() {
        return SecurityGroups.all(this.id);
    }

    get instances() {
        return Instance.findByVpcId(this.id);
    }

    /**
     * @brief Fetches all keypairs of this vpc's instances
     * @returns {KeyPair[]} Array of keypairs
     */
    get keyPairs() {
        return this.instances.map((instance) => instance.keyPair);
    }
};
