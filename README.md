# Example of Ed25519 Verification On Solana Using Anchor

## Setup

```shell
$ git clone https://github.com/rocalex/solana-offsig-demo
$ yarn install
```

```shell
$ cargo version
cargo 1.76.0 (c84b36747 2024-01-18)
$ rustc --version
rustc 1.76.0 (07dca489a 2024-02-04)
```

```shell
$ solana --version
solana-cli 1.18.3 (src:6f13e1c2; feat:3352961542, client:SolanaLabs)
```

```shell
$ solana-test-validator --version
solana-test-validator 1.18.3 (src:6f13e1c2; feat:3352961542, client:SolanaLabs)
```

```shell
$ anchor --version   
anchor-cli 0.29.0
```

```shell
$ node --version
v20.11.1
```

```shell
$ npm --version
10.4.0
```

```shell
$ yarn --version
1.22.21
```

* 编译

```shell
$ anchor build
```

* 运行单元测试

```shell
$ anchor test
```

* 启动 solana 本地测试节点

```shell
$ solana-test-validator
```

* 部署

```shell
$ anchor deploy
```
