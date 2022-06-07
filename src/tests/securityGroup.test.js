const SecurityGroupHelper = require('../SecurityGroupHelper.js');

describe('SecurityGroupHelper', () => {
    /** @type {SecurityGroupHelper} */
    let securityGroup;
    /** @type {string} */
    let securityGroupName;

    beforeAll(() => {
        securityGroup = new SecurityGroupHelper();
        securityGroupName = '';
    });

    test('exists_ExistingInstance_Success', async () => {
        // Given
        securityGroupName = 'default';

        // When
        const result = await securityGroup.exists(securityGroupName);

        // Then
        expect(result).toBeTruthy();
    })

    test('exists_NonExistingInstance_Success', async () => {
        // Given
        securityGroupName = 'non-existing';

        // When
        const result = await securityGroup.exists(securityGroupName);

        // Then
        expect(result).toBeFalsy();
    });

    test('describe_ExistingSecurityGroupName_Success', async () => {
        // Given
        securityGroupName = 'default';
        const securityGroupDescription = 'default VPC security group';
        const vpcName = 'vpc-deliver';

        // When
        const securityGroups = await securityGroup.describe(vpcName, securityGroupName);

        // Then
        const actualSecurityGroup = securityGroups.find(sg => sg.GroupName === securityGroupName);
        expect(actualSecurityGroup.GroupName).toBe(securityGroupName);
        expect(actualSecurityGroup.Description).toBe(securityGroupDescription);
        expect(actualSecurityGroup.IpPermissions.length).toBeGreaterThan(0);
        expect(actualSecurityGroup.IpPermissionsEgress.length).toBeGreaterThan(0);
    });

    test('describe_NonExistingSecurityGroupName_Success', async () => {
        // Given
        securityGroupName = 'non-existing';
        const vpcName = 'vpc-deliver';

        // When
        const securityGroups = await securityGroup.describe(vpcName, securityGroupName);

        // Then
        expect(securityGroups).toEqual([]);
    });
});
