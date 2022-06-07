const KeyPairHelper = require("../KeyPairHelper.js");
const KeyPairNotFoundException = require("../exceptions/key_pair/KeyPairNotFoundException.js");

describe("KeyPair", () => {
    let keypair = null;
    let givenKeyPairName = null;

    beforeEach(() => {
        keypair = new KeyPairHelper();
    });

    test("exists_ExistingName_Success", async () => {
        // Given
        givenKeyPairName = "test";
        const expectedResult = true;

        // When
        const result = await keypair.exists(givenKeyPairName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("exists_NotExistingName_Success", async () => {
        // Given
        givenKeyPairName = "keypair-name-which-does-not-exist";
        const expectedResult = false;

        // When
        const result = await keypair.exists(givenKeyPairName);

        // Then
        expect(result).toBe(expectedResult);
    });

    test("describe_ExistingKeypair_Success", async () => {
        // Given
        givenKeyPairName = "test";

        // When
        const result = await keypair.describe(givenKeyPairName);

        // Then
        expect(result.KeyName).toEqual(givenKeyPairName);
    });

    test("describe_NonExistingKeypair_ThrowException", async () => {
        // Given
        givenKeyPairName = "keypair-name-which-does-not-exist";

        // When
        await expect(keypair.describe(givenKeyPairName)).rejects.toThrow(
            KeyPairNotFoundException
        );

        // Then
        // Exception is thrown
    });
});
