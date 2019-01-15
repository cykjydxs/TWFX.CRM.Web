
<template>
  <div id="app">
    <transition name="fade"
                mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

  //import {routes} from "./router/menu.js"

export default {
  name: 'App',
  //防止刷新路由丢失；由于在刷新的时候单页应用会重新初始化，这时候所有配置的路由都会丢失，
  //只有本地配置的路由能够跳转。这时候我们可以在app.vue（ps：不论在哪里进行刷新，app.vue都会执行）中执行如下代码
  created() {
    // 当this.$router.options.routes的长度为1，且本地缓存存在菜单列表的时候才重新配置路由
    let menuList = JSON.parse(sessionStorage.getItem('twfxmenu'));
    if (menuList != null) {
      if (this.$router.options.routes.length <= 1) {
        //路由菜单
        var twfxMenu = [];
        //一级菜单
        var menuOneList = this.Enumerable.from(menuList).where(p => p.PARENTMENUID == null || p.PARENTMENUID == 0).orderBy(o => o.MENUSORT).toArray();
        //二级菜单
        var menuTwoList = this.Enumerable.from(menuList).where(p => p.PARENTMENUID != null && p.PARENTMENUID != 0).toArray();
        //循环
        for (var i = 0; i < menuOneList.length; i++) {
          var curMenu = menuOneList[i];
          //二级菜单
          let child = [];
          var curTowList = this.Enumerable.from(menuTwoList).where(p => p.PARENTMENUID == curMenu.MENUID).orderBy(o => o.MENUSORT).toArray();
          for (var ch = 0; ch < curTowList.length; ch++) {
            var curMenuChild = curTowList[ch];
            var childMenu = {
              path: curMenuChild.MENUURL,
              name: curMenuChild.MENUNAME,
              iconCls: curMenuChild.MENUICON,
              hidden: curMenuChild.MENUHIDDEN == 'Y' ? true : false,
              component: this.$VueList[curMenuChild.COMPONENT],
              meta: {},
            };
            child.push(childMenu);
          }
          let menu = {
            path: curMenu.MENUURL,
            name: curMenu.MENUNAME,
            iconCls: curMenu.MENUICON,
            hidden: curMenu.MENUHIDDEN == 'Y' ? true : false,
            component: resolve => require(['@/components/MasterPage.vue'], resolve),
            children: child,
          };
          twfxMenu.push(menu);
        }
        let menu404 = {
          path: '*',
          hidden: true,
          redirect: '/Error',
        };
        twfxMenu.push(menu404);
        this.$router.addRoutes(twfxMenu);
        // this.$router不是响应式的，所以手动将路由元注入路由对象
        for (var i = 0; i < twfxMenu.length; i++) {
          this.$router.options.routes.push(twfxMenu[i]);
        }
      }
    }
  }
}
</script>

<style>

  body {
    margin: 0px;
    padding: 0px;
    /*font-family:"微软雅黑","Microsoft YaHei",tahoma,Arial,Helvetica,sans-serif,"宋体";*/
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
  }

  #app {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }

  .el-submenu [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }

  .el-menu-item [class^=fa] {
    vertical-align: baseline;
    margin-right: 10px;
  }

  .toolbar {
    background: #f2f2f2;
    padding: 10px;
    margin: 10px 0px;
  }
  .el-form-item {
    margin-bottom: 10px;
  }


  .fade-enter-active,
  .fade-leave-active {
    transition: all .2s ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }


  /*table表格线对齐兼容start*/
  body .el-table th.gutter{
    display: table-cell!important;
  }
  body .el-table colgroup.gutter{
    display: table-cell!important;
  }
  /*table表格线对齐兼容end*/

</style>
