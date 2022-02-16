// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
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

    bytes32 constant public root = {{ root }};
    string constant public sig = "{{ sig }}";
    uint256 constant public fee = {{ fee }};
    address constant public feeDest = {{ feeDest }};

    constructor(
        bytes32[] memory proof
    ) ERC721(name, symbol) payable {
        if(!verify(proof, msg.sender)) {
            require(msg.value == fee, 'address not whitelsited, fee required for deployment');
            payable(feeDest).transfer(msg.value);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function setBaseURI(string memory newBaseURI) public onlyOwner {
        baseURI = newBaseURI;
    }

    function setRoot(bytes32 newRoot) public onlyOwner {
        root = newRoot;
    }

    function verify(bytes32[] memory proof, address to)
        public
        view
        returns (bool)
    {
        return MerkleProof.verify(proof, root, keccak256(abi.encodePacked(to)));
    }

    function mint(bytes32[] memory proof, address to) public {
        require(totalSupply() <= MAX_SUPPLY, "max supply reached");
        require(!hasMinted[to], "address has already minted");
        require(verify(proof, to), "address is not whitelisted");
        hasMinted[to] = true;
        _safeMint(to, totalSupply());
    }

    // function reserve(uint256 mintAmt) public onlyOwner {
    //     require(
    //         totalSupply() + mintAmt <= MAX_SUPPLY,
    //         "mint amount exceeds max supply"
    //     );
    //     for (uint256 i = 0; i < mintAmt; i++) {
    //         _safeMint(owner(), totalSupply());
    //     }
    // }
}
