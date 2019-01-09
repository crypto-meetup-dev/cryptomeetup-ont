# 合约内部函数说明

## getAll()
#### 获取所有地区信息格式为[[id, price, 目前拥有人], [id, price, 目前拥有人]]

## getGlebal()
#### 获取所有全局信息[倒计时结束时间, 最后一位购买人, 奖池目前金额(如奖池返回""则表示为0)]

## buy(id, fromAddress)
#### 购买地区,id为地区id,fromAddress为购买人的钱包地址


# 规则介绍
#### 初始化220个地区,初始化的地区的拥有人均为开发者,初始化价格为2(以下价格单位均为ONT)
#### 如用户A购买某地区目前价格为x,则上一个拥有人收入x - 1,合约奖池进入1。然后该地区价格重置为 (x - 1) * 2 + 1
#### 倒计时初始化为3456000秒(30天)合约产生交易则增加倒计时时间(产生交易为x ONT 则增加 x * 10秒)
#### 倒计时结束，最后一位购买人获得奖池所有资金。所有地区价格重置为2，倒计时重新重置为3456000秒(30天)


# 合约详情

```javascript
  {
    contractHash: '0e133e1e1f510933c309ada4f40bcd314b560fe9',
    Action: 'Notify',
    Desc: 'SUCCESS',
    Error: 0,
    Result: {
      TxHash: 'be30d66b67b92c98ed2090c57fb1ae56937df9075a137fff920d0330e429af8a',
      State: 1,
      GasConsumed: 10300000000,
      Notify: [{
        ContractAddress: '0200000000000000000000000000000000000000',
        States: ['transfer', 'ARfyRJQJVdUG1NX18rvp6LncWgaXTQUNBq', 'AFmseVrdL9f9oyCzZefL9tG6UbviEH9ugK', 10300000000]
      }]
    },
    Version: '1.0.0'
  }
```