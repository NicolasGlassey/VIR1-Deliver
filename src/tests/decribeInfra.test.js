"use strict";

const { AwsCloudClientImpl } = require("vir1-core");

const DescribeInfra = require("../DescribeInfra");
const VpcNotFoundException = require("../exceptions/vpc/VpcNotFoundException");

describe("DescribeInfra", () => {
    let client;

    let describeInfra;
    let givenVpcName;

    beforeAll(async () => {
        client = await AwsCloudClientImpl.initialize("eu-west-3");
    });

    beforeEach(() => {
        describeInfra = new DescribeInfra(client.connection);
        givenVpcName = "";
    });

    test('describe_AllInfra_Success', async () => {
        // Given
        givenVpcName = "vpc-paris";
        const expectedType = 'string';

        // When
        const vpcExist = await client.exists(AwsCloudClientImpl.VPC, givenVpcName);
        const infra = await describeInfra.describe(givenVpcName);
        const infraJson = JSON.parse(infra);

        // Then
        expect(vpcExist).toBe(true);
        expect(typeof infra).toBe(expectedType);
        expect(infraJson.vpcName).toBe(givenVpcName);
        expect(infraJson.vpcCidr).toBeDefined();
        expect(infraJson.igwName).toBeDefined();
        expect(infraJson.subnets.length).toBeGreaterThan(0);
        expect(infraJson.securityGroups.length).toBeGreaterThan(0);
        expect(infraJson.keyPairs.length).toBeGreaterThan(0);
        expect(infraJson.instances.length).toBeGreaterThan(0);
    });

    test('describe_NotExistingVpc_Success', async () => {
        // Given
        givenVpcName = "vpc-not-existing";

        // when
        const vpcExist = await client.exists(AwsCloudClientImpl.VPC, givenVpcName);
        await expect(describeInfra.describe(givenVpcName)).rejects.toThrow(
            VpcNotFoundException
        );

        // Then
        expect(vpcExist).toBe(false);
        // Exception is thrown
    });
});
