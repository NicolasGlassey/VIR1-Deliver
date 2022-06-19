"use strict";

const { AwsCloudClientImpl } = require("vir1-core");

const InstanceHelper = require("../InstanceHelper.js");

describe("Instance", () => {
    let client;

    let instance;
    let givenInstanceName;
    let givenVpcName;

    beforeAll(async () => {
        client = await AwsCloudClientImpl.initialize("eu-west-3");
    });

    beforeEach(async () => {
        instance = new InstanceHelper(client.connection);
        givenInstanceName = "";
        givenVpcName = "";
    });

    test("describe_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";
        givenVpcName = "vpc-paris";
        const expectedInstanceKeyName = "test";
        const expectedInstancePlatform = "Linux/UNIX";

        // When
        const vpcExist = await client.exists(AwsCloudClientImpl.VPC, givenVpcName);
        const result = await instance.describe(givenVpcName).then((result) => {
            return result.filter((instance) =>
                instance.Tags.find(
                    (tag) =>
                        tag.Key === "Name" && tag.Value === givenInstanceName
                )
            )[0];
        });

        // Then
        expect(vpcExist).toBe(true);
        expect(result.Tags.find((tag) => tag.Key === "Name").Value).toEqual(
            givenInstanceName
        );
        expect(result.KeyName).toEqual(expectedInstanceKeyName);
        expect(result.PlatformDetails).toEqual(expectedInstancePlatform);
    });
});
