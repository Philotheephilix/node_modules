// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./FoodChainToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenFactory is AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    bytes32 public constant INSPECTOR_ROLE = keccak256("INSPECTOR_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");

    // Mapping from token address to boolean indicating if it was created by this factory
    mapping(address => bool) public isTokenRegistered;
    
    // Array to store all created tokens
    address[] public allTokens;

    // Events
    event TokenCreated(
        address indexed tokenAddress,
        string produceName,
        address indexed farmer,
        uint256 amount
    );
    event RoleGranted(address indexed account, bytes32 indexed role);
    event RoleRevoked(address indexed account, bytes32 indexed role);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // Create new token for a produce batch
    function createToken(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        string memory produceName,
        string memory produceType,
        string memory origin,
        uint256 harvestDate,
        bool isOrganic,
        uint256 sustainabilityScore
    ) public returns (address) {
        require(hasRole(FARMER_ROLE, msg.sender), "Must have farmer role to create token");

        // Create new token contract
        FoodChainToken token = new FoodChainToken(
            name,
            symbol,
            initialSupply,
            produceName,
            produceType,
            origin,
            harvestDate,
            msg.sender,
            isOrganic,
            sustainabilityScore
        );

        // Register the token
        isTokenRegistered[address(token)] = true;
        allTokens.push(address(token));

        emit TokenCreated(address(token), produceName, msg.sender, initialSupply);
        return address(token);
    }

    // Role management functions
    function grantFarmerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(FARMER_ROLE, account);
        emit RoleGranted(account, FARMER_ROLE);
    }

    function grantSupplierRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(SUPPLIER_ROLE, account);
        emit RoleGranted(account, SUPPLIER_ROLE);
    }

    function grantRetailerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(RETAILER_ROLE, account);
        emit RoleGranted(account, RETAILER_ROLE);
    }

    function grantInspectorRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(INSPECTOR_ROLE, account);
        emit RoleGranted(account, INSPECTOR_ROLE);
    }

    function grantGovernmentRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(GOVERNMENT_ROLE, account);
        emit RoleGranted(account, GOVERNMENT_ROLE);
    }

    // View functions
    function getAllTokens() public view returns (address[] memory) {
        return allTokens;
    }

    function getTokenCount() public view returns (uint256) {
        return allTokens.length;
    }

    function isValidToken(address tokenAddress) public view returns (bool) {
        return isTokenRegistered[tokenAddress];
    }
} 