const Vpc = require("../Vpc.js");
const VpcNotFoundException = require('../exceptions/VpcNotFoundException.js');

test('find_ExistingVpcHavingSubnet_Success', async () => {
    // Given
    const expectedVpcId = 'vpc-08584e8bf7e83d040';
    const expectedVpcIpRange = '10.0.0.0/24';
    const expectedSubnetIds = ['subnet-00ebe6783616bc17c'];

    // When
    const vpc = await Vpc.find(expectedVpcId);

    // Then
    expect(vpc.id).toEqual(expectedVpcId);
    expect(vpc.ipRange).toEqual(expectedVpcIpRange);

    for (let i = 0; i < expectedSubnetIds.length; i++) {
        expect(vpc.subnets[i].id).toEqual(expectedSubnetIds[i]);
    }
});

test('find_NonExistingVpc_ThrowException', () => {
	// Given
	const wrongVpcId = 'vpc-id-which-does-not-exist';

	// When
    expect(async () => await Vpc.find(wrongVpcId)).rejects.toThrow(VpcNotFoundException);

	// Then
	// Exception is thrown
});
