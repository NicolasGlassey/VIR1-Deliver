const Instance = require("../Instance.js");
const InstanceNotFoundException = require('../exceptions/instance/InstanceNotFoundException.js');

//TODO NGY - using before all / each


describe('Instance', () => {
    //TODO NGY findbyId must be private. Rewrite it as "exists(instanceName)"
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

    //TODO NGY findbyId must be private. Rewrite it as "exists(instanceName)"
    test('findById_NonExistingInstance_ThrowException', async () => {
        // Given
        const wrongInstanceId = 'instance-id-which-does-not-exist';

        // When
        expect(async () => await Instance.findById(wrongInstanceId)).rejects.toThrow(InstanceNotFoundException);

        // Then
        // Exception is thrown
    });

    //TODO NGY - why are you testing keypair method in instance test file ?
    test('keyPair_ExistingInstance_Success', async () => {
        // Given
        const expectedInstanceId = 'i-03d46dee061af282b';

        // When
        const instance = await Instance.findById(expectedInstanceId);
        const keyPair = await instance.keyPair;

        // Then
        expect(instance.id).toEqual(expectedInstanceId);
        expect(instance.keyName).toEqual(keyPair.name);
    });

    //TODO NGY - move this test in the correct test file
    test('findByVpcId_ExistingVpcId_Success', async () => {
        // Given
        const expectedInstanceId = 'i-03d46dee061af282b';
        const expectedInstanceKeyName = 'test';
        const expectedInstanceName = 'debian';
        const expectedInstancePlatform = 'Linux/UNIX';

        const vpcId = 'vpc-08584e8bf7e83d040';

        // When
        const instance = await Instance.findById(expectedInstanceId);
        const vpc = await instance.vpc;

        // Then
        expect(instance.id).toEqual(expectedInstanceId);
        expect(instance.name).toEqual(expectedInstanceName);
        expect(instance.keyName).toEqual(expectedInstanceKeyName);
        expect(instance.platform).toEqual(expectedInstancePlatform);
        expect(vpc.id).toEqual(vpcId);
    });

    //TODO NGY - move this test in the correct test file
    test('findByVpcId_ExistingVpcId_Success', async () => {
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

});

//TODO NGY - using after all / each
