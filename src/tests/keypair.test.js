const keyPairHelper = require("../keyPairHelper.js");

describe("keyPair", () => {
    let keyPair;
    let givenKeyPairName;

    beforeEach(() => {
        keyPair = new keyPairHelper();
        givenKeyPairName = ""
    });

    test("exists_ExistingName_Success", async () => {
        // Given
        givenKeyPairName = "test";
        const expectedResult = true;

        // When
        const result = await keyPair.exists(givenKeyPairName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("exists_NotExistingName_Success", async () => {
        // Given
        givenKeyPairName = "keyPair-name-which-does-not-exist";
        const expectedResult = false;

        // When
        const result = await keyPair.exists(givenKeyPairName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("describe_ExistingkeyPair_Success", async () => {
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
