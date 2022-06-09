"use strict";

const VpcHelper = require("./VpcHelper.js");

module.exports = class DescribeInfra {
    //region public methods

    /**
     * @brief Describe the infrastructure
     * @param name {string} name of a VPC
     * @returns JSON
     */
    async describe(name) {
        const vpc = await new VpcHelper().describe(name);

        const result = {
            vpcName: vpc.Name,
            vpcCidr: vpc.CidrBlock,
        };
        return JSON.stringify(result);
    }

    //endregion public methods
};
