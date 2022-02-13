// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";


contract Donation is Ownable {

    uint public currentId;

    struct Entity {
        uint id;
        bool isEntity;
    }

    mapping(address => Entity) public addressToEntity;
    uint[] balances;
    address[] addresses;

    receive() external payable {
        Entity memory _entity = addressToEntity[msg.sender];

        if (!_entity.isEntity) {
            _entity.id = currentId;
            _entity.isEntity = true;
            addressToEntity[msg.sender] = _entity;

            balances.push(msg.value);
            addresses.push(msg.sender);

            currentId++;
        } else {
            balances[_entity.id] += msg.value;
        }
    }

    function withdraw(address payable _to, uint _amount) public onlyOwner {
        require(_amount <= getBalance(), "Not enough Balance!");
        _to.transfer(_amount);
    }

    function getDonators() public view returns (address[] memory) {
        return addresses;
    }

    function getDonationAmountForUser(address _userAddress) public view returns (uint) {
        Entity memory _entity = addressToEntity[_userAddress];
        if (!_entity.isEntity) return 0;
        
        return balances[_entity.id];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}