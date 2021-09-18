import Vue from 'vue'
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 用到element-ui的哪些组件，要来这里按需导入
// 导入弹框提示组件

// 注册为全局可用的对象
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
