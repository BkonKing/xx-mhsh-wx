(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/credit/payment"],{"0f78":function(t,e,n){"use strict";n.r(e);var o=n("cbfa"),r=n("527f");for(var s in r)"default"!==s&&function(t){n.d(e,t,(function(){return r[t]}))}(s);n("48a8");var a,i=n("f0c5"),c=Object(i["a"])(r["default"],o["b"],o["c"],!1,null,"4d683855",null,!1,o["a"],a);e["default"]=c.exports},"48a8":function(t,e,n){"use strict";var o=n("9280"),r=n.n(o);r.a},"527f":function(t,e,n){"use strict";n.r(e);var o=n("f50d"),r=n.n(o);for(var s in o)"default"!==s&&function(t){n.d(e,t,(function(){return o[t]}))}(s);e["default"]=r.a},"57c2":function(t,e,n){"use strict";(function(t){n("f38a");o(n("66fd"));var e=o(n("0f78"));function o(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},9280:function(t,e,n){},cbfa:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return s})),n.d(e,"a",(function(){return o}));var o={uniNavBar:function(){return n.e("uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar").then(n.bind(null,"35c2"))}},r=function(){var t=this,e=t.$createElement,n=(t._self._c,t._f("payText")(t.type));t._isMounted||(t.e0=function(e){return t.$router.go(-1)},t.e1=function(e){t.value=""},t.e2=function(e){t.paypassword=""}),t.$mp.data=Object.assign({},{$root:{f0:n}})},s=[]},f50d:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=n("26cb"),r=n("c92a");function s(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,o)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?s(Object(n),!0).forEach((function(e){i(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function i(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var c=function(){n.e("modules/TfUserInfo/index").then(function(){return resolve(n("2428"))}.bind(null,n)).catch(n.oe)},u=function(){n.e("components/TfDialog/index").then(function(){return resolve(n("187d"))}.bind(null,n)).catch(n.oe)},f=function(){n.e("components/TfPasswordInput/index").then(function(){return resolve(n("bdda"))}.bind(null,n)).catch(n.oe)},d={name:"CreditPayment",components:{TfUserInfo:c,TfDialog:u,TfPasswordInput:f},computed:a({},(0,o.mapGetters)(["userInfo"])),data:function(){return{type:"1",title:"",codeId:"",info:{},value:"",remarks:"",showKeyboard:!1,payCodeShow:!1,paypassword:""}},onLoad:function(t){var e=t.type,n=t.value,o=t.avatar,r=t.realname,s=t.mobile,a=t.credits,i=t.remarks;this.type=e,this.codeId=n,this.info={avatar:o,realname:r,mobile:s},this.title="2"!==this.type?"付款":"收款","3"===this.type&&(this.value=a,this.remarks=i)},onShow:function(){this.paypassword=""},methods:{handlePay:function(){+this.value<=0?t.showToast({title:"请输入金额",icon:"none",duration:2e3}):this.userInfo.is_setpaypassword?"2"!==this.type?(this.payCodeShow=!0,this.$refs.passwordInput.focus()):this.skCredits():this.setPaymentPassword("您还未设置支付密码！")},payEnter:function(){6===this.paypassword.length?"1"===this.type?this.collectCredits():"3"===this.type&&this.paymentCredits():t.showToast({title:"请输入完整密码",icon:"none",duration:2e3})},paymentCredits:function(){var e=this,n={credits:this.value,code_id:this.codeId,remarks:this.remarks,paypassword:this.paypassword};(0,r.paymentCredits)(n).then((function(n){t.showModal({content:"付款成功",showCancel:!1,success:function(t){t.confirm&&e.$router.go(-1)}})})).catch((function(t){var n=t.message;e.setPaymentPassword(n)}))},collectCredits:function(){var e=this,n={credits:this.value,remarks:this.remarks,code_id:this.codeId,paypassword:this.paypassword};(0,r.collectCredits)(n).then((function(n){t.showModal({content:"付款成功",showCancel:!1,success:function(t){t.confirm&&e.$router.go(-1)}})})).catch((function(t){var n=t.message;e.setPaymentPassword(n)}))},skCredits:function(){var e=this;(0,r.skCredits)({credits:this.value,remarks:this.remarks,code_id:this.codeId}).then((function(n){t.showModal({content:"请等待对方确认付款",showCancel:!1,success:function(t){t.confirm&&e.$router.go(-1)}})}))},setPaymentPassword:function(e){var n=this;"您还未设置支付密码！"===e?t.showModal({title:"您还未设置支付密码，是否前往设置",success:function(t){t.confirm?(n.payCodeShow=!1,n.$nextTick((function(){n.$router.push("/pages/personage/information/payment-code?status=0")}))):t.cancel&&n.$refs.passwordInput.focus()}}):t.showToast({title:e,icon:"none",duration:2e3})}},filters:{payText:function(t){var e={1:"付款",2:"收款",3:"向您收款"};return e[t]}}};e.default=d}).call(this,n("543d")["default"])}},[["57c2","common/runtime","common/vendor"]]]);