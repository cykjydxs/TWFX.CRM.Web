<template>
  <remote-js :src="this.jsUrl" @load-js-finish="this.jsLoadCallBack"></remote-js>
</template>

<script>
  //引入远程JS,通过此组件实现
  //参考地址：https://blog.csdn.net/olianyou1/article/details/79142851
  export default {
    components: {
      'remote-js': {
        render (createElement) {
          var self = this
          return createElement('script', {
            attrs: { type: 'text/javascript', src: this.src },
            on: {
              load: function () {
                self.$emit('load-js-finish')
              }
            }
          })
        },
        props: {
          src: { type: String, required: true }
        }
      }
    },
    props: {
      jsUrl: { type: String, required: true },// 需要加载的外部url
      jsLoadCallBack: Function// 外部js加载完成回调
    }
  }
</script>

<!--用法-->
<!--<template>-->
  <!--<remote-js :js-url="'http://cdn.ronghub.com/RongIMLib-2.2.5.js'" :js-load-call-back="loadRongJs"></remote-js>-->
<!--</template>-->

<!--<script>-->
  <!--import RemoteJs from '@/components/RemoteJs'// 导入组件-->
  <!--export default {-->
    <!--components: {-->
      <!--RemoteJs-->
    <!--},-->
    <!--methods: {-->
      <!--loadRongJs() {-->
        <!--// 当使用远程js里的内容时请添加"//eslint-disable-line"防止eslint检测报错-->
        <!--console.log(RongIMLib) //eslint-disable-line-->
      <!--}-->
    <!--}-->
  <!--}-->
<!--</script>-->

