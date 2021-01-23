# 🤹‍♂️ Rollup playground

This repo contains a variety of examples that demonstrate different Rollup configurations and an evaluation of their outputs.


## ⛳️ Demos
<!-- demos:start -->
- [externalization](/demos/externalization)

	Tree-shaking with lodash

- [tree-shaking-lodash](/demos/tree-shaking-lodash)

	Tree-shaking with lodash

- [tree-shaking-lodash-es](/demos/tree-shaking-lodash-es)

	Tree-shaking with lodash-es
<!-- demos:end -->

## 🛠 Contributing

### Setup
```sh
$ nvm i  # Use appropriate Node.js version via http://nvm.sh
$ pnpm i --frozen-lockfile # Install dependencies using pnpm
```

### Running builds

#### Run all package builds
```sh
$ pnpm run build-all
```

#### Run build in a specific package
```sh
$ pnpm run -C demos/<PACKAGE_NAME> build
```
