// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {ISchemaRegistry, SchemaRecord, SchemaField} from "./ISchemaRegistry.sol";
import {ISchemaResolver} from "./ISchemaResolver.sol";

/// @title SchemaRegistry
/// @notice The global schema registry.
contract SchemaRegistry is ISchemaRegistry {
    // The global mapping between schema records and their IDs.
    mapping(bytes32 uid => SchemaRecord schemaRecord) private _registry;

    // The global list of all schema UIDs.
    bytes32[] private _schemaUIDs;

    /// @inheritdoc ISchemaRegistry
    function register(string memory name, SchemaField[] memory schema, ISchemaResolver resolver, bool revocable)
        external
        returns (bytes32)
    {
        uint256 id = _schemaUIDs.length;
        SchemaRecord memory schemaRecord =
            SchemaRecord({id: id, uid: 0, name: name, schema: schema, resolver: resolver, revocable: revocable});

        bytes32 uid = _getUID(schemaRecord);

        SchemaRecord storage record = _registry[uid];
        record.id = id;
        record.uid = uid;
        record.name = name;
        record.resolver = resolver;
        record.revocable = revocable;
        for (uint256 i = 0; i < schema.length; i++) {
            record.schema.push(schema[i]);
        }

        _schemaUIDs.push(uid);

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

    /// @inheritdoc ISchemaRegistry
    function getSchemasInRange(uint256 from, uint256 to) public view returns (SchemaRecord[] memory) {
        SchemaRecord[] memory records = new SchemaRecord[](to - from);
        for (uint256 i = from; i < to; i++) {
            records[i - from] = _registry[_schemaUIDs[i]];
        }
        return records;
    }

    /// @inheritdoc ISchemaRegistry
    function totalSchemas() external view returns (uint256) {
        return _schemaUIDs.length;
    }

    /// @dev Calculates a UID for a given schema.
    /// @param schemaRecord The input schema.
    /// @return schema UID.
    function _getUID(SchemaRecord memory schemaRecord) private pure returns (bytes32) {
        return keccak256(abi.encode(schemaRecord.schema, schemaRecord.resolver, schemaRecord.revocable));
    }

    /// @dev Returns the current's block timestamp.
    function _time() private view returns (uint64) {
        return uint64(block.timestamp);
    }
}
