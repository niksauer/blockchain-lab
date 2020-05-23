// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';


// https://docs.openzeppelin.com/contracts/3.x/erc20
contract ERC20Example is ERC20 {
    // MARK: - Initialization
    constructor(uint256 initialSupply) public ERC20('ERC20 Example', 'ERC20E') {
        _setupDecimals(0);
        // contract deployer will receive initial supply
        _mint(msg.sender, initialSupply);
    }
}
