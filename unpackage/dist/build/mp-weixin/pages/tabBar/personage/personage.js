(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabBar/personage/personage"],{"2a88":function(n,e,t){"use strict";var o=t("5646"),i=t.n(o);i.a},5646:function(n,e,t){},"60a7":function(n,e,t){"use strict";(function(n){t("f38a");o(t("66fd"));var e=o(t("dc8d"));function o(n){return n&&n.__esModule?n:{default:n}}wx.__webpack_require_UNI_MP_PLUGIN__=t,n(e.default)}).call(this,t("543d")["createPage"])},be9d:function(n,e,t){"use strict";t.d(e,"b",(function(){return i})),t.d(e,"c",(function(){return r})),t.d(e,"a",(function(){return o}));var o={uniNavBar:function(){return t.e("uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar").then(t.bind(null,"35c2"))},uniList:function(){return t.e("uni_modules/uni-list/components/uni-list/uni-list").then(t.bind(null,"fa23"))},uniListItem:function(){return t.e("uni_modules/uni-list/components/uni-list-item/uni-list-item").then(t.bind(null,"0917"))}},i=function(){var n=this,e=n.$createElement,t=(n._self._c,n.hasLogIn&&"0"!=n.userType?n._f("houseRoleColor")(n.userType):null),o=n.hasLogIn&&"0"!=n.userType?n._f("houseRoleColor")(n.userType):null,i=n.hasLogIn&&"0"!=n.userType?n._f("houseRoleText")(n.userType):null,r=n.hasLogIn&&n.userInfo.position?n._f("houseRoleColor")(5):null,s=n.hasLogIn&&n.userInfo.position?n._f("houseRoleColor")(5):null,u=n._f("signText")(n.userInfo.signin_status);n._isMounted||(n.e0=function(e){return n.$router.push("/pages/personage/information/index")},n.e1=function(e){return n.$router.push("/pages/personage/message/index")},n.e2=function(e){return n.$router.push("/pages/personage/question/index")},n.e3=function(e){return n.$router.push("/pages/personage/feedback/index")},n.e4=function(e){return n.$router.push("/pages/personage/setting/index")}),n.$mp.data=Object.assign({},{$root:{f0:t,f1:o,f2:i,f3:r,f4:s,f5:u}})},r=[]},d9bb:function(n,e,t){"use strict";t.r(e);var o=t("f79b"),i=t.n(o);for(var r in o)"default"!==r&&function(n){t.d(e,n,(function(){return o[n]}))}(r);e["default"]=i.a},dc8d:function(n,e,t){"use strict";t.r(e);var o=t("be9d"),i=t("d9bb");for(var r in i)"default"!==r&&function(n){t.d(e,n,(function(){return i[n]}))}(r);t("2a88");var s,u=t("f0c5"),a=Object(u["a"])(i["default"],o["b"],o["c"],!1,null,"043866b7",null,!1,o["a"],s);e["default"]=a.exports},f79b:function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var o=t("26cb"),i=t("c92a"),r=t("21ff"),s=t("ec93");function u(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(n);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,o)}return t}function a(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?u(Object(t),!0).forEach((function(e){c(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):u(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function c(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}var f=function(){t.e("modules/TfCalendar/index").then(function(){return resolve(t("61ea"))}.bind(null,t)).catch(t.oe)},l=function(){t.e("pages/tabBar/credit/components/SignRuleDialog").then(function(){return resolve(t("6f48"))}.bind(null,t)).catch(t.oe)},g=function(){t.e("modules/SignInAlert/index").then(function(){return resolve(t("6a91"))}.bind(null,t)).catch(t.oe)},d={name:"PersonagePage",components:{SignRuleDialog:l,TfCalendar:f,SignInAlert:g},data:function(){return{signStatus:!0,showCalendar:!1,orderData:{},hbBannerData:{},signLoading:!1,signRuleVisible:!1,signAlertVisible:!1,signMessage:"",signOwnerCredits:"",shopData:{},sign:(0,r.throttle)(this.handleSign)}},computed:a(a({},(0,o.mapGetters)(["userInfo","userType","currentProject"])),{},{isShop:function(){return+this.shopData.is_shops},isShopStaff:function(){return+this.shopData.is_shops_clerk},hasLogIn:function(){return this.userInfo&&this.userInfo.id}}),onLoad:function(){},onShow:function(){var n=this;this.hasLogIn&&this.$store.dispatch("getMyAccount").then((function(e){var t=e.order_data,o=(e.hb_banner_data,e.shops_data);n.orderData=t,n.shopData=o||{}}))},methods:{handleSign:function(){var e=this;this.hasLogIn?0===this.userInfo.signin_status?(0,s.handlePermission)({name:"userLocation",title:"定位服务未开启",message:"为了提供更好服务，需要您开启定位"}).then((function(){e.signLoading=!0,(0,i.signin)().then((function(t){e.signLoading=!1,+t.open_box?(e.signMessage=t.message,e.signOwnerCredits=t.owner_credits,e.signAlertVisible=!0):n.showToast({title:t.message,icon:"none"}),e.$store.dispatch("getMyAccount")})).catch((function(){e.signLoading=!1}))})):2===this.userInfo.signin_status?this.signRuleVisible=!0:this.showCalendar=!0:this.goLogin()},goInformation:function(){this.$router.push("/pages/personage/information/index")},goCredit:function(){n.switchTab({url:"/pages/tabBar/credit/credit"})},goCouponList:function(){this.$router.push("/pages/personage/coupon/list")},goLogin:function(){this.$router.push("/pages/index/login")}},filters:{signText:function(n){return 1===n?"已签到":"签到"}}};e.default=d}).call(this,t("543d")["default"])}},[["60a7","common/runtime","common/vendor"]]]);