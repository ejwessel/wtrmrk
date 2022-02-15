//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Greeter is Ownable {
    string private greeting;
    bytes32 public root = 0xc567bec4524e2efedd7d7092394e6394f55052760fe36fb0d8745c9047146c14;
    string public sig = "0xe515c9cba8eb04b1306ef26c0f2378c628c5cfcd39a640d6424a0a484045c65a1e496779d55a53982ad3d9c13ed8d1eb7a0ed04e4c5ae83eb01104660fa4a57c1c";

    constructor(string memory _greeting) {
        // console.log("Deploying a Greeter with greeting:", _greeting);
        greeting = _greeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory _greeting) public {
        // console.log("Changing greeting from '%s' to '%s'", greeting, _greeting);
        greeting = _greeting;
    }
}
