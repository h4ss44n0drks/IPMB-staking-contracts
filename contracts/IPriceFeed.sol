// SPDX-License-Identifier: MIT

/**
 *
 *  @title: IPMB Price Feed Interface for IPMB and Gold prices
 *  @date: 20-September-2024
 *  @version: 1.9
 *  @author: IPMB Dev Team
 */

pragma solidity ^0.8.5;

interface IPriceFeed {

    function getLatestPrices() external view returns (uint256, uint256, uint256, bytes32, uint256);

    function getEpochPrices(uint256 _epoch) external view returns (uint256, uint256, bytes32, uint256);

    function getEpochDatasetHash(uint256 _epoch) external view returns (bytes32);

}