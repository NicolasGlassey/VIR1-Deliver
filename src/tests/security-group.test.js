const SecurityGroup = require('../SecurityGroup');

describe('Security Group', () => {
    test('all_BasicCase_Success', async () => {
        // Given
        const expectedId = 'sg-004f6547219fdef6c';
        const expectedDescription = 'launch-wizard-2 created 2020-12-04T08:21:57.536+01:00';

        // When
        const securityGroups = await SecurityGroup.all();

        // Then
        expect(securityGroups[1].id).toBe(expectedId);
        expect(securityGroups[1].description).toBe(expectedDescription);
    });
});
