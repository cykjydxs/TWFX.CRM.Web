//母版页
import MasterPage from '@/components/MasterPage'
import Home from '@/components/Home'
import Error from '@/components/Error'

//产品组件
import ProductType from '@/components/product/ProductType'
import ProductList from '@/components/product/ProductList'
import ProductStopList from '@/components/product/ProductStopList'

//商户组件
import BrandList from '@/components/trader/BrandList'
import TraderList from '@/components/trader/TraderList'
import BunkList from '@/components/trader/BunkList'
import BunkEdit from '@/components/trader/BunkEdit'
import TraderMap from '@/components/trader/TraderMap'
import Bunklevel from '@/components/trader/Bunklevel'

//系统管理组件
import RolesList from '@/components/system/RolesList'
import UserList from '@/components/system/UserList'
import MenuList from '@/components/system/MenuList'
import DepartList from '@/components/system/DepartList'

//采购管理
import PurchaseSupplier from '@/components/purchase/PurchaseSupplier'
import PurchaseList from '@/components/purchase/PurchaseList'
import PurchaseDetailList from '@/components/purchase/PurchaseDetailList'

//库存管理
import StockList from '@/components/stock/StockList'
import StockDetailList from '@/components/stock/StockDetailList'
import StockInList from '@/components/stock/StockInList'
import StockInDetailList from '@/components/stock/StockInDetailList'
import StockOutList from '@/components/stock/StockOutList'
import StockOutDetailList from '@/components/stock/StockOutDetailList'
import StockBadList from '@/components/stock/StockBadList'
import StockCheckList from '@/components/stock/StockCheckList'
import StockAssembleList from '@/components/stock/StockAssembleList'
import StockDisassemblyList from '@/components/stock/StockDisassemblyList'

//销售管理
import SellList from '@/components/sell/SellList'
import SellDetailList from '@/components/sell/SellDetailList'
import SellReturnList from '@/components/sell/SellReturnList'
import SellReturnDetailList from '@/components/sell/SellReturnDetailList'

//报表分析
import PurchaseStatistics from '@/components/report/PurchaseStatistics'
import BunkStatistics from '@/components/report/BunkStatistics'
import SellAreaStatistics from '@/components/report/SellAreaStatistics'
import SellMonthStatistics from '@/components/report/SellMonthStatistics'

//基础设置
import SystemSetting from '@/components/base/SystemSetting'
import MeterUnitList from '@/components/base/MeterUnitList'
import StorageList from '@/components/base/StorageList'
import StorageLoList from '@/components/base/StorageLoList'

//财务管理
import BillList from '@/components/payment/BillList'
import BillRecordList from '@/components/payment/BillRecordList'
import PayList from '@/components/payment/PayList'




//数据库读取component动态加载路由，始终不成功，所以用的下面方法
//component:(resolve) => require([`@/components/system/${curTowList[ch].COMPONENT}.vue`], resolve),

//组件建值对
let vueList= {
  "/MasterPage": MasterPage,
  "/Home": Home,
  "/Error": Error,

  //基础设置
  "/base/SystemSetting": SystemSetting,
  "/base/MeterUnitList": MeterUnitList,
  "/base/StorageList": StorageList,
  "/base/StorageLoList": StorageLoList,

  //系统设置
  "/system/UserList": UserList,
  "/system/RolesList": RolesList,
  "/system/MenuList": MenuList,
  "/system/DepartList":DepartList,


  //产品管理
  "/product/ProductType": ProductType,
  "/product/ProductList": ProductList,
  "/product/ProductStopList": ProductStopList,

  //商户管理
  "/trader/TraderList": TraderList,
  "/trader/Bunklevel": Bunklevel,
  "/trader/TraderMap": TraderMap,
  "/trader/BrandList": BrandList,
  "/trader/BunkList": BunkList,
  "/trader/BunkEdit": BunkEdit,

  //采购管理
  "/purchase/PurchaseSupplier": PurchaseSupplier,
  "/purchase/PurchaseList": PurchaseList,
  "/purchase/PurchaseDetailList": PurchaseDetailList,


  //库存管理
  "/stock/StockList": StockList,
  "/stock/StockDetailList": StockDetailList,
  "/stock/StockInList": StockInList,
  "/stock/StockInDetailList": StockInDetailList,
  "/stock/StockOutList": StockOutList,
  "/stock/StockOutDetailList": StockOutDetailList,
  "/stock/StockBadList": StockBadList,
  "/stock/StockCheckList": StockCheckList,
  "/stock/StockAssembleList": StockAssembleList,
  "/stock/StockDisassemblyList": StockDisassemblyList,


  //销售管理
  "/sell/SellList": SellList,
  "/sell/SellDetailList":SellDetailList,
  "/sell/SellReturnList": SellReturnList,
  "/sell/SellReturnDetailList": SellReturnDetailList,

  //报表分析
  "/report/PurchaseStatistics": PurchaseStatistics,
  "/report/BunkStatistics": BunkStatistics,
  "/report/SellAreaStatistics": SellAreaStatistics,
  "/report/SellMonthStatistics": SellMonthStatistics,

  //财务管理
  "/payment/BillList": BillList,
  "/payment/BillRecordList": BillRecordList,
  "/payment/PayList": PayList,

};
export default vueList;
