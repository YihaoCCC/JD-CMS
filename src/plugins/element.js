import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

// console.log(msg)

// const messages = {
//   [localeEN.name]: {
//     el: localeEN.el,
//     i18n: msg.en.i18n,
//   },
//   [localeZH.name]: {
//     el: localeZH.el,
//     i18n: msg.zh.i18n,
//   },
// }


export default (app) => {
  app.use(ElementPlus)
}
