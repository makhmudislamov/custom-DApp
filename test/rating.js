var Rating = artifacts.require("./Rating.sol");

contract("Rating", function (accounts) {
    let ratingInstance;

    // testing with amount of initial tenants in the app
    it("initializes with four tenants", function () {
        return Rating.deployed().then(function (instance) {
            return instance.tenantsCount();
        }).then(function (count) {
            assert.equal(count, 4);
        });
    });

    // testing tenants' correct values
    it("it initializes the tenants with the correct values", function () {
        return Rating.deployed().then(function (instance) {
            ratingInstance = instance;
            return ratingInstance.tenants(1);
        }).then(function (tenant) {
            assert.equal(tenant[0], 1, "contains the correct id");
            assert.equal(tenant[1], "Max Payne", "contains the correct name");
            assert.equal(tenant[2], 0, "contains the correct rating count");
            return ratingInstance.tenants(2);
        }).then(function (tenant) {
            assert.equal(tenant[0], 2, "contains the correct id");
            assert.equal(tenant[1], "John Wick", "contains the correct name");
            assert.equal(tenant[2], 0, "contains the correct rating count");
            return ratingInstance.tenants(3);
        }).then(function (tenant) {
            assert.equal(tenant[0], 3, "contains the correct id");
            assert.equal(tenant[1], "Jack Reacher", "contains the correct name");
            assert.equal(tenant[2], 0, "contains the correct rating count");
            return ratingInstance.tenants(4);
        }).then(function (tenant) {
            assert.equal(tenant[0], 4, "contains the correct id");
            assert.equal(tenant[1], "Lara Croft", "contains the correct name");
            assert.equal(tenant[2], 0, "contains the correct rating count");
        });
    });
    
    // can landlord/lady rate a tenant?
    it("allows a lanlord to rate", function () {
        return Rating.deployed().then(function (instance) {
            ratingInstance = instance;
            tenantId = 1;
            return ratingInstance.rate(tenantId, { from: accounts[0] });
        }).then(function (receipt) {
            // comparing event type
            assert.equal(receipt.logs.length, 1, "an event was triggered");
            assert.equal(receipt.logs[0].event, "ratedEvent", "the event type is correct");
            assert.equal(receipt.logs[0].args._tenantId.toNumber(), tenantId, "the tenant id is correct");
            return ratingInstance.raters(accounts[0]);
        }).then(function (rated) {
            assert(rated, "the voter was marked as rated");
            return ratingInstance.tenants(tenantId);
        }).then(function (tenant) {
            var rateCount = tenant[2];
            assert.equal(rateCount, 1, "increments the tenant's rate count");
        })
    });

    // invalid tenants cannot have a rating
    it("throws an exception for invalid tenants", function () {
        return Rating.deployed().then(function (instance) {
            ratingInstance = instance;
            return ratingInstance.rate(99, { from: accounts[1] })
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return ratingInstance.tenants(1);
        }).then(function (tenant1) {
            var rateCount = tenant1[2];
            assert.equal(rateCount, 1, "tenant1 did not receive any votes");
            return ratingInstance.tenants(2);
        }).then(function (tenant2) {
            var rateCount = tenant2[2];
            assert.equal(rateCount, 0, "tenant 2 did not receive any votes");
        });
    });

    // double voting is not allowed
    it("throws an exception for double rating", function () {
        return Rating.deployed().then(function (instance) {
            ratingInstance = instance;
            tenantId = 2;
            ratingInstance.rate(tenantId, { from: accounts[1] });
            return ratingInstance.tenants(tenantId);
        }).then(function (tenant) {
            var rateCount = tenant[2];
            assert.equal(rateCount, 1, "accepts first rate");
            // Try to rate again
            return ratingInstance.rate(tenantId, { from: accounts[1] });
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
            return ratingInstance.tenants(1);
        }).then(function (tenant1) {
            var rateCount = tenant1[2];
            assert.equal(rateCount, 1, "tenant 1 did not receive any votes");
            return ratingInstance.tenants(2);
        }).then(function (tenant2) {
            var rateCount = tenant2[2];
            assert.equal(rateCount, 1, "tenant 2 did not receive any votes");
        });
    });

});