import Vue from 'vue'
import {
  Button,
  Loading,
  MessageBox,
  Notification,
  Message,
  Row,
  Col,
  Card,
  Container,
  Aside,
  Main,
  Table,
  TableColumn,
  Header,
  Input,
  Tooltip,
  Link
} from 'element-ui'

Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Header)
Vue.use(Input)
Vue.use(Tooltip)
Vue.use(Link)

Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
