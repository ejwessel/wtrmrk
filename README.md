<img src="https://raw.githubusercontent.com/ejwessel/wtrmrk/main/WTRMRK.png">

## Prerequsites
https://github.com/DimitarPetrov/stegify
```
brew tap DimitarPetrov/stegify
brew install stegify
```

.env
```
PRIVATE_KEY=<insert>
ALCHEMY_API_KEY=<insert>
ETHERSCAN_API_KEY=<insert>
PINATA_API_KEY=<insert>
PINATA_SECRET_KEY=<insert>
```
## Construct
```
yarn clean; NODE_NO_WARNINGS=1 ADDRESSES=0x493d7ca07ccce5b66d244e305c11838f9cf66ffc,0x5814e529d85fb2751d5df9a808ab12e06d1114a0,0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 INPUT=images/pi_2.png OUTPUT=steg.png yarn construct
```
## Deconstruct
```
yarn clean; NODE_NO_WARNINGS=1 INPUT=steg.png DEPLOY=true yarn deconstruct
```
 ## Verify an existing contract
```
yarn clean; URI=https://ipfs.io/ipfs/QmTgobRZQ36vKMJCCF4VYhi7p1bh2JBidQ73MJmMwzZ7Xr CONTRACT_ADDRESS=0x7bD0707a5A3142fBf8Ff63634a5F9aD64e602230 yarn verify --network rinkeby
```

***[SHORT VIDEO DEMO](https://www.youtube.com/watch?v=ucK3RYQMlPE)***
# Inspiration
* https://twitter.com/NFTtheft
* We found a number of artists getting their artwork stolen and sold from under them without compensation and any upside.
* We found artists’ artwork being ransomed; a thief would post the image without consent and attempt to coerce the artist to split profit, and block them if they disagreed.
* We found marketplaces don’t provide validation or verification of an image being uploaded as being legitimate.
* We found it trivial to upload art and cumbersome to take stolen art down.
* We found NFT marketplaces inundated with fake art and marketplaces are playing whack-a-mole; effort to take stolen art is a resource sink.
* We found the scales tipped in favor of thieves; repercussions are nilch - addresses are free!
* We found that not all artists agree with NFTs.
* We wanted to put more control back into the artist’s hands. It shouldn’t be that artists have control over what they create, but not over how their creations are sold. 
# What it does:
* WTRMRK allows an artist to define the parameters and rules for how their art should behave when their art is minted as an NFT.
* It does this by stenographically encoding logic into the image: the contract, the signature, and the whitelist.
  * No EXIF data since it can easily be removed. 
  * Steganographic encoding forces the logic to be a part of the ‘DNA’ of the image.
  * Steganography is harder to detect and remove*
* When the art is minted as an NFT, the logic is extracted from and referenced as a source of truth for the deployment.
* The contract logic is flexible! It can be anything, more importantly it can be defined by the artist!
* If they don’t want their art minted, then that parameter can be respected.
* The image that contains the logic allows for bidirectional referencing. 
* The image defines how to deploy. 
* The deployment points back to the image, of which can be used to determine if the image has been deployed correctly. 
* If the NFT is not what is defined in the image then the NFT is invalid and a fake. 
* In lieu of theft, We’ve coded the contract with the following rules:
  * If msg.sender is on the whitelist, the contract is deployed without paying the artist’s defined fee.
  * If msg.sender is not on the whitelist, the deployer must pay a fee that goes directly to the artist in order to mint.
# How it's built:
* [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) for whitelisting
* [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
* [Stegify](https://github.com/DimitarPetrov/stegify) tool by Dimitar Petrov. Encodes using [Least Significant Bit (LSB)](https://en.wikipedia.org/wiki/Bit_numbering#Least_significant_bit_in_digital_steganography)
* [IPFS](https://ipfs.io/) for image referencing
# Latent Benefits:
* Artist’s don’t need to spend gas on deployment; artists can still “lazy mint”.
# The Challenge:
> “When the art is minted as an NFT, the logic is extracted from and referenced as a source of truth for the deployment.”
* There needs to be marketplace buy in, again there’s no validation or verification of an image being uploaded as being legitimate.
* Marketplaces currently sanitize their media (or should be) before sending to a user. This removes noise and often times steganographic data. There are ways to perform client side code execution through an image.
* Marketplaces currently ‘manage’ the problem, they haven’t solved the problem.
# What we learned:
* We learned a lot about steganography
* We learned a lot about digital watermarking
* We learned a bit about polyglot files
# Improvements:
* Including the package.json contents with regard to solidity compiler version and contract versions for determinism in compilation of the contract.
* This method does not guard againstm, "compression, rotation, cropping, additive noise, and quantization". Steganography is information hiding, but digital watermarking tries to control robustness and needs to have a resilient signal.
* This method unfortunately does not prevent the image from being overwritten or copied by having a picture taken of it. An approach where using a signal might be another way to do this.
* Turn the image into a Polyglot file.
* Polyglots are generally used for Remote Code Execution (RCE).
* Adding the encoding does increase image size. This subsequently means the 'carrier' image needs to be large enough to contain the encoded data.

# Applicability:
* Digital Rights Management (DRM).
* It’s possible to steganographically encode into audio.
* One could even embed the code into an inaudible audio signal and use processing to listen to the code and generate the code from that.
