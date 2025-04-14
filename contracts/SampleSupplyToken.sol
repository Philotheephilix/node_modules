// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ProductToken is ERC20, Ownable {
    address public factory;

    constructor(
        string memory name,
        string memory symbol,
        address farmer,
        uint256 initialSupply,
        address factoryAddress
    ) ERC20(name, symbol) Ownable(farmer) {
        factory = factoryAddress;
        _mint(farmer, initialSupply * 10 ** decimals());
    }

    // Removed all transfer restrictions
    // Inherits standard ERC20 transfer functionality

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}