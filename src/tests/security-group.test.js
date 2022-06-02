const SecurityGroupHelper = require('../SecurityGroupHelper.js');

//TODO NGY naming convention (file name with "-" ?)

//TODO NGY create exists method first
//TODO NGY add, remove, list rules

describe('SecurityGroupHelper', () => {
    test('describe_BasicCase_Success', async () => {
        // Given
        const expectedName = 'default';
        const expectedDescription = 'default VPC security group';
        const vpcName = 'vpc-deliver';

        // When
        const securityGroups = await SecurityGroupHelper.describe(vpcName);

        // Then
        expect(securityGroups[0].GroupName).toBe(expectedName);
        expect(securityGroups[0].Description).toBe(expectedDescription);
    });
});
