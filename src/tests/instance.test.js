const Instance = require("../Instance.js");
const InstanceNotFoundException = require('../exceptions/InstanceNotFoundException.js');

test('findById_ExistingInstance_Success', async () => {
    // Given
    const expectedInstanceId = 'i-03d46dee061af282b';
    const expectedInstanceKeyName = 'test';
    const expectedInstanceName = 'debian';
    const expectedInstancePlatform = 'Linux/UNIX';

    // When
    const instance = await Instance.findById(expectedInstanceId);

    // Then
    expect(instance.id).toEqual(expectedInstanceId);
    expect(instance.name).toEqual(expectedInstanceName);
    expect(instance.keyName).toEqual(expectedInstanceKeyName);
    expect(instance.platform).toEqual(expectedInstancePlatform);
});

test('findById_NonExistingInstance_ThrowException', async () => {
    // Given
	const wrongInstanceId = 'instance-id-which-does-not-exist';

	// When
    expect(async () => await Instance.findById(wrongInstanceId)).rejects.toThrow(InstanceNotFoundException);

	// Then
	// Exception is thrown
});

test('getKeyPair_ExistingInstance_Success', async () => {
    // Given
    const expectedInstanceId = 'i-03d46dee061af282b';
    const expectedInstanceKeyName = 'test';

    // When
    const instance = await Instance.findById(expectedInstanceId);
    const keyPair = await instance.getKeyPair();

    // Then
    expect(instance.id).toEqual(expectedInstanceId);
    expect(instance.keyName).toEqual(keyPair.name);
});