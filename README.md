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