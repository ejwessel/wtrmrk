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
* [NFT theft](https://twitter.com/NFTtheft) is a real issue with a number of artists having their artwork stolen by thieves who reupload the work on marketplaces. 
* Marketplaces do not provide adequate validation processes to verify the authenticity of image assets. 
* The process to take stolen art down by marketplaces is cumbersome and needlessly bureaucratic.
* NFT marketplaces either do not have the proper resources to combat NFT theft or are currently not prioritizing the issue. 
* Artists should have control over how their works are sold, so we want to put control back into their hands. 
# What it does:
* WTRMRK allows artists to define the parameters and rules for how their art should behave when minted as an NFT.
* The logic for the contract, the signature, and the whitelist are stenographically encoded into the image.
  * No EXIF data since it can easily be removed.
  * Steganographic encoding forces the logic to be a part of the ‘DNA’ of the image.
  * Steganography is harder to detect and remove
* The logic is extracted during minting and referenced as a source of truth for the deployment. 
* The contract logic is flexible allowing for artists to define parameters and restricting the minting of their art. 
* The logic allows for images to be referenced bidirectionally and to define how it can be deployed. 
  * Deployment points back to the image in order to determine whether the image has been properly deployed. 
  * An NFT is rendered invalid if it does not match what is defined in the image. 
* In lieu of theft, additional safeguards have been written into the contract with the following rules:
  * If msg.sender is on the whitelist, the contract is deployed without paying the artist’s defined fee.
  * If msg.sender is not on the whitelist, the deployer must pay a fee that goes directly to the artist in order to mint.

# How it's built:
* [Merkle Trees](https://en.wikipedia.org/wiki/Merkle_tree) for whitelisting
* [OpenZeppelin Contracts](https://openzeppelin.com/contracts/)
* [Stegify](https://github.com/DimitarPetrov/stegify) tool by Dimitar Petrov. Encodes using [Least Significant Bit (LSB)](https://en.wikipedia.org/wiki/Bit_numbering#Least_significant_bit_in_digital_steganography)
* [IPFS](https://ipfs.io/) for image referencing
# Latent Benefits:
* Artists can still lazy mint and not have to spend gas on deployment. 
# The Challenge:
> “When the art is minted as an NFT, the logic is extracted from and referenced as a source of truth for the deployment.”
* There needs to be marketplace buy in, again there’s no validation or verification of an image being uploaded as being legitimate.
* Marketplaces currently sanitize their media (or should be) before sending to a user. This removes noise and often times steganographic data. There are ways to perform client side code execution through an image.
* Marketplaces currently ‘manage’ the problem, they haven’t solved the problem.
# What we learned:
* We learned a lot about the interesting use cases for steganography and digital watermarking as well as their limitations.
* We learned a bit about polyglot files and their various applications. 
# Improvements:
* Including the package.json contents with regards to solidity compiler and contract versions for determinism in compilation of the contract.
* This method does not guard against, "compression, rotation, cropping, additive noise, and quantization." Steganography is information hiding while digital watermarking tries to control robustness and needs to have a resilient signal.
* This method unfortunately does not prevent images from being overwritten or copied via photography. 
* Utilizing a signal could potentially be an approach to achieving this. .
* Including metadata from the image where it becomes a part of the 'DNA' of the image and cannot be removed is another possible approach.
* Turn the image into a Polyglot file. 
  * It should be noted that polyglots are generally used for Remote Code Execution (RCE) and this might not be a valid approach.
* Adding the encoding does increase image size meaning the 'carrier' image has to be large enough to contain the encoded data.


# Applicability:
* Digital Rights Management (DRM).
* It’s possible to steganographically encode into audio.
* Embedding code into an inaudible audio signal utilizing processing in order to listen to and generate the code.
