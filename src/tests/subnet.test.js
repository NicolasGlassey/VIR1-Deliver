const Subnet = require('../Subnet.js');
const VpcNotFoundException = require('../exceptions/VpcNotFoundException.js');

test('find_ExistingVpc_Success', async () => {
	// Given
	const givenVpcId = 'vpc-08584e8bf7e83d040';
	const expectedSubnetIds = ['subnet-00ebe6783616bc17c'];

	// When
	const subnets = await Subnet.find(givenVpcId);

	// Then
	for (let i = 0; i < expectedSubnetIds.length; i++) {
		expect(subnets[i].id).toEqual(expectedSubnetIds[i]);
	}
});
