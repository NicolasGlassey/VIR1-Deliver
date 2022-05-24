const Vpc = require('../VpcHelper.js');
const VpcNotFoundException = require('../exceptions/vpc/VpcNotFoundException.js');

describe('Vpc', () => {
    test('describe_ExistingVpc_Success', async () => {
        // Given
        const expectedVpcName = 'vpc-paris';

        // When
        const vpc = await Vpc.describe(expectedVpcName);

        // Then
        expect(vpc.Name).toEqual(expectedVpcName);
    });

    test('describe_NonExistingVpc_ThrowException', async () => {
        // Given
        const wrongVpcName = 'vpc-name-which-does-not-exist';

        // When
		await expect(Vpc.describe(wrongVpcName)).rejects.toThrow(VpcNotFoundException);

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
