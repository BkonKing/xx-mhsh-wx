(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/activity/award/verification"],{"151b":function(t,n,e){"use strict";e.r(n);var a=e("8403"),r=e.n(a);for(var u in a)"default"!==u&&function(t){e.d(n,t,(function(){return a[t]}))}(u);n["default"]=r.a},"36e9":function(t,n,e){},"3b3d":function(t,n,e){"use strict";var a=e("36e9"),r=e.n(a);r.a},8403:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=u(e("a34a")),r=e("beeb");function u(t){return t&&t.__esModule?t:{default:t}}function i(t,n,e,a,r,u,i){try{var o=t[u](i),c=o.value}catch(f){return void e(f)}o.done?n(c):Promise.resolve(c).then(a,r)}function o(t){return function(){var n=this,e=arguments;return new Promise((function(a,r){var u=t.apply(n,e);function o(t){i(u,a,r,o,c,"next",t)}function c(t){i(u,a,r,o,c,"throw",t)}o(void 0)}))}}var c={data:function(){return{id:"",infoData:{}}},computed:{btnClassName:function(){var t={1:"tf-btn-primary",2:"tf-btn-gray",3:"tf-btn-red"},n=this.infoData.type;return t[n]}},onLoad:function(t){var n=t.id;this.id=n||"40",this.getAwardScan()},filters:{typeText:function(t){var n={1:"确定核销",2:"已核销",3:"奖品不属于我方"};return n[t]||""}},methods:{getAwardScan:function(){var t=this;return o(a.default.mark((function n(){var e,u;return a.default.wrap((function(n){while(1)switch(n.prev=n.next){case 0:return n.next=2,(0,r.getAwardScan)({award_log_id:t.id});case 2:e=n.sent,u=e.data,t.infoData=u;case 5:case"end":return n.stop()}}),n)})))()},awardOperation:function(){var n=this;return o(a.default.mark((function e(){var u,i;return a.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(+n.infoData.is_convert||!+n.infoData.is_power){e.next=6;break}return e.next=3,(0,r.awardOperation)({award_log_id:n.id});case 3:u=e.sent,i=u.success,i&&(t.showToast({title:"核销成功"}),n.getAwardScan());case 6:case"end":return e.stop()}}),e)})))()},callPhone:function(n){t.makePhoneCall({phoneNumber:n})}}};n.default=c}).call(this,e("543d")["default"])},a00f:function(t,n,e){"use strict";(function(t){e("f38a");a(e("66fd"));var n=a(e("da1b"));function a(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=e,t(n.default)}).call(this,e("543d")["createPage"])},d910:function(t,n,e){"use strict";e.d(n,"b",(function(){return r})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){return a}));var a={uniNavBar:function(){return e.e("uni_modules/uni-nav-bar/components/uni-nav-bar/uni-nav-bar").then(e.bind(null,"35c2"))}},r=function(){var t=this,n=t.$createElement,e=(t._self._c,t._f("typeText")(t.infoData.type));t._isMounted||(t.e0=function(n){return t.$router.go(-1)}),t.$mp.data=Object.assign({},{$root:{f0:e}})},u=[]},da1b:function(t,n,e){"use strict";e.r(n);var a=e("d910"),r=e("151b");for(var u in r)"default"!==u&&function(t){e.d(n,t,(function(){return r[t]}))}(u);e("3b3d");var i,o=e("f0c5"),c=Object(o["a"])(r["default"],a["b"],a["c"],!1,null,"427fe774",null,!1,a["a"],i);n["default"]=c.exports}},[["a00f","common/runtime","common/vendor"]]]);