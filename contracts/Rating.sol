pragma solidity ^0.5.0;

/**
 * @title Rating
 * Creature - a contract for rating tenants
 */

 contract Rating {
     /// state variable tenant
     string public tenant;
     
     /// constructor
     constructor () public {
         tenant = "Max Payne";

     }

 }