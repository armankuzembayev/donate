# Smart contract for donations


To run unit tests

```shell
npx hardhat test
```

To deploy to rinkeby network

```shell
npx hardhat run scripts/deploy.js --network rinkeby
```


Try running some of the following tasks for rinkeby network:

```shell
npx hardhat transfer --amount <amount> --network rinkeby
npx hardhat withdraw --to <account's address> --amount <amount> --network rinkeby
npx hardhat donators --network rinkeby
npx hardhat donationAmount --address <user's address> --network rinkeby
```
