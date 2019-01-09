# 创建账户

#### 安装创建用户依赖
```javascript
npm install jssha crypto elliptic js-sha3
```

#### 创建账户配置项
```javascript
// createAccount.js 文件 NUMBER 值为创建账户的数量 并在文件内填写公钥和私钥
```

#### 启动创建账户(创建成功后 会在根目录生成account.json,此文件就是你创建的账户)
```javascript
node createAccount.js
```


# 批量转账

#### 安装批量转账依赖
```javascript
npm install tronweb
```

#### 配置批量转账
```javascript
// transaction.js文件 AMOUNT值是给每一个账户转多少钱
// 上一步生成的账户都会接收到。
```

#### 执行批量转账
```javascript
node transaction.js
```

# 批量调用

#### 安装批量调用依赖

```javascript
npm install tronweb
```

#### 批量调用配置项
```javascript
// index.js MAXPRICE变量为最大买入价格 单位为SUN(1000000 SUN = 1 TRX)到了最大买入价,脚本会停止执行
// index.js NUMBER为最大买入次数,到了次数后脚本会停止执行 单位为SUN(1000000 SUN = 1 TRX)
```

#### 批量调用注意事项
```javascript
// 请保证你的用户列表均有足够TRX余额(批量调用程序并没有判断用户是否余额足够,如果余额不足会报错,并且程序停止运行)
// 用户列表在account.json文件, 也就是你创建的账户
```

#### 启动批量调用
```javascript
node idnex.js
```
