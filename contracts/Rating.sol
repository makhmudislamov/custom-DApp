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

     /// storing tenant count
     uint public tenantsCount;
     
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

 }