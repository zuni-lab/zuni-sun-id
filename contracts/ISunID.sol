// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ISchemaRegistry} from "./ISchemaRegistry.sol";

/// @notice A struct representing a single credential.
struct Credential {
    bytes32 uid; // A unique identifier of the credential.
    bytes32 schema; // The unique identifier of the schema.
    uint64 time; // The time when the credential was created (Unix timestamp).
    uint64 expirationTime; // The time when the credential expires (Unix timestamp).
    uint64 revocationTime; // The time when the credential was revoked (Unix timestamp).
    bytes32 refUID; // The UID of the related credential.
    address recipient; // The recipient of the credential.
    address issuer; // The issuer/sender of the credential.
    bool revocable; // Whether the credential is revocable.
    bytes[] data; // Custom credential data.
}

/// @notice A struct representing the full arguments of the credential request.
struct CredentialRequest {
    bytes32 schemaUID; // The unique identifier of the schema.
    address recipient; // The recipient of the credential.
    uint64 expirationTime; // The time when the credential expires (Unix timestamp).
    bool revocable; // Whether the credential is revocable.
    bytes32 refUID; // The UID of the related credential.
    bytes[] data; // Custom credential data.
}

/// @notice A struct representing the full arguments of the revocation request.
struct RevocationRequest {
    bytes32 schemaUID; // The unique identifier of the schema.
    bytes32 credentialUID; // The UID of the credential to revoke.
}

/// @title ISunID
/// @notice SunID - Ethereum credential Service interface.
interface ISunID {
    /// @notice Throws if the credential has already been revoked on-chain.
    error AlreadyRevoked();

    /// @notice Throws if the credential has already been revoked off-chain.
    error AlreadyRevokedOffchain();

    /// @notice Throws if the credential does not exist.
    error CredentialNotFound();

    /// @notice Throws if expiration time of the credential is invalid.
    error InvalidExpirationTime();

    /// @notice Throws if the credential is irrevocable.
    error Irrevocable();

    /// @notice Throws if the credential reference does not exist.
    error InvalidRefCredential();

    /// @notice Throws if the credential data length does not match the schema.
    error LengthMismatch();

    /// @notice Throws if failed to call the schema resolver.
    error ResolverFailed();

    /// @notice Throws if the schema requested does not match the schema of the credential.
    error SchemaMismatch();

    /// @notice Throws if the schema does not exist.
    error SchemaNotFound();

    /// @notice Throws if revoker is not issuer of the credential.
    error UnauthorizedRevocation();

    /// @notice Emitted when an credential has been made.
    /// @param recipient The recipient of the credential.
    /// @param issuer The issuing account.
    /// @param uid The UID of the new credential.
    /// @param schemaUID The UID of the schema.
    event Issued(address indexed recipient, address indexed issuer, bytes32 uid, bytes32 indexed schemaUID);

    /// @notice Emitted when an credential has been revoked.
    /// @param recipient The recipient of the credential.
    /// @param issuer The issuing account.
    /// @param schemaUID The UID of the schema.
    /// @param uid The UID the revoked credential.
    event Revoked(address indexed recipient, address indexed issuer, bytes32 uid, bytes32 indexed schemaUID);

    /// @notice Emitted when a data has been timestamped.
    /// @param data The data.
    /// @param timestamp The timestamp.
    event Timestamped(bytes32 indexed data, uint64 indexed timestamp);

    /// @notice Emitted when a data has been revoked.
    /// @param revoker The address of the revoker.
    /// @param data The data.
    /// @param timestamp The timestamp.
    event RevokedOffchain(address indexed revoker, bytes32 indexed data, uint64 indexed timestamp);

    /// @notice Returns the address of the global schema registry.
    /// @return The address of the global schema registry.
    function getSchemaRegistry() external view returns (ISchemaRegistry);

    /// @notice Issue a credential to a specific schema.
    /// @param request The arguments of the credential request.
    /// @return The UID of the new credential.
    function issue(CredentialRequest calldata request) external payable returns (bytes32);

    /// @notice Revokes an existing credential to a specific schema.
    /// @param request The arguments of the revocation request.
    function revoke(RevocationRequest calldata request) external payable;

    /// @notice Revokes the specified off-chain credential.
    /// @param uid The UID of the credential to revoke.
    /// @return The timestamp the data was revoked with.
    function revokeOffchain(bytes32 uid) external returns (uint64);

    /// @notice Returns an existing credential by UID.
    /// @param uid The UID of the credential to retrieve.
    /// @return The credential data members.
    function getCredential(bytes32 uid) external view returns (Credential memory);

    /// @notice Returns existing credentials by UIDs.
    /// @param uid The UIDs of the credentials to retrieve.
    /// @return List of credentials.
    function getCredentials(bytes32[] memory uid) external view returns (Credential[] memory);

    /// @notice Returns existing credentials by indexes.
    /// @param from The index to start from.
    /// @param to The index to end at.
    /// @return List of credentials in the specified range.
    function getCredentialsInRange(uint256 from, uint256 to) external view returns (Credential[] memory);

    /// @notice Checks whether an credential exists.
    /// @param uid The UID of the credential to retrieve.
    /// @return Whether an credential exists.
    function isCredentialValid(bytes32 uid) external view returns (bool);

    /// @notice Returns the timestamp that the specified data was timestamped with.
    /// @param data The data to query.
    /// @return The timestamp the data was timestamped with.
    function getRevokeOffchain(address revoker, bytes32 data) external view returns (uint64);

    /// @notice Returns total number of credentials.
    function totalCredentials() external view returns (uint256);
}
