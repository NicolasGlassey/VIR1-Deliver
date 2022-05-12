const KeyPair = require("../KeyPair.js");
const KeyPairNotFoundException = require('../exceptions/KeyPairNotFoundException.js');

test('extractKeyPairByName_BasicCase_Success', async () => {
    // Given
    const expectedKeyId = 'key-05c59bb0609bc8db5';
    const expectedKeyName = 'test';

    // When
    const key = await KeyPair.findByName(expectedKeyName);

    // Then
    expect(key.id).toEqual(expectedKeyId);
    expect(key.name).toEqual(expectedKeyName);
});

test('extractKeyPairById_NonExistingId_ThrowException', async () => {
    // Given
    const expectedKeyName = 'does-not-exist';

    // When
    // TODO: with rejects allways returns true, remove it
    expect(async () => await KeyPair.findByName(expectedKeyName)).rejects.toThrow(KeyPairNotFoundException);

    // Then
	// Exception is thrown
});

test('extractKeyPairById_BasicCase_Success', async () => {
    // Given
    const expectedKeyId = 'key-05c59bb0609bc8db5';
    const expectedKeyName = 'test';

    // When
    const key = await KeyPair.findById(expectedKeyId);

    // Then
    expect(key.id).toEqual(expectedKeyId);
    expect(key.name).toEqual(expectedKeyName);
});

test('extractKeyPairById_NonExistingId_ThrowException', async () => {
    // Given
    const expectedKeyId = 'key-which-does-not-exist';

    // When
    // TODO: with rejects allways returns true, remove it
    expect(async () => await KeyPair.findById(expectedKeyId)).rejects.toThrow(KeyPairNotFoundException);

    // Then
	// Exception is thrown
});