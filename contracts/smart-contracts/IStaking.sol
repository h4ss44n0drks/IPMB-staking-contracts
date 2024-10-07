// SPDX-License-Identifier: MIT

/**
 *
 * @title Interface of the IPMB Staking contract
 */

pragma solidity ^0.8.5;

interface IStaking {

    function getDiscount(uint256 _poolID, address _address, uint256 _index) external view returns (uint256);

    function poolStatus(uint256 _poolID) external view returns (bool);

    function poolAmountPerAddress(uint256 _poolID, address _address, uint256 _index) external view returns (uint256);

    function updateAddressPool(address _address, uint256 _poolID, uint256 _index) external; 

    function poolDataPerAddress(uint256 _poolID, address _address, uint256 _index) external view returns (uint256, uint256, uint256, uint256, uint256);

    function poolIPMBPricePerAddress(uint256 _poolID, address _address, uint256 _index) external view returns (uint256);

    function poolGoldPricePerAddress(uint256 _poolID, address _address, uint256 _index) external view returns (uint256);

    function poolEpochPerAddress(uint256 _poolID, address _address, uint256 _index) external view returns (uint256);

    function poolPrice(uint256 _poolID) external view returns (uint256);

    function retrieveKYCStatus(address _address) external view returns (bool);

    function retrieveBlackListStatus(address _address) external view returns (bool);

}