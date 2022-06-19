"use strict";

const { AwsCloudClientImpl } = require("vir1-core");

const VpcHelper = require("../VpcHelper.js");
const VpcNotFoundException = require("../exceptions/vpc/VpcNotFoundException.js");

describe("Vpc", () => {
    let client;

    let vpc;
    let givenVpcName;

    beforeAll(async () => {
        client = await AwsCloudClientImpl.initialize("eu-west-3");
    });

    beforeEach(() => {
        vpc = new VpcHelper(client.connection);
        givenVpcName = "";
    });

    test("describe_ExistingVpc_Success", async () => {
        // Given
        givenVpcName = "vpc-deliver";

        // When
        const exist = await client.exists(AwsCloudClientImpl.VPC, givenVpcName);
        const result = await vpc.describe(givenVpcName);

        // Then
        expect(exist).toBe(true);
        expect(result.Name).toEqual(givenVpcName);
    });

    test("describe_NonExistingVpc_ThrowException", async () => {
        // Given
        givenVpcName = "vpc-name-which-does-not-exist";

        // When
        const exist = await client.exists(AwsCloudClientImpl.VPC, givenVpcName);
        await expect(vpc.describe(givenVpcName)).rejects.toThrow(
            VpcNotFoundException
        );

        // Then
        expect(exist).toBe(false);
        // Exception is thrown
    });
});
