"use strict";

const AWS = require("aws-sdk");
const ec2 = new AWS.EC2({ region: "eu-west-3" });

const DescribeInfra = require("../DescribeInfra");
const VpcNotFoundException = require("../exceptions/vpc/VpcNotFoundException");

describe("DescribeInfra", () => {
    let describeInfra;
    let vpcName;

    beforeEach(() => {
        describeInfra = new DescribeInfra(ec2);
        vpcName = "";
    });

    test('describe_AllInfra_Success', async () => {
        // Given
        vpcName = "vpc-paris";
        const expectedType = 'string';

        // When
        const infra = await describeInfra.describe(vpcName);
        const infraJson = JSON.parse(infra);

        // Then
        expect(typeof infra).toBe(expectedType);
        expect(infraJson.vpcName).toBe(vpcName);
        expect(infraJson.vpcCidr).toBeDefined();
        expect(infraJson.igwName).toBeDefined();
        expect(infraJson.subnets.length).toBeGreaterThan(0);
        expect(infraJson.securityGroups.length).toBeGreaterThan(0);
        expect(infraJson.keyPairs.length).toBeGreaterThan(0);
        expect(infraJson.instances.length).toBeGreaterThan(0);
    });

    test('describe_NotExistingVpc_Success', async () => {
        // Given
        vpcName = "vpc-not-existing";

        // when
        await expect(describeInfra.describe(vpcName)).rejects.toThrow(VpcNotFoundException);

        // Then
        // Exception is thrown
    });
});
