(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabBar/credit/credit"],{76:function(n,e,t){"use strict";(function(n){t(5);r(t(3));var e=r(t(77));function r(n){return n&&n.__esModule?n:{default:n}}wx.__webpack_require_UNI_MP_PLUGIN__=t,n(e.default)}).call(this,t(1)["createPage"])},77:function(n,e,t){"use strict";t.r(e);var r=t(78),o=t(80);for(var i in o)"default"!==i&&function(n){t.d(e,n,(function(){return o[n]}))}(i);t(83),t(85);var s,c=t(11),u=Object(c["default"])(o["default"],r["render"],r["staticRenderFns"],!1,null,"991f8892",null,!1,r["components"],s);u.options.__file="pages/tabBar/credit/credit.vue",e["default"]=u.exports},78:function(n,e,t){"use strict";t.r(e);var r=t(79);t.d(e,"render",(function(){return r["render"]})),t.d(e,"staticRenderFns",(function(){return r["staticRenderFns"]})),t.d(e,"recyclableRender",(function(){return r["recyclableRender"]})),t.d(e,"components",(function(){return r["components"]}))},79:function(n,e,t){"use strict";var r;t.r(e),t.d(e,"render",(function(){return o})),t.d(e,"staticRenderFns",(function(){return s})),t.d(e,"recyclableRender",(function(){return i})),t.d(e,"components",(function(){return r}));try{r={uniNavBar:function(){return t.e("uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar").then(t.bind(null,274))}}}catch(c){if(-1===c.message.indexOf("Cannot find module")||-1===c.message.indexOf(".vue"))throw c;console.error(c.message),console.error("1. 排查组件名称拼写是否正确"),console.error("2. 排查组件是否符合 easycom 规范，文档：https://uniapp.dcloud.net.cn/collocation/pages?id=easycom"),console.error("3. 若组件不符合 easycom 规范，需手动引入，并在 components 中注册该组件")}var o=function(){var n=this,e=n.$createElement;n._self._c;n._isMounted||(n.e0=function(e){n.showCouponCentre=!1})},i=!1,s=[];o._withStripped=!0},80:function(n,e,t){"use strict";t.r(e);var r=t(81),o=t.n(r);for(var i in r)"default"!==i&&function(n){t.d(e,n,(function(){return r[n]}))}(i);e["default"]=o.a},81:function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=a(t(13)),o=t(16),i=t(39),s=t(82),c=t(37),u=t(73);function a(n){return n&&n.__esModule?n:{default:n}}function d(n,e,t,r,o,i,s){try{var c=n[i](s),u=c.value}catch(a){return void t(a)}c.done?e(u):Promise.resolve(u).then(r,o)}function f(n){return function(){var e=this,t=arguments;return new Promise((function(r,o){var i=n.apply(e,t);function s(n){d(i,r,o,s,c,"next",n)}function c(n){d(i,r,o,s,c,"throw",n)}s(void 0)}))}}function l(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),t.push.apply(t,r)}return t}function h(n){for(var e=1;e<arguments.length;e++){var t=null!=arguments[e]?arguments[e]:{};e%2?l(Object(t),!0).forEach((function(e){p(n,e,t[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):l(Object(t)).forEach((function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(t,e))}))}return n}function p(n,e,t){return e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}var g=function(){t.e("modules/TfCalendar/index").then(function(){return resolve(t(329))}.bind(null,t)).catch(t.oe)},b=function(){t.e("pages/tabBar/credit/components/GetCouponList").then(function(){return resolve(t(350))}.bind(null,t)).catch(t.oe)},v=function(){t.e("pages/tabBar/credit/components/TaskList").then(function(){return resolve(t(357))}.bind(null,t)).catch(t.oe)},m=function(){t.e("modules/SignInAlert/index").then(function(){return resolve(t(343))}.bind(null,t)).catch(t.oe)},_=function(){t.e("pages/tabBar/credit/components/SignRuleDialog").then(function(){return resolve(t(336))}.bind(null,t)).catch(t.oe)},y={components:{TfCalendar:g,SignInAlert:m,SignRuleDialog:_,GetCouponList:b,TaskList:v},data:function(){return{showCalendar:!1,signinToday:0,credits:"--",taskData:[],signLoading:!1,entranceStatus:!0,signRuleVisible:!1,sd_credits:"",ky_credits:"",signAlertVisible:!1,signMessage:"",signOwnerCredits:"",tabActive:"1",offsetTop:0,shopBannerInfo:{},showCouponCentre:!0,throttleSignIn:(0,c.throttle)(this.handleSignIn)}},computed:h(h({},(0,o.mapGetters)(["userType","userInfo"])),{},{shopId:function(){return this.userInfo.shops_id},isShowBanner:function(){return+this.shopBannerInfo.z_money},bannerText:function(){var n=this.shopBannerInfo.banner_text;if(!n)return"";var e=n.split("$money$");if(e.length<2)return n;var t=e[0],r=e[1],o=this.shopBannerInfo.z_money;return"".concat(t,'<span class="shop-coupon-banner-number">').concat(o,"</span>").concat(r)},freezeCredit:function(){return+this.sd_credits},hasLogIn:function(){return this.userInfo&&this.userInfo.id}}),onLoad:function(){this.offsetTop=n.getSystemInfoSync().statusBarHeight},onShow:function(){this.init()},onPullDownRefresh:function(){this.init()},methods:{init:function(){this.hasLogIn&&(this.getCreditsAccount(),this.getShopCouponBanner(),this.$refs.getCouponList&&this.$refs.getCouponList.init())},getCreditsAccount:function(){var n=this;(0,i.getCreditsAccount)().then((function(e){var t=e.data;n.signinToday=t.signin_status,n.taskData=t.task_list,n.credits=t.credits,n.entranceStatus=!!+t.mj_status,n.ky_credits=t.ky_credits,n.sd_credits=t.sd_credits}))},getShopCouponBanner:function(){var n=this;return f(r.default.mark((function e(){var t,o;return r.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,(0,s.getShopCouponBanner)({shops_id:n.shopId});case 2:t=e.sent,o=t.data,n.shopBannerInfo=o||{};case 5:case"end":return e.stop()}}),e)})))()},handleSignIn:function(){this.hasLogIn?1===this.signinToday?this.showCalendar=!0:2===this.signinToday?this.signRuleVisible=!0:this.signin():this.$router.push("/pages/index/login")},signin:function(){var e=this;(0,u.handlePermission)({name:"userLocation",title:"定位服务未开启",message:"为了提供更好服务，需要您开启定位"}).then((function(){e.signLoading=!0,(0,i.signin)().then((function(t){e.signLoading=!1,+t.open_box?(e.signMessage=t.message,e.signOwnerCredits=t.owner_credits,e.signAlertVisible=!0):n.showToast({title:t.message,icon:"none"}),e.getCreditsAccount()})).catch((function(){e.signLoading=!1}))}))},goScanCode:function(n){this.$router.push({path:"/pages/personage/scanCode/index",query:{current:n}})},goCreditRecord:function(){this.$router.push("/pages/credit/creditRecord")},onTabChange:function(n){this.tabActive=n.detail.name},openCouponCentre:function(){this.tabActive="1",this.$nextTick((function(){n.pageScrollTo({selector:".credit-tabs",duration:300})}))}}};e.default=y}).call(this,t(1)["default"])},83:function(n,e,t){"use strict";t.r(e);var r=t(84),o=t.n(r);for(var i in r)"default"!==i&&function(n){t.d(e,n,(function(){return r[n]}))}(i);e["default"]=o.a},84:function(n,e,t){},85:function(n,e,t){"use strict";t.r(e);var r=t(86),o=t.n(r);for(var i in r)"default"!==i&&function(n){t.d(e,n,(function(){return r[n]}))}(i);e["default"]=o.a},86:function(n,e,t){}},[[76,"common/runtime","common/vendor"]]]);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/tabBar/credit/credit.js.map