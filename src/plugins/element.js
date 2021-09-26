import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option
} from 'element-ui'
// 用到element-ui的哪些组件，要来这里按需导入
// 导入弹框提示组件

// 注册为全局可用的对象
Vue.use(Option)
Vue.use(Select)
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Tree)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Switch)
Vue.use(Breadcrumb)
Vue.use(Tooltip)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Table)
Vue.use(TableColumn)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
