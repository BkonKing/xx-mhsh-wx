(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabBar/credit/components/GetCouponList"],{350:function(e,t,n){"use strict";n.r(t);var r=n(351),o=n(353);for(var a in o)"default"!==a&&function(e){n.d(t,e,(function(){return o[e]}))}(a);n(355);var i,c=n(11),u=Object(c["default"])(o["default"],r["render"],r["staticRenderFns"],!1,null,"28d18c82",null,!1,r["components"],i);u.options.__file="pages/tabBar/credit/components/GetCouponList.vue",t["default"]=u.exports},351:function(e,t,n){"use strict";n.r(t);var r=n(352);n.d(t,"render",(function(){return r["render"]})),n.d(t,"staticRenderFns",(function(){return r["staticRenderFns"]})),n.d(t,"recyclableRender",(function(){return r["recyclableRender"]})),n.d(t,"components",(function(){return r["components"]}))},352:function(e,t,n){"use strict";var r;n.r(t),n.d(t,"render",(function(){return o})),n.d(t,"staticRenderFns",(function(){return i})),n.d(t,"recyclableRender",(function(){return a})),n.d(t,"components",(function(){return r}));var o=function(){var e=this,t=e.$createElement,n=(e._self._c,e.__map(e.data,(function(t,n){var r=e.__get_orig(t),o=e.__map(t.list,(function(t,n){var r=e.__get_orig(t),o=t.is_complete?e._f("btnText")(t):null;return{$orig:r,f0:o}}));return{$orig:r,l0:o}})));e.$mp.data=Object.assign({},{$root:{l1:n}})},a=!1,i=[];o._withStripped=!0},353:function(e,t,n){"use strict";n.r(t);var r=n(354),o=n.n(r);for(var a in r)"default"!==a&&function(e){n.d(t,e,(function(){return r[e]}))}(a);t["default"]=o.a},354:function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r=c(n(13)),o=n(39),a=n(37),i=n(82);function c(e){return e&&e.__esModule?e:{default:e}}function u(e,t,n,r,o,a,i){try{var c=e[a](i),u=c.value}catch(s){return void n(s)}c.done?t(u):Promise.resolve(u).then(r,o)}function s(e){return function(){var t=this,n=arguments;return new Promise((function(r,o){var a=e.apply(t,n);function i(e){u(a,r,o,i,c,"next",e)}function c(e){u(a,r,o,i,c,"throw",e)}i(void 0)}))}}var p=function(){n.e("components/TfPopup/index").then(function(){return resolve(n(422))}.bind(null,n)).catch(n.oe)},d=function(){n.e("pages/tabBar/credit/components/CouponItem").then(function(){return resolve(n(515))}.bind(null,n)).catch(n.oe)},f={components:{TfPopup:p,CouponItem:d},data:function(){return{showPayCredit:!1,activeCoupon:{},orderId:"",payAmount:0,payOrderInfo:{},data:[],activeShopIndex:0,activeCouponIndex:0,receive:(0,a.throttle)(this.handleReceive)}},filters:{btnText:function(e){return 1===+e.coupon_mode?"免费领":2===+e.pay_type?"￥".concat(e.pay_money,"抢券"):1===+e.pay_type?"".concat(e.pay_money,"抢券"):void 0}},methods:{init:function(){this.getCouponReceiveList()},getCouponReceiveList:function(){var e=this;return s(r.default.mark((function t(){var n,o;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,(0,i.getCouponReceiveList)();case 2:n=t.sent,o=n.data,e.data=o,e.data&&e.data.length||e.$emit("noData");case 6:case"end":return t.stop()}}),t)})))()},handleReceive:function(e,t,n){this.activeCoupon=e,this.activeShopIndex=t,this.activeCouponIndex=n,1!==+e.pay_type?this.receiveCoupon():this.showPayCredit=!0},receiveCoupon:function(){var e=this;(0,i.receiveCoupon)({shops_coupon_id:this.activeCoupon.shops_coupon_id}).then((function(t){var n=t.order_id;if(2===+e.activeCoupon.pay_type)return e.orderId=n,e.payAmount=e.activeCoupon.pay_money,void e.createPayOrder();e.receiveSuccess()})).catch((function(t){var n=t.code;203===+n&&e.deleteCoupon()}))},receiveSuccess:function(){var t=this.activeCoupon,n=t.coupon_type,r=t.miane,o=t.pay_type;1===+o&&(this.showPayCredit=!1);var a=1===+n?"用".concat(r,"元"):"享".concat(r,"折");e.showToast({title:"恭喜，抢到了！\n 下单可".concat(a),duration:2e3,icon:"none"}),this.getCouponReceiveList(),this.$emit("getSuccess")},deleteCoupon:function(){var e=this.data[this.activeShopIndex].list;e.splice(this.activeCouponIndex,1),0===e.length&&this.data.splice(this.activeShopIndex,1)},createPayOrder:function(){var e=this;return s(r.default.mark((function t(){var n;return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:if(n=e.$store.state.openId,n){t.next=6;break}return t.next=4,e.$store.dispatch("wxLogin");case 4:return e.createPayOrder(),t.abrupt("return");case 6:(0,o.payOrderUp)({order_id:e.orderId,pay_type:1,pay_price:e.payAmount,openid:n}).then((function(t){t.success&&t.data&&(e.payOrderInfo=t.data,e.wxPayUp())}));case 7:case"end":return t.stop()}}),t)})))()},wxPayUp:function(){var e=this;return s(r.default.mark((function t(){return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:return t.next=2,(0,a.requestPayment)({timeStamp:e.payOrderInfo.timeStamp,nonceStr:e.payOrderInfo.nonceStr,package:e.payOrderInfo.package,paySign:e.payOrderInfo.paySign,signType:e.payOrderInfo.signType});case 2:e.receiveSuccess();case 3:case"end":return t.stop()}}),t)})))()},goShopIntroduce:function(e){this.$router.push({path:"/pages/personage/shop/introduce",query:{shopId:e}})}}};t.default=f}).call(this,n(1)["default"])},355:function(e,t,n){"use strict";n.r(t);var r=n(356),o=n.n(r);for(var a in r)"default"!==a&&function(e){n.d(t,e,(function(){return r[e]}))}(a);t["default"]=o.a},356:function(e,t,n){}}]);
//# sourceMappingURL=../../../../../.sourcemap/mp-weixin/pages/tabBar/credit/components/GetCouponList.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/tabBar/credit/components/GetCouponList-create-component',
    {
        'pages/tabBar/credit/components/GetCouponList-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(350))
        })
    },
    [['pages/tabBar/credit/components/GetCouponList-create-component']]
]);
