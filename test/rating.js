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
            assert.equal(receipt.logs[0].args._tenantId.toNumber(), tenantId, "the candidate id is correct");
            return ratingInstance.raters(accounts[0]);
        }).then(function (rated) {
            assert(rated, "the voter was marked as rated");
            return ratingInstance.tenants(tenantId);
        }).then(function (tenant) {
            var rateCount = tenant[2];
            assert.equal(rateCount, 1, "increments the tenant's vote count");
        })
    });

});