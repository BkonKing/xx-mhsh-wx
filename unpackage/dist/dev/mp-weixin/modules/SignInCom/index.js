(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["modules/SignInCom/index"],{281:function(n,e,t){"use strict";t.r(e);var r=t(282),i=t(284);for(var o in i)"default"!==o&&function(n){t.d(e,n,(function(){return i[n]}))}(o);var u,s=t(11),a=Object(s["default"])(i["default"],r["render"],r["staticRenderFns"],!1,null,"564ed348",null,!1,r["components"],u);a.options.__file="modules/SignInCom/index.vue",e["default"]=a.exports},282:function(n,e,t){"use strict";t.r(e);var r=t(283);t.d(e,"render",(function(){return r["render"]})),t.d(e,"staticRenderFns",(function(){return r["staticRenderFns"]})),t.d(e,"recyclableRender",(function(){return r["recyclableRender"]})),t.d(e,"components",(function(){return r["components"]}))},283:function(n,e,t){"use strict";var r;t.r(e),t.d(e,"render",(function(){return i})),t.d(e,"staticRenderFns",(function(){return u})),t.d(e,"recyclableRender",(function(){return o})),t.d(e,"components",(function(){return r}));var i=function(){var n=this,e=n.$createElement;n._self._c},o=!1,u=[];i._withStripped=!0},284:function(n,e,t){"use strict";t.r(e);var r=t(285),i=t.n(r);for(var o in r)"default"!==o&&function(n){t.d(e,n,(function(){return r[n]}))}(o);e["default"]=i.a},285:function(n,e,t){"use strict";(function(n){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var r=u(t(13)),i=t(73),o=t(39);function u(n){return n&&n.__esModule?n:{default:n}}function s(n,e,t,r,i,o,u){try{var s=n[o](u),a=s.value}catch(c){return void t(c)}s.done?e(a):Promise.resolve(a).then(r,i)}function a(n){return function(){var e=this,t=arguments;return new Promise((function(r,i){var o=n.apply(e,t);function u(n){s(o,r,i,u,a,"next",n)}function a(n){s(o,r,i,u,a,"throw",n)}u(void 0)}))}}var c=function(){t.e("modules/SignInAlert/index").then(function(){return resolve(t(343))}.bind(null,t)).catch(t.oe)},d={name:"SignInCom",components:{SignAlert:c},props:{showLoading:{type:Boolean,default:!0}},data:function(){return{signAlertVisible:!1,signMessage:"",signOwnerCredits:""}},methods:{signIn:function(){var e=this;return a(r.default.mark((function t(){return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:(0,i.handlePermission)({name:"userLocation",title:"定位服务未开启",message:"为了提供更好服务，需要您开启定位"}).then(a(r.default.mark((function t(){return r.default.wrap((function(t){while(1)switch(t.prev=t.next){case 0:e.showLoading&&n.showLoading({title:"签到中"}),(0,o.signin)().then((function(t){e.showLoading&&n.hideLoading(),+t.open_box?(e.signMessage=t.message,e.signOwnerCredits=t.owner_credits,e.signAlertVisible=!0):n.showToast({title:t.message,icon:"none"})})).catch((function(){e.showLoading&&n.hideLoading()}));case 2:case"end":return t.stop()}}),t)}))));case 1:case"end":return t.stop()}}),t)})))()}}};e.default=d}).call(this,t(1)["default"])}}]);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/modules/SignInCom/index.js.map
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'modules/SignInCom/index-create-component',
    {
        'modules/SignInCom/index-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('1')['createComponent'](__webpack_require__(281))
        })
    },
    [['modules/SignInCom/index-create-component']]
]);
