"use strict";

const { AwsCloudClientImpl } = require("vir1-core");

const InstanceHelper = require("../InstanceHelper.js");

describe("Instance", () => {
    let client;

    let instance;
    let givenInstanceName;

    beforeAll(async () => {
        client = (await AwsCloudClientImpl.initialize("eu-west-3")).connection;
    });

    beforeEach(async () => {
        instance = new InstanceHelper(client);
        givenInstanceName = "";
    });

    test("describe_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";
        const giveVpcName = "vpc-paris";
        const expectedInstanceKeyName = "test";
        const expectedInstancePlatform = "Linux/UNIX";

        // When
        const result = await instance.describe(giveVpcName).then((result) => {
            return result.filter((instance) =>
                instance.Tags.find(
                    (tag) =>
                        tag.Key === "Name" && tag.Value === givenInstanceName
                )
            )[0];
        });

        // Then
        expect(result.Tags.find((tag) => tag.Key === "Name").Value).toEqual(
            givenInstanceName
        );
        expect(result.KeyName).toEqual(expectedInstanceKeyName);
        expect(result.PlatformDetails).toEqual(expectedInstancePlatform);
    });

    test("exists_ExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "debian";

        // When
        expect(await instance.exists(givenInstanceName)).toEqual(true);

        // Then
    });

    test("exists_NonExistingInstance_Success", async () => {
        // Given
        givenInstanceName = "non-existing-instance";

        // When
        expect(await instance.exists(givenInstanceName)).toEqual(false);

        // Then
    });
});
