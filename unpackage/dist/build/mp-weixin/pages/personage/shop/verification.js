(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/personage/shop/verification"],{2792:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=c(e("a34a")),r=e("26cb"),i=e("3b74"),u=e("21ff");function c(t){return t&&t.__esModule?t:{default:t}}function a(t,n,e,o,r,i,u){try{var c=t[i](u),a=c.value}catch(f){return void e(f)}c.done?n(a):Promise.resolve(a).then(o,r)}function f(t){return function(){var n=this,e=arguments;return new Promise((function(o,r){var i=t.apply(n,e);function u(t){a(i,o,r,u,c,"next",t)}function c(t){a(i,o,r,u,c,"throw",t)}u(void 0)}))}}function s(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);n&&(o=o.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,o)}return e}function d(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?s(Object(e),!0).forEach((function(n){l(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):s(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}function l(t,n,e){return n in t?Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!0,writable:!0}):t[n]=e,t}var p={data:function(){return{infoData:{},codeInfo:"",confirm:(0,u.throttle)(this.handleConfirm)}},computed:d(d({},(0,r.mapGetters)(["userInfo"])),{},{isCanUse:function(){return+this.infoData.is_ok},btnText:function(){return this.isCanUse?"核销优惠券":this.infoData.error_text}}),onLoad:function(t){this.codeInfo=t.codeInfo},onShow:function(){this.getScanCouponInfo()},methods:{getScanCouponInfo:function(){var t=this;(0,i.getScanCouponInfo)({code_info:this.codeInfo}).then((function(n){var e=n.data;t.infoData=e})).catch((function(){setTimeout((function(){t.$router.go(-1)}),1e3)}))},handleConfirm:function(){this.isCanUse&&this.verificationCoupon()},verificationCoupon:function(){var n=this;return f(o.default.mark((function e(){var r,u;return o.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,(0,i.verificationCoupon)({shops_user_coupon_id:n.infoData.shops_user_coupon_id});case 2:r=e.sent,u=r.success,u?(t.showToast({title:"核销成功",icon:"none"}),setTimeout((function(){n.$router.go(-1)}),500)):t.showToast({title:"核销失败",icon:"none"});case 5:case"end":return e.stop()}}),e)})))()}}};n.default=p}).call(this,e("543d")["default"])},"64e8":function(t,n,e){"use strict";e.r(n);var o=e("7486"),r=e("6dc4");for(var i in r)"default"!==i&&function(t){e.d(n,t,(function(){return r[t]}))}(i);e("ca62");var u,c=e("f0c5"),a=Object(c["a"])(r["default"],o["b"],o["c"],!1,null,"3f93f152",null,!1,o["a"],u);n["default"]=a.exports},"6dc4":function(t,n,e){"use strict";e.r(n);var o=e("2792"),r=e.n(o);for(var i in o)"default"!==i&&function(t){e.d(n,t,(function(){return o[t]}))}(i);n["default"]=r.a},7486:function(t,n,e){"use strict";var o;e.d(n,"b",(function(){return r})),e.d(n,"c",(function(){return i})),e.d(n,"a",(function(){return o}));var r=function(){var t=this,n=t.$createElement;t._self._c;t._isMounted||(t.e0=function(n){return t.$router.go(-1)})},i=[]},ca62:function(t,n,e){"use strict";var o=e("f5dd"),r=e.n(o);r.a},e22b:function(t,n,e){"use strict";(function(t){e("f38a");o(e("66fd"));var n=o(e("64e8"));function o(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=e,t(n.default)}).call(this,e("543d")["createPage"])},f5dd:function(t,n,e){}},[["e22b","common/runtime","common/vendor"]]]);