var Rating = artifacts.require("./Rating.sol");

contract("Rating", function (accounts) {
    // var ratingInstance;

    // testing with amount of initial tenants in the app
    it("initializes with four tenants", function () {
        return Rating.deployed().then(function (instance) {
            return instance.tenantsCount();
        }).then(function (count) {
            assert.equal(count, 4);
        });
    });

});