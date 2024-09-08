// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/ISchemaRegistry.sol";

/// @title SchemaRegistry
/// @notice The global schema registry.
contract SchemaRegistry is ISchemaRegistry {
    // The global mapping between schema records and their IDs.
    mapping(bytes32 uid => SchemaRecord schemaRecord) private _registry;

    /// @inheritdoc ISchemaRegistry
    function register(SchemaField[] memory schema, address resolver, bool revocable) external returns (bytes32) {
        SchemaRecord memory schemaRecord =
            SchemaRecord({uid: EMPTY_UID, schema: schema, resolver: resolver, revocable: revocable});

        bytes32 uid = _getUID(schemaRecord);
        require(_registry[uid].uid == EMPTY_UID, "Already registered");

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

    /// @dev Calculates a UID for a given schema.
    /// @param schemaRecord The input schema.
    /// @return schema UID.
    function _getUID(SchemaRecord memory schemaRecord) private pure returns (bytes32) {
        return keccak256(abi.encode(schemaRecord.schema, schemaRecord.resolver, schemaRecord.revocable));
    }
}
