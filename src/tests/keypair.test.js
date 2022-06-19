"use strict";

const { AwsCloudClientImpl } = require("vir1-core");

const keyPairHelper = require("../keyPairHelper.js");

describe("keyPair", () => {
    let client;

    let keyPair;
    let givenKeyPairName;

    beforeAll(async () => {
        client = (await AwsCloudClientImpl.initialize("eu-west-3")).connection;
    });

    beforeEach(() => {
        keyPair = new keyPairHelper(client);
        givenKeyPairName = "";
    });

    test("describe_ExistingKeyPair_Success", async () => {
        // Given
        const expectedKeyPairName = "test";
        const expectedKeyPairType = "rsa";

        // When
        const result = await keyPair.describe().then((result) => {
            return result.filter((keyPair) => keyPair.KeyName === "test")[0];
        });

        // Then
        expect(result.KeyName).toEqual(expectedKeyPairName);
        expect(result.KeyType).toEqual(expectedKeyPairType);
    });
});
