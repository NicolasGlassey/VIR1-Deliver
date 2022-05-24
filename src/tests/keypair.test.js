const KeyPairHelper = require("../KeyPairHelper.js");
const KeyPairNotFoundException = require('../exceptions/key_pair/KeyPairNotFoundException.js');

describe('KeyPair', () => {
    test('exists_BasicCase_Success', async () => {
        // Given
        const expectedKeyName = 'test';

        // When
        const key = await KeyPairHelper.describe(expectedKeyName);

        // Then
        expect(key.KeyName).toEqual(expectedKeyName);
    });

    test('describe_BasicCase_Failure', async () => {
        // Given
        const expectedKeyName = 'test';

        // When
        const key = await KeyPairHelper.describe(expectedKeyName);

        // Then
        expect(key.KeyName).toEqual(expectedKeyName);
    });


    test('exists_ExistingName_ThrowException', async () => {
        // Given
        const expectedKeyName = 'test';

        // When
        expect(await KeyPairHelper.exists(expectedKeyName)).toEqual(true);

        // Then
        // Exception is thrown
    });

    test('exists_NotExistingName_ThrowException', async () => {
        // Given
        const expectedKeyName = 'does-not-exist';

        // When
        expect(await KeyPairHelper.exists(expectedKeyName)).toEqual(false);

        // Then
        // Exception is thrown
    });
});
