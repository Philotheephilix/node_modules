// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SupplyChainToken is ERC20, Ownable {
    // Metadata about the produce
    string public produceName;
    string public produceType;
    string public origin;
    uint256 public harvestDate;
    address public farmer;
    bool public isOrganic;
    uint256 public sustainabilityScore;

    // Quality verification data
    struct QualityCheck {
        address inspector;
        uint256 timestamp;
        string report;
        uint8 score; // 0-100
        bool passed;
    }
    QualityCheck[] public qualityChecks;

    // Supply chain tracking
    struct Transfer {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string location;
        string condition;
    }
    Transfer[] public transfers;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        string memory _produceName,
        string memory _produceType,
        string memory _origin,
        uint256 _harvestDate,
        address _farmer,
        bool _isOrganic,
        uint256 _sustainabilityScore
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        produceName = _produceName;
        produceType = _produceType;
        origin = _origin;
        harvestDate = _harvestDate;
        farmer = _farmer;
        isOrganic = _isOrganic;
        sustainabilityScore = _sustainabilityScore;

        // Mint initial supply to farmer
        _mint(_farmer, _initialSupply);
    }

    // Transfer with supply chain tracking
    function transferWithTracking(
        address to,
        uint256 amount,
        string memory location,
        string memory condition
    ) public returns (bool) {
        require(amount > 0, "Amount must be greater than 0");
        require(to != address(0), "Cannot transfer to zero address");

        // Record the transfer
        transfers.push(
            Transfer({
                from: msg.sender,
                to: to,
                amount: amount,
                timestamp: block.timestamp,
                location: location,
                condition: condition
            })
        );

        // Perform the transfer
        return transfer(to, amount);
    }

    // Quality check recording
    function addQualityCheck(
        string memory report,
        uint8 score,
        bool passed
    ) public {
        require(score <= 100, "Score must be between 0 and 100");
        
        qualityChecks.push(
            QualityCheck({
                inspector: msg.sender,
                timestamp: block.timestamp,
                report: report,
                score: score,
                passed: passed
            })
        );
    }

    // Burn tokens when produce is sold to consumer or disposed
    function burnFromRetailer(uint256 amount) public {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        _burn(msg.sender, amount);
    }

    // View functions
    function getTransferHistory() public view returns (Transfer[] memory) {
        return transfers;
    }

    function getQualityChecks() public view returns (QualityCheck[] memory) {
        return qualityChecks;
    }

    function getProduceInfo() public view returns (
        string memory _produceName,
        string memory _produceType,
        string memory _origin,
        uint256 _harvestDate,
        address _farmer,
        bool _isOrganic,
        uint256 _sustainabilityScore
    ) {
        return (
            produceName,
            produceType,
            origin,
            harvestDate,
            farmer,
            isOrganic,
            sustainabilityScore
        );
    }
} 