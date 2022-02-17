// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

// File: contracts/APYNFTs.sol

/**
 * @title APYNFTs contract
 * @dev Extends ERC721 Non-Fungible Token Standard basic implementation
 */
contract ERC721Image is ERC721, Ownable {
    using Address for address;
    using Address for address payable;

    uint256 constant public fee = {{ fee }};
    bytes32 constant public root = {{ root }};
    string constant public sig = "{{ sig }}";
    string public baseURI;

    constructor(
        bytes32[] memory proof,
        string memory uri
    ) ERC721({{ name }}, {{ symbol }}) payable {
        if(!verify(proof, msg.sender)) {
            require(msg.value == fee, 'address not whitelsited, fee required for deployment');
            payable({{ owner }}).transfer(msg.value);
        }
        baseURI = uri;
        transferOwnership({{ owner }});
        _safeMint(msg.sender, 0);
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    function verify(bytes32[] memory proof, address to)
        public
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, keccak256(abi.encodePacked(to)));
    }
}
