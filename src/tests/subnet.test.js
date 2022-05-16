const Subnet = require('../Subnet.js');

describe('Subnet', () => {
	test('all_ExistingVpc_Success', async () => {
		// Given
		const givenVpcId = 'vpc-08584e8bf7e83d040';
		const expectedSubnetIds = ['subnet-00ebe6783616bc17c'];

		// When
		const subnets = await Subnet.all(givenVpcId);

		// Then
		for (let i = 0; i < expectedSubnetIds.length; i++) {
			expect(subnets[i].id).toEqual(expectedSubnetIds[i]);
		}
	});

	test('all_NonExistingVpc_ThrowException', async () => {
		// Given
		const wrongVpcId = 'vpc-id-which-does-not-exist';
		const expectedSubnetIds = [];

		// When
		const subnets = await Subnet.all(wrongVpcId);

		// Then
		expect(subnets).toEqual(expectedSubnetIds);
	});
});