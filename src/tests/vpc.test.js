const Vpc = require("../Vpc.js");
const NonExistingVpcException = require("../exceptions/NonExistingVpcException.js");

test('describeVpcWithSubnets_ExistingVpcHavingSubnet_Success', () => {
    // Given
    const expectedVpcId = 'vpc-0970d7e47ed499d75';
    const expectedVpcIpRange = '128.1.1.1/16';
    const expectedSubnetIds = [
        'subnet-0970d7e47ed499d75', 
        'subnet-0970d7e47ed499d76'
    ];

    // When
    const vpc = new Vpc(expectedVpcId);

    // Then
    expect(vpc.id).toEqual(expectedVpcId);
    expect(vpc.ipRange).toEqual(expectedVpcIpRange);
    vpc.subnets.forEach(subnet => {
        expect(subnet).toEqual(expectedSubnetIds.shift());
    });
});

test('describeVpcWithSubnets_ExistingVpcWithoutSubnet_Success', () => {
    // Given
    const vpcId = 'vpc-0970d7e47ed499d75';
    const expectedVpcIpRange = '128.1.1.1/16';
    const expectedVpcSubnetsLength = 0;

    // When
    const vpc = null;

    // Then
    expect(vpc.id).toEqual(vpcId);
    expect(vpc.ipRange).toEqual(expectedVpcIpRange);
    expect(vpc.subnets).toHaveLength(expectedVpcSubnetsLength);
});

test('describeVpcWithSubnets_NonExistingVpc_ThrowException', () => {
    // Given
    const wrongVpcId = 'yad7asdko6kokp512qo2';

    // When
    expect(() => new Vpc(expectedVpcId)).toThrow(NonExistingVpcException)

    // Then
    // Exception is thrown
});
