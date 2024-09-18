// SPDX-License-Identifier: MIT

/**
 *
 *  @title: IPMB Price Feed Contract
 *  @date: ??-September-2024
 *  @version: 1.8
 *  @author: IPMB Dev Team
 */

import "./Ownable.sol";
import "./Strings.sol";

pragma solidity ^0.8.19;

contract PriceFeed is Ownable {

    // mappings declaration

    mapping (address => bool) public admin;
    mapping (uint256 => uint256) public ipmb;
    mapping (uint256 => uint256) public gold;
    mapping (uint256 => bytes32) public epochHash;
    mapping (uint256 => uint256) public epochTS;

    // variables declaration

    using Strings for uint256;
    uint256 public nextEpoch;
    uint256 public latestTS;

    // modifiers
    
    modifier onlyAdmin() {
        require(admin[msg.sender] == true, "Not allowed");
        _;
    }

    // events

    event EpochData(uint256 indexed epoch, uint256 indexed ipmb, uint256 indexed gold, bytes32 hash, uint256 ts);

    // constructor

    constructor(uint256 _ipmb, uint256 _gold) {
        admin[msg.sender] = true;
        ipmb[0] = _ipmb;
        gold[0] = _gold;
        epochHash[0] = keccak256((abi.encodePacked(_ipmb.toString() , _gold.toString())));
        epochTS[0] = block.timestamp;
        latestTS = block.timestamp;
        emit EpochData(0, ipmb[0], gold[0], epochHash[0], epochTS[0]);
        nextEpoch = nextEpoch + 1;
    }

    // set epoch data

    function setData(uint256 _ipmb, uint256 _gold) public onlyAdmin {
        require (block.timestamp >= latestTS + 10, "1 epoch per day"); // 86400s --> 1 day
        uint256 curEpoch = nextEpoch;
        ipmb[curEpoch] = _ipmb;
        gold[curEpoch] = _gold;
        epochHash[curEpoch] = keccak256((abi.encodePacked(_ipmb.toString() , _gold.toString())));
        epochTS[curEpoch] = block.timestamp;
        latestTS = block.timestamp;
        emit EpochData(curEpoch, ipmb[curEpoch], gold[curEpoch], epochHash[curEpoch], epochTS[curEpoch]);
        nextEpoch = nextEpoch + 1;
    }

    // retrieve data for latest epoch

    function getLatestPrices() public view returns (uint256, uint256, uint256, bytes32, uint256) {
        uint256 latest = nextEpoch - 1;
        return (latest, ipmb[latest], gold[latest], epochHash[latest], epochTS[latest]);
    }

    // retrieve data for specific epoch

    function getEpochPrices(uint256 _epoch) public view returns (uint256, uint256, bytes32, uint256) {
        return (ipmb[_epoch], gold[_epoch], epochHash[_epoch], epochTS[_epoch]);
    }

    // update admin status

    function updateAdminStatus(address _address, bool _st) public onlyOwner() {
        admin[_address] = _st;
    }

}