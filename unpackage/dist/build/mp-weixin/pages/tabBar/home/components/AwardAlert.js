(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/tabBar/home/components/AwardAlert"],{"0751":function(t,n,e){"use strict";e.r(n);var a=e("ba21"),u=e.n(a);for(var r in a)"default"!==r&&function(t){e.d(n,t,(function(){return a[t]}))}(r);n["default"]=u.a},5691:function(t,n,e){"use strict";var a=e("6496"),u=e.n(a);u.a},"58d3":function(t,n,e){"use strict";e.r(n);var a=e("caf6"),u=e("0751");for(var r in u)"default"!==r&&function(t){e.d(n,t,(function(){return u[t]}))}(r);e("5691");var i,o=e("f0c5"),c=Object(o["a"])(u["default"],a["b"],a["c"],!1,null,"4e7b7693",null,!1,a["a"],i);n["default"]=c.exports},6496:function(t,n,e){},ba21:function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var a=u(e("2920"));function u(t){return t&&t.__esModule?t:{default:t}}var r=function(){e.e("components/TfPopup/index").then(function(){return resolve(e("c209"))}.bind(null,e)).catch(e.oe)},i={name:"AwardAlert",components:{TfPopup:r},props:{value:{type:Boolean,default:!1},data:{type:Array,default:function(){return[]}}},data:function(){return{baseUrl:a.default.baseUrl,visible:!1}},watch:{value:function(t){t!==this.visible&&(this.visible=t)},visible:function(t){this.$emit("input",t)}},methods:{goAwardIndex:function(){this.close(),this.$router.push({path:"/pages/activity/award/index"})},close:function(){this.visible=!1}}};n.default=i},caf6:function(t,n,e){"use strict";var a;e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return r})),e.d(n,"a",(function(){return a}));var u=function(){var t=this,n=t.$createElement,e=(t._self._c,t.__map(t.data,(function(n,e){var a=t.__get_orig(n),u="1"!==n.award_type?["2","3"].includes(n.award_type):null;return{$orig:a,g0:u}})));t.$mp.data=Object.assign({},{$root:{l0:e}})},r=[]}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/tabBar/home/components/AwardAlert-create-component',
    {
        'pages/tabBar/home/components/AwardAlert-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("58d3"))
        })
    },
    [['pages/tabBar/home/components/AwardAlert-create-component']]
]);
