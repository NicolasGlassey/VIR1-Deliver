'use strict';

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({region: 'eu-west-3'});

module.exports = class SecurityGroup {

    #id;
    #description;

    constructor(id, description) {
        this.#id = id;
        this.#description = description;
    }

    get id() {
        return this.#id;
    }

    get description() {
        return this.#description;
    }

    /**
     * @brief Fetch all security groups from the AWS EC2 SDK.
     * @params
     */
    static async all(vpcId) {
        const result = await ec2.describeSecurityGroups({Filters: [{Name: 'vpc-id', Values: [vpcId]}]}).promise();

        return result.SecurityGroups.map(sg => {
            return new SecurityGroup(sg.GroupId, sg.Description);
        });
    }
};
