// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISchemaRegistry, SchemaRecord, SchemaField} from "./ISchemaRegistry.sol";
import {ISchemaResolver} from "./ISchemaResolver.sol";

/// @title SchemaRegistry
/// @notice The global schema registry.
contract SchemaRegistry is ISchemaRegistry {
    // The global mapping between schema records and their IDs.
    mapping(bytes32 uid => SchemaRecord schemaRecord) private _registry;

    /// @inheritdoc ISchemaRegistry
    uint256 public totalSchemas;

    /// @inheritdoc ISchemaRegistry
    function register(string memory name, SchemaField[] memory schema, ISchemaResolver resolver, bool revocable)
        external
        returns (bytes32)
    {
        SchemaRecord memory schemaRecord =
            SchemaRecord({uid: 0, name: name, schema: schema, resolver: resolver, revocable: revocable});

        bytes32 uid = _getUID(schemaRecord);
        require(_registry[uid].uid == 0, "already exists");

        _registry[uid].uid = uid;
        _registry[uid].resolver = resolver;
        _registry[uid].revocable = revocable;
        for (uint256 i = 0; i < schema.length; i++) {
            _registry[uid].schema.push(schema[i]);
        }

        emit Registered(uid, msg.sender);

        return uid;
    }

    /// @inheritdoc ISchemaRegistry
    function getSchema(bytes32 uid) external view returns (SchemaRecord memory) {
        return _registry[uid];
    }

    /// @inheritdoc ISchemaRegistry
    function getSchemas(bytes32[] memory uids) external view returns (SchemaRecord[] memory) {
        SchemaRecord[] memory records = new SchemaRecord[](uids.length);
        for (uint256 i = 0; i < uids.length; i++) {
            records[i] = _registry[uids[i]];
        }
        return records;
    }

    /// @dev Calculates a UID for a given schema.
    /// @param schemaRecord The input schema.
    /// @return schema UID.
    function _getUID(SchemaRecord memory schemaRecord) private pure returns (bytes32) {
        return keccak256(abi.encode(schemaRecord.schema, schemaRecord.resolver, schemaRecord.revocable));
    }
}
