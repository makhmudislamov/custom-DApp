pragma solidity ^0.5.0;

/**
 * @title Rating - rating for tenants by landlords/landladies
 * @author Makhmud Islamov
 * @notice You can use this contract for only the most basic simulation
 * Creature - a contract for rating tenants
 */


 contract Rating {

     /// Model: Tenant
     struct Tenant {
         uint id;
         string name;
         uint rateCount;
     }

     /// Fetching tenants: persisting tenants into storage
     mapping(uint => Tenant) public tenants;

     /// Storing accounts that rated the tenants
     mapping(address => bool) public raters;

     /// storing tenant count
     uint public tenantsCount;
     

    /// event of leaving a rating
    event ratedEvent (
        uint indexed _tenantId
    );

     /// constructor
     constructor () public {
         /// adding tenants
         addTenant("Max Payne");
         addTenant("John Wick");
         addTenant("Jack Reacher");
         addTenant("Lara Croft");

     }

    /// adding new Tenants to the app
    function addTenant (string memory _name) private {
        tenantsCount ++;
        tenants[tenantsCount] = Tenant(tenantsCount, _name, 0);
    }

    /// increasing the rating of a candidate
    function rate (uint _tenantId) public {
        /// @notice this is very basic function
        /// landlord/lady can rate only once
        require(!raters[msg.sender]);

        // require a valid candidate
        require(_tenantId > 0 && _tenantId <= tenantsCount);

        // record that voter has voted
        raters[msg.sender] = true;

        // update candidate vote Count
        tenants[_tenantId].rateCount ++;

        // trigger voted event
        emit ratedEvent(_tenantId);
    }

 }