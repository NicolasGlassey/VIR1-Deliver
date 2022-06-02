const InstanceHelper = require("../InstanceHelper.js");
const InstanceNotFoundException = require('../exceptions/instance/InstanceNotFoundException.js');

describe('Instance', () => {
    test('describe_ExistingInstance_Success', async () => {
        // Given
        const expectedInstanceName = 'debian';
        const expectedInstanceKeyName = 'test';
        const expectedInstancePlatform = 'Linux/UNIX';

        // When
        const instance = await InstanceHelper.describe(expectedInstanceName);

        // Then
        expect(instance.Tags[0].Value).toEqual(expectedInstanceName);
        expect(instance.KeyName).toEqual(expectedInstanceKeyName);
        expect(instance.PlatformDetails).toEqual(expectedInstancePlatform);
    });

    test('describe_NonExistingInstance_ThrowsException', async () => {
        // Given
        const expectedInstanceName = 'non-existing-instance';

        // When
        await expect(InstanceHelper.describe(expectedInstanceName)).rejects.toThrow(InstanceNotFoundException);

        // Then
    });

    test('exists_ExistingInstance_Success', async () => {
        // Given
        const expectedInstanceName = 'debian';

        // When
        expect(await InstanceHelper.exists(expectedInstanceName)).toEqual(true);

        // Then
    });

    test('exists_NonExistingInstance_Success', async () => {
        // Given
        const expectedInstanceName = 'non-existing-instance';

        // When
        expect(await InstanceHelper.exists(expectedInstanceName)).toEqual(false);

        // Then
    });
});
