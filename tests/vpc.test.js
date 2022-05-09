const AWS = require('aws-sdk');
const ec2 = new AWS.EC2({region: 'eu-west-3'});

const Vpc = require("../Vpc.js");


test('describeVpcWithSubnets_ExistingVpcHavingSubnet_Success', () => {
    // Given
    const expectedVpcId = 'vpc-0970d7e47ed499d75';
    const expectedVpcIpRange = '128.1.1.1/16';
    const expectedSubnetIds = ['subnet-0970d7e47ed499d75', 'subnet-0970d7e47ed499d76'];
    const vpc = new Vpc(expectedVpcId);
    
    // When
    const description = vpc.describeVpcWithSubnets();

    // Then
    expect(vpc.id).toEqual(expectedVpcId);
    expect(vpc.ipRange).toEqual(expectedVpcIpRange);
    vpc.subnets.forEach(subnet => {
        expect(expectedSubnetIds).toContain(subnet.id);
    });
});

/**
 * @description This test validates
 *              Test case : 
 */
test('describeVpcWithSubnets_ExistingVpcWithoutSubnet_Success', () => {
    // Given
    const vpcId = 'vpc-0970d7e47ed499d75';
    const expectedVpcIpRange = '128.1.1.1/16';
    const expectedSubnetIds = [];

    // When
    const actualVpc = null;
    const actualSubnetIds = actualVpc.subnets;

    // Then
    expect(actualVpc.id).toEqual(vpcId);
    expect(actualVpc.ipRange).toEqual(expectedVpcIpRange);
    expect(actualSubnetIds).toEqual(expect.arrayContaining(expectedSubnetIds));
});

/**
 * @description This test validates
 *              Test case : 
 */
test('describeVpcWithSubnets_NonExistingVpc_ThrowException', () => {
    // Given
    const wrongVpcId = 'yad7asdko6kokp512qo2';

    // When
    expect(() => new Vpc(expectedVpcId)).toThrow(FileNotFoundException)

    // Then
    // Exception is thrown

});
