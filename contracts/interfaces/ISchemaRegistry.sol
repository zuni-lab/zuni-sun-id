// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A representation of an empty/uninitialized UID.
bytes32 constant EMPTY_UID = 0;

struct SchemaField {
    string fieldType;
    string fieldName;
    string fieldDescription;
}

/// @notice A struct representing a record for a submitted schema.
struct SchemaRecord {
    bytes32 uid; // The unique identifier of the schema.
    address resolver; // Optional schema resolver.
    bool revocable; // Whether the schema allows revocations explicitly.
    SchemaField[] schema; // Custom specification of the schema.
}

/// @title ISchemaRegistry
/// @notice The interface of schema registry.
interface ISchemaRegistry {
    /// @notice Emitted when a new schema has been registered
    /// @param uid The schema UID.
    /// @param registerer The address of the account used to register the schema.
    event Registered(bytes32 indexed uid, address registerer);

    /// @notice Submits and reserves a new schema
    /// @param schema The schema data schema.
    /// @param resolver An optional schema resolver.
    /// @param revocable Whether the schema allows revocations explicitly.
    /// @return The UID of the new schema.
    function register(SchemaField[] memory schema, address resolver, bool revocable) external returns (bytes32);

    /// @notice Returns an existing schema by UID
    /// @param uid The UID of the schema to retrieve.
    /// @return The schema data members.
    function getSchema(bytes32 uid) external view returns (SchemaRecord memory);
}
