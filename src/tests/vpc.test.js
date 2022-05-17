const Vpc = require('../Vpc.js');
const VpcNotFoundException = require('../exceptions/VpcNotFoundException.js');

describe('Vpc', () => {
    test('find_ExistingVpc_Success', async () => {
        // Given
        const expectedVpcId = 'vpc-08584e8bf7e83d040';
        const expectedVpcIpRange = '10.0.0.0/24';

        // When
        const vpc = await Vpc.find(expectedVpcId);

        // Then
        expect(vpc.id).toEqual(expectedVpcId);
        expect(vpc.ipRange).toEqual(expectedVpcIpRange);
    });

    test('find_NonExistingVpc_ThrowException', () => {
        // Given
        const wrongVpcId = 'vpc-id-which-does-not-exist';

        // When
        expect(async () => await Vpc.find(wrongVpcId)).rejects.toThrow(VpcNotFoundException);

        // Then
        // Exception is thrown
    });

    test('subnets_ExistingVpc_Success', async () => {
        // Given
        const givenVpcId = 'vpc-08584e8bf7e83d040';
        const expectedSubnetIds = ['subnet-00ebe6783616bc17c'];

        // When
        const vpc = await Vpc.find(givenVpcId);
        const subnets = await vpc.subnets;

        // Then
        for (let i = 0; i < expectedSubnetIds.length; i++) {
            expect(subnets[i].id).toEqual(expectedSubnetIds[i]);
        }
    });

    test('securityGroups_ExistingVpc_Success', async () => {
        // Given
        const expectedVpcId = 'vpc-08584e8bf7e83d040';
        const vpc = await Vpc.find(expectedVpcId);

        // When
        const securityGroups = await vpc.securityGroups;

        // Then
        expect(securityGroups.length).toBeGreaterThan(0);
    });
});
