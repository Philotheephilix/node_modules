// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./SampleSupplyToken.sol";

contract TokenFactory is Ownable {
    event ProductRegistered(address indexed farmer, address tokenAddress, string ProductName, uint256 quantity);
    
    mapping(address => address[]) public farmerTokens;
    address[] public allTokens;

    constructor() Ownable(msg.sender) {}

    function registerProduct(string memory name, string memory symbol, uint256 quantity) external {
        ProductToken token = new ProductToken(
            name,
            symbol,
            msg.sender,
            quantity,
            address(this)
        );
        
        farmerTokens[msg.sender].push(address(token));
        allTokens.push(address(token));
        
        emit ProductRegistered(msg.sender, address(token), name, quantity);
    }

    function getAllTokens() external view returns (address[] memory) {
        return allTokens;
    }
}