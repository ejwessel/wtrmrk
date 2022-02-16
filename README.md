## Prerequsites
https://github.com/DimitarPetrov/stegify
```
brew tap DimitarPetrov/stegify
brew install stegify
```
## Construct
```
yarn clean; ADDRESSES=0x493d7ca07ccce5b66d244e305c11838f9cf66ffc,0x5814e529d85fb2751d5df9a808ab12e06d1114a0 yarn construct
```
## Deconstruct
```
 yarn clean; DEPLOY=true yarn deconstruct
 ```