// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {SelfVerificationRoot} from "@selfxyz/contracts/contracts/abstract/SelfVerificationRoot.sol";
import {ISelfVerificationRoot} from "@selfxyz/contracts/contracts/interfaces/ISelfVerificationRoot.sol";
import {IVcAndDiscloseCircuitVerifier} from "@selfxyz/contracts/contracts/interfaces/IVcAndDiscloseCircuitVerifier.sol";
import {IIdentityVerificationHubV1} from "@selfxyz/contracts/contracts/interfaces/IIdentityVerificationHubV1.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CircuitConstants} from "@selfxyz/contracts/contracts/constants/CircuitConstants.sol";

contract StockRootVerifier is SelfVerificationRoot, Ownable {
    
    mapping(uint256 => bool) internal _nullifiers;
    
    // Mapping to store user verification status
   
    
    // Mapping to track registered users for two-step verification
    mapping(address => bool) public registeredUsers;
    
    // Define verification status struct
    
    
    // Minimum score required for verification
    
    // Events
    event UserVerified(address indexed user, uint256 score);
    event UserRegistered(address indexed user);
    event VerificationFailed(address indexed user, string reason);
    
    // Errors
    error RegisteredNullifier();
    error ScoreTooLow(uint256 score, uint256 threshold);
    error OFACSanctioned();
    error UserNotRegistered();
    
    constructor(
        address _identityVerificationHub, 
        uint256 _scope, 
        uint256 _attestationId,
        bool _olderThanEnabled,
        uint256 _olderThan,
        bool _forbiddenCountriesEnabled,
        uint256[4] memory _forbiddenCountriesListPacked,
        bool[3] memory _ofacEnabled
    )
        SelfVerificationRoot(
            _identityVerificationHub, 
            _scope, 
            _attestationId, 
            _olderThanEnabled,
            _olderThan,
            _forbiddenCountriesEnabled,
            _forbiddenCountriesListPacked,
            _ofacEnabled
        )
        Ownable(_msgSender())
    {}

    /*
    - register with verifySelfProof like mapping (address => bool)
    - register score or isClient for that address in the other function
    */
    
    // Step 1: Verify the Self proof and register the user
    function verifySelfProof(
        IVcAndDiscloseCircuitVerifier.VcAndDiscloseProof memory proof
    )
        public
        override
    {
        if (_scope != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_SCOPE_INDEX]) {
            revert InvalidScope();
        }

        if (_attestationId != proof.pubSignals[CircuitConstants.VC_AND_DISCLOSE_ATTESTATION_ID_INDEX]) {
            revert InvalidAttestationId();
        }
        
        IIdentityVerificationHubV1.VcAndDiscloseVerificationResult memory result = _identityVerificationHub.verifyVcAndDisclose(
            IIdentityVerificationHubV1.VcAndDiscloseHubProof({
                olderThanEnabled: _verificationConfig.olderThanEnabled,
                olderThan: _verificationConfig.olderThan,
                forbiddenCountriesEnabled: _verificationConfig.forbiddenCountriesEnabled,
                forbiddenCountriesListPacked: _verificationConfig.forbiddenCountriesListPacked,
                ofacEnabled: _verificationConfig.ofacEnabled,
                vcAndDiscloseProof: proof
            })
        );        
        // Register the user for step 2
        address userAddress = address(uint160(result.userIdentifier));
        registeredUsers[userAddress] = true;
        
        // Emit registration event
        emit UserRegistered(userAddress);
    }
    
    // Step 2: Complete verification with score and client status
   
    
    // Check if a user is registered
    function isUserRegistered(address user) external view returns (bool) {
        return registeredUsers[user];
    }
} 