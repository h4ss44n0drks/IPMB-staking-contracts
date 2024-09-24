// SPDX-License-Identifier: MIT

/**
 *
 *  @title: IPMB Price Feed Contract
 *  @date: 20-September-2024
 *  @version: 1.9
 *  @author: IPMB Dev Team
 */

import "./openzeppelin/Ownable.sol";
import "./openzeppelin/Strings.sol";

pragma solidity ^0.8.19;

contract PriceFeed is Ownable {

    // mappings declaration

    mapping (address => bool) public admin;
    mapping (uint256 => uint256) public ipmb;
    mapping (uint256 => uint256) public gold;
    mapping (uint256 => bytes32) public epochAvgPriceHash;
    mapping (uint256 => bytes32) public epochDataSetHash;
    mapping (uint256 => uint256) public epochTS;

    // variables declaration

    using Strings for uint256;
    uint256 public nextEpoch;
    uint256 public latestTS;
    uint256 public epochInterval;

    // modifiers
    
    modifier onlyAdmin() {
        require(admin[msg.sender] == true, "Not allowed");
        _;
    }

    // events

    event EpochData(uint256 indexed epoch, uint256 indexed ipmb, uint256 indexed gold, bytes32 avgpricehash, bytes32 datasethash, uint256 ts);

    // constructor

    constructor(uint256 _ipmb, uint256 _gold, bytes32 _epochDataSetHash, uint256 _epochInterval) {
        admin[msg.sender] = true;
        ipmb[0] = _ipmb;
        gold[0] = _gold;
        epochAvgPriceHash[0] = keccak256((abi.encodePacked(_ipmb.toString() , _gold.toString())));
        epochDataSetHash[0] = _epochDataSetHash;
        epochTS[0] = block.timestamp;
        latestTS = block.timestamp;
        epochInterval = _epochInterval;
        emit EpochData(0, ipmb[0], gold[0], epochAvgPriceHash[0], epochDataSetHash[0], epochTS[0]);
        nextEpoch = nextEpoch + 1;
    }

    // set epoch data

    function setData(uint256 _ipmb, uint256 _gold, bytes32 _epochDataSetHash) public onlyAdmin {
        require (block.timestamp >= latestTS + epochInterval, "1 epoch per interval"); 
        uint256 curEpoch = nextEpoch;
        ipmb[curEpoch] = _ipmb;
        gold[curEpoch] = _gold;
        epochAvgPriceHash[curEpoch] = keccak256((abi.encodePacked(_ipmb.toString() , _gold.toString())));
        epochDataSetHash[curEpoch] = _epochDataSetHash;
        epochTS[curEpoch] = block.timestamp;
        latestTS = block.timestamp;
        emit EpochData(curEpoch, ipmb[curEpoch], gold[curEpoch], epochAvgPriceHash[curEpoch], epochDataSetHash[curEpoch], epochTS[curEpoch]);
        nextEpoch = nextEpoch + 1;
    }

    // retrieve data for latest epoch

    function getLatestPrices() public view returns (uint256, uint256, uint256, bytes32, uint256) {
        uint256 latest = nextEpoch - 1;
        return (latest, ipmb[latest], gold[latest], epochAvgPriceHash[latest], epochTS[latest]);
    }

    // retrieve data for specific epoch

    function getEpochPrices(uint256 _epoch) public view returns (uint256, uint256, bytes32, uint256) {
        return (ipmb[_epoch], gold[_epoch], epochAvgPriceHash[_epoch], epochTS[_epoch]);
    }

    // retrieve data for specific epoch

    function getEpochDatasetHash(uint256 _epoch) public view returns (bytes32) {
        return (epochDataSetHash[_epoch]);
    }

    // update admin status

    function updateAdminStatus(address _address, bool _st) public onlyOwner() {
        admin[_address] = _st;
    }

    // update epoch interval

    function updateEpochInterval(uint256 _epochInterval) public onlyOwner() {
        epochInterval = _epochInterval;
    }

}