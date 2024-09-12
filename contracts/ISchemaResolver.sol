// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {Credential} from "./ISunID.sol";

/// @title ISchemaResolver
/// @notice The interface of an optional schema resolver.
interface ISchemaResolver {
    /// @notice Checks if the resolver can be sent ETH.
    /// @return Whether the resolver supports ETH transfers.
    function isPayable() external pure returns (bool);

    /// @notice Processes a credential and verifies whether it's valid.
    /// @param credential The new credential.
    /// @return Whether the credential is valid.
    function issue(Credential calldata credential) external payable returns (bool);

    /// @notice Processes a credential revocation and verifies if it can be revoked.
    /// @param credential The existing credential to be revoked.
    /// @return Whether the credential can be revoked.
    function revoke(Credential calldata credential) external payable returns (bool);
}
