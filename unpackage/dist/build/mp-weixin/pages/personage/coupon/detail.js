(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/personage/coupon/detail"],{"622f":function(n,o,e){"use strict";e.r(o);var t=e("bb11"),r=e.n(t);for(var s in t)"default"!==s&&function(n){e.d(o,n,(function(){return t[n]}))}(s);o["default"]=r.a},"6d0d":function(n,o,e){"use strict";e.d(o,"b",(function(){return r})),e.d(o,"c",(function(){return s})),e.d(o,"a",(function(){return t}));var t={uniNavBar:function(){return e.e("uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar").then(e.bind(null,"35c2"))},uniIcons:function(){return Promise.all([e.e("common/vendor"),e.e("uni_modules/uni-icons/components/uni-icons/uni-icons")]).then(e.bind(null,"9a3b"))}},r=function(){var n=this,o=n.$createElement,e=(n._self._c,n.isCoupon&&n.expanded?n.couponRule.replace(/\r\n|\n/g,"<br/>"):null);n._isMounted||(n.e0=function(o){return n.$router.go(-1)},n.e1=function(o){o.stopPropagation(),n.popoverVisible=!0},n.e2=function(o){n.expanded=!0},n.e3=function(o){n.expanded=!n.expanded}),n.$mp.data=Object.assign({},{$root:{g0:e}})},s=[]},"96d7":function(n,o,e){"use strict";(function(n){e("f38a");t(e("66fd"));var o=t(e("afb7"));function t(n){return n&&n.__esModule?n:{default:n}}wx.__webpack_require_UNI_MP_PLUGIN__=e,n(o.default)}).call(this,e("543d")["createPage"])},afb7:function(n,o,e){"use strict";e.r(o);var t=e("6d0d"),r=e("622f");for(var s in r)"default"!==s&&function(n){e.d(o,n,(function(){return r[n]}))}(s);e("eca3");var i,u=e("f0c5"),c=Object(u["a"])(r["default"],t["b"],t["c"],!1,null,"13f29910",null,!1,t["a"],i);o["default"]=c.exports},bb11:function(n,o,e){"use strict";(function(n){Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var t=e("c92a"),r=e("21ff"),s=function(){e.e("pages/personage/coupon/components/ExplainPopover").then(function(){return resolve(e("ef6c"))}.bind(null,e)).catch(e.oe)},i={components:{ExplainPopover:s},data:function(){return{type:1,popoverVisible:!1,expanded:!1,goodsInfo:{},orderInfo:{}}},computed:{shopInfo:function(){return this.orderInfo.shops_user_coupon_info||{}},couponInfo:function(){return this.shopInfo.shops_user_coupon_data?this.shopInfo.shops_user_coupon_data:{}},couponRule:function(){var n=this.couponInfo.coupon_rule||"";return n.replace(/\r\n|\n/g,"<br/>")},isCoupon:function(){return 1===this.type},creaditPrice:function(){return+this.orderInfo.happiness_price}},onLoad:function(n){this.order_id=n.id,this.type=+n.type,this.getData()},methods:{getData:function(){var n=this;(0,t.getOrderDetail)({order_project_id:this.order_id,order_type:this.isCoupon?3:4}).then((function(o){o.success&&(n.goodsInfo=o.order_goods_specs_list[0],n.orderInfo=o.order_project_info)}))},goLocation:function(){(0,r.openLocation)({name:this.shopInfo.shops_address,address:"".concat(this.shopInfo.shops_address_province).concat(this.shopInfo.shops_address_city).concat(this.shopInfo.shops_address_area).concat(this.shopInfo.shops_address),longitude:this.shopInfo.shops_longitude,latitude:this.shopInfo.shops_latitude})},copy:function(){n.setClipboardData({data:this.orderInfo.order_numb,success:function(){n.showToast({title:"复制成功",icon:"none"})}})}}};o.default=i}).call(this,e("543d")["default"])},eca3:function(n,o,e){"use strict";var t=e("f5cc"),r=e.n(t);r.a},f5cc:function(n,o,e){}},[["96d7","common/runtime","common/vendor"]]]);