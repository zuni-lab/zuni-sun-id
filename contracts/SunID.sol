// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ISchemaRegistry, SchemaRecord} from "./ISchemaRegistry.sol";
import {ISchemaResolver} from "./ISchemaResolver.sol";
import {ISunID, Credential, CredentialRequest, RevocationRequest} from "./ISunID.sol";

/// @title SunID
/// @notice The SunID protocol.
contract SunID is ISunID {
    // The global schema registry.
    ISchemaRegistry private immutable _schemaRegistry;

    struct EnumerableCredential {
        Credential credential;
        uint256 index;
    }

    // The global mapping between credentials and their UIDs.
    mapping(bytes32 uid => EnumerableCredential credential) private _db;

    // The global mapping between data and their revocation timestamps.
    mapping(address revoker => mapping(bytes32 data => uint64 timestamp) timestamps) private _revocationsOffchain;

    // The global list of all credential UIDs.
    bytes32[] private _credentialUIDs;

    bytes32 internal constant EMPTY_UID = 0;
    uint64 internal constant NO_EXPIRATION_TIME = 0;

    /// @dev Creates a new SunID instance.
    /// @param registry The address of the global schema registry.
    constructor(ISchemaRegistry registry) {
        _schemaRegistry = registry;
    }

    /// @inheritdoc ISunID
    function getSchemaRegistry() external view returns (ISchemaRegistry) {
        return _schemaRegistry;
    }

    /// @inheritdoc ISunID
    function issue(CredentialRequest calldata request) external payable returns (bytes32) {
        address issuer = msg.sender;
        bytes32 schemaUID = request.schemaUID;

        // Ensure that we aren't attempting to credential to a non-existing schema.
        SchemaRecord memory schemaRecord = _schemaRegistry.getSchema(schemaUID);
        if (schemaRecord.uid == EMPTY_UID) revert SchemaNotFound();

        // Ensure that either no expiration time was set or that it was set in the future.
        if (request.expirationTime != NO_EXPIRATION_TIME && request.expirationTime <= _time()) {
            revert InvalidExpirationTime();
        }

        // Ensure that we aren't trying to make a revocable credential for a non-revocable schema.
        if (!schemaRecord.revocable && request.revocable) {
            revert Irrevocable();
        }

        Credential memory credential = Credential({
            uid: 0,
            schema: schemaUID,
            refUID: request.refUID,
            time: _time(),
            expirationTime: request.expirationTime,
            revocationTime: 0,
            recipient: request.recipient,
            issuer: issuer,
            revocable: request.revocable,
            data: request.data
        });

        // Look for the first non-existing UID (and use a bump seed/nonce in the rare case of a conflict).
        bytes32 uid;
        uint32 bump = 0;
        while (true) {
            uid = _getUID(credential, bump);
            if (_db[uid].credential.uid == 0) {
                break;
            }

            unchecked {
                ++bump;
            }
        }
        credential.uid = uid;

        _db[uid].credential = credential;
        _db[uid].index = _credentialUIDs.length;
        _credentialUIDs.push(uid);

        if (request.refUID != EMPTY_UID && !isCredentialValid(request.refUID)) {
            revert InvalidRefCredential();
        }

        if (
            address(schemaRecord.resolver) != address(0)
                && !ISchemaResolver(schemaRecord.resolver).issue{value: msg.value}(credential)
        ) {
            revert ResolverFailed();
        } else {
            _refund(msg.value);
        }

        emit Issued(request.recipient, issuer, uid, schemaUID);

        return uid;
    }

    /// @inheritdoc ISunID
    function revoke(RevocationRequest calldata request) external payable {
        address revoker = msg.sender;
        bytes32 schemaUID = request.schemaUID;

        // Ensure that a non-existing schema ID wasn't passed by accident.
        SchemaRecord memory schemaRecord = _schemaRegistry.getSchema(schemaUID);
        if (schemaRecord.uid == EMPTY_UID) revert SchemaNotFound();

        Credential memory credential = _db[request.credentialUID].credential;

        // Ensure that we aren't attempting to revoke a non-existing credential.
        if (credential.uid == EMPTY_UID) revert CredentialNotFound();

        // Ensure that a wrong schema ID wasn't passed by accident.
        if (credential.schema != schemaUID) revert SchemaMismatch();

        // Allow only original issuers to revoke their credentials.
        if (credential.issuer != revoker) revert UnauthorizedRevocation();

        // Please note that also checking of the schema itself is revocable is unnecessary, since it's not possible to
        // make revocable credentials to an irrevocable schema.
        if (!credential.revocable) revert Irrevocable();

        // Ensure that we aren't trying to revoke the same credential twice.
        if (credential.revocationTime != 0) revert AlreadyRevoked();

        _db[request.credentialUID].credential.revocationTime = _time();

        if (
            address(schemaRecord.resolver) != address(0)
                && !ISchemaResolver(schemaRecord.resolver).revoke{value: msg.value}(credential)
        ) {
            revert ResolverFailed();
        } else {
            _refund(msg.value);
        }

        emit Revoked(credential.recipient, revoker, request.credentialUID, schemaUID);
    }

    /// @inheritdoc ISunID
    function revokeOffchain(bytes32 data) external returns (uint64) {
        uint64 time = _time();

        _revokeOffchain(msg.sender, data, time);

        return time;
    }

    /// @inheritdoc ISunID
    function getCredential(bytes32 uid) external view returns (Credential memory) {
        return _db[uid].credential;
    }

    /// @inheritdoc ISunID
    function getCredentials(bytes32[] memory uids) external view returns (Credential[] memory) {
        Credential[] memory credentials = new Credential[](uids.length);
        for (uint256 i = 0; i < uids.length; i++) {
            credentials[i] = _db[uids[i]].credential;
        }
        return credentials;
    }

    /// @inheritdoc ISunID
    function getCredentialsInRange(uint256 from, uint256 to) external view returns (Credential[] memory) {
        Credential[] memory credentials = new Credential[](to - from);
        for (uint256 i = from; i < to; i++) {
            credentials[i - from] = _db[_credentialUIDs[i]].credential;
        }
        return credentials;
    }

    /// @inheritdoc ISunID
    function isCredentialValid(bytes32 uid) public view returns (bool) {
        return _db[uid].credential.uid != 0;
    }

    /// @inheritdoc ISunID
    function getRevokeOffchain(address revoker, bytes32 data) external view returns (uint64) {
        return _revocationsOffchain[revoker][data];
    }

    /// @inheritdoc ISunID
    function totalCredentials() external view returns (uint256) {
        return _credentialUIDs.length;
    }

    /// @dev Calculates a UID for a given credential.
    /// @param credential The input credential.
    /// @param bump A bump value to use in case of a UID conflict.
    /// @return Credential UID.
    function _getUID(Credential memory credential, uint32 bump) private pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                credential.schema,
                credential.recipient,
                credential.issuer,
                credential.time,
                credential.expirationTime,
                credential.revocable,
                credential.refUID,
                credential.data,
                bump
            )
        );
    }

    /// @dev Refunds remaining ETH amount to the issuer.
    /// @param remainingValue The remaining ETH amount that was not sent to the resolver.
    function _refund(uint256 remainingValue) private {
        if (remainingValue > 0) {
            (bool success,) = msg.sender.call{value: remainingValue}("");
            require(success);
        }
    }

    /// @dev Returns the current's block timestamp.
    function _time() private view returns (uint64) {
        return uint64(block.timestamp);
    }

    /// @dev Revokes the specified bytes32 data.
    /// @param revoker The revoking account.
    /// @param data The data to revoke.
    /// @param time The timestamp the data was revoked with.
    function _revokeOffchain(address revoker, bytes32 data, uint64 time) private {
        mapping(bytes32 data => uint64 timestamp) storage revocations = _revocationsOffchain[revoker];

        if (revocations[data] != 0) {
            revert AlreadyRevokedOffchain();
        }
        revocations[data] = time;

        emit RevokedOffchain(revoker, data, time);
    }
}
