// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ISchemaResolver} from "./ISchemaResolver.sol";

struct SchemaField {
    string fieldType;
    string fieldName;
    string fieldDescription;
}

/// @notice A struct representing a record for a submitted schema.
struct SchemaRecord {
    bytes32 uid; // The unique identifier of the schema.
    ISchemaResolver resolver; // Optional schema resolver.
    bool revocable; // Whether the schema allows revocations explicitly.
    SchemaField[] schema; // Custom specification of the schema (e.g., an ABI).
}

/// @title ISchemaRegistry
/// @notice The interface of global credential schemas for the SunID.
interface ISchemaRegistry {
    /// @notice Emitted when a new schema has been registered
    /// @param uid The schema UID.
    /// @param registerer The address of the account used to register the schema.
    event Registered(bytes32 indexed uid, address indexed registerer);

    /// @notice Submits and reserves a new schema
    /// @param schema The schema data schema.
    /// @param resolver An optional schema resolver.
    /// @param revocable Whether the schema allows revocations explicitly.
    /// @return The UID of the new schema.
    function register(SchemaField[] memory schema, ISchemaResolver resolver, bool revocable)
        external
        returns (bytes32);

    /// @notice Returns an existing schema by UID
    /// @param uid The UID of the schema to retrieve.
    /// @return The schema data members.
    function getSchema(bytes32 uid) external view returns (SchemaRecord memory);

    /// @notice Returns multiple schemas by their UIDs
    /// @param uids The UIDs of the schemas to retrieve.
    /// @return List of schema.
    function getSchemas(bytes32[] memory uids) external view returns (SchemaRecord[] memory);

    /// @notice Returns total number of schemas.
    function totalSchemas() external view returns (uint256);
}
