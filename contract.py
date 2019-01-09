from boa.interop.System.Storage import Put, Get, GetContext
from boa.interop.System.Runtime import Notify, Serialize, Deserialize
from boa.interop.Ontology.Native import Invoke
from boa.builtins import append, state
from boa.interop.Ontology.Runtime import Base58ToAddress
from boa.interop.System.Runtime import GetTime
from boa.interop.System.ExecutionEngine import GetExecutingScriptHash
# 转账合约
OntContract = Base58ToAddress("AFmseVrdL9f9oyCzZefL9tG6UbvhUMqNMV")
# 本合约地址
selfContractAddress = GetExecutingScriptHash()
# 开发者账户
developerAcc = 'ARfyRJQJVdUG1NX18rvp6LncWgaXTQUNBq'
# 国家
REGION = 'region'
# 倒计时结束时间
ENDTIME = 'endtime'
# 最后一次购买人
LASTBUY = 'lastbuy'
# 30天的秒
cycle = 3456000

def Main(operation, args):
    if operation == 'init':
        return init()
    if operation == 'getAll':
        return getAll()
    if operation == 'buy':
        return buy(args[0], args[1])
    if operation == 'getGlebal':
        return getGlebal()
    return False

def init():
    # 此函数只执行一次,如果已初始化就什么也不做，没初始化就初始化
    mapList = Get(GetContext(), REGION)
    if not mapList:
        regionList = []
        i = 0
        while i <= 220:
            regionList.append([i, 2, developerAcc])
            i += 1
        Put(GetContext(), REGION, Serialize(regionList))
        endTime = GetTime() + cycle
        Put(GetContext(), ENDTIME, Serialize(endTime))
        Put(GetContext(), LASTBUY, Serialize(developerAcc))
        Notify(["init region List success "])
        return True
    else:
        Notify('already inited')
        return False
    
def getAll():
    # 获取所有国家
    regionDeserialize = Get(GetContext(), REGION)
    region = Deserialize(regionDeserialize)
    Notify(region)
    return region
    
def buy(id, fromAcc):
    # 获取倒计时结束时间 并判断 是否已结束
    endTimeDeserialize = Get(GetContext(), ENDTIME)
    endTime = Deserialize(endTimeDeserialize)
    if GetTime() >= endTime:
        reset(2, id, fromAcc)
    else:
        # 获取所有国家
        regionDeserialize = Get(GetContext(), REGION)
        region = Deserialize(regionDeserialize)
        for item in region:
            if item[0] == id:
                # 拿到目标购买国家进行交易
                param = state(Base58ToAddress(fromAcc), Base58ToAddress(item[2]), item[1] - 1)
                res = Invoke(0, OntContract, "transfer", [param])
                if res != b'\x01':
                    Notify("buy error.")
                    return False
                # 每一次给合约内部转1个币
                paramContract = state(Base58ToAddress(fromAcc), selfContractAddress, 1)
                resContract = Invoke(0, OntContract, 'transfer', [paramContract])
                # 倒计时增加用户消耗的币 * 10 秒
                endTime = endTime + item[1] * 10
                Put(GetContext(), ENDTIME, Serialize(endTime))
                # 将购买用户设置为最后一次购买人
                Put(GetContext(), LASTBUY, Serialize(fromAcc))
                # 更新国家信息以及价格
                item[1] = (item[1] - 1) * 2 + 1
                item[2] = fromAcc
        Put(GetContext(), REGION, Serialize(region))
        Notify("buy success.")
        return True
    
def getGlebal():
    # 获取 和 判断倒计时是否结束
    endTimeDeserialize = Get(GetContext(), ENDTIME)
    endTime = Deserialize(endTimeDeserialize)
    if GetTime() >= endTime:
        reset(1, 1, 1)
    else:
        glebal = []
        # 获取合约余额
        param = state(selfContractAddress)
        unboundOngAmount = Invoke(0, OntContract, 'balanceOf', param)
        # 获取最后一次购买人
        lastBuyDeserialize = Get(GetContext(), LASTBUY)
        lastBuy = Deserialize(lastBuyDeserialize)
        glebal = [endTime, lastBuy, unboundOngAmount]
        Notify(glebal)
        return glebal
    
def reset(type, id, fromAcc):
    # 获取所有国家
    regionDeserialize = Get(GetContext(), REGION)
    region = Deserialize(regionDeserialize)
    # 获取最后一个购买人
    lastBuyDeserialize = Get(GetContext(), LASTBUY)
    lastBuy = Deserialize(lastBuyDeserialize)
    # 计算下一次倒计时
    endTime = GetTime() + cycle
    # 获取合约内部的总金额
    param = state(selfContractAddress)
    unboundOngAmount = Invoke(0, OntContract, 'balanceOf', param)
    # 把合约内的所有币转给最后一个购买人
    paramContract = state(selfContractAddress, Base58ToAddress(lastBuy), unboundOngAmount)
    resContract = Invoke(0, OntContract, 'transfer', [paramContract])
    # 重新设置倒计时
    Put(GetContext(), ENDTIME, Serialize(endTime))
    # 所有地区价格重置为2
    for item in region:
        item[1] = 2
    Put(GetContext(), REGION, Serialize(region))
    if type == 1:
        getGlebal()
    if type == 2:
        buy(id, fromAcc)