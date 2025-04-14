// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./SupplyChainToken.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract TokenFactory is AccessControl {
    bytes32 public constant FARMER_ROLE = keccak256("FARMER_ROLE");
    bytes32 public constant SUPPLIER_ROLE = keccak256("SUPPLIER_ROLE");
    bytes32 public constant RETAILER_ROLE = keccak256("RETAILER_ROLE");
    bytes32 public constant CONSUMER_ROLE = keccak256("CONSUMER_ROLE");
    bytes32 public constant GOVERNMENT_ROLE = keccak256("GOVERNMENT_ROLE");
    bytes32 public constant WASTE_ROLE = keccak256("WASTE_ROLE");

    // Mapping from token address to boolean indicating if it was created by this factory
    mapping(address => bool) public isTokenRegistered;
    
    // Array to store all created tokens
    address[] public allTokens;

    // Role-based user tracking
    mapping(bytes32 => address[]) public roleUsers;

    // User details struct
    struct UserDetails {
        string name;
        string location;
        uint256 registrationDate;
        bool isVerified;
        uint256 reputationScore;
        bytes32 role;
    }
    mapping(address => UserDetails) public users;

    // Inventory tracking
    struct InventoryItem {
        address tokenAddress;
        uint256 amount;
    }
    mapping(address => InventoryItem[]) public inventory;

    // Transaction history
    struct Transaction {
        address tokenAddress;
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string transactionType; // "MINT", "TRANSFER", "BURN"
    }
    Transaction[] public transactions;

    // Events
    event TokenCreated(address indexed tokenAddress, string produceName, address indexed farmer, uint256 amount);
    event UserRegistered(address indexed user, bytes32 indexed role, string name);
    event TokenTransferred(address indexed token, address indexed from, address indexed to, uint256 amount);
    event TokenBurned(address indexed token, address indexed burner, uint256 amount);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GOVERNMENT_ROLE, msg.sender);
    }

    // User registration functions
    function registerUser(
        string memory name,
        string memory location,
        bytes32 role
    ) public {
        require(!hasAnyRole(msg.sender), "Already registered");
        require(
            role == FARMER_ROLE ||
            role == SUPPLIER_ROLE ||
            role == RETAILER_ROLE ||
            role == CONSUMER_ROLE,
            "Invalid role"
        );
        
        users[msg.sender] = UserDetails({
            name: name,
            location: location,
            registrationDate: block.timestamp,
            isVerified: false,
            reputationScore: 0,
            role: role
        });

        _grantRole(role, msg.sender);
        roleUsers[role].push(msg.sender);

        emit UserRegistered(msg.sender, role, name);
    }

    // Token creation and transfer functions
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
        require(hasRole(FARMER_ROLE, msg.sender), "Must be registered as farmer");
        require(users[msg.sender].isVerified, "Farmer not verified");

        SupplyChainToken token = new SupplyChainToken(
            name, symbol, initialSupply, produceName, produceType,
            origin, harvestDate, msg.sender, isOrganic, sustainabilityScore
        );

        isTokenRegistered[address(token)] = true;
        allTokens.push(address(token));

        // Add to farmer's inventory
        inventory[msg.sender].push(InventoryItem({
            tokenAddress: address(token),
            amount: initialSupply
        }));

        // Record transaction
        transactions.push(Transaction({
            tokenAddress: address(token),
            from: address(0),
            to: msg.sender,
            amount: initialSupply,
            timestamp: block.timestamp,
            transactionType: "MINT"
        }));

        emit TokenCreated(address(token), produceName, msg.sender, initialSupply);
        return address(token);
    }

    function transferToken(
        address tokenAddress,
        address to,
        uint256 amount
    ) public {
        require(isTokenRegistered[tokenAddress], "Invalid token");
        require(amount > 0, "Amount must be greater than 0");
        
        SupplyChainToken token = SupplyChainToken(tokenAddress);
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Validate transfer based on roles
        require(
            (hasRole(FARMER_ROLE, msg.sender) && hasRole(SUPPLIER_ROLE, to)) ||
            (hasRole(SUPPLIER_ROLE, msg.sender) && hasRole(RETAILER_ROLE, to)) ||
            (hasRole(RETAILER_ROLE, msg.sender) && hasRole(CONSUMER_ROLE, to)),
            "Invalid transfer path"
        );

        // Transfer tokens
        require(token.transfer(to, amount), "Transfer failed");

        // Update inventories
        updateInventory(msg.sender, tokenAddress, amount, false);
        updateInventory(to, tokenAddress, amount, true);

        // Record transaction
        transactions.push(Transaction({
            tokenAddress: tokenAddress,
            from: msg.sender,
            to: to,
            amount: amount,
            timestamp: block.timestamp,
            transactionType: "TRANSFER"
        }));

        emit TokenTransferred(tokenAddress, msg.sender, to, amount);
    }

    function burnToken(address tokenAddress, uint256 amount) public {
        require(hasRole(RETAILER_ROLE, msg.sender), "Only retailers can burn tokens");
        require(isTokenRegistered[tokenAddress], "Invalid token");
        
        SupplyChainToken token = SupplyChainToken(tokenAddress);
        require(token.balanceOf(msg.sender) >= amount, "Insufficient balance");

        // Burn tokens
        token.burnFromRetailer(amount);

        // Update inventory
        updateInventory(msg.sender, tokenAddress, amount, false);

        // Record transaction
        transactions.push(Transaction({
            tokenAddress: tokenAddress,
            from: msg.sender,
            to: address(0),
            amount: amount,
            timestamp: block.timestamp,
            transactionType: "BURN"
        }));

        emit TokenBurned(tokenAddress, msg.sender, amount);
    }

    // Government and admin functions
    function verifyUser(address user) public {
        require(
            hasRole(GOVERNMENT_ROLE, msg.sender) || hasRole(WASTE_ROLE, msg.sender),
            "Only government or waste management can verify users"
        );
        require(hasAnyRole(user), "User not registered");
        users[user].isVerified = true;
    }

    // View functions
    function getUsersByRole(bytes32 role) public view returns (address[] memory) {
        require(
            hasRole(GOVERNMENT_ROLE, msg.sender) || hasRole(WASTE_ROLE, msg.sender),
            "Only government or waste management can view all users"
        );
        return roleUsers[role];
    }

    function getUserInventory(address user) public view returns (InventoryItem[] memory) {
        require(
            msg.sender == user ||
            hasRole(GOVERNMENT_ROLE, msg.sender) ||
            hasRole(WASTE_ROLE, msg.sender),
            "Not authorized to view inventory"
        );
        return inventory[user];
    }

    function getTransactionHistory() public view returns (Transaction[] memory) {
        require(
            hasRole(GOVERNMENT_ROLE, msg.sender) ||
            hasRole(WASTE_ROLE, msg.sender) ||
            hasRole(CONSUMER_ROLE, msg.sender),
            "Not authorized to view transactions"
        );
        return transactions;
    }

    function getUserTransactions(address user) public view returns (Transaction[] memory) {
        require(
            msg.sender == user ||
            hasRole(GOVERNMENT_ROLE, msg.sender) ||
            hasRole(WASTE_ROLE, msg.sender),
            "Not authorized to view user transactions"
        );
        
        uint256 count = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].from == user || transactions[i].to == user) {
                count++;
            }
        }

        Transaction[] memory userTxs = new Transaction[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < transactions.length; i++) {
            if (transactions[i].from == user || transactions[i].to == user) {
                userTxs[index] = transactions[i];
                index++;
            }
        }

        return userTxs;
    }

    // Helper functions
    function hasAnyRole(address account) internal view returns (bool) {
        return (
            hasRole(FARMER_ROLE, account) ||
            hasRole(SUPPLIER_ROLE, account) ||
            hasRole(RETAILER_ROLE, account) ||
            hasRole(CONSUMER_ROLE, account) ||
            hasRole(GOVERNMENT_ROLE, account) ||
            hasRole(WASTE_ROLE, account)
        );
    }

    function updateInventory(
        address user,
        address tokenAddress,
        uint256 amount,
        bool isAddition
    ) internal {
        bool found = false;
        for (uint256 i = 0; i < inventory[user].length; i++) {
            if (inventory[user][i].tokenAddress == tokenAddress) {
                if (isAddition) {
                    inventory[user][i].amount += amount;
                } else {
                    inventory[user][i].amount -= amount;
                }
                found = true;
                break;
            }
        }

        if (!found && isAddition) {
            inventory[user].push(InventoryItem({
                tokenAddress: tokenAddress,
                amount: amount
            }));
        }
    }
} 