// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;


contract GetSetValue {
    // MARK: - Private Properties
    string private value;

    // MARK: - Public Methods
    // MARK: Setter
    function setValue(string memory _value) public {
        value = _value;
    }

    // MARK: Getter
    function getValue() public view returns (string memory) {
        return value;
    }
}
