var ew=Object.defineProperty,tw=Object.defineProperties;var nw=Object.getOwnPropertyDescriptors;var ca=Object.getOwnPropertySymbols;var Bp=Object.prototype.hasOwnProperty,$p=Object.prototype.propertyIsEnumerable;var zp=(t,e,n)=>e in t?ew(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n,se=(t,e)=>{for(var n in e||(e={}))Bp.call(e,n)&&zp(t,n,e[n]);if(ca)for(var n of ca(e))$p.call(e,n)&&zp(t,n,e[n]);return t},Lt=(t,e)=>tw(t,nw(e));var ii=(t,e)=>{var n={};for(var r in t)Bp.call(t,r)&&e.indexOf(r)<0&&(n[r]=t[r]);if(t!=null&&ca)for(var r of ca(t))e.indexOf(r)<0&&$p.call(t,r)&&(n[r]=t[r]);return n};var Ct={exports:{}},ie={};/*
object-assign
(c) Sindre Sorhus
@license MIT
*/var Hp=Object.getOwnPropertySymbols,rw=Object.prototype.hasOwnProperty,iw=Object.prototype.propertyIsEnumerable;function sw(t){if(t==null)throw new TypeError("Object.assign cannot be called with null or undefined");return Object(t)}function ow(){try{if(!Object.assign)return!1;var t=new String("abc");if(t[5]="de",Object.getOwnPropertyNames(t)[0]==="5")return!1;for(var e={},n=0;n<10;n++)e["_"+String.fromCharCode(n)]=n;var r=Object.getOwnPropertyNames(e).map(function(s){return e[s]});if(r.join("")!=="0123456789")return!1;var i={};return"abcdefghijklmnopqrst".split("").forEach(function(s){i[s]=s}),Object.keys(Object.assign({},i)).join("")==="abcdefghijklmnopqrst"}catch{return!1}}var qp=ow()?Object.assign:function(t,e){for(var n,r=sw(t),i,s=1;s<arguments.length;s++){n=Object(arguments[s]);for(var o in n)rw.call(n,o)&&(r[o]=n[o]);if(Hp){i=Hp(n);for(var l=0;l<i.length;l++)iw.call(n,i[l])&&(r[i[l]]=n[i[l]])}}return r};/** @license React v17.0.2
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Wu=qp,si=60103,Wp=60106;ie.Fragment=60107;ie.StrictMode=60108;ie.Profiler=60114;var Gp=60109,Kp=60110,Qp=60112;ie.Suspense=60113;var Yp=60115,Xp=60116;if(typeof Symbol=="function"&&Symbol.for){var Pt=Symbol.for;si=Pt("react.element"),Wp=Pt("react.portal"),ie.Fragment=Pt("react.fragment"),ie.StrictMode=Pt("react.strict_mode"),ie.Profiler=Pt("react.profiler"),Gp=Pt("react.provider"),Kp=Pt("react.context"),Qp=Pt("react.forward_ref"),ie.Suspense=Pt("react.suspense"),Yp=Pt("react.memo"),Xp=Pt("react.lazy")}var Jp=typeof Symbol=="function"&&Symbol.iterator;function aw(t){return t===null||typeof t!="object"?null:(t=Jp&&t[Jp]||t["@@iterator"],typeof t=="function"?t:null)}function vs(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Zp={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},em={};function oi(t,e,n){this.props=t,this.context=e,this.refs=em,this.updater=n||Zp}oi.prototype.isReactComponent={};oi.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error(vs(85));this.updater.enqueueSetState(this,t,e,"setState")};oi.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function tm(){}tm.prototype=oi.prototype;function Gu(t,e,n){this.props=t,this.context=e,this.refs=em,this.updater=n||Zp}var Ku=Gu.prototype=new tm;Ku.constructor=Gu;Wu(Ku,oi.prototype);Ku.isPureReactComponent=!0;var Qu={current:null},nm=Object.prototype.hasOwnProperty,rm={key:!0,ref:!0,__self:!0,__source:!0};function im(t,e,n){var r,i={},s=null,o=null;if(e!=null)for(r in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)nm.call(e,r)&&!rm.hasOwnProperty(r)&&(i[r]=e[r]);var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){for(var u=Array(l),h=0;h<l;h++)u[h]=arguments[h+2];i.children=u}if(t&&t.defaultProps)for(r in l=t.defaultProps,l)i[r]===void 0&&(i[r]=l[r]);return{$$typeof:si,type:t,key:s,ref:o,props:i,_owner:Qu.current}}function lw(t,e){return{$$typeof:si,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function Yu(t){return typeof t=="object"&&t!==null&&t.$$typeof===si}function uw(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var sm=/\/+/g;function Xu(t,e){return typeof t=="object"&&t!==null&&t.key!=null?uw(""+t.key):e.toString(36)}function ha(t,e,n,r,i){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case si:case Wp:o=!0}}if(o)return o=t,i=i(o),t=r===""?"."+Xu(o,0):r,Array.isArray(i)?(n="",t!=null&&(n=t.replace(sm,"$&/")+"/"),ha(i,e,n,"",function(h){return h})):i!=null&&(Yu(i)&&(i=lw(i,n+(!i.key||o&&o.key===i.key?"":(""+i.key).replace(sm,"$&/")+"/")+t)),e.push(i)),1;if(o=0,r=r===""?".":r+":",Array.isArray(t))for(var l=0;l<t.length;l++){s=t[l];var u=r+Xu(s,l);o+=ha(s,e,n,u,i)}else if(u=aw(t),typeof u=="function")for(t=u.call(t),l=0;!(s=t.next()).done;)s=s.value,u=r+Xu(s,l++),o+=ha(s,e,n,u,i);else if(s==="object")throw e=""+t,Error(vs(31,e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e));return o}function da(t,e,n){if(t==null)return t;var r=[],i=0;return ha(t,r,"","",function(s){return e.call(n,s,i++)}),r}function cw(t){if(t._status===-1){var e=t._result;e=e(),t._status=0,t._result=e,e.then(function(n){t._status===0&&(n=n.default,t._status=1,t._result=n)},function(n){t._status===0&&(t._status=2,t._result=n)})}if(t._status===1)return t._result;throw t._result}var om={current:null};function rn(){var t=om.current;if(t===null)throw Error(vs(321));return t}var hw={ReactCurrentDispatcher:om,ReactCurrentBatchConfig:{transition:0},ReactCurrentOwner:Qu,IsSomeRendererActing:{current:!1},assign:Wu};ie.Children={map:da,forEach:function(t,e,n){da(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return da(t,function(){e++}),e},toArray:function(t){return da(t,function(e){return e})||[]},only:function(t){if(!Yu(t))throw Error(vs(143));return t}};ie.Component=oi;ie.PureComponent=Gu;ie.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=hw;ie.cloneElement=function(t,e,n){if(t==null)throw Error(vs(267,t));var r=Wu({},t.props),i=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Qu.current),e.key!==void 0&&(i=""+e.key),t.type&&t.type.defaultProps)var l=t.type.defaultProps;for(u in e)nm.call(e,u)&&!rm.hasOwnProperty(u)&&(r[u]=e[u]===void 0&&l!==void 0?l[u]:e[u])}var u=arguments.length-2;if(u===1)r.children=n;else if(1<u){l=Array(u);for(var h=0;h<u;h++)l[h]=arguments[h+2];r.children=l}return{$$typeof:si,type:t.type,key:i,ref:s,props:r,_owner:o}};ie.createContext=function(t,e){return e===void 0&&(e=null),t={$$typeof:Kp,_calculateChangedBits:e,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null},t.Provider={$$typeof:Gp,_context:t},t.Consumer=t};ie.createElement=im;ie.createFactory=function(t){var e=im.bind(null,t);return e.type=t,e};ie.createRef=function(){return{current:null}};ie.forwardRef=function(t){return{$$typeof:Qp,render:t}};ie.isValidElement=Yu;ie.lazy=function(t){return{$$typeof:Xp,_payload:{_status:-1,_result:t},_init:cw}};ie.memo=function(t,e){return{$$typeof:Yp,type:t,compare:e===void 0?null:e}};ie.useCallback=function(t,e){return rn().useCallback(t,e)};ie.useContext=function(t,e){return rn().useContext(t,e)};ie.useDebugValue=function(){};ie.useEffect=function(t,e){return rn().useEffect(t,e)};ie.useImperativeHandle=function(t,e,n){return rn().useImperativeHandle(t,e,n)};ie.useLayoutEffect=function(t,e){return rn().useLayoutEffect(t,e)};ie.useMemo=function(t,e){return rn().useMemo(t,e)};ie.useReducer=function(t,e,n){return rn().useReducer(t,e,n)};ie.useRef=function(t){return rn().useRef(t)};ie.useState=function(t){return rn().useState(t)};ie.version="17.0.2";Ct.exports=ie;var XD=Ct.exports,am={exports:{}},_t={},lm={exports:{}},um={};/** @license React v0.20.2
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){var e,n,r,i;if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,l=o.now();t.unstable_now=function(){return o.now()-l}}if(typeof window=="undefined"||typeof MessageChannel!="function"){var u=null,h=null,f=function(){if(u!==null)try{var B=t.unstable_now();u(!0,B),u=null}catch(K){throw setTimeout(f,0),K}};e=function(B){u!==null?setTimeout(e,0,B):(u=B,setTimeout(f,0))},n=function(B,K){h=setTimeout(B,K)},r=function(){clearTimeout(h)},t.unstable_shouldYield=function(){return!1},i=t.unstable_forceFrameRate=function(){}}else{var y=window.setTimeout,g=window.clearTimeout;if(typeof console!="undefined"){var k=window.cancelAnimationFrame;typeof window.requestAnimationFrame!="function"&&console.error("This browser doesn't support requestAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills"),typeof k!="function"&&console.error("This browser doesn't support cancelAnimationFrame. Make sure that you load a polyfill in older browsers. https://reactjs.org/link/react-polyfills")}var V=!1,O=null,v=-1,E=5,I=0;t.unstable_shouldYield=function(){return t.unstable_now()>=I},i=function(){},t.unstable_forceFrameRate=function(B){0>B||125<B?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):E=0<B?Math.floor(1e3/B):5};var P=new MessageChannel,N=P.port2;P.port1.onmessage=function(){if(O!==null){var B=t.unstable_now();I=B+E;try{O(!0,B)?N.postMessage(null):(V=!1,O=null)}catch(K){throw N.postMessage(null),K}}else V=!1},e=function(B){O=B,V||(V=!0,N.postMessage(null))},n=function(B,K){v=y(function(){B(t.unstable_now())},K)},r=function(){g(v),v=-1}}function F(B,K){var J=B.length;B.push(K);e:for(;;){var le=J-1>>>1,Ie=B[le];if(Ie!==void 0&&0<m(Ie,K))B[le]=K,B[J]=Ie,J=le;else break e}}function b(B){return B=B[0],B===void 0?null:B}function w(B){var K=B[0];if(K!==void 0){var J=B.pop();if(J!==K){B[0]=J;e:for(var le=0,Ie=B.length;le<Ie;){var kt=2*(le+1)-1,Rt=B[kt],tn=kt+1,nn=B[tn];if(Rt!==void 0&&0>m(Rt,J))nn!==void 0&&0>m(nn,Rt)?(B[le]=nn,B[tn]=J,le=tn):(B[le]=Rt,B[kt]=J,le=kt);else if(nn!==void 0&&0>m(nn,J))B[le]=nn,B[tn]=J,le=tn;else break e}}return K}return null}function m(B,K){var J=B.sortIndex-K.sortIndex;return J!==0?J:B.id-K.id}var _=[],A=[],S=1,R=null,T=3,Ne=!1,He=!1,_r=!1;function ns(B){for(var K=b(A);K!==null;){if(K.callback===null)w(A);else if(K.startTime<=B)w(A),K.sortIndex=K.expirationTime,F(_,K);else break;K=b(A)}}function En(B){if(_r=!1,ns(B),!He)if(b(_)!==null)He=!0,e(wn);else{var K=b(A);K!==null&&n(En,K.startTime-B)}}function wn(B,K){He=!1,_r&&(_r=!1,r()),Ne=!0;var J=T;try{for(ns(K),R=b(_);R!==null&&(!(R.expirationTime>K)||B&&!t.unstable_shouldYield());){var le=R.callback;if(typeof le=="function"){R.callback=null,T=R.priorityLevel;var Ie=le(R.expirationTime<=K);K=t.unstable_now(),typeof Ie=="function"?R.callback=Ie:R===b(_)&&w(_),ns(K)}else w(_);R=b(_)}if(R!==null)var kt=!0;else{var Rt=b(A);Rt!==null&&n(En,Rt.startTime-K),kt=!1}return kt}finally{R=null,T=J,Ne=!1}}var Au=i;t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(B){B.callback=null},t.unstable_continueExecution=function(){He||Ne||(He=!0,e(wn))},t.unstable_getCurrentPriorityLevel=function(){return T},t.unstable_getFirstCallbackNode=function(){return b(_)},t.unstable_next=function(B){switch(T){case 1:case 2:case 3:var K=3;break;default:K=T}var J=T;T=K;try{return B()}finally{T=J}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=Au,t.unstable_runWithPriority=function(B,K){switch(B){case 1:case 2:case 3:case 4:case 5:break;default:B=3}var J=T;T=B;try{return K()}finally{T=J}},t.unstable_scheduleCallback=function(B,K,J){var le=t.unstable_now();switch(typeof J=="object"&&J!==null?(J=J.delay,J=typeof J=="number"&&0<J?le+J:le):J=le,B){case 1:var Ie=-1;break;case 2:Ie=250;break;case 5:Ie=1073741823;break;case 4:Ie=1e4;break;default:Ie=5e3}return Ie=J+Ie,B={id:S++,callback:K,priorityLevel:B,startTime:J,expirationTime:Ie,sortIndex:-1},J>le?(B.sortIndex=J,F(A,B),b(_)===null&&B===b(A)&&(_r?r():_r=!0,n(En,J-le))):(B.sortIndex=Ie,F(_,B),He||Ne||(He=!0,e(wn))),B},t.unstable_wrapCallback=function(B){var K=T;return function(){var J=T;T=K;try{return B.apply(this,arguments)}finally{T=J}}}})(um);lm.exports=um;/** @license React v17.0.2
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var fa=Ct.exports,me=qp,Me=lm.exports;function L(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}if(!fa)throw Error(L(227));var cm=new Set,Es={};function Ar(t,e){ai(t,e),ai(t+"Capture",e)}function ai(t,e){for(Es[t]=e,t=0;t<e.length;t++)cm.add(e[t])}var sn=!(typeof window=="undefined"||typeof window.document=="undefined"||typeof window.document.createElement=="undefined"),dw=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,hm=Object.prototype.hasOwnProperty,dm={},fm={};function fw(t){return hm.call(fm,t)?!0:hm.call(dm,t)?!1:dw.test(t)?fm[t]=!0:(dm[t]=!0,!1)}function pw(t,e,n,r){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return r?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function mw(t,e,n,r){if(e===null||typeof e=="undefined"||pw(t,e,n,r))return!0;if(r)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function nt(t,e,n,r,i,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=r,this.attributeNamespace=i,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var Ue={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ue[t]=new nt(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ue[e]=new nt(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ue[t]=new nt(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ue[t]=new nt(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ue[t]=new nt(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ue[t]=new nt(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ue[t]=new nt(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ue[t]=new nt(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ue[t]=new nt(t,5,!1,t.toLowerCase(),null,!1,!1)});var Ju=/[\-:]([a-z])/g;function Zu(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Ju,Zu);Ue[e]=new nt(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Ju,Zu);Ue[e]=new nt(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Ju,Zu);Ue[e]=new nt(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ue[t]=new nt(t,1,!1,t.toLowerCase(),null,!1,!1)});Ue.xlinkHref=new nt("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ue[t]=new nt(t,1,!1,t.toLowerCase(),null,!0,!0)});function ec(t,e,n,r){var i=Ue.hasOwnProperty(e)?Ue[e]:null,s=i!==null?i.type===0:r?!1:!(!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N");s||(mw(e,n,i,r)&&(n=null),r||i===null?fw(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):i.mustUseProperty?t[i.propertyName]=n===null?i.type===3?!1:"":n:(e=i.attributeName,r=i.attributeNamespace,n===null?t.removeAttribute(e):(i=i.type,n=i===3||i===4&&n===!0?"":""+n,r?t.setAttributeNS(r,e,n):t.setAttribute(e,n))))}var Sr=fa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ws=60103,kr=60106,Cn=60107,tc=60108,Ts=60114,nc=60109,rc=60110,pa=60112,Is=60113,ma=60120,ga=60115,ic=60116,sc=60121,oc=60128,pm=60129,ac=60130,lc=60131;if(typeof Symbol=="function"&&Symbol.for){var be=Symbol.for;ws=be("react.element"),kr=be("react.portal"),Cn=be("react.fragment"),tc=be("react.strict_mode"),Ts=be("react.profiler"),nc=be("react.provider"),rc=be("react.context"),pa=be("react.forward_ref"),Is=be("react.suspense"),ma=be("react.suspense_list"),ga=be("react.memo"),ic=be("react.lazy"),sc=be("react.block"),be("react.scope"),oc=be("react.opaque.id"),pm=be("react.debug_trace_mode"),ac=be("react.offscreen"),lc=be("react.legacy_hidden")}var mm=typeof Symbol=="function"&&Symbol.iterator;function As(t){return t===null||typeof t!="object"?null:(t=mm&&t[mm]||t["@@iterator"],typeof t=="function"?t:null)}var uc;function Ss(t){if(uc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);uc=e&&e[1]||""}return`
`+uc+t}var cc=!1;function ya(t,e){if(!t||cc)return"";cc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(u){var r=u}Reflect.construct(t,[],e)}else{try{e.call()}catch(u){r=u}t.call(e.prototype)}else{try{throw Error()}catch(u){r=u}t()}}catch(u){if(u&&r&&typeof u.stack=="string"){for(var i=u.stack.split(`
`),s=r.stack.split(`
`),o=i.length-1,l=s.length-1;1<=o&&0<=l&&i[o]!==s[l];)l--;for(;1<=o&&0<=l;o--,l--)if(i[o]!==s[l]){if(o!==1||l!==1)do if(o--,l--,0>l||i[o]!==s[l])return`
`+i[o].replace(" at new "," at ");while(1<=o&&0<=l);break}}}finally{cc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?Ss(t):""}function gw(t){switch(t.tag){case 5:return Ss(t.type);case 16:return Ss("Lazy");case 13:return Ss("Suspense");case 19:return Ss("SuspenseList");case 0:case 2:case 15:return t=ya(t.type,!1),t;case 11:return t=ya(t.type.render,!1),t;case 22:return t=ya(t.type._render,!1),t;case 1:return t=ya(t.type,!0),t;default:return""}}function li(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Cn:return"Fragment";case kr:return"Portal";case Ts:return"Profiler";case tc:return"StrictMode";case Is:return"Suspense";case ma:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case rc:return(t.displayName||"Context")+".Consumer";case nc:return(t._context.displayName||"Context")+".Provider";case pa:var e=t.render;return e=e.displayName||e.name||"",t.displayName||(e!==""?"ForwardRef("+e+")":"ForwardRef");case ga:return li(t.type);case sc:return li(t._render);case ic:e=t._payload,t=t._init;try{return li(t(e))}catch{}}return null}function Pn(t){switch(typeof t){case"boolean":case"number":case"object":case"string":case"undefined":return t;default:return""}}function gm(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function yw(t){var e=gm(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),r=""+t[e];if(!t.hasOwnProperty(e)&&typeof n!="undefined"&&typeof n.get=="function"&&typeof n.set=="function"){var i=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return i.call(this)},set:function(o){r=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return r},setValue:function(o){r=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function _a(t){t._valueTracker||(t._valueTracker=yw(t))}function ym(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),r="";return t&&(r=gm(t)?t.checked?"true":"false":t.value),t=r,t!==n?(e.setValue(t),!0):!1}function va(t){if(t=t||(typeof document!="undefined"?document:void 0),typeof t=="undefined")return null;try{return t.activeElement||t.body}catch{return t.body}}function hc(t,e){var n=e.checked;return me({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n!=null?n:t._wrapperState.initialChecked})}function _m(t,e){var n=e.defaultValue==null?"":e.defaultValue,r=e.checked!=null?e.checked:e.defaultChecked;n=Pn(e.value!=null?e.value:n),t._wrapperState={initialChecked:r,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function vm(t,e){e=e.checked,e!=null&&ec(t,"checked",e,!1)}function dc(t,e){vm(t,e);var n=Pn(e.value),r=e.type;if(n!=null)r==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(r==="submit"||r==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?fc(t,e.type,n):e.hasOwnProperty("defaultValue")&&fc(t,e.type,Pn(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Em(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var r=e.type;if(!(r!=="submit"&&r!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function fc(t,e,n){(e!=="number"||va(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}function _w(t){var e="";return fa.Children.forEach(t,function(n){n!=null&&(e+=n)}),e}function pc(t,e){return t=me({children:void 0},e),(e=_w(e.children))&&(t.children=e),t}function ui(t,e,n,r){if(t=t.options,e){e={};for(var i=0;i<n.length;i++)e["$"+n[i]]=!0;for(n=0;n<t.length;n++)i=e.hasOwnProperty("$"+t[n].value),t[n].selected!==i&&(t[n].selected=i),i&&r&&(t[n].defaultSelected=!0)}else{for(n=""+Pn(n),e=null,i=0;i<t.length;i++){if(t[i].value===n){t[i].selected=!0,r&&(t[i].defaultSelected=!0);return}e!==null||t[i].disabled||(e=t[i])}e!==null&&(e.selected=!0)}}function mc(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(L(91));return me({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function wm(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(L(92));if(Array.isArray(n)){if(!(1>=n.length))throw Error(L(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Pn(n)}}function Tm(t,e){var n=Pn(e.value),r=Pn(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),r!=null&&(t.defaultValue=""+r)}function Im(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}var gc={html:"http://www.w3.org/1999/xhtml",mathml:"http://www.w3.org/1998/Math/MathML",svg:"http://www.w3.org/2000/svg"};function Am(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function yc(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Am(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Ea,Sm=function(t){return typeof MSApp!="undefined"&&MSApp.execUnsafeLocalFunction?function(e,n,r,i){MSApp.execUnsafeLocalFunction(function(){return t(e,n,r,i)})}:t}(function(t,e){if(t.namespaceURI!==gc.svg||"innerHTML"in t)t.innerHTML=e;else{for(Ea=Ea||document.createElement("div"),Ea.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Ea.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function ks(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Rs={animationIterationCount:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},vw=["Webkit","ms","Moz","O"];Object.keys(Rs).forEach(function(t){vw.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Rs[e]=Rs[t]})});function km(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Rs.hasOwnProperty(t)&&Rs[t]?(""+e).trim():e+"px"}function Rm(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var r=n.indexOf("--")===0,i=km(n,e[n],r);n==="float"&&(n="cssFloat"),r?t.setProperty(n,i):t[n]=i}}var Ew=me({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function _c(t,e){if(e){if(Ew[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(L(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(L(60));if(!(typeof e.dangerouslySetInnerHTML=="object"&&"__html"in e.dangerouslySetInnerHTML))throw Error(L(61))}if(e.style!=null&&typeof e.style!="object")throw Error(L(62))}}function vc(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}function Ec(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var wc=null,ci=null,hi=null;function Cm(t){if(t=Ws(t)){if(typeof wc!="function")throw Error(L(280));var e=t.stateNode;e&&(e=Ua(e),wc(t.stateNode,t.type,e))}}function Pm(t){ci?hi?hi.push(t):hi=[t]:ci=t}function Nm(){if(ci){var t=ci,e=hi;if(hi=ci=null,Cm(t),e)for(t=0;t<e.length;t++)Cm(e[t])}}function Tc(t,e){return t(e)}function Dm(t,e,n,r,i){return t(e,n,r,i)}function Ic(){}var Vm=Tc,Rr=!1,Ac=!1;function Sc(){(ci!==null||hi!==null)&&(Ic(),Nm())}function ww(t,e,n){if(Ac)return t(e,n);Ac=!0;try{return Vm(t,e,n)}finally{Ac=!1,Sc()}}function Cs(t,e){var n=t.stateNode;if(n===null)return null;var r=Ua(n);if(r===null)return null;n=r[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(r=!r.disabled)||(t=t.type,r=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!r;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(L(231,e,typeof n));return n}var kc=!1;if(sn)try{var Ps={};Object.defineProperty(Ps,"passive",{get:function(){kc=!0}}),window.addEventListener("test",Ps,Ps),window.removeEventListener("test",Ps,Ps)}catch{kc=!1}function Tw(t,e,n,r,i,s,o,l,u){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(f){this.onError(f)}}var Ns=!1,wa=null,Ta=!1,Rc=null,Iw={onError:function(t){Ns=!0,wa=t}};function Aw(t,e,n,r,i,s,o,l,u){Ns=!1,wa=null,Tw.apply(Iw,arguments)}function Sw(t,e,n,r,i,s,o,l,u){if(Aw.apply(this,arguments),Ns){if(Ns){var h=wa;Ns=!1,wa=null}else throw Error(L(198));Ta||(Ta=!0,Rc=h)}}function Cr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,(e.flags&1026)!=0&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Om(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function xm(t){if(Cr(t)!==t)throw Error(L(188))}function kw(t){var e=t.alternate;if(!e){if(e=Cr(t),e===null)throw Error(L(188));return e!==t?null:t}for(var n=t,r=e;;){var i=n.return;if(i===null)break;var s=i.alternate;if(s===null){if(r=i.return,r!==null){n=r;continue}break}if(i.child===s.child){for(s=i.child;s;){if(s===n)return xm(i),t;if(s===r)return xm(i),e;s=s.sibling}throw Error(L(188))}if(n.return!==r.return)n=i,r=s;else{for(var o=!1,l=i.child;l;){if(l===n){o=!0,n=i,r=s;break}if(l===r){o=!0,r=i,n=s;break}l=l.sibling}if(!o){for(l=s.child;l;){if(l===n){o=!0,n=s,r=i;break}if(l===r){o=!0,r=s,n=i;break}l=l.sibling}if(!o)throw Error(L(189))}}if(n.alternate!==r)throw Error(L(190))}if(n.tag!==3)throw Error(L(188));return n.stateNode.current===n?t:e}function Mm(t){if(t=kw(t),!t)return null;for(var e=t;;){if(e.tag===5||e.tag===6)return e;if(e.child)e.child.return=e,e=e.child;else{if(e===t)break;for(;!e.sibling;){if(!e.return||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}}return null}function bm(t,e){for(var n=t.alternate;e!==null;){if(e===t||e===n)return!0;e=e.return}return!1}var Lm,Cc,Um,Fm,Pc=!1,Ut=[],Nn=null,Dn=null,Vn=null,Ds=new Map,Vs=new Map,Os=[],jm="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Nc(t,e,n,r,i){return{blockedOn:t,domEventName:e,eventSystemFlags:n|16,nativeEvent:i,targetContainers:[r]}}function Bm(t,e){switch(t){case"focusin":case"focusout":Nn=null;break;case"dragenter":case"dragleave":Dn=null;break;case"mouseover":case"mouseout":Vn=null;break;case"pointerover":case"pointerout":Ds.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Vs.delete(e.pointerId)}}function xs(t,e,n,r,i,s){return t===null||t.nativeEvent!==s?(t=Nc(e,n,r,i,s),e!==null&&(e=Ws(e),e!==null&&Cc(e)),t):(t.eventSystemFlags|=r,e=t.targetContainers,i!==null&&e.indexOf(i)===-1&&e.push(i),t)}function Rw(t,e,n,r,i){switch(e){case"focusin":return Nn=xs(Nn,t,e,n,r,i),!0;case"dragenter":return Dn=xs(Dn,t,e,n,r,i),!0;case"mouseover":return Vn=xs(Vn,t,e,n,r,i),!0;case"pointerover":var s=i.pointerId;return Ds.set(s,xs(Ds.get(s)||null,t,e,n,r,i)),!0;case"gotpointercapture":return s=i.pointerId,Vs.set(s,xs(Vs.get(s)||null,t,e,n,r,i)),!0}return!1}function Cw(t){var e=Pr(t.target);if(e!==null){var n=Cr(e);if(n!==null){if(e=n.tag,e===13){if(e=Om(n),e!==null){t.blockedOn=e,Fm(t.lanePriority,function(){Me.unstable_runWithPriority(t.priority,function(){Um(n)})});return}}else if(e===3&&n.stateNode.hydrate){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Ia(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=bc(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n!==null)return e=Ws(n),e!==null&&Cc(e),t.blockedOn=n,!1;e.shift()}return!0}function $m(t,e,n){Ia(t)&&n.delete(e)}function Pw(){for(Pc=!1;0<Ut.length;){var t=Ut[0];if(t.blockedOn!==null){t=Ws(t.blockedOn),t!==null&&Lm(t);break}for(var e=t.targetContainers;0<e.length;){var n=bc(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n!==null){t.blockedOn=n;break}e.shift()}t.blockedOn===null&&Ut.shift()}Nn!==null&&Ia(Nn)&&(Nn=null),Dn!==null&&Ia(Dn)&&(Dn=null),Vn!==null&&Ia(Vn)&&(Vn=null),Ds.forEach($m),Vs.forEach($m)}function Ms(t,e){t.blockedOn===e&&(t.blockedOn=null,Pc||(Pc=!0,Me.unstable_scheduleCallback(Me.unstable_NormalPriority,Pw)))}function zm(t){function e(i){return Ms(i,t)}if(0<Ut.length){Ms(Ut[0],t);for(var n=1;n<Ut.length;n++){var r=Ut[n];r.blockedOn===t&&(r.blockedOn=null)}}for(Nn!==null&&Ms(Nn,t),Dn!==null&&Ms(Dn,t),Vn!==null&&Ms(Vn,t),Ds.forEach(e),Vs.forEach(e),n=0;n<Os.length;n++)r=Os[n],r.blockedOn===t&&(r.blockedOn=null);for(;0<Os.length&&(n=Os[0],n.blockedOn===null);)Cw(n),n.blockedOn===null&&Os.shift()}function Aa(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var di={animationend:Aa("Animation","AnimationEnd"),animationiteration:Aa("Animation","AnimationIteration"),animationstart:Aa("Animation","AnimationStart"),transitionend:Aa("Transition","TransitionEnd")},Dc={},Hm={};sn&&(Hm=document.createElement("div").style,"AnimationEvent"in window||(delete di.animationend.animation,delete di.animationiteration.animation,delete di.animationstart.animation),"TransitionEvent"in window||delete di.transitionend.transition);function Sa(t){if(Dc[t])return Dc[t];if(!di[t])return t;var e=di[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Hm)return Dc[t]=e[n];return t}var qm=Sa("animationend"),Wm=Sa("animationiteration"),Gm=Sa("animationstart"),Km=Sa("transitionend"),Qm=new Map,Vc=new Map,Nw=["abort","abort",qm,"animationEnd",Wm,"animationIteration",Gm,"animationStart","canplay","canPlay","canplaythrough","canPlayThrough","durationchange","durationChange","emptied","emptied","encrypted","encrypted","ended","ended","error","error","gotpointercapture","gotPointerCapture","load","load","loadeddata","loadedData","loadedmetadata","loadedMetadata","loadstart","loadStart","lostpointercapture","lostPointerCapture","playing","playing","progress","progress","seeking","seeking","stalled","stalled","suspend","suspend","timeupdate","timeUpdate",Km,"transitionEnd","waiting","waiting"];function Oc(t,e){for(var n=0;n<t.length;n+=2){var r=t[n],i=t[n+1];i="on"+(i[0].toUpperCase()+i.slice(1)),Vc.set(r,e),Qm.set(r,i),Ar(i,[r])}}var Dw=Me.unstable_now;Dw();var ue=8;function fi(t){if((1&t)!=0)return ue=15,1;if((2&t)!=0)return ue=14,2;if((4&t)!=0)return ue=13,4;var e=24&t;return e!==0?(ue=12,e):(t&32)!=0?(ue=11,32):(e=192&t,e!==0?(ue=10,e):(t&256)!=0?(ue=9,256):(e=3584&t,e!==0?(ue=8,e):(t&4096)!=0?(ue=7,4096):(e=4186112&t,e!==0?(ue=6,e):(e=62914560&t,e!==0?(ue=5,e):t&67108864?(ue=4,67108864):(t&134217728)!=0?(ue=3,134217728):(e=805306368&t,e!==0?(ue=2,e):(1073741824&t)!=0?(ue=1,1073741824):(ue=8,t))))))}function Vw(t){switch(t){case 99:return 15;case 98:return 10;case 97:case 96:return 8;case 95:return 2;default:return 0}}function Ow(t){switch(t){case 15:case 14:return 99;case 13:case 12:case 11:case 10:return 98;case 9:case 8:case 7:case 6:case 4:case 5:return 97;case 3:case 2:case 1:return 95;case 0:return 90;default:throw Error(L(358,t))}}function bs(t,e){var n=t.pendingLanes;if(n===0)return ue=0;var r=0,i=0,s=t.expiredLanes,o=t.suspendedLanes,l=t.pingedLanes;if(s!==0)r=s,i=ue=15;else if(s=n&134217727,s!==0){var u=s&~o;u!==0?(r=fi(u),i=ue):(l&=s,l!==0&&(r=fi(l),i=ue))}else s=n&~o,s!==0?(r=fi(s),i=ue):l!==0&&(r=fi(l),i=ue);if(r===0)return 0;if(r=31-On(r),r=n&((0>r?0:1<<r)<<1)-1,e!==0&&e!==r&&(e&o)==0){if(fi(e),i<=ue)return e;ue=i}if(e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=r;0<e;)n=31-On(e),i=1<<n,r|=t[n],e&=~i;return r}function Ym(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function ka(t,e){switch(t){case 15:return 1;case 14:return 2;case 12:return t=pi(24&~e),t===0?ka(10,e):t;case 10:return t=pi(192&~e),t===0?ka(8,e):t;case 8:return t=pi(3584&~e),t===0&&(t=pi(4186112&~e),t===0&&(t=512)),t;case 2:return e=pi(805306368&~e),e===0&&(e=268435456),e}throw Error(L(358,t))}function pi(t){return t&-t}function xc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ra(t,e,n){t.pendingLanes|=e;var r=e-1;t.suspendedLanes&=r,t.pingedLanes&=r,t=t.eventTimes,e=31-On(e),t[e]=n}var On=Math.clz32?Math.clz32:bw,xw=Math.log,Mw=Math.LN2;function bw(t){return t===0?32:31-(xw(t)/Mw|0)|0}var Lw=Me.unstable_UserBlockingPriority,Uw=Me.unstable_runWithPriority,Ca=!0;function Fw(t,e,n,r){Rr||Ic();var i=Mc,s=Rr;Rr=!0;try{Dm(i,t,e,n,r)}finally{(Rr=s)||Sc()}}function jw(t,e,n,r){Uw(Lw,Mc.bind(null,t,e,n,r))}function Mc(t,e,n,r){if(Ca){var i;if((i=(e&4)==0)&&0<Ut.length&&-1<jm.indexOf(t))t=Nc(null,t,e,n,r),Ut.push(t);else{var s=bc(t,e,n,r);if(s===null)i&&Bm(t,r);else{if(i){if(-1<jm.indexOf(t)){t=Nc(s,t,e,n,r),Ut.push(t);return}if(Rw(s,t,e,n,r))return;Bm(t,r)}kg(t,e,r,null,n)}}}}function bc(t,e,n,r){var i=Ec(r);if(i=Pr(i),i!==null){var s=Cr(i);if(s===null)i=null;else{var o=s.tag;if(o===13){if(i=Om(s),i!==null)return i;i=null}else if(o===3){if(s.stateNode.hydrate)return s.tag===3?s.stateNode.containerInfo:null;i=null}else s!==i&&(i=null)}}return kg(t,e,r,i,n),null}var xn=null,Lc=null,Pa=null;function Xm(){if(Pa)return Pa;var t,e=Lc,n=e.length,r,i="value"in xn?xn.value:xn.textContent,s=i.length;for(t=0;t<n&&e[t]===i[t];t++);var o=n-t;for(r=1;r<=o&&e[n-r]===i[s-r];r++);return Pa=i.slice(t,1<r?1-r:void 0)}function Na(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Da(){return!0}function Jm(){return!1}function dt(t){function e(n,r,i,s,o){this._reactName=n,this._targetInst=i,this.type=r,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var l in t)t.hasOwnProperty(l)&&(n=t[l],this[l]=n?n(s):s[l]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Da:Jm,this.isPropagationStopped=Jm,this}return me(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Da)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Da)},persist:function(){},isPersistent:Da}),e}var mi={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Uc=dt(mi),Ls=me({},mi,{view:0,detail:0}),Bw=dt(Ls),Fc,jc,Us,Va=me({},Ls,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:$c,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Us&&(Us&&t.type==="mousemove"?(Fc=t.screenX-Us.screenX,jc=t.screenY-Us.screenY):jc=Fc=0,Us=t),Fc)},movementY:function(t){return"movementY"in t?t.movementY:jc}}),Zm=dt(Va),$w=me({},Va,{dataTransfer:0}),zw=dt($w),Hw=me({},Ls,{relatedTarget:0}),Bc=dt(Hw),qw=me({},mi,{animationName:0,elapsedTime:0,pseudoElement:0}),Ww=dt(qw),Gw=me({},mi,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),Kw=dt(Gw),Qw=me({},mi,{data:0}),eg=dt(Qw),Yw={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},Xw={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},Jw={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function Zw(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=Jw[t])?!!e[t]:!1}function $c(){return Zw}var eT=me({},Ls,{key:function(t){if(t.key){var e=Yw[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Na(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?Xw[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:$c,charCode:function(t){return t.type==="keypress"?Na(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Na(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),tT=dt(eT),nT=me({},Va,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),tg=dt(nT),rT=me({},Ls,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:$c}),iT=dt(rT),sT=me({},mi,{propertyName:0,elapsedTime:0,pseudoElement:0}),oT=dt(sT),aT=me({},Va,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),lT=dt(aT),uT=[9,13,27,32],zc=sn&&"CompositionEvent"in window,Fs=null;sn&&"documentMode"in document&&(Fs=document.documentMode);var cT=sn&&"TextEvent"in window&&!Fs,ng=sn&&(!zc||Fs&&8<Fs&&11>=Fs),rg=String.fromCharCode(32),ig=!1;function sg(t,e){switch(t){case"keyup":return uT.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function og(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var gi=!1;function hT(t,e){switch(t){case"compositionend":return og(e);case"keypress":return e.which!==32?null:(ig=!0,rg);case"textInput":return t=e.data,t===rg&&ig?null:t;default:return null}}function dT(t,e){if(gi)return t==="compositionend"||!zc&&sg(t,e)?(t=Xm(),Pa=Lc=xn=null,gi=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return ng&&e.locale!=="ko"?null:e.data;default:return null}}var fT={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function ag(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!fT[t.type]:e==="textarea"}function lg(t,e,n,r){Pm(r),e=xa(e,"onChange"),0<e.length&&(n=new Uc("onChange","change",null,n,r),t.push({event:n,listeners:e}))}var js=null,Bs=null;function pT(t){wg(t,0)}function Oa(t){var e=wi(t);if(ym(e))return t}function mT(t,e){if(t==="change")return e}var ug=!1;if(sn){var Hc;if(sn){var qc="oninput"in document;if(!qc){var cg=document.createElement("div");cg.setAttribute("oninput","return;"),qc=typeof cg.oninput=="function"}Hc=qc}else Hc=!1;ug=Hc&&(!document.documentMode||9<document.documentMode)}function hg(){js&&(js.detachEvent("onpropertychange",dg),Bs=js=null)}function dg(t){if(t.propertyName==="value"&&Oa(Bs)){var e=[];if(lg(e,Bs,t,Ec(t)),t=pT,Rr)t(e);else{Rr=!0;try{Tc(t,e)}finally{Rr=!1,Sc()}}}}function gT(t,e,n){t==="focusin"?(hg(),js=e,Bs=n,js.attachEvent("onpropertychange",dg)):t==="focusout"&&hg()}function yT(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Oa(Bs)}function _T(t,e){if(t==="click")return Oa(e)}function vT(t,e){if(t==="input"||t==="change")return Oa(e)}function ET(t,e){return t===e&&(t!==0||1/t==1/e)||t!==t&&e!==e}var vt=typeof Object.is=="function"?Object.is:ET,wT=Object.prototype.hasOwnProperty;function $s(t,e){if(vt(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),r=Object.keys(e);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++)if(!wT.call(e,n[r])||!vt(t[n[r]],e[n[r]]))return!1;return!0}function fg(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function pg(t,e){var n=fg(t);t=0;for(var r;n;){if(n.nodeType===3){if(r=t+n.textContent.length,t<=e&&r>=e)return{node:n,offset:e-t};t=r}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=fg(n)}}function mg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?mg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function gg(){for(var t=window,e=va();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=va(t.document)}return e}function Wc(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}var TT=sn&&"documentMode"in document&&11>=document.documentMode,yi=null,Gc=null,zs=null,Kc=!1;function yg(t,e,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Kc||yi==null||yi!==va(r)||(r=yi,"selectionStart"in r&&Wc(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),zs&&$s(zs,r)||(zs=r,r=xa(Gc,"onSelect"),0<r.length&&(e=new Uc("onSelect","select",null,e,n),t.push({event:e,listeners:r}),e.target=yi)))}Oc("cancel cancel click click close close contextmenu contextMenu copy copy cut cut auxclick auxClick dblclick doubleClick dragend dragEnd dragstart dragStart drop drop focusin focus focusout blur input input invalid invalid keydown keyDown keypress keyPress keyup keyUp mousedown mouseDown mouseup mouseUp paste paste pause pause play play pointercancel pointerCancel pointerdown pointerDown pointerup pointerUp ratechange rateChange reset reset seeked seeked submit submit touchcancel touchCancel touchend touchEnd touchstart touchStart volumechange volumeChange".split(" "),0);Oc("drag drag dragenter dragEnter dragexit dragExit dragleave dragLeave dragover dragOver mousemove mouseMove mouseout mouseOut mouseover mouseOver pointermove pointerMove pointerout pointerOut pointerover pointerOver scroll scroll toggle toggle touchmove touchMove wheel wheel".split(" "),1);Oc(Nw,2);for(var _g="change selectionchange textInput compositionstart compositionend compositionupdate".split(" "),Qc=0;Qc<_g.length;Qc++)Vc.set(_g[Qc],0);ai("onMouseEnter",["mouseout","mouseover"]);ai("onMouseLeave",["mouseout","mouseover"]);ai("onPointerEnter",["pointerout","pointerover"]);ai("onPointerLeave",["pointerout","pointerover"]);Ar("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ar("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ar("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ar("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ar("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ar("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var Hs="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),vg=new Set("cancel close invalid load scroll toggle".split(" ").concat(Hs));function Eg(t,e,n){var r=t.type||"unknown-event";t.currentTarget=n,Sw(r,e,void 0,t),t.currentTarget=null}function wg(t,e){e=(e&4)!=0;for(var n=0;n<t.length;n++){var r=t[n],i=r.event;r=r.listeners;e:{var s=void 0;if(e)for(var o=r.length-1;0<=o;o--){var l=r[o],u=l.instance,h=l.currentTarget;if(l=l.listener,u!==s&&i.isPropagationStopped())break e;Eg(i,l,h),s=u}else for(o=0;o<r.length;o++){if(l=r[o],u=l.instance,h=l.currentTarget,l=l.listener,u!==s&&i.isPropagationStopped())break e;Eg(i,l,h),s=u}}}if(Ta)throw t=Rc,Ta=!1,Rc=null,t}function de(t,e){var n=Vg(e),r=t+"__bubble";n.has(r)||(Sg(e,t,2,!1),n.add(r))}var Tg="_reactListening"+Math.random().toString(36).slice(2);function Ig(t){t[Tg]||(t[Tg]=!0,cm.forEach(function(e){vg.has(e)||Ag(e,!1,t,null),Ag(e,!0,t,null)}))}function Ag(t,e,n,r){var i=4<arguments.length&&arguments[4]!==void 0?arguments[4]:0,s=n;if(t==="selectionchange"&&n.nodeType!==9&&(s=n.ownerDocument),r!==null&&!e&&vg.has(t)){if(t!=="scroll")return;i|=2,s=r}var o=Vg(s),l=t+"__"+(e?"capture":"bubble");o.has(l)||(e&&(i|=4),Sg(s,t,i,e),o.add(l))}function Sg(t,e,n,r){var i=Vc.get(e);switch(i===void 0?2:i){case 0:i=Fw;break;case 1:i=jw;break;default:i=Mc}n=i.bind(null,e,n,t),i=void 0,!kc||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(i=!0),r?i!==void 0?t.addEventListener(e,n,{capture:!0,passive:i}):t.addEventListener(e,n,!0):i!==void 0?t.addEventListener(e,n,{passive:i}):t.addEventListener(e,n,!1)}function kg(t,e,n,r,i){var s=r;if((e&1)==0&&(e&2)==0&&r!==null)e:for(;;){if(r===null)return;var o=r.tag;if(o===3||o===4){var l=r.stateNode.containerInfo;if(l===i||l.nodeType===8&&l.parentNode===i)break;if(o===4)for(o=r.return;o!==null;){var u=o.tag;if((u===3||u===4)&&(u=o.stateNode.containerInfo,u===i||u.nodeType===8&&u.parentNode===i))return;o=o.return}for(;l!==null;){if(o=Pr(l),o===null)return;if(u=o.tag,u===5||u===6){r=s=o;continue e}l=l.parentNode}}r=r.return}ww(function(){var h=s,f=Ec(n),y=[];e:{var g=Qm.get(t);if(g!==void 0){var k=Uc,V=t;switch(t){case"keypress":if(Na(n)===0)break e;case"keydown":case"keyup":k=tT;break;case"focusin":V="focus",k=Bc;break;case"focusout":V="blur",k=Bc;break;case"beforeblur":case"afterblur":k=Bc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":k=Zm;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":k=zw;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":k=iT;break;case qm:case Wm:case Gm:k=Ww;break;case Km:k=oT;break;case"scroll":k=Bw;break;case"wheel":k=lT;break;case"copy":case"cut":case"paste":k=Kw;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":k=tg}var O=(e&4)!=0,v=!O&&t==="scroll",E=O?g!==null?g+"Capture":null:g;O=[];for(var I=h,P;I!==null;){P=I;var N=P.stateNode;if(P.tag===5&&N!==null&&(P=N,E!==null&&(N=Cs(I,E),N!=null&&O.push(qs(I,N,P)))),v)break;I=I.return}0<O.length&&(g=new k(g,V,null,n,f),y.push({event:g,listeners:O}))}}if((e&7)==0){e:{if(g=t==="mouseover"||t==="pointerover",k=t==="mouseout"||t==="pointerout",g&&(e&16)==0&&(V=n.relatedTarget||n.fromElement)&&(Pr(V)||V[Ei]))break e;if((k||g)&&(g=f.window===f?f:(g=f.ownerDocument)?g.defaultView||g.parentWindow:window,k?(V=n.relatedTarget||n.toElement,k=h,V=V?Pr(V):null,V!==null&&(v=Cr(V),V!==v||V.tag!==5&&V.tag!==6)&&(V=null)):(k=null,V=h),k!==V)){if(O=Zm,N="onMouseLeave",E="onMouseEnter",I="mouse",(t==="pointerout"||t==="pointerover")&&(O=tg,N="onPointerLeave",E="onPointerEnter",I="pointer"),v=k==null?g:wi(k),P=V==null?g:wi(V),g=new O(N,I+"leave",k,n,f),g.target=v,g.relatedTarget=P,N=null,Pr(f)===h&&(O=new O(E,I+"enter",V,n,f),O.target=P,O.relatedTarget=v,N=O),v=N,k&&V)t:{for(O=k,E=V,I=0,P=O;P;P=_i(P))I++;for(P=0,N=E;N;N=_i(N))P++;for(;0<I-P;)O=_i(O),I--;for(;0<P-I;)E=_i(E),P--;for(;I--;){if(O===E||E!==null&&O===E.alternate)break t;O=_i(O),E=_i(E)}O=null}else O=null;k!==null&&Rg(y,g,k,O,!1),V!==null&&v!==null&&Rg(y,v,V,O,!0)}}e:{if(g=h?wi(h):window,k=g.nodeName&&g.nodeName.toLowerCase(),k==="select"||k==="input"&&g.type==="file")var F=mT;else if(ag(g))if(ug)F=vT;else{F=yT;var b=gT}else(k=g.nodeName)&&k.toLowerCase()==="input"&&(g.type==="checkbox"||g.type==="radio")&&(F=_T);if(F&&(F=F(t,h))){lg(y,F,n,f);break e}b&&b(t,g,h),t==="focusout"&&(b=g._wrapperState)&&b.controlled&&g.type==="number"&&fc(g,"number",g.value)}switch(b=h?wi(h):window,t){case"focusin":(ag(b)||b.contentEditable==="true")&&(yi=b,Gc=h,zs=null);break;case"focusout":zs=Gc=yi=null;break;case"mousedown":Kc=!0;break;case"contextmenu":case"mouseup":case"dragend":Kc=!1,yg(y,n,f);break;case"selectionchange":if(TT)break;case"keydown":case"keyup":yg(y,n,f)}var w;if(zc)e:{switch(t){case"compositionstart":var m="onCompositionStart";break e;case"compositionend":m="onCompositionEnd";break e;case"compositionupdate":m="onCompositionUpdate";break e}m=void 0}else gi?sg(t,n)&&(m="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(m="onCompositionStart");m&&(ng&&n.locale!=="ko"&&(gi||m!=="onCompositionStart"?m==="onCompositionEnd"&&gi&&(w=Xm()):(xn=f,Lc="value"in xn?xn.value:xn.textContent,gi=!0)),b=xa(h,m),0<b.length&&(m=new eg(m,t,null,n,f),y.push({event:m,listeners:b}),w?m.data=w:(w=og(n),w!==null&&(m.data=w)))),(w=cT?hT(t,n):dT(t,n))&&(h=xa(h,"onBeforeInput"),0<h.length&&(f=new eg("onBeforeInput","beforeinput",null,n,f),y.push({event:f,listeners:h}),f.data=w))}wg(y,e)})}function qs(t,e,n){return{instance:t,listener:e,currentTarget:n}}function xa(t,e){for(var n=e+"Capture",r=[];t!==null;){var i=t,s=i.stateNode;i.tag===5&&s!==null&&(i=s,s=Cs(t,n),s!=null&&r.unshift(qs(t,s,i)),s=Cs(t,e),s!=null&&r.push(qs(t,s,i))),t=t.return}return r}function _i(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Rg(t,e,n,r,i){for(var s=e._reactName,o=[];n!==null&&n!==r;){var l=n,u=l.alternate,h=l.stateNode;if(u!==null&&u===r)break;l.tag===5&&h!==null&&(l=h,i?(u=Cs(n,s),u!=null&&o.unshift(qs(n,u,l))):i||(u=Cs(n,s),u!=null&&o.push(qs(n,u,l)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}function Ma(){}var Yc=null,Xc=null;function Cg(t,e){switch(t){case"button":case"input":case"select":case"textarea":return!!e.autoFocus}return!1}function Jc(t,e){return t==="textarea"||t==="option"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Pg=typeof setTimeout=="function"?setTimeout:void 0,IT=typeof clearTimeout=="function"?clearTimeout:void 0;function Zc(t){t.nodeType===1?t.textContent="":t.nodeType===9&&(t=t.body,t!=null&&(t.textContent=""))}function vi(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break}return t}function Ng(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var eh=0;function AT(t){return{$$typeof:oc,toString:t,valueOf:t}}var ba=Math.random().toString(36).slice(2),Mn="__reactFiber$"+ba,La="__reactProps$"+ba,Ei="__reactContainer$"+ba,Dg="__reactEvents$"+ba;function Pr(t){var e=t[Mn];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ei]||n[Mn]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=Ng(t);t!==null;){if(n=t[Mn])return n;t=Ng(t)}return e}t=n,n=t.parentNode}return null}function Ws(t){return t=t[Mn]||t[Ei],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function wi(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(L(33))}function Ua(t){return t[La]||null}function Vg(t){var e=t[Dg];return e===void 0&&(e=t[Dg]=new Set),e}var th=[],Ti=-1;function bn(t){return{current:t}}function fe(t){0>Ti||(t.current=th[Ti],th[Ti]=null,Ti--)}function ve(t,e){Ti++,th[Ti]=t.current,t.current=e}var Ln={},We=bn(Ln),st=bn(!1),Nr=Ln;function Ii(t,e){var n=t.type.contextTypes;if(!n)return Ln;var r=t.stateNode;if(r&&r.__reactInternalMemoizedUnmaskedChildContext===e)return r.__reactInternalMemoizedMaskedChildContext;var i={},s;for(s in n)i[s]=e[s];return r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=i),i}function ot(t){return t=t.childContextTypes,t!=null}function Fa(){fe(st),fe(We)}function Og(t,e,n){if(We.current!==Ln)throw Error(L(168));ve(We,e),ve(st,n)}function xg(t,e,n){var r=t.stateNode;if(t=e.childContextTypes,typeof r.getChildContext!="function")return n;r=r.getChildContext();for(var i in r)if(!(i in t))throw Error(L(108,li(e)||"Unknown",i));return me({},n,r)}function ja(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Ln,Nr=We.current,ve(We,t),ve(st,st.current),!0}function Mg(t,e,n){var r=t.stateNode;if(!r)throw Error(L(169));n?(t=xg(t,e,Nr),r.__reactInternalMemoizedMergedChildContext=t,fe(st),fe(We),ve(We,t)):fe(st),ve(st,n)}var nh=null,Dr=null,ST=Me.unstable_runWithPriority,rh=Me.unstable_scheduleCallback,ih=Me.unstable_cancelCallback,kT=Me.unstable_shouldYield,bg=Me.unstable_requestPaint,sh=Me.unstable_now,RT=Me.unstable_getCurrentPriorityLevel,Ba=Me.unstable_ImmediatePriority,Lg=Me.unstable_UserBlockingPriority,Ug=Me.unstable_NormalPriority,Fg=Me.unstable_LowPriority,jg=Me.unstable_IdlePriority,oh={},CT=bg!==void 0?bg:function(){},on=null,$a=null,ah=!1,Bg=sh(),Ge=1e4>Bg?sh:function(){return sh()-Bg};function Ai(){switch(RT()){case Ba:return 99;case Lg:return 98;case Ug:return 97;case Fg:return 96;case jg:return 95;default:throw Error(L(332))}}function $g(t){switch(t){case 99:return Ba;case 98:return Lg;case 97:return Ug;case 96:return Fg;case 95:return jg;default:throw Error(L(332))}}function Vr(t,e){return t=$g(t),ST(t,e)}function Gs(t,e,n){return t=$g(t),rh(t,e,n)}function Ft(){if($a!==null){var t=$a;$a=null,ih(t)}zg()}function zg(){if(!ah&&on!==null){ah=!0;var t=0;try{var e=on;Vr(99,function(){for(;t<e.length;t++){var n=e[t];do n=n(!0);while(n!==null)}}),on=null}catch(n){throw on!==null&&(on=on.slice(t+1)),rh(Ba,Ft),n}finally{ah=!1}}}var PT=Sr.ReactCurrentBatchConfig;function Nt(t,e){if(t&&t.defaultProps){e=me({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}var za=bn(null),Ha=null,Si=null,qa=null;function lh(){qa=Si=Ha=null}function uh(t){var e=za.current;fe(za),t.type._context._currentValue=e}function Hg(t,e){for(;t!==null;){var n=t.alternate;if((t.childLanes&e)===e){if(n===null||(n.childLanes&e)===e)break;n.childLanes|=e}else t.childLanes|=e,n!==null&&(n.childLanes|=e);t=t.return}}function ki(t,e){Ha=t,qa=Si=null,t=t.dependencies,t!==null&&t.firstContext!==null&&((t.lanes&e)!=0&&(Dt=!0),t.firstContext=null)}function Et(t,e){if(qa!==t&&e!==!1&&e!==0)if((typeof e!="number"||e===1073741823)&&(qa=t,e=1073741823),e={context:t,observedBits:e,next:null},Si===null){if(Ha===null)throw Error(L(308));Si=e,Ha.dependencies={lanes:0,firstContext:e,responders:null}}else Si=Si.next=e;return t._currentValue}var Un=!1;function ch(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null},effects:null}}function qg(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Fn(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function jn(t,e){if(t=t.updateQueue,t!==null){t=t.shared;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}}function Wg(t,e){var n=t.updateQueue,r=t.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?i=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?i=s=e:s=s.next=e}else i=s=e;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:s,shared:r.shared,effects:r.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Ks(t,e,n,r){var i=t.updateQueue;Un=!1;var s=i.firstBaseUpdate,o=i.lastBaseUpdate,l=i.shared.pending;if(l!==null){i.shared.pending=null;var u=l,h=u.next;u.next=null,o===null?s=h:o.next=h,o=u;var f=t.alternate;if(f!==null){f=f.updateQueue;var y=f.lastBaseUpdate;y!==o&&(y===null?f.firstBaseUpdate=h:y.next=h,f.lastBaseUpdate=u)}}if(s!==null){y=i.baseState,o=0,f=h=u=null;do{l=s.lane;var g=s.eventTime;if((r&l)===l){f!==null&&(f=f.next={eventTime:g,lane:0,tag:s.tag,payload:s.payload,callback:s.callback,next:null});e:{var k=t,V=s;switch(l=e,g=n,V.tag){case 1:if(k=V.payload,typeof k=="function"){y=k.call(g,y,l);break e}y=k;break e;case 3:k.flags=k.flags&-4097|64;case 0:if(k=V.payload,l=typeof k=="function"?k.call(g,y,l):k,l==null)break e;y=me({},y,l);break e;case 2:Un=!0}}s.callback!==null&&(t.flags|=32,l=i.effects,l===null?i.effects=[s]:l.push(s))}else g={eventTime:g,lane:l,tag:s.tag,payload:s.payload,callback:s.callback,next:null},f===null?(h=f=g,u=y):f=f.next=g,o|=l;if(s=s.next,s===null){if(l=i.shared.pending,l===null)break;s=l.next,l.next=null,i.lastBaseUpdate=l,i.shared.pending=null}}while(1);f===null&&(u=y),i.baseState=u,i.firstBaseUpdate=h,i.lastBaseUpdate=f,oo|=o,t.lanes=o,t.memoizedState=y}}function Gg(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var r=t[e],i=r.callback;if(i!==null){if(r.callback=null,r=n,typeof i!="function")throw Error(L(191,i));i.call(r)}}}var Kg=new fa.Component().refs;function Wa(t,e,n,r){e=t.memoizedState,n=n(r,e),n=n==null?e:me({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Ga={isMounted:function(t){return(t=t._reactInternals)?Cr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var r=ft(),i=zn(t),s=Fn(r,i);s.payload=e,n!=null&&(s.callback=n),jn(t,s),Hn(t,i,r)},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var r=ft(),i=zn(t),s=Fn(r,i);s.tag=1,s.payload=e,n!=null&&(s.callback=n),jn(t,s),Hn(t,i,r)},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=ft(),r=zn(t),i=Fn(n,r);i.tag=2,e!=null&&(i.callback=e),jn(t,i),Hn(t,r,n)}};function Qg(t,e,n,r,i,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(r,s,o):e.prototype&&e.prototype.isPureReactComponent?!$s(n,r)||!$s(i,s):!0}function Yg(t,e,n){var r=!1,i=Ln,s=e.contextType;return typeof s=="object"&&s!==null?s=Et(s):(i=ot(e)?Nr:We.current,r=e.contextTypes,s=(r=r!=null)?Ii(t,i):Ln),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Ga,t.stateNode=e,e._reactInternals=t,r&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=i,t.__reactInternalMemoizedMaskedChildContext=s),e}function Xg(t,e,n,r){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,r),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,r),e.state!==t&&Ga.enqueueReplaceState(e,e.state,null)}function hh(t,e,n,r){var i=t.stateNode;i.props=n,i.state=t.memoizedState,i.refs=Kg,ch(t);var s=e.contextType;typeof s=="object"&&s!==null?i.context=Et(s):(s=ot(e)?Nr:We.current,i.context=Ii(t,s)),Ks(t,n,i,r),i.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(Wa(t,e,s,n),i.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof i.getSnapshotBeforeUpdate=="function"||typeof i.UNSAFE_componentWillMount!="function"&&typeof i.componentWillMount!="function"||(e=i.state,typeof i.componentWillMount=="function"&&i.componentWillMount(),typeof i.UNSAFE_componentWillMount=="function"&&i.UNSAFE_componentWillMount(),e!==i.state&&Ga.enqueueReplaceState(i,i.state,null),Ks(t,n,i,r),i.state=t.memoizedState),typeof i.componentDidMount=="function"&&(t.flags|=4)}var Ka=Array.isArray;function Qs(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(L(309));var r=n.stateNode}if(!r)throw Error(L(147,t));var i=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===i?e.ref:(e=function(s){var o=r.refs;o===Kg&&(o=r.refs={}),s===null?delete o[i]:o[i]=s},e._stringRef=i,e)}if(typeof t!="string")throw Error(L(284));if(!n._owner)throw Error(L(290,t))}return t}function Qa(t,e){if(t.type!=="textarea")throw Error(L(31,Object.prototype.toString.call(e)==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":e))}function Jg(t){function e(v,E){if(t){var I=v.lastEffect;I!==null?(I.nextEffect=E,v.lastEffect=E):v.firstEffect=v.lastEffect=E,E.nextEffect=null,E.flags=8}}function n(v,E){if(!t)return null;for(;E!==null;)e(v,E),E=E.sibling;return null}function r(v,E){for(v=new Map;E!==null;)E.key!==null?v.set(E.key,E):v.set(E.index,E),E=E.sibling;return v}function i(v,E){return v=Gn(v,E),v.index=0,v.sibling=null,v}function s(v,E,I){return v.index=I,t?(I=v.alternate,I!==null?(I=I.index,I<E?(v.flags=2,E):I):(v.flags=2,E)):E}function o(v){return t&&v.alternate===null&&(v.flags=2),v}function l(v,E,I,P){return E===null||E.tag!==6?(E=Gh(I,v.mode,P),E.return=v,E):(E=i(E,I),E.return=v,E)}function u(v,E,I,P){return E!==null&&E.elementType===I.type?(P=i(E,I.props),P.ref=Qs(v,E,I),P.return=v,P):(P=fl(I.type,I.key,I.props,null,v.mode,P),P.ref=Qs(v,E,I),P.return=v,P)}function h(v,E,I,P){return E===null||E.tag!==4||E.stateNode.containerInfo!==I.containerInfo||E.stateNode.implementation!==I.implementation?(E=Kh(I,v.mode,P),E.return=v,E):(E=i(E,I.children||[]),E.return=v,E)}function f(v,E,I,P,N){return E===null||E.tag!==7?(E=xi(I,v.mode,P,N),E.return=v,E):(E=i(E,I),E.return=v,E)}function y(v,E,I){if(typeof E=="string"||typeof E=="number")return E=Gh(""+E,v.mode,I),E.return=v,E;if(typeof E=="object"&&E!==null){switch(E.$$typeof){case ws:return I=fl(E.type,E.key,E.props,null,v.mode,I),I.ref=Qs(v,null,E),I.return=v,I;case kr:return E=Kh(E,v.mode,I),E.return=v,E}if(Ka(E)||As(E))return E=xi(E,v.mode,I,null),E.return=v,E;Qa(v,E)}return null}function g(v,E,I,P){var N=E!==null?E.key:null;if(typeof I=="string"||typeof I=="number")return N!==null?null:l(v,E,""+I,P);if(typeof I=="object"&&I!==null){switch(I.$$typeof){case ws:return I.key===N?I.type===Cn?f(v,E,I.props.children,P,N):u(v,E,I,P):null;case kr:return I.key===N?h(v,E,I,P):null}if(Ka(I)||As(I))return N!==null?null:f(v,E,I,P,null);Qa(v,I)}return null}function k(v,E,I,P,N){if(typeof P=="string"||typeof P=="number")return v=v.get(I)||null,l(E,v,""+P,N);if(typeof P=="object"&&P!==null){switch(P.$$typeof){case ws:return v=v.get(P.key===null?I:P.key)||null,P.type===Cn?f(E,v,P.props.children,N,P.key):u(E,v,P,N);case kr:return v=v.get(P.key===null?I:P.key)||null,h(E,v,P,N)}if(Ka(P)||As(P))return v=v.get(I)||null,f(E,v,P,N,null);Qa(E,P)}return null}function V(v,E,I,P){for(var N=null,F=null,b=E,w=E=0,m=null;b!==null&&w<I.length;w++){b.index>w?(m=b,b=null):m=b.sibling;var _=g(v,b,I[w],P);if(_===null){b===null&&(b=m);break}t&&b&&_.alternate===null&&e(v,b),E=s(_,E,w),F===null?N=_:F.sibling=_,F=_,b=m}if(w===I.length)return n(v,b),N;if(b===null){for(;w<I.length;w++)b=y(v,I[w],P),b!==null&&(E=s(b,E,w),F===null?N=b:F.sibling=b,F=b);return N}for(b=r(v,b);w<I.length;w++)m=k(b,v,w,I[w],P),m!==null&&(t&&m.alternate!==null&&b.delete(m.key===null?w:m.key),E=s(m,E,w),F===null?N=m:F.sibling=m,F=m);return t&&b.forEach(function(A){return e(v,A)}),N}function O(v,E,I,P){var N=As(I);if(typeof N!="function")throw Error(L(150));if(I=N.call(I),I==null)throw Error(L(151));for(var F=N=null,b=E,w=E=0,m=null,_=I.next();b!==null&&!_.done;w++,_=I.next()){b.index>w?(m=b,b=null):m=b.sibling;var A=g(v,b,_.value,P);if(A===null){b===null&&(b=m);break}t&&b&&A.alternate===null&&e(v,b),E=s(A,E,w),F===null?N=A:F.sibling=A,F=A,b=m}if(_.done)return n(v,b),N;if(b===null){for(;!_.done;w++,_=I.next())_=y(v,_.value,P),_!==null&&(E=s(_,E,w),F===null?N=_:F.sibling=_,F=_);return N}for(b=r(v,b);!_.done;w++,_=I.next())_=k(b,v,w,_.value,P),_!==null&&(t&&_.alternate!==null&&b.delete(_.key===null?w:_.key),E=s(_,E,w),F===null?N=_:F.sibling=_,F=_);return t&&b.forEach(function(S){return e(v,S)}),N}return function(v,E,I,P){var N=typeof I=="object"&&I!==null&&I.type===Cn&&I.key===null;N&&(I=I.props.children);var F=typeof I=="object"&&I!==null;if(F)switch(I.$$typeof){case ws:e:{for(F=I.key,N=E;N!==null;){if(N.key===F){switch(N.tag){case 7:if(I.type===Cn){n(v,N.sibling),E=i(N,I.props.children),E.return=v,v=E;break e}break;default:if(N.elementType===I.type){n(v,N.sibling),E=i(N,I.props),E.ref=Qs(v,N,I),E.return=v,v=E;break e}}n(v,N);break}else e(v,N);N=N.sibling}I.type===Cn?(E=xi(I.props.children,v.mode,P,I.key),E.return=v,v=E):(P=fl(I.type,I.key,I.props,null,v.mode,P),P.ref=Qs(v,E,I),P.return=v,v=P)}return o(v);case kr:e:{for(N=I.key;E!==null;){if(E.key===N)if(E.tag===4&&E.stateNode.containerInfo===I.containerInfo&&E.stateNode.implementation===I.implementation){n(v,E.sibling),E=i(E,I.children||[]),E.return=v,v=E;break e}else{n(v,E);break}else e(v,E);E=E.sibling}E=Kh(I,v.mode,P),E.return=v,v=E}return o(v)}if(typeof I=="string"||typeof I=="number")return I=""+I,E!==null&&E.tag===6?(n(v,E.sibling),E=i(E,I),E.return=v,v=E):(n(v,E),E=Gh(I,v.mode,P),E.return=v,v=E),o(v);if(Ka(I))return V(v,E,I,P);if(As(I))return O(v,E,I,P);if(F&&Qa(v,I),typeof I=="undefined"&&!N)switch(v.tag){case 1:case 22:case 0:case 11:case 15:throw Error(L(152,li(v.type)||"Component"))}return n(v,E)}}var Ya=Jg(!0),Zg=Jg(!1),Ys={},jt=bn(Ys),Xs=bn(Ys),Js=bn(Ys);function Or(t){if(t===Ys)throw Error(L(174));return t}function dh(t,e){switch(ve(Js,e),ve(Xs,t),ve(jt,Ys),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:yc(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=yc(e,t)}fe(jt),ve(jt,e)}function Ri(){fe(jt),fe(Xs),fe(Js)}function ey(t){Or(Js.current);var e=Or(jt.current),n=yc(e,t.type);e!==n&&(ve(Xs,t),ve(jt,n))}function fh(t){Xs.current===t&&(fe(jt),fe(Xs))}var Ee=bn(0);function Xa(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if((e.flags&64)!=0)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var an=null,Bn=null,Bt=!1;function ty(t,e){var n=It(5,null,null,0);n.elementType="DELETED",n.type="DELETED",n.stateNode=e,n.return=t,n.flags=8,t.lastEffect!==null?(t.lastEffect.nextEffect=n,t.lastEffect=n):t.firstEffect=t.lastEffect=n}function ny(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,!0):!1;case 13:return!1;default:return!1}}function ph(t){if(Bt){var e=Bn;if(e){var n=e;if(!ny(t,e)){if(e=vi(n.nextSibling),!e||!ny(t,e)){t.flags=t.flags&-1025|2,Bt=!1,an=t;return}ty(an,n)}an=t,Bn=vi(e.firstChild)}else t.flags=t.flags&-1025|2,Bt=!1,an=t}}function ry(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;an=t}function Ja(t){if(t!==an)return!1;if(!Bt)return ry(t),Bt=!0,!1;var e=t.type;if(t.tag!==5||e!=="head"&&e!=="body"&&!Jc(e,t.memoizedProps))for(e=Bn;e;)ty(t,e),e=vi(e.nextSibling);if(ry(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(L(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Bn=vi(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Bn=null}}else Bn=an?vi(t.stateNode.nextSibling):null;return!0}function mh(){Bn=an=null,Bt=!1}var Ci=[];function gh(){for(var t=0;t<Ci.length;t++)Ci[t]._workInProgressVersionPrimary=null;Ci.length=0}var Zs=Sr.ReactCurrentDispatcher,wt=Sr.ReactCurrentBatchConfig,eo=0,Ae=null,Ke=null,Fe=null,Za=!1,to=!1;function at(){throw Error(L(321))}function yh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!vt(t[n],e[n]))return!1;return!0}function _h(t,e,n,r,i,s){if(eo=s,Ae=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Zs.current=t===null||t.memoizedState===null?DT:VT,t=n(r,i),to){s=0;do{if(to=!1,!(25>s))throw Error(L(301));s+=1,Fe=Ke=null,e.updateQueue=null,Zs.current=OT,t=n(r,i)}while(to)}if(Zs.current=rl,e=Ke!==null&&Ke.next!==null,eo=0,Fe=Ke=Ae=null,Za=!1,e)throw Error(L(300));return t}function xr(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Fe===null?Ae.memoizedState=Fe=t:Fe=Fe.next=t,Fe}function Mr(){if(Ke===null){var t=Ae.alternate;t=t!==null?t.memoizedState:null}else t=Ke.next;var e=Fe===null?Ae.memoizedState:Fe.next;if(e!==null)Fe=e,Ke=t;else{if(t===null)throw Error(L(310));Ke=t,t={memoizedState:Ke.memoizedState,baseState:Ke.baseState,baseQueue:Ke.baseQueue,queue:Ke.queue,next:null},Fe===null?Ae.memoizedState=Fe=t:Fe=Fe.next=t}return Fe}function $t(t,e){return typeof e=="function"?e(t):e}function no(t){var e=Mr(),n=e.queue;if(n===null)throw Error(L(311));n.lastRenderedReducer=t;var r=Ke,i=r.baseQueue,s=n.pending;if(s!==null){if(i!==null){var o=i.next;i.next=s.next,s.next=o}r.baseQueue=i=s,n.pending=null}if(i!==null){i=i.next,r=r.baseState;var l=o=s=null,u=i;do{var h=u.lane;if((eo&h)===h)l!==null&&(l=l.next={lane:0,action:u.action,eagerReducer:u.eagerReducer,eagerState:u.eagerState,next:null}),r=u.eagerReducer===t?u.eagerState:t(r,u.action);else{var f={lane:h,action:u.action,eagerReducer:u.eagerReducer,eagerState:u.eagerState,next:null};l===null?(o=l=f,s=r):l=l.next=f,Ae.lanes|=h,oo|=h}u=u.next}while(u!==null&&u!==i);l===null?s=r:l.next=o,vt(r,e.memoizedState)||(Dt=!0),e.memoizedState=r,e.baseState=s,e.baseQueue=l,n.lastRenderedState=r}return[e.memoizedState,n.dispatch]}function ro(t){var e=Mr(),n=e.queue;if(n===null)throw Error(L(311));n.lastRenderedReducer=t;var r=n.dispatch,i=n.pending,s=e.memoizedState;if(i!==null){n.pending=null;var o=i=i.next;do s=t(s,o.action),o=o.next;while(o!==i);vt(s,e.memoizedState)||(Dt=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,r]}function iy(t,e,n){var r=e._getVersion;r=r(e._source);var i=e._workInProgressVersionPrimary;if(i!==null?t=i===r:(t=t.mutableReadLanes,(t=(eo&t)===t)&&(e._workInProgressVersionPrimary=r,Ci.push(e))),t)return n(e._source);throw Ci.push(e),Error(L(350))}function sy(t,e,n,r){var i=rt;if(i===null)throw Error(L(349));var s=e._getVersion,o=s(e._source),l=Zs.current,u=l.useState(function(){return iy(i,e,n)}),h=u[1],f=u[0];u=Fe;var y=t.memoizedState,g=y.refs,k=g.getSnapshot,V=y.source;y=y.subscribe;var O=Ae;return t.memoizedState={refs:g,source:e,subscribe:r},l.useEffect(function(){g.getSnapshot=n,g.setSnapshot=h;var v=s(e._source);if(!vt(o,v)){v=n(e._source),vt(f,v)||(h(v),v=zn(O),i.mutableReadLanes|=v&i.pendingLanes),v=i.mutableReadLanes,i.entangledLanes|=v;for(var E=i.entanglements,I=v;0<I;){var P=31-On(I),N=1<<P;E[P]|=v,I&=~N}}},[n,e,r]),l.useEffect(function(){return r(e._source,function(){var v=g.getSnapshot,E=g.setSnapshot;try{E(v(e._source));var I=zn(O);i.mutableReadLanes|=I&i.pendingLanes}catch(P){E(function(){throw P})}})},[e,r]),vt(k,n)&&vt(V,e)&&vt(y,r)||(t={pending:null,dispatch:null,lastRenderedReducer:$t,lastRenderedState:f},t.dispatch=h=Th.bind(null,Ae,t),u.queue=t,u.baseQueue=null,f=iy(i,e,n),u.memoizedState=u.baseState=f),f}function oy(t,e,n){var r=Mr();return sy(r,t,e,n)}function io(t){var e=xr();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t=e.queue={pending:null,dispatch:null,lastRenderedReducer:$t,lastRenderedState:t},t=t.dispatch=Th.bind(null,Ae,t),[e.memoizedState,t]}function el(t,e,n,r){return t={tag:t,create:e,destroy:n,deps:r,next:null},e=Ae.updateQueue,e===null?(e={lastEffect:null},Ae.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(r=n.next,n.next=t,t.next=r,e.lastEffect=t)),t}function ay(t){var e=xr();return t={current:t},e.memoizedState=t}function tl(){return Mr().memoizedState}function vh(t,e,n,r){var i=xr();Ae.flags|=t,i.memoizedState=el(1|e,n,void 0,r===void 0?null:r)}function Eh(t,e,n,r){var i=Mr();r=r===void 0?null:r;var s=void 0;if(Ke!==null){var o=Ke.memoizedState;if(s=o.destroy,r!==null&&yh(r,o.deps)){el(e,n,s,r);return}}Ae.flags|=t,i.memoizedState=el(1|e,n,s,r)}function ly(t,e){return vh(516,4,t,e)}function nl(t,e){return Eh(516,4,t,e)}function uy(t,e){return Eh(4,2,t,e)}function cy(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function hy(t,e,n){return n=n!=null?n.concat([t]):null,Eh(4,2,cy.bind(null,e,t),n)}function wh(){}function dy(t,e){var n=Mr();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&yh(e,r[1])?r[0]:(n.memoizedState=[t,e],t)}function fy(t,e){var n=Mr();e=e===void 0?null:e;var r=n.memoizedState;return r!==null&&e!==null&&yh(e,r[1])?r[0]:(t=t(),n.memoizedState=[t,e],t)}function NT(t,e){var n=Ai();Vr(98>n?98:n,function(){t(!0)}),Vr(97<n?97:n,function(){var r=wt.transition;wt.transition=1;try{t(!1),e()}finally{wt.transition=r}})}function Th(t,e,n){var r=ft(),i=zn(t),s={lane:i,action:n,eagerReducer:null,eagerState:null,next:null},o=e.pending;if(o===null?s.next=s:(s.next=o.next,o.next=s),e.pending=s,o=t.alternate,t===Ae||o!==null&&o===Ae)to=Za=!0;else{if(t.lanes===0&&(o===null||o.lanes===0)&&(o=e.lastRenderedReducer,o!==null))try{var l=e.lastRenderedState,u=o(l,n);if(s.eagerReducer=o,s.eagerState=u,vt(u,l))return}catch{}finally{}Hn(t,i,r)}}var rl={readContext:Et,useCallback:at,useContext:at,useEffect:at,useImperativeHandle:at,useLayoutEffect:at,useMemo:at,useReducer:at,useRef:at,useState:at,useDebugValue:at,useDeferredValue:at,useTransition:at,useMutableSource:at,useOpaqueIdentifier:at,unstable_isNewReconciler:!1},DT={readContext:Et,useCallback:function(t,e){return xr().memoizedState=[t,e===void 0?null:e],t},useContext:Et,useEffect:ly,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,vh(4,2,cy.bind(null,e,t),n)},useLayoutEffect:function(t,e){return vh(4,2,t,e)},useMemo:function(t,e){var n=xr();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var r=xr();return e=n!==void 0?n(e):e,r.memoizedState=r.baseState=e,t=r.queue={pending:null,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},t=t.dispatch=Th.bind(null,Ae,t),[r.memoizedState,t]},useRef:ay,useState:io,useDebugValue:wh,useDeferredValue:function(t){var e=io(t),n=e[0],r=e[1];return ly(function(){var i=wt.transition;wt.transition=1;try{r(t)}finally{wt.transition=i}},[t]),n},useTransition:function(){var t=io(!1),e=t[0];return t=NT.bind(null,t[1]),ay(t),[t,e]},useMutableSource:function(t,e,n){var r=xr();return r.memoizedState={refs:{getSnapshot:e,setSnapshot:null},source:t,subscribe:n},sy(r,t,e,n)},useOpaqueIdentifier:function(){if(Bt){var t=!1,e=AT(function(){throw t||(t=!0,n("r:"+(eh++).toString(36))),Error(L(355))}),n=io(e)[1];return(Ae.mode&2)==0&&(Ae.flags|=516,el(5,function(){n("r:"+(eh++).toString(36))},void 0,null)),e}return e="r:"+(eh++).toString(36),io(e),e},unstable_isNewReconciler:!1},VT={readContext:Et,useCallback:dy,useContext:Et,useEffect:nl,useImperativeHandle:hy,useLayoutEffect:uy,useMemo:fy,useReducer:no,useRef:tl,useState:function(){return no($t)},useDebugValue:wh,useDeferredValue:function(t){var e=no($t),n=e[0],r=e[1];return nl(function(){var i=wt.transition;wt.transition=1;try{r(t)}finally{wt.transition=i}},[t]),n},useTransition:function(){var t=no($t)[0];return[tl().current,t]},useMutableSource:oy,useOpaqueIdentifier:function(){return no($t)[0]},unstable_isNewReconciler:!1},OT={readContext:Et,useCallback:dy,useContext:Et,useEffect:nl,useImperativeHandle:hy,useLayoutEffect:uy,useMemo:fy,useReducer:ro,useRef:tl,useState:function(){return ro($t)},useDebugValue:wh,useDeferredValue:function(t){var e=ro($t),n=e[0],r=e[1];return nl(function(){var i=wt.transition;wt.transition=1;try{r(t)}finally{wt.transition=i}},[t]),n},useTransition:function(){var t=ro($t)[0];return[tl().current,t]},useMutableSource:oy,useOpaqueIdentifier:function(){return ro($t)[0]},unstable_isNewReconciler:!1},xT=Sr.ReactCurrentOwner,Dt=!1;function lt(t,e,n,r){e.child=t===null?Zg(e,null,n,r):Ya(e,t.child,n,r)}function py(t,e,n,r,i){n=n.render;var s=e.ref;return ki(e,i),r=_h(t,e,n,r,s,i),t!==null&&!Dt?(e.updateQueue=t.updateQueue,e.flags&=-517,t.lanes&=~i,ln(t,e,i)):(e.flags|=1,lt(t,e,r,i),e.child)}function my(t,e,n,r,i,s){if(t===null){var o=n.type;return typeof o=="function"&&!qh(o)&&o.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=o,gy(t,e,o,r,i,s)):(t=fl(n.type,null,r,e,e.mode,s),t.ref=e.ref,t.return=e,e.child=t)}return o=t.child,(i&s)==0&&(i=o.memoizedProps,n=n.compare,n=n!==null?n:$s,n(i,r)&&t.ref===e.ref)?ln(t,e,s):(e.flags|=1,t=Gn(o,r),t.ref=e.ref,t.return=e,e.child=t)}function gy(t,e,n,r,i,s){if(t!==null&&$s(t.memoizedProps,r)&&t.ref===e.ref)if(Dt=!1,(s&i)!=0)(t.flags&16384)!=0&&(Dt=!0);else return e.lanes=t.lanes,ln(t,e,s);return Ah(t,e,n,r,s)}function Ih(t,e,n){var r=e.pendingProps,i=r.children,s=t!==null?t.memoizedState:null;if(r.mode==="hidden"||r.mode==="unstable-defer-without-hiding")if((e.mode&4)==0)e.memoizedState={baseLanes:0},dl(e,n);else if((n&1073741824)!=0)e.memoizedState={baseLanes:0},dl(e,s!==null?s.baseLanes:n);else return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t},dl(e,t),null;else s!==null?(r=s.baseLanes|n,e.memoizedState=null):r=n,dl(e,r);return lt(t,e,i,n),e.child}function yy(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=128)}function Ah(t,e,n,r,i){var s=ot(n)?Nr:We.current;return s=Ii(e,s),ki(e,i),n=_h(t,e,n,r,s,i),t!==null&&!Dt?(e.updateQueue=t.updateQueue,e.flags&=-517,t.lanes&=~i,ln(t,e,i)):(e.flags|=1,lt(t,e,n,i),e.child)}function _y(t,e,n,r,i){if(ot(n)){var s=!0;ja(e)}else s=!1;if(ki(e,i),e.stateNode===null)t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2),Yg(e,n,r),hh(e,n,r,i),r=!0;else if(t===null){var o=e.stateNode,l=e.memoizedProps;o.props=l;var u=o.context,h=n.contextType;typeof h=="object"&&h!==null?h=Et(h):(h=ot(n)?Nr:We.current,h=Ii(e,h));var f=n.getDerivedStateFromProps,y=typeof f=="function"||typeof o.getSnapshotBeforeUpdate=="function";y||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==r||u!==h)&&Xg(e,o,r,h),Un=!1;var g=e.memoizedState;o.state=g,Ks(e,r,o,i),u=e.memoizedState,l!==r||g!==u||st.current||Un?(typeof f=="function"&&(Wa(e,n,f,r),u=e.memoizedState),(l=Un||Qg(e,n,l,r,g,u,h))?(y||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4)):(typeof o.componentDidMount=="function"&&(e.flags|=4),e.memoizedProps=r,e.memoizedState=u),o.props=r,o.state=u,o.context=h,r=l):(typeof o.componentDidMount=="function"&&(e.flags|=4),r=!1)}else{o=e.stateNode,qg(t,e),l=e.memoizedProps,h=e.type===e.elementType?l:Nt(e.type,l),o.props=h,y=e.pendingProps,g=o.context,u=n.contextType,typeof u=="object"&&u!==null?u=Et(u):(u=ot(n)?Nr:We.current,u=Ii(e,u));var k=n.getDerivedStateFromProps;(f=typeof k=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(l!==y||g!==u)&&Xg(e,o,r,u),Un=!1,g=e.memoizedState,o.state=g,Ks(e,r,o,i);var V=e.memoizedState;l!==y||g!==V||st.current||Un?(typeof k=="function"&&(Wa(e,n,k,r),V=e.memoizedState),(h=Un||Qg(e,n,h,r,g,V,u))?(f||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(r,V,u),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(r,V,u)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=256)):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=256),e.memoizedProps=r,e.memoizedState=V),o.props=r,o.state=V,o.context=u,r=h):(typeof o.componentDidUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||l===t.memoizedProps&&g===t.memoizedState||(e.flags|=256),r=!1)}return Sh(t,e,n,r,s,i)}function Sh(t,e,n,r,i,s){yy(t,e);var o=(e.flags&64)!=0;if(!r&&!o)return i&&Mg(e,n,!1),ln(t,e,s);r=e.stateNode,xT.current=e;var l=o&&typeof n.getDerivedStateFromError!="function"?null:r.render();return e.flags|=1,t!==null&&o?(e.child=Ya(e,t.child,null,s),e.child=Ya(e,null,l,s)):lt(t,e,l,s),e.memoizedState=r.state,i&&Mg(e,n,!0),e.child}function vy(t){var e=t.stateNode;e.pendingContext?Og(t,e.pendingContext,e.pendingContext!==e.context):e.context&&Og(t,e.context,!1),dh(t,e.containerInfo)}var il={dehydrated:null,retryLane:0};function Ey(t,e,n){var r=e.pendingProps,i=Ee.current,s=!1,o;return(o=(e.flags&64)!=0)||(o=t!==null&&t.memoizedState===null?!1:(i&2)!=0),o?(s=!0,e.flags&=-65):t!==null&&t.memoizedState===null||r.fallback===void 0||r.unstable_avoidThisFallback===!0||(i|=1),ve(Ee,i&1),t===null?(r.fallback!==void 0&&ph(e),t=r.children,i=r.fallback,s?(t=wy(e,t,i,n),e.child.memoizedState={baseLanes:n},e.memoizedState=il,t):typeof r.unstable_expectedLoadTime=="number"?(t=wy(e,t,i,n),e.child.memoizedState={baseLanes:n},e.memoizedState=il,e.lanes=33554432,t):(n=Wh({mode:"visible",children:t},e.mode,n,null),n.return=e,e.child=n)):t.memoizedState!==null?s?(r=Iy(t,e,r.children,r.fallback,n),s=e.child,i=t.child.memoizedState,s.memoizedState=i===null?{baseLanes:n}:{baseLanes:i.baseLanes|n},s.childLanes=t.childLanes&~n,e.memoizedState=il,r):(n=Ty(t,e,r.children,n),e.memoizedState=null,n):s?(r=Iy(t,e,r.children,r.fallback,n),s=e.child,i=t.child.memoizedState,s.memoizedState=i===null?{baseLanes:n}:{baseLanes:i.baseLanes|n},s.childLanes=t.childLanes&~n,e.memoizedState=il,r):(n=Ty(t,e,r.children,n),e.memoizedState=null,n)}function wy(t,e,n,r){var i=t.mode,s=t.child;return e={mode:"hidden",children:e},(i&2)==0&&s!==null?(s.childLanes=0,s.pendingProps=e):s=Wh(e,i,0,null),n=xi(n,i,r,null),s.return=t,n.return=t,s.sibling=n,t.child=s,n}function Ty(t,e,n,r){var i=t.child;return t=i.sibling,n=Gn(i,{mode:"visible",children:n}),(e.mode&2)==0&&(n.lanes=r),n.return=e,n.sibling=null,t!==null&&(t.nextEffect=null,t.flags=8,e.firstEffect=e.lastEffect=t),e.child=n}function Iy(t,e,n,r,i){var s=e.mode,o=t.child;t=o.sibling;var l={mode:"hidden",children:n};return(s&2)==0&&e.child!==o?(n=e.child,n.childLanes=0,n.pendingProps=l,o=n.lastEffect,o!==null?(e.firstEffect=n.firstEffect,e.lastEffect=o,o.nextEffect=null):e.firstEffect=e.lastEffect=null):n=Gn(o,l),t!==null?r=Gn(t,r):(r=xi(r,s,i,null),r.flags|=2),r.return=e,n.return=e,n.sibling=r,e.child=n,r}function Ay(t,e){t.lanes|=e;var n=t.alternate;n!==null&&(n.lanes|=e),Hg(t.return,e)}function kh(t,e,n,r,i,s){var o=t.memoizedState;o===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,lastEffect:s}:(o.isBackwards=e,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.lastEffect=s)}function Sy(t,e,n){var r=e.pendingProps,i=r.revealOrder,s=r.tail;if(lt(t,e,r.children,n),r=Ee.current,(r&2)!=0)r=r&1|2,e.flags|=64;else{if(t!==null&&(t.flags&64)!=0)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Ay(t,n);else if(t.tag===19)Ay(t,n);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}r&=1}if(ve(Ee,r),(e.mode&2)==0)e.memoizedState=null;else switch(i){case"forwards":for(n=e.child,i=null;n!==null;)t=n.alternate,t!==null&&Xa(t)===null&&(i=n),n=n.sibling;n=i,n===null?(i=e.child,e.child=null):(i=n.sibling,n.sibling=null),kh(e,!1,i,n,s,e.lastEffect);break;case"backwards":for(n=null,i=e.child,e.child=null;i!==null;){if(t=i.alternate,t!==null&&Xa(t)===null){e.child=i;break}t=i.sibling,i.sibling=n,n=i,i=t}kh(e,!0,n,null,s,e.lastEffect);break;case"together":kh(e,!1,null,null,void 0,e.lastEffect);break;default:e.memoizedState=null}return e.child}function ln(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),oo|=e.lanes,(n&e.childLanes)!=0){if(t!==null&&e.child!==t.child)throw Error(L(153));if(e.child!==null){for(t=e.child,n=Gn(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Gn(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}return null}var ky,Rh,Ry,Cy;ky=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Rh=function(){};Ry=function(t,e,n,r){var i=t.memoizedProps;if(i!==r){t=e.stateNode,Or(jt.current);var s=null;switch(n){case"input":i=hc(t,i),r=hc(t,r),s=[];break;case"option":i=pc(t,i),r=pc(t,r),s=[];break;case"select":i=me({},i,{value:void 0}),r=me({},r,{value:void 0}),s=[];break;case"textarea":i=mc(t,i),r=mc(t,r),s=[];break;default:typeof i.onClick!="function"&&typeof r.onClick=="function"&&(t.onclick=Ma)}_c(n,r);var o;n=null;for(h in i)if(!r.hasOwnProperty(h)&&i.hasOwnProperty(h)&&i[h]!=null)if(h==="style"){var l=i[h];for(o in l)l.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(Es.hasOwnProperty(h)?s||(s=[]):(s=s||[]).push(h,null));for(h in r){var u=r[h];if(l=i!=null?i[h]:void 0,r.hasOwnProperty(h)&&u!==l&&(u!=null||l!=null))if(h==="style")if(l){for(o in l)!l.hasOwnProperty(o)||u&&u.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in u)u.hasOwnProperty(o)&&l[o]!==u[o]&&(n||(n={}),n[o]=u[o])}else n||(s||(s=[]),s.push(h,n)),n=u;else h==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,l=l?l.__html:void 0,u!=null&&l!==u&&(s=s||[]).push(h,u)):h==="children"?typeof u!="string"&&typeof u!="number"||(s=s||[]).push(h,""+u):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(Es.hasOwnProperty(h)?(u!=null&&h==="onScroll"&&de("scroll",t),s||l===u||(s=[])):typeof u=="object"&&u!==null&&u.$$typeof===oc?u.toString():(s=s||[]).push(h,u))}n&&(s=s||[]).push("style",n);var h=s;(e.updateQueue=h)&&(e.flags|=4)}};Cy=function(t,e,n,r){n!==r&&(e.flags|=4)};function so(t,e){if(!Bt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:r.sibling=null}}function MT(t,e,n){var r=e.pendingProps;switch(e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return null;case 1:return ot(e.type)&&Fa(),null;case 3:return Ri(),fe(st),fe(We),gh(),r=e.stateNode,r.pendingContext&&(r.context=r.pendingContext,r.pendingContext=null),(t===null||t.child===null)&&(Ja(e)?e.flags|=4:r.hydrate||(e.flags|=256)),Rh(e),null;case 5:fh(e);var i=Or(Js.current);if(n=e.type,t!==null&&e.stateNode!=null)Ry(t,e,n,r,i),t.ref!==e.ref&&(e.flags|=128);else{if(!r){if(e.stateNode===null)throw Error(L(166));return null}if(t=Or(jt.current),Ja(e)){r=e.stateNode,n=e.type;var s=e.memoizedProps;switch(r[Mn]=e,r[La]=s,n){case"dialog":de("cancel",r),de("close",r);break;case"iframe":case"object":case"embed":de("load",r);break;case"video":case"audio":for(t=0;t<Hs.length;t++)de(Hs[t],r);break;case"source":de("error",r);break;case"img":case"image":case"link":de("error",r),de("load",r);break;case"details":de("toggle",r);break;case"input":_m(r,s),de("invalid",r);break;case"select":r._wrapperState={wasMultiple:!!s.multiple},de("invalid",r);break;case"textarea":wm(r,s),de("invalid",r)}_c(n,s),t=null;for(var o in s)s.hasOwnProperty(o)&&(i=s[o],o==="children"?typeof i=="string"?r.textContent!==i&&(t=["children",i]):typeof i=="number"&&r.textContent!==""+i&&(t=["children",""+i]):Es.hasOwnProperty(o)&&i!=null&&o==="onScroll"&&de("scroll",r));switch(n){case"input":_a(r),Em(r,s,!0);break;case"textarea":_a(r),Im(r);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(r.onclick=Ma)}r=t,e.updateQueue=r,r!==null&&(e.flags|=4)}else{switch(o=i.nodeType===9?i:i.ownerDocument,t===gc.html&&(t=Am(n)),t===gc.html?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof r.is=="string"?t=o.createElement(n,{is:r.is}):(t=o.createElement(n),n==="select"&&(o=t,r.multiple?o.multiple=!0:r.size&&(o.size=r.size))):t=o.createElementNS(t,n),t[Mn]=e,t[La]=r,ky(t,e,!1,!1),e.stateNode=t,o=vc(n,r),n){case"dialog":de("cancel",t),de("close",t),i=r;break;case"iframe":case"object":case"embed":de("load",t),i=r;break;case"video":case"audio":for(i=0;i<Hs.length;i++)de(Hs[i],t);i=r;break;case"source":de("error",t),i=r;break;case"img":case"image":case"link":de("error",t),de("load",t),i=r;break;case"details":de("toggle",t),i=r;break;case"input":_m(t,r),i=hc(t,r),de("invalid",t);break;case"option":i=pc(t,r);break;case"select":t._wrapperState={wasMultiple:!!r.multiple},i=me({},r,{value:void 0}),de("invalid",t);break;case"textarea":wm(t,r),i=mc(t,r),de("invalid",t);break;default:i=r}_c(n,i);var l=i;for(s in l)if(l.hasOwnProperty(s)){var u=l[s];s==="style"?Rm(t,u):s==="dangerouslySetInnerHTML"?(u=u?u.__html:void 0,u!=null&&Sm(t,u)):s==="children"?typeof u=="string"?(n!=="textarea"||u!=="")&&ks(t,u):typeof u=="number"&&ks(t,""+u):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Es.hasOwnProperty(s)?u!=null&&s==="onScroll"&&de("scroll",t):u!=null&&ec(t,s,u,o))}switch(n){case"input":_a(t),Em(t,r,!1);break;case"textarea":_a(t),Im(t);break;case"option":r.value!=null&&t.setAttribute("value",""+Pn(r.value));break;case"select":t.multiple=!!r.multiple,s=r.value,s!=null?ui(t,!!r.multiple,s,!1):r.defaultValue!=null&&ui(t,!!r.multiple,r.defaultValue,!0);break;default:typeof i.onClick=="function"&&(t.onclick=Ma)}Cg(n,r)&&(e.flags|=4)}e.ref!==null&&(e.flags|=128)}return null;case 6:if(t&&e.stateNode!=null)Cy(t,e,t.memoizedProps,r);else{if(typeof r!="string"&&e.stateNode===null)throw Error(L(166));n=Or(Js.current),Or(jt.current),Ja(e)?(r=e.stateNode,n=e.memoizedProps,r[Mn]=e,r.nodeValue!==n&&(e.flags|=4)):(r=(n.nodeType===9?n:n.ownerDocument).createTextNode(r),r[Mn]=e,e.stateNode=r)}return null;case 13:return fe(Ee),r=e.memoizedState,(e.flags&64)!=0?(e.lanes=n,e):(r=r!==null,n=!1,t===null?e.memoizedProps.fallback!==void 0&&Ja(e):n=t.memoizedState!==null,r&&!n&&(e.mode&2)!=0&&(t===null&&e.memoizedProps.unstable_avoidThisFallback!==!0||(Ee.current&1)!=0?je===0&&(je=3):((je===0||je===3)&&(je=4),rt===null||(oo&134217727)==0&&(Ni&134217727)==0||Vi(rt,Qe))),(r||n)&&(e.flags|=4),null);case 4:return Ri(),Rh(e),t===null&&Ig(e.stateNode.containerInfo),null;case 10:return uh(e),null;case 17:return ot(e.type)&&Fa(),null;case 19:if(fe(Ee),r=e.memoizedState,r===null)return null;if(s=(e.flags&64)!=0,o=r.rendering,o===null)if(s)so(r,!1);else{if(je!==0||t!==null&&(t.flags&64)!=0)for(t=e.child;t!==null;){if(o=Xa(t),o!==null){for(e.flags|=64,so(r,!1),s=o.updateQueue,s!==null&&(e.updateQueue=s,e.flags|=4),r.lastEffect===null&&(e.firstEffect=null),e.lastEffect=r.lastEffect,r=n,n=e.child;n!==null;)s=n,t=r,s.flags&=2,s.nextEffect=null,s.firstEffect=null,s.lastEffect=null,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ve(Ee,Ee.current&1|2),e.child}t=t.sibling}r.tail!==null&&Ge()>Uh&&(e.flags|=64,s=!0,so(r,!1),e.lanes=33554432)}else{if(!s)if(t=Xa(o),t!==null){if(e.flags|=64,s=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),so(r,!0),r.tail===null&&r.tailMode==="hidden"&&!o.alternate&&!Bt)return e=e.lastEffect=r.lastEffect,e!==null&&(e.nextEffect=null),null}else 2*Ge()-r.renderingStartTime>Uh&&n!==1073741824&&(e.flags|=64,s=!0,so(r,!1),e.lanes=33554432);r.isBackwards?(o.sibling=e.child,e.child=o):(n=r.last,n!==null?n.sibling=o:e.child=o,r.last=o)}return r.tail!==null?(n=r.tail,r.rendering=n,r.tail=n.sibling,r.lastEffect=e.lastEffect,r.renderingStartTime=Ge(),n.sibling=null,e=Ee.current,ve(Ee,s?e&1|2:e&1),n):null;case 23:case 24:return Hh(),t!==null&&t.memoizedState!==null!=(e.memoizedState!==null)&&r.mode!=="unstable-defer-without-hiding"&&(e.flags|=4),null}throw Error(L(156,e.tag))}function bT(t){switch(t.tag){case 1:ot(t.type)&&Fa();var e=t.flags;return e&4096?(t.flags=e&-4097|64,t):null;case 3:if(Ri(),fe(st),fe(We),gh(),e=t.flags,(e&64)!=0)throw Error(L(285));return t.flags=e&-4097|64,t;case 5:return fh(t),null;case 13:return fe(Ee),e=t.flags,e&4096?(t.flags=e&-4097|64,t):null;case 19:return fe(Ee),null;case 4:return Ri(),null;case 10:return uh(t),null;case 23:case 24:return Hh(),null;default:return null}}function Ch(t,e){try{var n="",r=e;do n+=gw(r),r=r.return;while(r);var i=n}catch(s){i=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:i}}function Ph(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var LT=typeof WeakMap=="function"?WeakMap:Map;function Py(t,e,n){n=Fn(-1,n),n.tag=3,n.payload={element:null};var r=e.value;return n.callback=function(){al||(al=!0,Fh=r),Ph(t,e)},n}function Ny(t,e,n){n=Fn(-1,n),n.tag=3;var r=t.type.getDerivedStateFromError;if(typeof r=="function"){var i=e.value;n.payload=function(){return Ph(t,e),r(i)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){typeof r!="function"&&(zt===null?zt=new Set([this]):zt.add(this),Ph(t,e));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}var UT=typeof WeakSet=="function"?WeakSet:Set;function Dy(t){var e=t.ref;if(e!==null)if(typeof e=="function")try{e(null)}catch(n){Wn(t,n)}else e.current=null}function FT(t,e){switch(e.tag){case 0:case 11:case 15:case 22:return;case 1:if(e.flags&256&&t!==null){var n=t.memoizedProps,r=t.memoizedState;t=e.stateNode,e=t.getSnapshotBeforeUpdate(e.elementType===e.type?n:Nt(e.type,n),r),t.__reactInternalSnapshotBeforeUpdate=e}return;case 3:e.flags&256&&Zc(e.stateNode.containerInfo);return;case 5:case 6:case 4:case 17:return}throw Error(L(163))}function jT(t,e,n){switch(n.tag){case 0:case 11:case 15:case 22:if(e=n.updateQueue,e=e!==null?e.lastEffect:null,e!==null){t=e=e.next;do{if((t.tag&3)==3){var r=t.create;t.destroy=r()}t=t.next}while(t!==e)}if(e=n.updateQueue,e=e!==null?e.lastEffect:null,e!==null){t=e=e.next;do{var i=t;r=i.next,i=i.tag,(i&4)!=0&&(i&1)!=0&&(Wy(n,t),KT(n,t)),t=r}while(t!==e)}return;case 1:t=n.stateNode,n.flags&4&&(e===null?t.componentDidMount():(r=n.elementType===n.type?e.memoizedProps:Nt(n.type,e.memoizedProps),t.componentDidUpdate(r,e.memoizedState,t.__reactInternalSnapshotBeforeUpdate))),e=n.updateQueue,e!==null&&Gg(n,e,t);return;case 3:if(e=n.updateQueue,e!==null){if(t=null,n.child!==null)switch(n.child.tag){case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}Gg(n,e,t)}return;case 5:t=n.stateNode,e===null&&n.flags&4&&Cg(n.type,n.memoizedProps)&&t.focus();return;case 6:return;case 4:return;case 12:return;case 13:n.memoizedState===null&&(n=n.alternate,n!==null&&(n=n.memoizedState,n!==null&&(n=n.dehydrated,n!==null&&zm(n))));return;case 19:case 17:case 20:case 21:case 23:case 24:return}throw Error(L(163))}function Vy(t,e){for(var n=t;;){if(n.tag===5){var r=n.stateNode;if(e)r=r.style,typeof r.setProperty=="function"?r.setProperty("display","none","important"):r.display="none";else{r=n.stateNode;var i=n.memoizedProps.style;i=i!=null&&i.hasOwnProperty("display")?i.display:null,r.style.display=km("display",i)}}else if(n.tag===6)n.stateNode.nodeValue=e?"":n.memoizedProps;else if((n.tag!==23&&n.tag!==24||n.memoizedState===null||n===t)&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===t)break;for(;n.sibling===null;){if(n.return===null||n.return===t)return;n=n.return}n.sibling.return=n.return,n=n.sibling}}function Oy(t,e){if(Dr&&typeof Dr.onCommitFiberUnmount=="function")try{Dr.onCommitFiberUnmount(nh,e)}catch{}switch(e.tag){case 0:case 11:case 14:case 15:case 22:if(t=e.updateQueue,t!==null&&(t=t.lastEffect,t!==null)){var n=t=t.next;do{var r=n,i=r.destroy;if(r=r.tag,i!==void 0)if((r&4)!=0)Wy(e,n);else{r=e;try{i()}catch(s){Wn(r,s)}}n=n.next}while(n!==t)}break;case 1:if(Dy(e),t=e.stateNode,typeof t.componentWillUnmount=="function")try{t.props=e.memoizedProps,t.state=e.memoizedState,t.componentWillUnmount()}catch(s){Wn(e,s)}break;case 5:Dy(e);break;case 4:Ly(t,e)}}function xy(t){t.alternate=null,t.child=null,t.dependencies=null,t.firstEffect=null,t.lastEffect=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.return=null,t.updateQueue=null}function My(t){return t.tag===5||t.tag===3||t.tag===4}function by(t){e:{for(var e=t.return;e!==null;){if(My(e))break e;e=e.return}throw Error(L(160))}var n=e;switch(e=n.stateNode,n.tag){case 5:var r=!1;break;case 3:e=e.containerInfo,r=!0;break;case 4:e=e.containerInfo,r=!0;break;default:throw Error(L(161))}n.flags&16&&(ks(e,""),n.flags&=-17);e:t:for(n=t;;){for(;n.sibling===null;){if(n.return===null||My(n.return)){n=null;break e}n=n.return}for(n.sibling.return=n.return,n=n.sibling;n.tag!==5&&n.tag!==6&&n.tag!==18;){if(n.flags&2||n.child===null||n.tag===4)continue t;n.child.return=n,n=n.child}if(!(n.flags&2)){n=n.stateNode;break e}}r?Nh(t,n,e):Dh(t,n,e)}function Nh(t,e,n){var r=t.tag,i=r===5||r===6;if(i)t=i?t.stateNode:t.stateNode.instance,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Ma));else if(r!==4&&(t=t.child,t!==null))for(Nh(t,e,n),t=t.sibling;t!==null;)Nh(t,e,n),t=t.sibling}function Dh(t,e,n){var r=t.tag,i=r===5||r===6;if(i)t=i?t.stateNode:t.stateNode.instance,e?n.insertBefore(t,e):n.appendChild(t);else if(r!==4&&(t=t.child,t!==null))for(Dh(t,e,n),t=t.sibling;t!==null;)Dh(t,e,n),t=t.sibling}function Ly(t,e){for(var n=e,r=!1,i,s;;){if(!r){r=n.return;e:for(;;){if(r===null)throw Error(L(160));switch(i=r.stateNode,r.tag){case 5:s=!1;break e;case 3:i=i.containerInfo,s=!0;break e;case 4:i=i.containerInfo,s=!0;break e}r=r.return}r=!0}if(n.tag===5||n.tag===6){e:for(var o=t,l=n,u=l;;)if(Oy(o,u),u.child!==null&&u.tag!==4)u.child.return=u,u=u.child;else{if(u===l)break e;for(;u.sibling===null;){if(u.return===null||u.return===l)break e;u=u.return}u.sibling.return=u.return,u=u.sibling}s?(o=i,l=n.stateNode,o.nodeType===8?o.parentNode.removeChild(l):o.removeChild(l)):i.removeChild(n.stateNode)}else if(n.tag===4){if(n.child!==null){i=n.stateNode.containerInfo,s=!0,n.child.return=n,n=n.child;continue}}else if(Oy(t,n),n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return,n.tag===4&&(r=!1)}n.sibling.return=n.return,n=n.sibling}}function Vh(t,e){switch(e.tag){case 0:case 11:case 14:case 15:case 22:var n=e.updateQueue;if(n=n!==null?n.lastEffect:null,n!==null){var r=n=n.next;do(r.tag&3)==3&&(t=r.destroy,r.destroy=void 0,t!==void 0&&t()),r=r.next;while(r!==n)}return;case 1:return;case 5:if(n=e.stateNode,n!=null){r=e.memoizedProps;var i=t!==null?t.memoizedProps:r;t=e.type;var s=e.updateQueue;if(e.updateQueue=null,s!==null){for(n[La]=r,t==="input"&&r.type==="radio"&&r.name!=null&&vm(n,r),vc(t,i),e=vc(t,r),i=0;i<s.length;i+=2){var o=s[i],l=s[i+1];o==="style"?Rm(n,l):o==="dangerouslySetInnerHTML"?Sm(n,l):o==="children"?ks(n,l):ec(n,o,l,e)}switch(t){case"input":dc(n,r);break;case"textarea":Tm(n,r);break;case"select":t=n._wrapperState.wasMultiple,n._wrapperState.wasMultiple=!!r.multiple,s=r.value,s!=null?ui(n,!!r.multiple,s,!1):t!==!!r.multiple&&(r.defaultValue!=null?ui(n,!!r.multiple,r.defaultValue,!0):ui(n,!!r.multiple,r.multiple?[]:"",!1))}}}return;case 6:if(e.stateNode===null)throw Error(L(162));e.stateNode.nodeValue=e.memoizedProps;return;case 3:n=e.stateNode,n.hydrate&&(n.hydrate=!1,zm(n.containerInfo));return;case 12:return;case 13:e.memoizedState!==null&&(Lh=Ge(),Vy(e.child,!0)),Uy(e);return;case 19:Uy(e);return;case 17:return;case 23:case 24:Vy(e,e.memoizedState!==null);return}throw Error(L(163))}function Uy(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new UT),e.forEach(function(r){var i=XT.bind(null,t,r);n.has(r)||(n.add(r),r.then(i,i))})}}function BT(t,e){return t!==null&&(t=t.memoizedState,t===null||t.dehydrated!==null)?(e=e.memoizedState,e!==null&&e.dehydrated===null):!1}var $T=Math.ceil,sl=Sr.ReactCurrentDispatcher,Oh=Sr.ReactCurrentOwner,Q=0,rt=null,Ve=null,Qe=0,br=0,xh=bn(0),je=0,ol=null,Pi=0,oo=0,Ni=0,Mh=0,bh=null,Lh=0,Uh=1/0;function Di(){Uh=Ge()+500}var H=null,al=!1,Fh=null,zt=null,$n=!1,ao=null,lo=90,jh=[],Bh=[],un=null,uo=0,$h=null,ll=-1,cn=0,ul=0,co=null,cl=!1;function ft(){return(Q&48)!=0?Ge():ll!==-1?ll:ll=Ge()}function zn(t){if(t=t.mode,(t&2)==0)return 1;if((t&4)==0)return Ai()===99?1:2;if(cn===0&&(cn=Pi),PT.transition!==0){ul!==0&&(ul=bh!==null?bh.pendingLanes:0),t=cn;var e=4186112&~ul;return e&=-e,e===0&&(t=4186112&~t,e=t&-t,e===0&&(e=8192)),e}return t=Ai(),(Q&4)!=0&&t===98?t=ka(12,cn):(t=Vw(t),t=ka(t,cn)),t}function Hn(t,e,n){if(50<uo)throw uo=0,$h=null,Error(L(185));if(t=hl(t,e),t===null)return null;Ra(t,e,n),t===rt&&(Ni|=e,je===4&&Vi(t,Qe));var r=Ai();e===1?(Q&8)!=0&&(Q&48)==0?zh(t):(Tt(t,n),Q===0&&(Di(),Ft())):((Q&4)==0||r!==98&&r!==99||(un===null?un=new Set([t]):un.add(t)),Tt(t,n)),bh=t}function hl(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}function Tt(t,e){for(var n=t.callbackNode,r=t.suspendedLanes,i=t.pingedLanes,s=t.expirationTimes,o=t.pendingLanes;0<o;){var l=31-On(o),u=1<<l,h=s[l];if(h===-1){if((u&r)==0||(u&i)!=0){h=e,fi(u);var f=ue;s[l]=10<=f?h+250:6<=f?h+5e3:-1}}else h<=e&&(t.expiredLanes|=u);o&=~u}if(r=bs(t,t===rt?Qe:0),e=ue,r===0)n!==null&&(n!==oh&&ih(n),t.callbackNode=null,t.callbackPriority=0);else{if(n!==null){if(t.callbackPriority===e)return;n!==oh&&ih(n)}e===15?(n=zh.bind(null,t),on===null?(on=[n],$a=rh(Ba,zg)):on.push(n),n=oh):e===14?n=Gs(99,zh.bind(null,t)):(n=Ow(e),n=Gs(n,Fy.bind(null,t))),t.callbackPriority=e,t.callbackNode=n}}function Fy(t){if(ll=-1,ul=cn=0,(Q&48)!=0)throw Error(L(327));var e=t.callbackNode;if(qn()&&t.callbackNode!==e)return null;var n=bs(t,t===rt?Qe:0);if(n===0)return null;var r=n,i=Q;Q|=16;var s=zy();(rt!==t||Qe!==r)&&(Di(),Oi(t,r));do try{qT();break}catch(l){$y(t,l)}while(1);if(lh(),sl.current=s,Q=i,Ve!==null?r=0:(rt=null,Qe=0,r=je),(Pi&Ni)!=0)Oi(t,0);else if(r!==0){if(r===2&&(Q|=64,t.hydrate&&(t.hydrate=!1,Zc(t.containerInfo)),n=Ym(t),n!==0&&(r=ho(t,n))),r===1)throw e=ol,Oi(t,0),Vi(t,n),Tt(t,Ge()),e;switch(t.finishedWork=t.current.alternate,t.finishedLanes=n,r){case 0:case 1:throw Error(L(345));case 2:Lr(t);break;case 3:if(Vi(t,n),(n&62914560)===n&&(r=Lh+500-Ge(),10<r)){if(bs(t,0)!==0)break;if(i=t.suspendedLanes,(i&n)!==n){ft(),t.pingedLanes|=t.suspendedLanes&i;break}t.timeoutHandle=Pg(Lr.bind(null,t),r);break}Lr(t);break;case 4:if(Vi(t,n),(n&4186112)===n)break;for(r=t.eventTimes,i=-1;0<n;){var o=31-On(n);s=1<<o,o=r[o],o>i&&(i=o),n&=~s}if(n=i,n=Ge()-n,n=(120>n?120:480>n?480:1080>n?1080:1920>n?1920:3e3>n?3e3:4320>n?4320:1960*$T(n/1960))-n,10<n){t.timeoutHandle=Pg(Lr.bind(null,t),n);break}Lr(t);break;case 5:Lr(t);break;default:throw Error(L(329))}}return Tt(t,Ge()),t.callbackNode===e?Fy.bind(null,t):null}function Vi(t,e){for(e&=~Mh,e&=~Ni,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-On(e),r=1<<n;t[n]=-1,e&=~r}}function zh(t){if((Q&48)!=0)throw Error(L(327));if(qn(),t===rt&&(t.expiredLanes&Qe)!=0){var e=Qe,n=ho(t,e);(Pi&Ni)!=0&&(e=bs(t,e),n=ho(t,e))}else e=bs(t,0),n=ho(t,e);if(t.tag!==0&&n===2&&(Q|=64,t.hydrate&&(t.hydrate=!1,Zc(t.containerInfo)),e=Ym(t),e!==0&&(n=ho(t,e))),n===1)throw n=ol,Oi(t,0),Vi(t,e),Tt(t,Ge()),n;return t.finishedWork=t.current.alternate,t.finishedLanes=e,Lr(t),Tt(t,Ge()),null}function zT(){if(un!==null){var t=un;un=null,t.forEach(function(e){e.expiredLanes|=24&e.pendingLanes,Tt(e,Ge())})}Ft()}function jy(t,e){var n=Q;Q|=1;try{return t(e)}finally{Q=n,Q===0&&(Di(),Ft())}}function By(t,e){var n=Q;Q&=-2,Q|=8;try{return t(e)}finally{Q=n,Q===0&&(Di(),Ft())}}function dl(t,e){ve(xh,br),br|=e,Pi|=e}function Hh(){br=xh.current,fe(xh)}function Oi(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,IT(n)),Ve!==null)for(n=Ve.return;n!==null;){var r=n;switch(r.tag){case 1:r=r.type.childContextTypes,r!=null&&Fa();break;case 3:Ri(),fe(st),fe(We),gh();break;case 5:fh(r);break;case 4:Ri();break;case 13:fe(Ee);break;case 19:fe(Ee);break;case 10:uh(r);break;case 23:case 24:Hh()}n=n.return}rt=t,Ve=Gn(t.current,null),Qe=br=Pi=e,je=0,ol=null,Mh=Ni=oo=0}function $y(t,e){do{var n=Ve;try{if(lh(),Zs.current=rl,Za){for(var r=Ae.memoizedState;r!==null;){var i=r.queue;i!==null&&(i.pending=null),r=r.next}Za=!1}if(eo=0,Fe=Ke=Ae=null,to=!1,Oh.current=null,n===null||n.return===null){je=1,ol=e,Ve=null;break}e:{var s=t,o=n.return,l=n,u=e;if(e=Qe,l.flags|=2048,l.firstEffect=l.lastEffect=null,u!==null&&typeof u=="object"&&typeof u.then=="function"){var h=u;if((l.mode&2)==0){var f=l.alternate;f?(l.updateQueue=f.updateQueue,l.memoizedState=f.memoizedState,l.lanes=f.lanes):(l.updateQueue=null,l.memoizedState=null)}var y=(Ee.current&1)!=0,g=o;do{var k;if(k=g.tag===13){var V=g.memoizedState;if(V!==null)k=V.dehydrated!==null;else{var O=g.memoizedProps;k=O.fallback===void 0?!1:O.unstable_avoidThisFallback!==!0?!0:!y}}if(k){var v=g.updateQueue;if(v===null){var E=new Set;E.add(h),g.updateQueue=E}else v.add(h);if((g.mode&2)==0){if(g.flags|=64,l.flags|=16384,l.flags&=-2981,l.tag===1)if(l.alternate===null)l.tag=17;else{var I=Fn(-1,1);I.tag=2,jn(l,I)}l.lanes|=1;break e}u=void 0,l=e;var P=s.pingCache;if(P===null?(P=s.pingCache=new LT,u=new Set,P.set(h,u)):(u=P.get(h),u===void 0&&(u=new Set,P.set(h,u))),!u.has(l)){u.add(l);var N=YT.bind(null,s,h,l);h.then(N,N)}g.flags|=4096,g.lanes=e;break e}g=g.return}while(g!==null);u=Error((li(l.type)||"A React component")+` suspended while rendering, but no fallback UI was specified.

Add a <Suspense fallback=...> component higher in the tree to provide a loading indicator or placeholder to display.`)}je!==5&&(je=2),u=Ch(u,l),g=o;do{switch(g.tag){case 3:s=u,g.flags|=4096,e&=-e,g.lanes|=e;var F=Py(g,s,e);Wg(g,F);break e;case 1:s=u;var b=g.type,w=g.stateNode;if((g.flags&64)==0&&(typeof b.getDerivedStateFromError=="function"||w!==null&&typeof w.componentDidCatch=="function"&&(zt===null||!zt.has(w)))){g.flags|=4096,e&=-e,g.lanes|=e;var m=Ny(g,s,e);Wg(g,m);break e}}g=g.return}while(g!==null)}qy(n)}catch(_){e=_,Ve===n&&n!==null&&(Ve=n=n.return);continue}break}while(1)}function zy(){var t=sl.current;return sl.current=rl,t===null?rl:t}function ho(t,e){var n=Q;Q|=16;var r=zy();rt===t&&Qe===e||Oi(t,e);do try{HT();break}catch(i){$y(t,i)}while(1);if(lh(),Q=n,sl.current=r,Ve!==null)throw Error(L(261));return rt=null,Qe=0,je}function HT(){for(;Ve!==null;)Hy(Ve)}function qT(){for(;Ve!==null&&!kT();)Hy(Ve)}function Hy(t){var e=Ky(t.alternate,t,br);t.memoizedProps=t.pendingProps,e===null?qy(t):Ve=e,Oh.current=null}function qy(t){var e=t;do{var n=e.alternate;if(t=e.return,(e.flags&2048)==0){if(n=MT(n,e,br),n!==null){Ve=n;return}if(n=e,n.tag!==24&&n.tag!==23||n.memoizedState===null||(br&1073741824)!=0||(n.mode&4)==0){for(var r=0,i=n.child;i!==null;)r|=i.lanes|i.childLanes,i=i.sibling;n.childLanes=r}t!==null&&(t.flags&2048)==0&&(t.firstEffect===null&&(t.firstEffect=e.firstEffect),e.lastEffect!==null&&(t.lastEffect!==null&&(t.lastEffect.nextEffect=e.firstEffect),t.lastEffect=e.lastEffect),1<e.flags&&(t.lastEffect!==null?t.lastEffect.nextEffect=e:t.firstEffect=e,t.lastEffect=e))}else{if(n=bT(e),n!==null){n.flags&=2047,Ve=n;return}t!==null&&(t.firstEffect=t.lastEffect=null,t.flags|=2048)}if(e=e.sibling,e!==null){Ve=e;return}Ve=e=t}while(e!==null);je===0&&(je=5)}function Lr(t){var e=Ai();return Vr(99,WT.bind(null,t,e)),null}function WT(t,e){do qn();while(ao!==null);if((Q&48)!=0)throw Error(L(327));var n=t.finishedWork;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(L(177));t.callbackNode=null;var r=n.lanes|n.childLanes,i=r,s=t.pendingLanes&~i;t.pendingLanes=i,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=i,t.mutableReadLanes&=i,t.entangledLanes&=i,i=t.entanglements;for(var o=t.eventTimes,l=t.expirationTimes;0<s;){var u=31-On(s),h=1<<u;i[u]=0,o[u]=-1,l[u]=-1,s&=~h}if(un!==null&&(r&24)==0&&un.has(t)&&un.delete(t),t===rt&&(Ve=rt=null,Qe=0),1<n.flags?n.lastEffect!==null?(n.lastEffect.nextEffect=n,r=n.firstEffect):r=n:r=n.firstEffect,r!==null){if(i=Q,Q|=32,Oh.current=null,Yc=Ca,o=gg(),Wc(o)){if("selectionStart"in o)l={start:o.selectionStart,end:o.selectionEnd};else e:if(l=(l=o.ownerDocument)&&l.defaultView||window,(h=l.getSelection&&l.getSelection())&&h.rangeCount!==0){l=h.anchorNode,s=h.anchorOffset,u=h.focusNode,h=h.focusOffset;try{l.nodeType,u.nodeType}catch{l=null;break e}var f=0,y=-1,g=-1,k=0,V=0,O=o,v=null;t:for(;;){for(var E;O!==l||s!==0&&O.nodeType!==3||(y=f+s),O!==u||h!==0&&O.nodeType!==3||(g=f+h),O.nodeType===3&&(f+=O.nodeValue.length),(E=O.firstChild)!==null;)v=O,O=E;for(;;){if(O===o)break t;if(v===l&&++k===s&&(y=f),v===u&&++V===h&&(g=f),(E=O.nextSibling)!==null)break;O=v,v=O.parentNode}O=E}l=y===-1||g===-1?null:{start:y,end:g}}else l=null;l=l||{start:0,end:0}}else l=null;Xc={focusedElem:o,selectionRange:l},Ca=!1,co=null,cl=!1,H=r;do try{GT()}catch(_){if(H===null)throw Error(L(330));Wn(H,_),H=H.nextEffect}while(H!==null);co=null,H=r;do try{for(o=t;H!==null;){var I=H.flags;if(I&16&&ks(H.stateNode,""),I&128){var P=H.alternate;if(P!==null){var N=P.ref;N!==null&&(typeof N=="function"?N(null):N.current=null)}}switch(I&1038){case 2:by(H),H.flags&=-3;break;case 6:by(H),H.flags&=-3,Vh(H.alternate,H);break;case 1024:H.flags&=-1025;break;case 1028:H.flags&=-1025,Vh(H.alternate,H);break;case 4:Vh(H.alternate,H);break;case 8:l=H,Ly(o,l);var F=l.alternate;xy(l),F!==null&&xy(F)}H=H.nextEffect}}catch(_){if(H===null)throw Error(L(330));Wn(H,_),H=H.nextEffect}while(H!==null);if(N=Xc,P=gg(),I=N.focusedElem,o=N.selectionRange,P!==I&&I&&I.ownerDocument&&mg(I.ownerDocument.documentElement,I)){for(o!==null&&Wc(I)&&(P=o.start,N=o.end,N===void 0&&(N=P),"selectionStart"in I?(I.selectionStart=P,I.selectionEnd=Math.min(N,I.value.length)):(N=(P=I.ownerDocument||document)&&P.defaultView||window,N.getSelection&&(N=N.getSelection(),l=I.textContent.length,F=Math.min(o.start,l),o=o.end===void 0?F:Math.min(o.end,l),!N.extend&&F>o&&(l=o,o=F,F=l),l=pg(I,F),s=pg(I,o),l&&s&&(N.rangeCount!==1||N.anchorNode!==l.node||N.anchorOffset!==l.offset||N.focusNode!==s.node||N.focusOffset!==s.offset)&&(P=P.createRange(),P.setStart(l.node,l.offset),N.removeAllRanges(),F>o?(N.addRange(P),N.extend(s.node,s.offset)):(P.setEnd(s.node,s.offset),N.addRange(P)))))),P=[],N=I;N=N.parentNode;)N.nodeType===1&&P.push({element:N,left:N.scrollLeft,top:N.scrollTop});for(typeof I.focus=="function"&&I.focus(),I=0;I<P.length;I++)N=P[I],N.element.scrollLeft=N.left,N.element.scrollTop=N.top}Ca=!!Yc,Xc=Yc=null,t.current=n,H=r;do try{for(I=t;H!==null;){var b=H.flags;if(b&36&&jT(I,H.alternate,H),b&128){P=void 0;var w=H.ref;if(w!==null){var m=H.stateNode;switch(H.tag){case 5:P=m;break;default:P=m}typeof w=="function"?w(P):w.current=P}}H=H.nextEffect}}catch(_){if(H===null)throw Error(L(330));Wn(H,_),H=H.nextEffect}while(H!==null);H=null,CT(),Q=i}else t.current=n;if($n)$n=!1,ao=t,lo=e;else for(H=r;H!==null;)e=H.nextEffect,H.nextEffect=null,H.flags&8&&(b=H,b.sibling=null,b.stateNode=null),H=e;if(r=t.pendingLanes,r===0&&(zt=null),r===1?t===$h?uo++:(uo=0,$h=t):uo=0,n=n.stateNode,Dr&&typeof Dr.onCommitFiberRoot=="function")try{Dr.onCommitFiberRoot(nh,n,void 0,(n.current.flags&64)==64)}catch{}if(Tt(t,Ge()),al)throw al=!1,t=Fh,Fh=null,t;return(Q&8)!=0||Ft(),null}function GT(){for(;H!==null;){var t=H.alternate;cl||co===null||((H.flags&8)!=0?bm(H,co)&&(cl=!0):H.tag===13&&BT(t,H)&&bm(H,co)&&(cl=!0));var e=H.flags;(e&256)!=0&&FT(t,H),(e&512)==0||$n||($n=!0,Gs(97,function(){return qn(),null})),H=H.nextEffect}}function qn(){if(lo!==90){var t=97<lo?97:lo;return lo=90,Vr(t,QT)}return!1}function KT(t,e){jh.push(e,t),$n||($n=!0,Gs(97,function(){return qn(),null}))}function Wy(t,e){Bh.push(e,t),$n||($n=!0,Gs(97,function(){return qn(),null}))}function QT(){if(ao===null)return!1;var t=ao;if(ao=null,(Q&48)!=0)throw Error(L(331));var e=Q;Q|=32;var n=Bh;Bh=[];for(var r=0;r<n.length;r+=2){var i=n[r],s=n[r+1],o=i.destroy;if(i.destroy=void 0,typeof o=="function")try{o()}catch(u){if(s===null)throw Error(L(330));Wn(s,u)}}for(n=jh,jh=[],r=0;r<n.length;r+=2){i=n[r],s=n[r+1];try{var l=i.create;i.destroy=l()}catch(u){if(s===null)throw Error(L(330));Wn(s,u)}}for(l=t.current.firstEffect;l!==null;)t=l.nextEffect,l.nextEffect=null,l.flags&8&&(l.sibling=null,l.stateNode=null),l=t;return Q=e,Ft(),!0}function Gy(t,e,n){e=Ch(n,e),e=Py(t,e,1),jn(t,e),e=ft(),t=hl(t,1),t!==null&&(Ra(t,1,e),Tt(t,e))}function Wn(t,e){if(t.tag===3)Gy(t,t,e);else for(var n=t.return;n!==null;){if(n.tag===3){Gy(n,t,e);break}else if(n.tag===1){var r=n.stateNode;if(typeof n.type.getDerivedStateFromError=="function"||typeof r.componentDidCatch=="function"&&(zt===null||!zt.has(r))){t=Ch(e,t);var i=Ny(n,t,1);if(jn(n,i),i=ft(),n=hl(n,1),n!==null)Ra(n,1,i),Tt(n,i);else if(typeof r.componentDidCatch=="function"&&(zt===null||!zt.has(r)))try{r.componentDidCatch(e,t)}catch{}break}}n=n.return}}function YT(t,e,n){var r=t.pingCache;r!==null&&r.delete(e),e=ft(),t.pingedLanes|=t.suspendedLanes&n,rt===t&&(Qe&n)===n&&(je===4||je===3&&(Qe&62914560)===Qe&&500>Ge()-Lh?Oi(t,0):Mh|=n),Tt(t,e)}function XT(t,e){var n=t.stateNode;n!==null&&n.delete(e),e=0,e===0&&(e=t.mode,(e&2)==0?e=1:(e&4)==0?e=Ai()===99?1:2:(cn===0&&(cn=Pi),e=pi(62914560&~cn),e===0&&(e=4194304))),n=ft(),t=hl(t,e),t!==null&&(Ra(t,e,n),Tt(t,n))}var Ky;Ky=function(t,e,n){var r=e.lanes;if(t!==null)if(t.memoizedProps!==e.pendingProps||st.current)Dt=!0;else if((n&r)!=0)Dt=(t.flags&16384)!=0;else{switch(Dt=!1,e.tag){case 3:vy(e),mh();break;case 5:ey(e);break;case 1:ot(e.type)&&ja(e);break;case 4:dh(e,e.stateNode.containerInfo);break;case 10:r=e.memoizedProps.value;var i=e.type._context;ve(za,i._currentValue),i._currentValue=r;break;case 13:if(e.memoizedState!==null)return(n&e.child.childLanes)!=0?Ey(t,e,n):(ve(Ee,Ee.current&1),e=ln(t,e,n),e!==null?e.sibling:null);ve(Ee,Ee.current&1);break;case 19:if(r=(n&e.childLanes)!=0,(t.flags&64)!=0){if(r)return Sy(t,e,n);e.flags|=64}if(i=e.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),ve(Ee,Ee.current),r)break;return null;case 23:case 24:return e.lanes=0,Ih(t,e,n)}return ln(t,e,n)}else Dt=!1;switch(e.lanes=0,e.tag){case 2:if(r=e.type,t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2),t=e.pendingProps,i=Ii(e,We.current),ki(e,n),i=_h(null,e,r,t,i,n),e.flags|=1,typeof i=="object"&&i!==null&&typeof i.render=="function"&&i.$$typeof===void 0){if(e.tag=1,e.memoizedState=null,e.updateQueue=null,ot(r)){var s=!0;ja(e)}else s=!1;e.memoizedState=i.state!==null&&i.state!==void 0?i.state:null,ch(e);var o=r.getDerivedStateFromProps;typeof o=="function"&&Wa(e,r,o,t),i.updater=Ga,e.stateNode=i,i._reactInternals=e,hh(e,r,t,n),e=Sh(null,e,r,!0,s,n)}else e.tag=0,lt(null,e,i,n),e=e.child;return e;case 16:i=e.elementType;e:{switch(t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2),t=e.pendingProps,s=i._init,i=s(i._payload),e.type=i,s=e.tag=ZT(i),t=Nt(i,t),s){case 0:e=Ah(null,e,i,t,n);break e;case 1:e=_y(null,e,i,t,n);break e;case 11:e=py(null,e,i,t,n);break e;case 14:e=my(null,e,i,Nt(i.type,t),r,n);break e}throw Error(L(306,i,""))}return e;case 0:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),Ah(t,e,r,i,n);case 1:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),_y(t,e,r,i,n);case 3:if(vy(e),r=e.updateQueue,t===null||r===null)throw Error(L(282));if(r=e.pendingProps,i=e.memoizedState,i=i!==null?i.element:null,qg(t,e),Ks(e,r,null,n),r=e.memoizedState.element,r===i)mh(),e=ln(t,e,n);else{if(i=e.stateNode,(s=i.hydrate)&&(Bn=vi(e.stateNode.containerInfo.firstChild),an=e,s=Bt=!0),s){if(t=i.mutableSourceEagerHydrationData,t!=null)for(i=0;i<t.length;i+=2)s=t[i],s._workInProgressVersionPrimary=t[i+1],Ci.push(s);for(n=Zg(e,null,r,n),e.child=n;n;)n.flags=n.flags&-3|1024,n=n.sibling}else lt(t,e,r,n),mh();e=e.child}return e;case 5:return ey(e),t===null&&ph(e),r=e.type,i=e.pendingProps,s=t!==null?t.memoizedProps:null,o=i.children,Jc(r,i)?o=null:s!==null&&Jc(r,s)&&(e.flags|=16),yy(t,e),lt(t,e,o,n),e.child;case 6:return t===null&&ph(e),null;case 13:return Ey(t,e,n);case 4:return dh(e,e.stateNode.containerInfo),r=e.pendingProps,t===null?e.child=Ya(e,null,r,n):lt(t,e,r,n),e.child;case 11:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),py(t,e,r,i,n);case 7:return lt(t,e,e.pendingProps,n),e.child;case 8:return lt(t,e,e.pendingProps.children,n),e.child;case 12:return lt(t,e,e.pendingProps.children,n),e.child;case 10:e:{r=e.type._context,i=e.pendingProps,o=e.memoizedProps,s=i.value;var l=e.type._context;if(ve(za,l._currentValue),l._currentValue=s,o!==null)if(l=o.value,s=vt(l,s)?0:(typeof r._calculateChangedBits=="function"?r._calculateChangedBits(l,s):1073741823)|0,s===0){if(o.children===i.children&&!st.current){e=ln(t,e,n);break e}}else for(l=e.child,l!==null&&(l.return=e);l!==null;){var u=l.dependencies;if(u!==null){o=l.child;for(var h=u.firstContext;h!==null;){if(h.context===r&&(h.observedBits&s)!=0){l.tag===1&&(h=Fn(-1,n&-n),h.tag=2,jn(l,h)),l.lanes|=n,h=l.alternate,h!==null&&(h.lanes|=n),Hg(l.return,n),u.lanes|=n;break}h=h.next}}else o=l.tag===10&&l.type===e.type?null:l.child;if(o!==null)o.return=l;else for(o=l;o!==null;){if(o===e){o=null;break}if(l=o.sibling,l!==null){l.return=o.return,o=l;break}o=o.return}l=o}lt(t,e,i.children,n),e=e.child}return e;case 9:return i=e.type,s=e.pendingProps,r=s.children,ki(e,n),i=Et(i,s.unstable_observedBits),r=r(i),e.flags|=1,lt(t,e,r,n),e.child;case 14:return i=e.type,s=Nt(i,e.pendingProps),s=Nt(i.type,s),my(t,e,i,s,r,n);case 15:return gy(t,e,e.type,e.pendingProps,r,n);case 17:return r=e.type,i=e.pendingProps,i=e.elementType===r?i:Nt(r,i),t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2),e.tag=1,ot(r)?(t=!0,ja(e)):t=!1,ki(e,n),Yg(e,r,i),hh(e,r,i,n),Sh(null,e,r,!0,t,n);case 19:return Sy(t,e,n);case 23:return Ih(t,e,n);case 24:return Ih(t,e,n)}throw Error(L(156,e.tag))};function JT(t,e,n,r){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.flags=0,this.lastEffect=this.firstEffect=this.nextEffect=null,this.childLanes=this.lanes=0,this.alternate=null}function It(t,e,n,r){return new JT(t,e,n,r)}function qh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function ZT(t){if(typeof t=="function")return qh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===pa)return 11;if(t===ga)return 14}return 2}function Gn(t,e){var n=t.alternate;return n===null?(n=It(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.nextEffect=null,n.firstEffect=null,n.lastEffect=null),n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function fl(t,e,n,r,i,s){var o=2;if(r=t,typeof t=="function")qh(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Cn:return xi(n.children,i,s,e);case pm:o=8,i|=16;break;case tc:o=8,i|=1;break;case Ts:return t=It(12,n,e,i|8),t.elementType=Ts,t.type=Ts,t.lanes=s,t;case Is:return t=It(13,n,e,i),t.type=Is,t.elementType=Is,t.lanes=s,t;case ma:return t=It(19,n,e,i),t.elementType=ma,t.lanes=s,t;case ac:return Wh(n,i,s,e);case lc:return t=It(24,n,e,i),t.elementType=lc,t.lanes=s,t;default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case nc:o=10;break e;case rc:o=9;break e;case pa:o=11;break e;case ga:o=14;break e;case ic:o=16,r=null;break e;case sc:o=22;break e}throw Error(L(130,t==null?t:typeof t,""))}return e=It(o,n,e,i),e.elementType=t,e.type=r,e.lanes=s,e}function xi(t,e,n,r){return t=It(7,t,r,e),t.lanes=n,t}function Wh(t,e,n,r){return t=It(23,t,r,e),t.elementType=ac,t.lanes=n,t}function Gh(t,e,n){return t=It(6,t,null,e),t.lanes=n,t}function Kh(t,e,n){return e=It(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function eI(t,e,n){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.pendingContext=this.context=null,this.hydrate=n,this.callbackNode=null,this.callbackPriority=0,this.eventTimes=xc(0),this.expirationTimes=xc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=xc(0),this.mutableSourceEagerHydrationData=null}function tI(t,e,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:kr,key:r==null?null:""+r,children:t,containerInfo:e,implementation:n}}function pl(t,e,n,r){var i=e.current,s=ft(),o=zn(i);e:if(n){n=n._reactInternals;t:{if(Cr(n)!==n||n.tag!==1)throw Error(L(170));var l=n;do{switch(l.tag){case 3:l=l.stateNode.context;break t;case 1:if(ot(l.type)){l=l.stateNode.__reactInternalMemoizedMergedChildContext;break t}}l=l.return}while(l!==null);throw Error(L(171))}if(n.tag===1){var u=n.type;if(ot(u)){n=xg(n,u,l);break e}}n=l}else n=Ln;return e.context===null?e.context=n:e.pendingContext=n,e=Fn(s,o),e.payload={element:t},r=r===void 0?null:r,r!==null&&(e.callback=r),jn(i,e),Hn(i,o,s),o}function Qh(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Qy(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Yh(t,e){Qy(t,e),(t=t.alternate)&&Qy(t,e)}function nI(){return null}function Xh(t,e,n){var r=n!=null&&n.hydrationOptions!=null&&n.hydrationOptions.mutableSources||null;if(n=new eI(t,e,n!=null&&n.hydrate===!0),e=It(3,null,null,e===2?7:e===1?3:0),n.current=e,e.stateNode=n,ch(e),t[Ei]=n.current,Ig(t.nodeType===8?t.parentNode:t),r)for(t=0;t<r.length;t++){e=r[t];var i=e._getVersion;i=i(e._source),n.mutableSourceEagerHydrationData==null?n.mutableSourceEagerHydrationData=[e,i]:n.mutableSourceEagerHydrationData.push(e,i)}this._internalRoot=n}Xh.prototype.render=function(t){pl(t,this._internalRoot,null,null)};Xh.prototype.unmount=function(){var t=this._internalRoot,e=t.containerInfo;pl(null,t,null,function(){e[Ei]=null})};function fo(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function rI(t,e){if(e||(e=t?t.nodeType===9?t.documentElement:t.firstChild:null,e=!(!e||e.nodeType!==1||!e.hasAttribute("data-reactroot"))),!e)for(var n;n=t.lastChild;)t.removeChild(n);return new Xh(t,0,e?{hydrate:!0}:void 0)}function ml(t,e,n,r,i){var s=n._reactRootContainer;if(s){var o=s._internalRoot;if(typeof i=="function"){var l=i;i=function(){var h=Qh(o);l.call(h)}}pl(e,o,t,i)}else{if(s=n._reactRootContainer=rI(n,r),o=s._internalRoot,typeof i=="function"){var u=i;i=function(){var h=Qh(o);u.call(h)}}By(function(){pl(e,o,t,i)})}return Qh(o)}Lm=function(t){if(t.tag===13){var e=ft();Hn(t,4,e),Yh(t,4)}};Cc=function(t){if(t.tag===13){var e=ft();Hn(t,67108864,e),Yh(t,67108864)}};Um=function(t){if(t.tag===13){var e=ft(),n=zn(t);Hn(t,n,e),Yh(t,n)}};Fm=function(t,e){return e()};wc=function(t,e,n){switch(e){case"input":if(dc(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var r=n[e];if(r!==t&&r.form===t.form){var i=Ua(r);if(!i)throw Error(L(90));ym(r),dc(r,i)}}}break;case"textarea":Tm(t,n);break;case"select":e=n.value,e!=null&&ui(t,!!n.multiple,e,!1)}};Tc=jy;Dm=function(t,e,n,r,i){var s=Q;Q|=4;try{return Vr(98,t.bind(null,e,n,r,i))}finally{Q=s,Q===0&&(Di(),Ft())}};Ic=function(){(Q&49)==0&&(zT(),qn())};Vm=function(t,e){var n=Q;Q|=2;try{return t(e)}finally{Q=n,Q===0&&(Di(),Ft())}};function Yy(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!fo(e))throw Error(L(200));return tI(t,e,null,n)}var iI={Events:[Ws,wi,Ua,Pm,Nm,qn,{current:!1}]},po={findFiberByHostInstance:Pr,bundleType:0,version:"17.0.2",rendererPackageName:"react-dom"},sI={bundleType:po.bundleType,version:po.version,rendererPackageName:po.rendererPackageName,rendererConfig:po.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Sr.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Mm(t),t===null?null:t.stateNode},findFiberByHostInstance:po.findFiberByHostInstance||nI,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__!="undefined"){var gl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!gl.isDisabled&&gl.supportsFiber)try{nh=gl.inject(sI),Dr=gl}catch{}}_t.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=iI;_t.createPortal=Yy;_t.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(L(188)):Error(L(268,Object.keys(t)));return t=Mm(e),t=t===null?null:t.stateNode,t};_t.flushSync=function(t,e){var n=Q;if((n&48)!=0)return t(e);Q|=1;try{if(t)return Vr(99,t.bind(null,e))}finally{Q=n,Ft()}};_t.hydrate=function(t,e,n){if(!fo(e))throw Error(L(200));return ml(null,t,e,!0,n)};_t.render=function(t,e,n){if(!fo(e))throw Error(L(200));return ml(null,t,e,!1,n)};_t.unmountComponentAtNode=function(t){if(!fo(t))throw Error(L(40));return t._reactRootContainer?(By(function(){ml(null,null,t,!1,function(){t._reactRootContainer=null,t[Ei]=null})}),!0):!1};_t.unstable_batchedUpdates=jy;_t.unstable_createPortal=function(t,e){return Yy(t,e,2<arguments.length&&arguments[2]!==void 0?arguments[2]:null)};_t.unstable_renderSubtreeIntoContainer=function(t,e,n,r){if(!fo(n))throw Error(L(200));if(t==null||t._reactInternals===void 0)throw Error(L(38));return ml(t,e,n,!1,r)};_t.version="17.0.2";function Xy(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__=="undefined"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Xy)}catch(t){console.error(t)}}Xy(),am.exports=_t;var JD=am.exports;/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Jy=(...t)=>t.filter((e,n,r)=>Boolean(e)&&e.trim()!==""&&r.indexOf(e)===n).join(" ").trim();/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oI=t=>t.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aI=t=>t.replace(/^([A-Z])|[\s-_]+(\w)/g,(e,n,r)=>r?r.toUpperCase():n.toLowerCase());/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zy=t=>{const e=aI(t);return e.charAt(0).toUpperCase()+e.slice(1)};/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var Jh={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:2,strokeLinecap:"round",strokeLinejoin:"round"};/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lI=t=>{for(const e in t)if(e.startsWith("aria-")||e==="role"||e==="title")return!0;return!1},uI=Ct.exports.createContext({}),cI=()=>Ct.exports.useContext(uI),hI=Ct.exports.forwardRef((h,u)=>{var f=h,{color:t,size:e,strokeWidth:n,absoluteStrokeWidth:r,className:i="",children:s,iconNode:o}=f,l=ii(f,["color","size","strokeWidth","absoluteStrokeWidth","className","children","iconNode"]);var E,I,P;const{size:y=24,strokeWidth:g=2,absoluteStrokeWidth:k=!1,color:V="currentColor",className:O=""}=(E=cI())!=null?E:{},v=(r!=null?r:k)?Number(n!=null?n:g)*24/Number(e!=null?e:y):n!=null?n:g;return Ct.exports.createElement("svg",se(se(Lt(se({ref:u},Jh),{width:(I=e!=null?e:y)!=null?I:Jh.width,height:(P=e!=null?e:y)!=null?P:Jh.height,stroke:t!=null?t:V,strokeWidth:v,className:Jy("lucide",O,i)}),!s&&!lI(l)&&{"aria-hidden":"true"}),l),[...o.map(([N,F])=>Ct.exports.createElement(N,F)),...Array.isArray(s)?s:[s]])});/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=(t,e)=>{const n=Ct.exports.forwardRef((o,s)=>{var l=o,{className:r}=l,i=ii(l,["className"]);return Ct.exports.createElement(hI,se({ref:s,iconNode:e,className:Jy(`lucide-${oI(Zy(t))}`,`lucide-${t}`,r)},i))});return n.displayName=Zy(t),n};/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dI=[["path",{d:"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",key:"169zse"}]],ZD=$("activity",dI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fI=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],eV=$("arrow-up-right",fI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pI=[["path",{d:"m11 7-3 5h4l-3 5",key:"b4a64w"}],["path",{d:"M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935",key:"lre1cr"}],["path",{d:"M22 14v-4",key:"14q9d5"}],["path",{d:"M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936",key:"13q5k0"}]],tV=$("battery-charging",pI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mI=[["path",{d:"M4.5 3h15",key:"c7n0jr"}],["path",{d:"M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3",key:"m1uhx7"}],["path",{d:"M6 14h12",key:"4cwo0f"}]],nV=$("beaker",mI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gI=[["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]],rV=$("box",gI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yI=[["path",{d:"M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16",key:"jecpp"}],["rect",{width:"20",height:"14",x:"2",y:"6",rx:"2",key:"i6l2r4"}]],iV=$("briefcase",yI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _I=[["path",{d:"M10 12h4",key:"a56b0p"}],["path",{d:"M10 8h4",key:"1sr2af"}],["path",{d:"M14 21v-3a2 2 0 0 0-4 0v3",key:"1rgiei"}],["path",{d:"M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",key:"secmi2"}],["path",{d:"M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16",key:"16ra0t"}]],sV=$("building-2",_I);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vI=[["path",{d:"M12 10h.01",key:"1nrarc"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M12 6h.01",key:"1vi96p"}],["path",{d:"M16 10h.01",key:"1m94wz"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M16 6h.01",key:"1x0f13"}],["path",{d:"M8 10h.01",key:"19clt8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M8 6h.01",key:"1dz90k"}],["path",{d:"M9 22v-3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3",key:"cabbwy"}],["rect",{x:"4",y:"2",width:"16",height:"20",rx:"2",key:"1uxh74"}]],oV=$("building",vI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const EI=[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}]],aV=$("calendar",EI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wI=[["path",{d:"M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z",key:"18u6gg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]],lV=$("camera",wI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TI=[["path",{d:"M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z",key:"pzmjnu"}],["path",{d:"M21.21 15.89A10 10 0 1 1 8 2.83",key:"k2fpak"}]],uV=$("chart-pie",TI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const II=[["path",{d:"m6 9 6 6 6-6",key:"qrunsl"}]],cV=$("chevron-down",II);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AI=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],hV=$("chevron-left",AI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const SI=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],dV=$("chevron-right",SI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kI=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]],fV=$("circle-alert",kI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const RI=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],pV=$("circle-check",RI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CI=[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]],mV=$("circle-check-big",CI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const PI=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"10",x2:"10",y1:"15",y2:"9",key:"c1nkhi"}],["line",{x1:"14",x2:"14",y1:"15",y2:"9",key:"h65svq"}]],gV=$("circle-pause",PI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const NI=[["path",{d:"M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z",key:"kmsa83"}],["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}]],yV=$("circle-play",NI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const DI=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]],_V=$("circle-plus",DI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const VI=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],vV=$("circle-x",VI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const OI=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"m9 14 2 2 4-4",key:"df797q"}]],EV=$("clipboard-check",OI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xI=[["rect",{width:"8",height:"4",x:"8",y:"2",rx:"1",ry:"1",key:"tgr4d6"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",key:"116196"}],["path",{d:"M12 11h4",key:"1jrz19"}],["path",{d:"M12 16h4",key:"n85exb"}],["path",{d:"M8 11h.01",key:"1dfujw"}],["path",{d:"M8 16h.01",key:"18s6g9"}]],wV=$("clipboard-list",xI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const MI=[["path",{d:"M11 14h10",key:"1w8e9d"}],["path",{d:"M16 4h2a2 2 0 0 1 2 2v1.344",key:"1e62lh"}],["path",{d:"m17 18 4-4-4-4",key:"z2g111"}],["path",{d:"M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113",key:"bjbb7m"}],["rect",{x:"8",y:"2",width:"8",height:"4",rx:"1",key:"ublpy"}]],TV=$("clipboard-paste",MI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const bI=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 6v6l4 2",key:"mmk7yg"}]],IV=$("clock",bI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const LI=[["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M17 20v2",key:"1rnc9c"}],["path",{d:"M17 2v2",key:"11trls"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M2 17h2",key:"7oei6x"}],["path",{d:"M2 7h2",key:"asdhe0"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"M20 17h2",key:"1fpfkl"}],["path",{d:"M20 7h2",key:"1o8tra"}],["path",{d:"M7 20v2",key:"4gnj0m"}],["path",{d:"M7 2v2",key:"1i4yhu"}],["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"8",y:"8",width:"8",height:"8",rx:"1",key:"z9xiuo"}]],AV=$("cpu",LI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const UI=[["line",{x1:"12",x2:"12",y1:"2",y2:"22",key:"7eqyqh"}],["path",{d:"M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",key:"1b0p4s"}]],SV=$("dollar-sign",UI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const FI=[["path",{d:"M11 20H2",key:"nlcfvz"}],["path",{d:"M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z",key:"au4z13"}],["path",{d:"M11 4H8a2 2 0 0 0-2 2v14",key:"74r1mk"}],["path",{d:"M14 12h.01",key:"1jfl7z"}],["path",{d:"M22 20h-3",key:"vhrsz"}]],kV=$("door-open",FI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const jI=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],RV=$("eye-off",jI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const BI=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],CV=$("eye",BI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $I=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M8 13h2",key:"yr2amv"}],["path",{d:"M14 13h2",key:"un5t4a"}],["path",{d:"M8 17h2",key:"2yhykz"}],["path",{d:"M14 17h2",key:"10kma7"}]],PV=$("file-spreadsheet",$I);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const zI=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],NV=$("file-text",zI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const HI=[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}]],DV=$("file",HI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const qI=[["path",{d:"M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4",key:"1slcih"}]],VV=$("flame",qI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const WI=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",key:"13o1zl"}],["path",{d:"M2 12h20",key:"9i4pu4"}]],OV=$("globe",WI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const GI=[["line",{x1:"4",x2:"20",y1:"9",y2:"9",key:"4lhtct"}],["line",{x1:"4",x2:"20",y1:"15",y2:"15",key:"vyu0kd"}],["line",{x1:"10",x2:"8",y1:"3",y2:"21",key:"1ggp8o"}],["line",{x1:"16",x2:"14",y1:"3",y2:"21",key:"weycgp"}]],xV=$("hash",GI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const KI=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8",key:"5wwlr5"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",key:"r6nss1"}]],MV=$("house",KI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const QI=[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]],bV=$("layout-dashboard",QI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const YI=[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]],LV=$("loader-circle",YI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const XI=[["path",{d:"m16 17 5-5-5-5",key:"1bji2h"}],["path",{d:"M21 12H9",key:"dn1m92"}],["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}]],UV=$("log-out",XI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const JI=[["path",{d:"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",key:"1r0f0z"}],["circle",{cx:"12",cy:"10",r:"3",key:"ilqhr7"}]],FV=$("map-pin",JI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ZI=[["path",{d:"M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z",key:"169xi5"}],["path",{d:"M15 5.764v15",key:"1pn4in"}],["path",{d:"M9 3.236v15",key:"1uimfh"}]],jV=$("map",ZI);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const eA=[["path",{d:"M15 3h6v6",key:"1q9fwt"}],["path",{d:"m21 3-7 7",key:"1l2asr"}],["path",{d:"m3 21 7-7",key:"tjx5ai"}],["path",{d:"M9 21H3v-6",key:"wtvkvv"}]],BV=$("maximize-2",eA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const tA=[["path",{d:"M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8",key:"10dyio"}],["path",{d:"M10 19v-3.96 3.15",key:"1irgej"}],["path",{d:"M7 19h5",key:"qswx4l"}],["rect",{width:"6",height:"10",x:"16",y:"12",rx:"2",key:"1egngj"}]],$V=$("monitor-smartphone",tA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const nA=[["rect",{width:"20",height:"14",x:"2",y:"3",rx:"2",key:"48i651"}],["line",{x1:"8",x2:"16",y1:"21",y2:"21",key:"1svkeh"}],["line",{x1:"12",x2:"12",y1:"17",y2:"21",key:"vw1qmm"}]],zV=$("monitor",nA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const rA=[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]],HV=$("package",rA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const iA=[["path",{d:"m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",key:"1miecu"}]],qV=$("paperclip",iA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const sA=[["path",{d:"M13 21h8",key:"1jsn5i"}],["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]],WV=$("pen-line",sA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oA=[["path",{d:"M13 2a9 9 0 0 1 9 9",key:"1itnx2"}],["path",{d:"M13 6a5 5 0 0 1 5 5",key:"11nki7"}],["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],GV=$("phone-call",oA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const aA=[["path",{d:"M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",key:"9njp5v"}]],KV=$("phone",aA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const lA=[["path",{d:"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"1357e3"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}]],QV=$("rotate-ccw",lA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const uA=[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]],YV=$("save",uA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const cA=[["path",{d:"m21 21-4.34-4.34",key:"14j7rj"}],["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}]],XV=$("search",cA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const hA=[["path",{d:"M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",key:"1ffxy3"}],["path",{d:"m21.854 2.147-10.94 10.939",key:"12cjpa"}]],JV=$("send",hA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const dA=[["rect",{width:"20",height:"8",x:"2",y:"2",rx:"2",ry:"2",key:"ngkwjq"}],["rect",{width:"20",height:"8",x:"2",y:"14",rx:"2",ry:"2",key:"iecqi9"}],["line",{x1:"6",x2:"6.01",y1:"6",y2:"6",key:"16zg32"}],["line",{x1:"6",x2:"6.01",y1:"18",y2:"18",key:"nzw8ys"}]],ZV=$("server",dA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fA=[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],eO=$("settings",fA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const pA=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"M12 8v4",key:"1got3b"}],["path",{d:"M12 16h.01",key:"1drbdi"}]],tO=$("shield-alert",pA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const mA=[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]],nO=$("shield-check",mA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const gA=[["path",{d:"M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3",key:"1dgpiv"}],["path",{d:"M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z",key:"xacw8m"}],["path",{d:"M4 18v2",key:"jwo5n2"}],["path",{d:"M20 18v2",key:"1ar1qi"}],["path",{d:"M12 4v9",key:"oqhhn3"}]],rO=$("sofa",gA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const yA=[["path",{d:"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z",key:"r04s7s"}]],iO=$("star",yA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _A=[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]],sO=$("sun",_A);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const vA=[["path",{d:"M12 10V2",key:"16sf7g"}],["path",{d:"m4.93 10.93 1.41 1.41",key:"2a7f42"}],["path",{d:"M2 18h2",key:"j10viu"}],["path",{d:"M20 18h2",key:"wocana"}],["path",{d:"m19.07 10.93-1.41 1.41",key:"15zs5n"}],["path",{d:"M22 22H2",key:"19qnx5"}],["path",{d:"m16 6-4 4-4-4",key:"6wukr"}],["path",{d:"M16 18a4 4 0 0 0-8 0",key:"1lzouq"}]],oO=$("sunset",vA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const EA=[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]],aO=$("triangle-alert",EA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const wA=[["path",{d:"m16 11 2 2 4-4",key:"9rsbq5"}],["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],lO=$("user-check",wA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const TA=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"17",x2:"22",y1:"8",y2:"13",key:"3nzzx3"}],["line",{x1:"22",x2:"17",y1:"8",y2:"13",key:"1swrse"}]],uO=$("user-x",TA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const IA=[["path",{d:"M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",key:"975kel"}],["circle",{cx:"12",cy:"7",r:"4",key:"17ys0d"}]],cO=$("user",IA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const AA=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]],hO=$("users",AA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const SA=[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]],dO=$("video",SA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const kA=[["path",{d:"M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",key:"1ngwbx"}]],fO=$("wrench",kA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const RA=[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]],pO=$("x",RA);/**
 * @license lucide-react v1.14.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const CA=[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]],mO=$("zap",CA);/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PA=()=>{};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const e_=function(t){const e=[];let n=0;for(let r=0;r<t.length;r++){let i=t.charCodeAt(r);i<128?e[n++]=i:i<2048?(e[n++]=i>>6|192,e[n++]=i&63|128):(i&64512)==55296&&r+1<t.length&&(t.charCodeAt(r+1)&64512)==56320?(i=65536+((i&1023)<<10)+(t.charCodeAt(++r)&1023),e[n++]=i>>18|240,e[n++]=i>>12&63|128,e[n++]=i>>6&63|128,e[n++]=i&63|128):(e[n++]=i>>12|224,e[n++]=i>>6&63|128,e[n++]=i&63|128)}return e},NA=function(t){const e=[];let n=0,r=0;for(;n<t.length;){const i=t[n++];if(i<128)e[r++]=String.fromCharCode(i);else if(i>191&&i<224){const s=t[n++];e[r++]=String.fromCharCode((i&31)<<6|s&63)}else if(i>239&&i<365){const s=t[n++],o=t[n++],l=t[n++],u=((i&7)<<18|(s&63)<<12|(o&63)<<6|l&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const s=t[n++],o=t[n++];e[r++]=String.fromCharCode((i&15)<<12|(s&63)<<6|o&63)}}return e.join("")},t_={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(t,e){if(!Array.isArray(t))throw Error("encodeByteArray takes an array as a parameter");this.init_();const n=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<t.length;i+=3){const s=t[i],o=i+1<t.length,l=o?t[i+1]:0,u=i+2<t.length,h=u?t[i+2]:0,f=s>>2,y=(s&3)<<4|l>>4;let g=(l&15)<<2|h>>6,k=h&63;u||(k=64,o||(g=64)),r.push(n[f],n[y],n[g],n[k])}return r.join("")},encodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(t):this.encodeByteArray(e_(t),e)},decodeString(t,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(t):NA(this.decodeStringToByteArray(t,e))},decodeStringToByteArray(t,e){this.init_();const n=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<t.length;){const s=n[t.charAt(i++)],l=i<t.length?n[t.charAt(i)]:0;++i;const h=i<t.length?n[t.charAt(i)]:64;++i;const y=i<t.length?n[t.charAt(i)]:64;if(++i,s==null||l==null||h==null||y==null)throw new DA;const g=s<<2|l>>4;if(r.push(g),h!==64){const k=l<<4&240|h>>2;if(r.push(k),y!==64){const V=h<<6&192|y;r.push(V)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let t=0;t<this.ENCODED_VALS.length;t++)this.byteToCharMap_[t]=this.ENCODED_VALS.charAt(t),this.charToByteMap_[this.byteToCharMap_[t]]=t,this.byteToCharMapWebSafe_[t]=this.ENCODED_VALS_WEBSAFE.charAt(t),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]]=t,t>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)]=t,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)]=t)}}};class DA extends Error{constructor(){super(...arguments);this.name="DecodeBase64StringError"}}const VA=function(t){const e=e_(t);return t_.encodeByteArray(e,!0)},yl=function(t){return VA(t).replace(/\./g,"")},n_=function(t){try{return t_.decodeString(t,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OA(){if(typeof self!="undefined")return self;if(typeof window!="undefined")return window;if(typeof global!="undefined")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xA=()=>OA().__FIREBASE_DEFAULTS__,MA=()=>{!(typeof process=="undefined"||typeof process.env=="undefined")},bA=()=>{if(typeof document=="undefined")return;let t;try{t=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=t&&n_(t[1]);return e&&JSON.parse(e)},_l=()=>{try{return PA()||xA()||MA()||bA()}catch(t){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${t}`);return}},r_=t=>{var e,n;return(n=(e=_l())==null?void 0:e.emulatorHosts)==null?void 0:n[t]},i_=t=>{const e=r_(t);if(!e)return;const n=e.lastIndexOf(":");if(n<=0||n+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(n+1),10);return e[0]==="["?[e.substring(1,n-1),r]:[e.substring(0,n),r]},s_=()=>{var t;return(t=_l())==null?void 0:t.config},o_=t=>{var e;return(e=_l())==null?void 0:e[`_${t}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LA{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}wrapCallback(e){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(n):e(n,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function a_(t,e){if(t.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const n={alg:"none",type:"JWT"},r=e||"demo-project",i=t.iat||0,s=t.sub||t.user_id;if(!s)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o=se({iss:`https://securetoken.google.com/${r}`,aud:r,iat:i,exp:i+3600,auth_time:i,sub:s,user_id:s,firebase:{sign_in_provider:"custom",identities:{}}},t),l="";return[yl(JSON.stringify(n)),yl(JSON.stringify(o)),l].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(){return typeof navigator!="undefined"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function UA(){return typeof window!="undefined"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ye())}function FA(){var e;const t=(e=_l())==null?void 0:e.forceEnvironment;if(t==="node")return!0;if(t==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function jA(){return typeof navigator!="undefined"&&navigator.userAgent==="Cloudflare-Workers"}function BA(){const t=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof t=="object"&&t.id!==void 0}function $A(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function zA(){const t=Ye();return t.indexOf("MSIE ")>=0||t.indexOf("Trident/")>=0}function HA(){return!FA()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function qA(){try{return typeof indexedDB=="object"}catch{return!1}}function WA(){return new Promise((t,e)=>{try{let n=!0;const r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),t(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{var s;e(((s=i.error)==null?void 0:s.message)||"")}}catch(n){e(n)}})}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const GA="FirebaseError";class Ht extends Error{constructor(e,n,r){super(n);this.code=e,this.customData=r,this.name=GA,Object.setPrototypeOf(this,Ht.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,mo.prototype.create)}}class mo{constructor(e,n,r){this.service=e,this.serviceName=n,this.errors=r}create(e,...n){const r=n[0]||{},i=`${this.service}/${e}`,s=this.errors[e],o=s?KA(s,r):"Error",l=`${this.serviceName}: ${o} (${i}).`;return new Ht(i,l,r)}}function KA(t,e){return t.replace(QA,(n,r)=>{const i=e[r];return i!=null?String(i):`<${r}?>`})}const QA=/\{\$([^}]+)}/g;function YA(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}function Ur(t,e){if(t===e)return!0;const n=Object.keys(t),r=Object.keys(e);for(const i of n){if(!r.includes(i))return!1;const s=t[i],o=e[i];if(l_(s)&&l_(o)){if(!Ur(s,o))return!1}else if(s!==o)return!1}for(const i of r)if(!n.includes(i))return!1;return!0}function l_(t){return t!==null&&typeof t=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function go(t){const e=[];for(const[n,r]of Object.entries(t))Array.isArray(r)?r.forEach(i=>{e.push(encodeURIComponent(n)+"="+encodeURIComponent(i))}):e.push(encodeURIComponent(n)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function XA(t,e){const n=new JA(t,e);return n.subscribe.bind(n)}class JA{constructor(e,n){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=n,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(n=>{n.next(e)})}error(e){this.forEachObserver(n=>{n.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,n,r){let i;if(e===void 0&&n===void 0&&r===void 0)throw new Error("Missing Observer.");ZA(e,["next","error","complete"])?i=e:i={next:e,error:n,complete:r},i.next===void 0&&(i.next=Zh),i.error===void 0&&(i.error=Zh),i.complete===void 0&&(i.complete=Zh);const s=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch{}}),this.observers.push(i),s}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let n=0;n<this.observers.length;n++)this.sendOne(n,e)}sendOne(e,n){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{n(this.observers[e])}catch(r){typeof console!="undefined"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function ZA(t,e){if(typeof t!="object"||t===null)return!1;for(const n of e)if(n in t&&typeof t[n]=="function")return!0;return!1}function Zh(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ge(t){return t&&t._delegate?t._delegate:t}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fr(t){try{return(t.startsWith("http://")||t.startsWith("https://")?new URL(t).hostname:t).endsWith(".cloudworkstations.dev")}catch{return!1}}async function ed(t){return(await fetch(t,{credentials:"include"})).ok}class Kn{constructor(e,n,r){this.name=e,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const jr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class e2{constructor(e,n){this.name=e,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const n=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(n)){const r=new LA;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{const i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(e){var i;const n=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(i=e==null?void 0:e.optional)!=null?i:!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(n2(e))try{this.getOrInitializeService({instanceIdentifier:jr})}catch{}for(const[n,r]of this.instancesDeferred.entries()){const i=this.normalizeInstanceIdentifier(n);try{const s=this.getOrInitializeService({instanceIdentifier:i});r.resolve(s)}catch{}}}}clearInstance(e=jr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...e.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=jr){return this.instances.has(e)}getOptions(e=jr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:n={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(const[s,o]of this.instancesDeferred.entries()){const l=this.normalizeInstanceIdentifier(s);r===l&&o.resolve(i)}return i}onInit(e,n){var o;const r=this.normalizeInstanceIdentifier(n),i=(o=this.onInitCallbacks.get(r))!=null?o:new Set;i.add(e),this.onInitCallbacks.set(r,i);const s=this.instances.get(r);return s&&e(s,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,n){const r=this.onInitCallbacks.get(n);if(!!r)for(const i of r)try{i(e,n)}catch{}}getOrInitializeService({instanceIdentifier:e,options:n={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:t2(e),options:n}),this.instances.set(e,r),this.instancesOptions.set(e,n),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=jr){return this.component?this.component.multipleInstances?e:jr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function t2(t){return t===jr?void 0:t}function n2(t){return t.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class r2{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const n=this.getProvider(e.name);if(n.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);n.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const n=new e2(e,this);return this.providers.set(e,n),n}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var ee;(function(t){t[t.DEBUG=0]="DEBUG",t[t.VERBOSE=1]="VERBOSE",t[t.INFO=2]="INFO",t[t.WARN=3]="WARN",t[t.ERROR=4]="ERROR",t[t.SILENT=5]="SILENT"})(ee||(ee={}));const i2={debug:ee.DEBUG,verbose:ee.VERBOSE,info:ee.INFO,warn:ee.WARN,error:ee.ERROR,silent:ee.SILENT},s2=ee.INFO,o2={[ee.DEBUG]:"log",[ee.VERBOSE]:"log",[ee.INFO]:"info",[ee.WARN]:"warn",[ee.ERROR]:"error"},a2=(t,e,...n)=>{if(e<t.logLevel)return;const r=new Date().toISOString(),i=o2[e];if(i)console[i](`[${r}]  ${t.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class td{constructor(e){this.name=e,this._logLevel=s2,this._logHandler=a2,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in ee))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?i2[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,ee.DEBUG,...e),this._logHandler(this,ee.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,ee.VERBOSE,...e),this._logHandler(this,ee.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,ee.INFO,...e),this._logHandler(this,ee.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,ee.WARN,...e),this._logHandler(this,ee.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,ee.ERROR,...e),this._logHandler(this,ee.ERROR,...e)}}const l2=(t,e)=>e.some(n=>t instanceof n);let u_,c_;function u2(){return u_||(u_=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function c2(){return c_||(c_=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const h_=new WeakMap,nd=new WeakMap,d_=new WeakMap,rd=new WeakMap,id=new WeakMap;function h2(t){const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("success",s),t.removeEventListener("error",o)},s=()=>{n(Qn(t.result)),i()},o=()=>{r(t.error),i()};t.addEventListener("success",s),t.addEventListener("error",o)});return e.then(n=>{n instanceof IDBCursor&&h_.set(n,t)}).catch(()=>{}),id.set(e,t),e}function d2(t){if(nd.has(t))return;const e=new Promise((n,r)=>{const i=()=>{t.removeEventListener("complete",s),t.removeEventListener("error",o),t.removeEventListener("abort",o)},s=()=>{n(),i()},o=()=>{r(t.error||new DOMException("AbortError","AbortError")),i()};t.addEventListener("complete",s),t.addEventListener("error",o),t.addEventListener("abort",o)});nd.set(t,e)}let sd={get(t,e,n){if(t instanceof IDBTransaction){if(e==="done")return nd.get(t);if(e==="objectStoreNames")return t.objectStoreNames||d_.get(t);if(e==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return Qn(t[e])},set(t,e,n){return t[e]=n,!0},has(t,e){return t instanceof IDBTransaction&&(e==="done"||e==="store")?!0:e in t}};function f2(t){sd=t(sd)}function p2(t){return t===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(e,...n){const r=t.call(od(this),e,...n);return d_.set(r,e.sort?e.sort():[e]),Qn(r)}:c2().includes(t)?function(...e){return t.apply(od(this),e),Qn(h_.get(this))}:function(...e){return Qn(t.apply(od(this),e))}}function m2(t){return typeof t=="function"?p2(t):(t instanceof IDBTransaction&&d2(t),l2(t,u2())?new Proxy(t,sd):t)}function Qn(t){if(t instanceof IDBRequest)return h2(t);if(rd.has(t))return rd.get(t);const e=m2(t);return e!==t&&(rd.set(t,e),id.set(e,t)),e}const od=t=>id.get(t);function g2(t,e,{blocked:n,upgrade:r,blocking:i,terminated:s}={}){const o=indexedDB.open(t,e),l=Qn(o);return r&&o.addEventListener("upgradeneeded",u=>{r(Qn(o.result),u.oldVersion,u.newVersion,Qn(o.transaction),u)}),n&&o.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),l.then(u=>{s&&u.addEventListener("close",()=>s()),i&&u.addEventListener("versionchange",h=>i(h.oldVersion,h.newVersion,h))}).catch(()=>{}),l}const y2=["get","getKey","getAll","getAllKeys","count"],_2=["put","add","delete","clear"],ad=new Map;function f_(t,e){if(!(t instanceof IDBDatabase&&!(e in t)&&typeof e=="string"))return;if(ad.get(e))return ad.get(e);const n=e.replace(/FromIndex$/,""),r=e!==n,i=_2.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||y2.includes(n)))return;const s=async function(o,...l){const u=this.transaction(o,i?"readwrite":"readonly");let h=u.store;return r&&(h=h.index(l.shift())),(await Promise.all([h[n](...l),i&&u.done]))[0]};return ad.set(e,s),s}f2(t=>Lt(se({},t),{get:(e,n,r)=>f_(e,n)||t.get(e,n,r),has:(e,n)=>!!f_(e,n)||t.has(e,n)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class v2{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(E2(n)){const r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}}function E2(t){const e=t.getComponent();return(e==null?void 0:e.type)==="VERSION"}const ld="@firebase/app",p_="0.14.11";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hn=new td("@firebase/app"),w2="@firebase/app-compat",T2="@firebase/analytics-compat",I2="@firebase/analytics",A2="@firebase/app-check-compat",S2="@firebase/app-check",k2="@firebase/auth",R2="@firebase/auth-compat",C2="@firebase/database",P2="@firebase/data-connect",N2="@firebase/database-compat",D2="@firebase/functions",V2="@firebase/functions-compat",O2="@firebase/installations",x2="@firebase/installations-compat",M2="@firebase/messaging",b2="@firebase/messaging-compat",L2="@firebase/performance",U2="@firebase/performance-compat",F2="@firebase/remote-config",j2="@firebase/remote-config-compat",B2="@firebase/storage",$2="@firebase/storage-compat",z2="@firebase/firestore",H2="@firebase/ai",q2="@firebase/firestore-compat",W2="firebase",G2="12.12.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ud="[DEFAULT]",K2={[ld]:"fire-core",[w2]:"fire-core-compat",[I2]:"fire-analytics",[T2]:"fire-analytics-compat",[S2]:"fire-app-check",[A2]:"fire-app-check-compat",[k2]:"fire-auth",[R2]:"fire-auth-compat",[C2]:"fire-rtdb",[P2]:"fire-data-connect",[N2]:"fire-rtdb-compat",[D2]:"fire-fn",[V2]:"fire-fn-compat",[O2]:"fire-iid",[x2]:"fire-iid-compat",[M2]:"fire-fcm",[b2]:"fire-fcm-compat",[L2]:"fire-perf",[U2]:"fire-perf-compat",[F2]:"fire-rc",[j2]:"fire-rc-compat",[B2]:"fire-gcs",[$2]:"fire-gcs-compat",[z2]:"fire-fst",[q2]:"fire-fst-compat",[H2]:"fire-vertex","fire-js":"fire-js",[W2]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yo=new Map,Q2=new Map,cd=new Map;function m_(t,e){try{t.container.addComponent(e)}catch(n){hn.debug(`Component ${e.name} failed to register with FirebaseApp ${t.name}`,n)}}function Br(t){const e=t.name;if(cd.has(e))return hn.debug(`There were multiple attempts to register component ${e}.`),!1;cd.set(e,t);for(const n of yo.values())m_(n,t);for(const n of Q2.values())m_(n,t);return!0}function vl(t,e){const n=t.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),t.container.getProvider(e)}function pt(t){return t==null?!1:t.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Y2={["no-app"]:"No Firebase App '{$appName}' has been created - call initializeApp() first",["bad-app-name"]:"Illegal App name: '{$appName}'",["duplicate-app"]:"Firebase App named '{$appName}' already exists with different options or config",["app-deleted"]:"Firebase App named '{$appName}' already deleted",["server-app-deleted"]:"Firebase Server App has been deleted",["no-options"]:"Need to provide options, when not being deployed to hosting via source.",["invalid-app-argument"]:"firebase.{$appName}() takes either no argument or a Firebase App instance.",["invalid-log-argument"]:"First argument to `onLog` must be null or a function.",["idb-open"]:"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.",["idb-get"]:"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.",["idb-set"]:"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.",["idb-delete"]:"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.",["finalization-registry-not-supported"]:"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.",["invalid-server-app-environment"]:"FirebaseServerApp is not for use in browser environments."},Yn=new mo("app","Firebase",Y2);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X2{constructor(e,n,r){this._isDeleted=!1,this._options=se({},e),this._config=se({},n),this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Kn("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Yn.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $r=G2;function J2(t,e={}){let n=t;typeof e!="object"&&(e={name:e});const r=se({name:ud,automaticDataCollectionEnabled:!0},e),i=r.name;if(typeof i!="string"||!i)throw Yn.create("bad-app-name",{appName:String(i)});if(n||(n=s_()),!n)throw Yn.create("no-options");const s=yo.get(i);if(s){if(Ur(n,s.options)&&Ur(r,s.config))return s;throw Yn.create("duplicate-app",{appName:i})}const o=new r2(i);for(const u of cd.values())o.addComponent(u);const l=new X2(n,r,o);return yo.set(i,l),l}function hd(t=ud){const e=yo.get(t);if(!e&&t===ud&&s_())return J2();if(!e)throw Yn.create("no-app",{appName:t});return e}function gO(){return Array.from(yo.values())}function qt(t,e,n){var o;let r=(o=K2[t])!=null?o:t;n&&(r+=`-${n}`);const i=r.match(/\s|\//),s=e.match(/\s|\//);if(i||s){const l=[`Unable to register library "${r}" with version "${e}":`];i&&l.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&s&&l.push("and"),s&&l.push(`version name "${e}" contains illegal characters (whitespace or "/")`),hn.warn(l.join(" "));return}Br(new Kn(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Z2="firebase-heartbeat-database",eS=1,_o="firebase-heartbeat-store";let dd=null;function g_(){return dd||(dd=g2(Z2,eS,{upgrade:(t,e)=>{switch(e){case 0:try{t.createObjectStore(_o)}catch(n){console.warn(n)}}}}).catch(t=>{throw Yn.create("idb-open",{originalErrorMessage:t.message})})),dd}async function tS(t){try{const n=(await g_()).transaction(_o),r=await n.objectStore(_o).get(__(t));return await n.done,r}catch(e){if(e instanceof Ht)hn.warn(e.message);else{const n=Yn.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});hn.warn(n.message)}}}async function y_(t,e){try{const r=(await g_()).transaction(_o,"readwrite");await r.objectStore(_o).put(e,__(t)),await r.done}catch(n){if(n instanceof Ht)hn.warn(n.message);else{const r=Yn.create("idb-set",{originalErrorMessage:n==null?void 0:n.message});hn.warn(r.message)}}}function __(t){return`${t.name}!${t.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nS=1024,rS=30;class iS{constructor(e){this.container=e,this._heartbeatsCache=null;const n=this.container.getProvider("app").getImmediate();this._storage=new oS(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,n;try{const i=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),s=v_();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((n=this._heartbeatsCache)==null?void 0:n.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===s||this._heartbeatsCache.heartbeats.some(o=>o.date===s))return;if(this._heartbeatsCache.heartbeats.push({date:s,agent:i}),this._heartbeatsCache.heartbeats.length>rS){const o=aS(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){hn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const n=v_(),{heartbeatsToSend:r,unsentEntries:i}=sS(this._heartbeatsCache.heartbeats),s=yl(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=n,i.length>0?(this._heartbeatsCache.heartbeats=i,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),s}catch(n){return hn.warn(n),""}}}function v_(){return new Date().toISOString().substring(0,10)}function sS(t,e=nS){const n=[];let r=t.slice();for(const i of t){const s=n.find(o=>o.agent===i.agent);if(s){if(s.dates.push(i.date),E_(n)>e){s.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),E_(n)>e){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}class oS{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return qA()?WA().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const n=await tS(this.app);return(n==null?void 0:n.heartbeats)?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){var r;if(await this._canUseIndexedDBPromise){const i=await this.read();return y_(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){var r;if(await this._canUseIndexedDBPromise){const i=await this.read();return y_(this.app,{lastSentHeartbeatDate:(r=e.lastSentHeartbeatDate)!=null?r:i.lastSentHeartbeatDate,heartbeats:[...i.heartbeats,...e.heartbeats]})}else return}}function E_(t){return yl(JSON.stringify({version:2,heartbeats:t})).length}function aS(t){if(t.length===0)return-1;let e=0,n=t[0].date;for(let r=1;r<t.length;r++)t[r].date<n&&(n=t[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lS(t){Br(new Kn("platform-logger",e=>new v2(e),"PRIVATE")),Br(new Kn("heartbeat",e=>new iS(e),"PRIVATE")),qt(ld,p_,t),qt(ld,p_,"esm2020"),qt("fire-js","")}lS("");var w_=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Xn,T_;(function(){var t;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(w,m){function _(){}_.prototype=m.prototype,w.F=m.prototype,w.prototype=new _,w.prototype.constructor=w,w.D=function(A,S,R){for(var T=Array(arguments.length-2),Ne=2;Ne<arguments.length;Ne++)T[Ne-2]=arguments[Ne];return m.prototype[S].apply(A,T)}}function n(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,n),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function i(w,m,_){_||(_=0);const A=Array(16);if(typeof m=="string")for(var S=0;S<16;++S)A[S]=m.charCodeAt(_++)|m.charCodeAt(_++)<<8|m.charCodeAt(_++)<<16|m.charCodeAt(_++)<<24;else for(S=0;S<16;++S)A[S]=m[_++]|m[_++]<<8|m[_++]<<16|m[_++]<<24;m=w.g[0],_=w.g[1],S=w.g[2];let R=w.g[3],T;T=m+(R^_&(S^R))+A[0]+3614090360&4294967295,m=_+(T<<7&4294967295|T>>>25),T=R+(S^m&(_^S))+A[1]+3905402710&4294967295,R=m+(T<<12&4294967295|T>>>20),T=S+(_^R&(m^_))+A[2]+606105819&4294967295,S=R+(T<<17&4294967295|T>>>15),T=_+(m^S&(R^m))+A[3]+3250441966&4294967295,_=S+(T<<22&4294967295|T>>>10),T=m+(R^_&(S^R))+A[4]+4118548399&4294967295,m=_+(T<<7&4294967295|T>>>25),T=R+(S^m&(_^S))+A[5]+1200080426&4294967295,R=m+(T<<12&4294967295|T>>>20),T=S+(_^R&(m^_))+A[6]+2821735955&4294967295,S=R+(T<<17&4294967295|T>>>15),T=_+(m^S&(R^m))+A[7]+4249261313&4294967295,_=S+(T<<22&4294967295|T>>>10),T=m+(R^_&(S^R))+A[8]+1770035416&4294967295,m=_+(T<<7&4294967295|T>>>25),T=R+(S^m&(_^S))+A[9]+2336552879&4294967295,R=m+(T<<12&4294967295|T>>>20),T=S+(_^R&(m^_))+A[10]+4294925233&4294967295,S=R+(T<<17&4294967295|T>>>15),T=_+(m^S&(R^m))+A[11]+2304563134&4294967295,_=S+(T<<22&4294967295|T>>>10),T=m+(R^_&(S^R))+A[12]+1804603682&4294967295,m=_+(T<<7&4294967295|T>>>25),T=R+(S^m&(_^S))+A[13]+4254626195&4294967295,R=m+(T<<12&4294967295|T>>>20),T=S+(_^R&(m^_))+A[14]+2792965006&4294967295,S=R+(T<<17&4294967295|T>>>15),T=_+(m^S&(R^m))+A[15]+1236535329&4294967295,_=S+(T<<22&4294967295|T>>>10),T=m+(S^R&(_^S))+A[1]+4129170786&4294967295,m=_+(T<<5&4294967295|T>>>27),T=R+(_^S&(m^_))+A[6]+3225465664&4294967295,R=m+(T<<9&4294967295|T>>>23),T=S+(m^_&(R^m))+A[11]+643717713&4294967295,S=R+(T<<14&4294967295|T>>>18),T=_+(R^m&(S^R))+A[0]+3921069994&4294967295,_=S+(T<<20&4294967295|T>>>12),T=m+(S^R&(_^S))+A[5]+3593408605&4294967295,m=_+(T<<5&4294967295|T>>>27),T=R+(_^S&(m^_))+A[10]+38016083&4294967295,R=m+(T<<9&4294967295|T>>>23),T=S+(m^_&(R^m))+A[15]+3634488961&4294967295,S=R+(T<<14&4294967295|T>>>18),T=_+(R^m&(S^R))+A[4]+3889429448&4294967295,_=S+(T<<20&4294967295|T>>>12),T=m+(S^R&(_^S))+A[9]+568446438&4294967295,m=_+(T<<5&4294967295|T>>>27),T=R+(_^S&(m^_))+A[14]+3275163606&4294967295,R=m+(T<<9&4294967295|T>>>23),T=S+(m^_&(R^m))+A[3]+4107603335&4294967295,S=R+(T<<14&4294967295|T>>>18),T=_+(R^m&(S^R))+A[8]+1163531501&4294967295,_=S+(T<<20&4294967295|T>>>12),T=m+(S^R&(_^S))+A[13]+2850285829&4294967295,m=_+(T<<5&4294967295|T>>>27),T=R+(_^S&(m^_))+A[2]+4243563512&4294967295,R=m+(T<<9&4294967295|T>>>23),T=S+(m^_&(R^m))+A[7]+1735328473&4294967295,S=R+(T<<14&4294967295|T>>>18),T=_+(R^m&(S^R))+A[12]+2368359562&4294967295,_=S+(T<<20&4294967295|T>>>12),T=m+(_^S^R)+A[5]+4294588738&4294967295,m=_+(T<<4&4294967295|T>>>28),T=R+(m^_^S)+A[8]+2272392833&4294967295,R=m+(T<<11&4294967295|T>>>21),T=S+(R^m^_)+A[11]+1839030562&4294967295,S=R+(T<<16&4294967295|T>>>16),T=_+(S^R^m)+A[14]+4259657740&4294967295,_=S+(T<<23&4294967295|T>>>9),T=m+(_^S^R)+A[1]+2763975236&4294967295,m=_+(T<<4&4294967295|T>>>28),T=R+(m^_^S)+A[4]+1272893353&4294967295,R=m+(T<<11&4294967295|T>>>21),T=S+(R^m^_)+A[7]+4139469664&4294967295,S=R+(T<<16&4294967295|T>>>16),T=_+(S^R^m)+A[10]+3200236656&4294967295,_=S+(T<<23&4294967295|T>>>9),T=m+(_^S^R)+A[13]+681279174&4294967295,m=_+(T<<4&4294967295|T>>>28),T=R+(m^_^S)+A[0]+3936430074&4294967295,R=m+(T<<11&4294967295|T>>>21),T=S+(R^m^_)+A[3]+3572445317&4294967295,S=R+(T<<16&4294967295|T>>>16),T=_+(S^R^m)+A[6]+76029189&4294967295,_=S+(T<<23&4294967295|T>>>9),T=m+(_^S^R)+A[9]+3654602809&4294967295,m=_+(T<<4&4294967295|T>>>28),T=R+(m^_^S)+A[12]+3873151461&4294967295,R=m+(T<<11&4294967295|T>>>21),T=S+(R^m^_)+A[15]+530742520&4294967295,S=R+(T<<16&4294967295|T>>>16),T=_+(S^R^m)+A[2]+3299628645&4294967295,_=S+(T<<23&4294967295|T>>>9),T=m+(S^(_|~R))+A[0]+4096336452&4294967295,m=_+(T<<6&4294967295|T>>>26),T=R+(_^(m|~S))+A[7]+1126891415&4294967295,R=m+(T<<10&4294967295|T>>>22),T=S+(m^(R|~_))+A[14]+2878612391&4294967295,S=R+(T<<15&4294967295|T>>>17),T=_+(R^(S|~m))+A[5]+4237533241&4294967295,_=S+(T<<21&4294967295|T>>>11),T=m+(S^(_|~R))+A[12]+1700485571&4294967295,m=_+(T<<6&4294967295|T>>>26),T=R+(_^(m|~S))+A[3]+2399980690&4294967295,R=m+(T<<10&4294967295|T>>>22),T=S+(m^(R|~_))+A[10]+4293915773&4294967295,S=R+(T<<15&4294967295|T>>>17),T=_+(R^(S|~m))+A[1]+2240044497&4294967295,_=S+(T<<21&4294967295|T>>>11),T=m+(S^(_|~R))+A[8]+1873313359&4294967295,m=_+(T<<6&4294967295|T>>>26),T=R+(_^(m|~S))+A[15]+4264355552&4294967295,R=m+(T<<10&4294967295|T>>>22),T=S+(m^(R|~_))+A[6]+2734768916&4294967295,S=R+(T<<15&4294967295|T>>>17),T=_+(R^(S|~m))+A[13]+1309151649&4294967295,_=S+(T<<21&4294967295|T>>>11),T=m+(S^(_|~R))+A[4]+4149444226&4294967295,m=_+(T<<6&4294967295|T>>>26),T=R+(_^(m|~S))+A[11]+3174756917&4294967295,R=m+(T<<10&4294967295|T>>>22),T=S+(m^(R|~_))+A[2]+718787259&4294967295,S=R+(T<<15&4294967295|T>>>17),T=_+(R^(S|~m))+A[9]+3951481745&4294967295,w.g[0]=w.g[0]+m&4294967295,w.g[1]=w.g[1]+(S+(T<<21&4294967295|T>>>11))&4294967295,w.g[2]=w.g[2]+S&4294967295,w.g[3]=w.g[3]+R&4294967295}r.prototype.v=function(w,m){m===void 0&&(m=w.length);const _=m-this.blockSize,A=this.C;let S=this.h,R=0;for(;R<m;){if(S==0)for(;R<=_;)i(this,w,R),R+=this.blockSize;if(typeof w=="string"){for(;R<m;)if(A[S++]=w.charCodeAt(R++),S==this.blockSize){i(this,A),S=0;break}}else for(;R<m;)if(A[S++]=w[R++],S==this.blockSize){i(this,A),S=0;break}}this.h=S,this.o+=m},r.prototype.A=function(){var w=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);w[0]=128;for(var m=1;m<w.length-8;++m)w[m]=0;m=this.o*8;for(var _=w.length-8;_<w.length;++_)w[_]=m&255,m/=256;for(this.v(w),w=Array(16),m=0,_=0;_<4;++_)for(let A=0;A<32;A+=8)w[m++]=this.g[_]>>>A&255;return w};function s(w,m){var _=l;return Object.prototype.hasOwnProperty.call(_,w)?_[w]:_[w]=m(w)}function o(w,m){this.h=m;const _=[];let A=!0;for(let S=w.length-1;S>=0;S--){const R=w[S]|0;A&&R==m||(_[S]=R,A=!1)}this.g=_}var l={};function u(w){return-128<=w&&w<128?s(w,function(m){return new o([m|0],m<0?-1:0)}):new o([w|0],w<0?-1:0)}function h(w){if(isNaN(w)||!isFinite(w))return y;if(w<0)return v(h(-w));const m=[];let _=1;for(let A=0;w>=_;A++)m[A]=w/_|0,_*=4294967296;return new o(m,0)}function f(w,m){if(w.length==0)throw Error("number format error: empty string");if(m=m||10,m<2||36<m)throw Error("radix out of range: "+m);if(w.charAt(0)=="-")return v(f(w.substring(1),m));if(w.indexOf("-")>=0)throw Error('number format error: interior "-" character');const _=h(Math.pow(m,8));let A=y;for(let R=0;R<w.length;R+=8){var S=Math.min(8,w.length-R);const T=parseInt(w.substring(R,R+S),m);S<8?(S=h(Math.pow(m,S)),A=A.j(S).add(h(T))):(A=A.j(_),A=A.add(h(T)))}return A}var y=u(0),g=u(1),k=u(16777216);t=o.prototype,t.m=function(){if(O(this))return-v(this).m();let w=0,m=1;for(let _=0;_<this.g.length;_++){const A=this.i(_);w+=(A>=0?A:4294967296+A)*m,m*=4294967296}return w},t.toString=function(w){if(w=w||10,w<2||36<w)throw Error("radix out of range: "+w);if(V(this))return"0";if(O(this))return"-"+v(this).toString(w);const m=h(Math.pow(w,6));var _=this;let A="";for(;;){const S=N(_,m).g;_=E(_,S.j(m));let R=((_.g.length>0?_.g[0]:_.h)>>>0).toString(w);if(_=S,V(_))return R+A;for(;R.length<6;)R="0"+R;A=R+A}},t.i=function(w){return w<0?0:w<this.g.length?this.g[w]:this.h};function V(w){if(w.h!=0)return!1;for(let m=0;m<w.g.length;m++)if(w.g[m]!=0)return!1;return!0}function O(w){return w.h==-1}t.l=function(w){return w=E(this,w),O(w)?-1:V(w)?0:1};function v(w){const m=w.g.length,_=[];for(let A=0;A<m;A++)_[A]=~w.g[A];return new o(_,~w.h).add(g)}t.abs=function(){return O(this)?v(this):this},t.add=function(w){const m=Math.max(this.g.length,w.g.length),_=[];let A=0;for(let S=0;S<=m;S++){let R=A+(this.i(S)&65535)+(w.i(S)&65535),T=(R>>>16)+(this.i(S)>>>16)+(w.i(S)>>>16);A=T>>>16,R&=65535,T&=65535,_[S]=T<<16|R}return new o(_,_[_.length-1]&-2147483648?-1:0)};function E(w,m){return w.add(v(m))}t.j=function(w){if(V(this)||V(w))return y;if(O(this))return O(w)?v(this).j(v(w)):v(v(this).j(w));if(O(w))return v(this.j(v(w)));if(this.l(k)<0&&w.l(k)<0)return h(this.m()*w.m());const m=this.g.length+w.g.length,_=[];for(var A=0;A<2*m;A++)_[A]=0;for(A=0;A<this.g.length;A++)for(let S=0;S<w.g.length;S++){const R=this.i(A)>>>16,T=this.i(A)&65535,Ne=w.i(S)>>>16,He=w.i(S)&65535;_[2*A+2*S]+=T*He,I(_,2*A+2*S),_[2*A+2*S+1]+=R*He,I(_,2*A+2*S+1),_[2*A+2*S+1]+=T*Ne,I(_,2*A+2*S+1),_[2*A+2*S+2]+=R*Ne,I(_,2*A+2*S+2)}for(w=0;w<m;w++)_[w]=_[2*w+1]<<16|_[2*w];for(w=m;w<2*m;w++)_[w]=0;return new o(_,0)};function I(w,m){for(;(w[m]&65535)!=w[m];)w[m+1]+=w[m]>>>16,w[m]&=65535,m++}function P(w,m){this.g=w,this.h=m}function N(w,m){if(V(m))throw Error("division by zero");if(V(w))return new P(y,y);if(O(w))return m=N(v(w),m),new P(v(m.g),v(m.h));if(O(m))return m=N(w,v(m)),new P(v(m.g),m.h);if(w.g.length>30){if(O(w)||O(m))throw Error("slowDivide_ only works with positive integers.");for(var _=g,A=m;A.l(w)<=0;)_=F(_),A=F(A);var S=b(_,1),R=b(A,1);for(A=b(A,2),_=b(_,2);!V(A);){var T=R.add(A);T.l(w)<=0&&(S=S.add(_),R=T),A=b(A,1),_=b(_,1)}return m=E(w,S.j(m)),new P(S,m)}for(S=y;w.l(m)>=0;){for(_=Math.max(1,Math.floor(w.m()/m.m())),A=Math.ceil(Math.log(_)/Math.LN2),A=A<=48?1:Math.pow(2,A-48),R=h(_),T=R.j(m);O(T)||T.l(w)>0;)_-=A,R=h(_),T=R.j(m);V(R)&&(R=g),S=S.add(R),w=E(w,T)}return new P(S,w)}t.B=function(w){return N(this,w).h},t.and=function(w){const m=Math.max(this.g.length,w.g.length),_=[];for(let A=0;A<m;A++)_[A]=this.i(A)&w.i(A);return new o(_,this.h&w.h)},t.or=function(w){const m=Math.max(this.g.length,w.g.length),_=[];for(let A=0;A<m;A++)_[A]=this.i(A)|w.i(A);return new o(_,this.h|w.h)},t.xor=function(w){const m=Math.max(this.g.length,w.g.length),_=[];for(let A=0;A<m;A++)_[A]=this.i(A)^w.i(A);return new o(_,this.h^w.h)};function F(w){const m=w.g.length+1,_=[];for(let A=0;A<m;A++)_[A]=w.i(A)<<1|w.i(A-1)>>>31;return new o(_,w.h)}function b(w,m){const _=m>>5;m%=32;const A=w.g.length-_,S=[];for(let R=0;R<A;R++)S[R]=m>0?w.i(R+_)>>>m|w.i(R+_+1)<<32-m:w.i(R+_);return new o(S,w.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,T_=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=h,o.fromString=f,Xn=o}).apply(typeof w_!="undefined"?w_:typeof self!="undefined"?self:typeof window!="undefined"?window:{});var El=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var I_,vo,A_,wl,fd,S_,k_,R_;(function(){var t,e=Object.defineProperty;function n(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof El=="object"&&El];for(var c=0;c<a.length;++c){var d=a[c];if(d&&d.Math==Math)return d}throw Error("Cannot find global object")}var r=n(this);function i(a,c){if(c)e:{var d=r;a=a.split(".");for(var p=0;p<a.length-1;p++){var C=a[p];if(!(C in d))break e;d=d[C]}a=a[a.length-1],p=d[a],c=c(p),c!=p&&c!=null&&e(d,a,{configurable:!0,writable:!0,value:c})}}i("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),i("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),i("Object.entries",function(a){return a||function(c){var d=[],p;for(p in c)Object.prototype.hasOwnProperty.call(c,p)&&d.push([p,c[p]]);return d}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var s=s||{},o=this||self;function l(a){var c=typeof a;return c=="object"&&a!=null||c=="function"}function u(a,c,d){return a.call.apply(a.bind,arguments)}function h(a,c,d){return h=u,h.apply(null,arguments)}function f(a,c){var d=Array.prototype.slice.call(arguments,1);return function(){var p=d.slice();return p.push.apply(p,arguments),a.apply(this,p)}}function y(a,c){function d(){}d.prototype=c.prototype,a.Z=c.prototype,a.prototype=new d,a.prototype.constructor=a,a.Ob=function(p,C,D){for(var U=Array(arguments.length-2),Z=2;Z<arguments.length;Z++)U[Z-2]=arguments[Z];return c.prototype[C].apply(p,U)}}var g=typeof AsyncContext!="undefined"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function k(a){const c=a.length;if(c>0){const d=Array(c);for(let p=0;p<c;p++)d[p]=a[p];return d}return[]}function V(a,c){for(let p=1;p<arguments.length;p++){const C=arguments[p];var d=typeof C;if(d=d!="object"?d:C?Array.isArray(C)?"array":d:"null",d=="array"||d=="object"&&typeof C.length=="number"){d=a.length||0;const D=C.length||0;a.length=d+D;for(let U=0;U<D;U++)a[d+U]=C[U]}else a.push(C)}}class O{constructor(c,d){this.i=c,this.j=d,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function v(a){o.setTimeout(()=>{throw a},0)}function E(){var a=w;let c=null;return a.g&&(c=a.g,a.g=a.g.next,a.g||(a.h=null),c.next=null),c}class I{constructor(){this.h=this.g=null}add(c,d){const p=P.get();p.set(c,d),this.h?this.h.next=p:this.g=p,this.h=p}}var P=new O(()=>new N,a=>a.reset());class N{constructor(){this.next=this.g=this.h=null}set(c,d){this.h=c,this.g=d,this.next=null}reset(){this.next=this.g=this.h=null}}let F,b=!1,w=new I,m=()=>{const a=Promise.resolve(void 0);F=()=>{a.then(_)}};function _(){for(var a;a=E();){try{a.h.call(a.g)}catch(d){v(d)}var c=P;c.j(a),c.h<100&&(c.h++,a.next=c.g,c.g=a)}b=!1}function A(){this.u=this.u,this.C=this.C}A.prototype.u=!1,A.prototype.dispose=function(){this.u||(this.u=!0,this.N())},A.prototype[Symbol.dispose]=function(){this.dispose()},A.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function S(a,c){this.type=a,this.g=this.target=c,this.defaultPrevented=!1}S.prototype.h=function(){this.defaultPrevented=!0};var R=function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,c=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const d=()=>{};o.addEventListener("test",d,c),o.removeEventListener("test",d,c)}catch{}return a}();function T(a){return/^[\s\xa0]*$/.test(a)}function Ne(a,c){S.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,c)}y(Ne,S),Ne.prototype.init=function(a,c){const d=this.type=a.type,p=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=c,c=a.relatedTarget,c||(d=="mouseover"?c=a.fromElement:d=="mouseout"&&(c=a.toElement)),this.relatedTarget=c,p?(this.clientX=p.clientX!==void 0?p.clientX:p.pageX,this.clientY=p.clientY!==void 0?p.clientY:p.pageY,this.screenX=p.screenX||0,this.screenY=p.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Ne.Z.h.call(this)},Ne.prototype.h=function(){Ne.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var He="closure_listenable_"+(Math.random()*1e6|0),_r=0;function ns(a,c,d,p,C){this.listener=a,this.proxy=null,this.src=c,this.type=d,this.capture=!!p,this.ha=C,this.key=++_r,this.da=this.fa=!1}function En(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function wn(a,c,d){for(const p in a)c.call(d,a[p],p,a)}function Au(a,c){for(const d in a)c.call(void 0,a[d],d,a)}function B(a){const c={};for(const d in a)c[d]=a[d];return c}const K="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function J(a,c){let d,p;for(let C=1;C<arguments.length;C++){p=arguments[C];for(d in p)a[d]=p[d];for(let D=0;D<K.length;D++)d=K[D],Object.prototype.hasOwnProperty.call(p,d)&&(a[d]=p[d])}}function le(a){this.src=a,this.g={},this.h=0}le.prototype.add=function(a,c,d,p,C){const D=a.toString();a=this.g[D],a||(a=this.g[D]=[],this.h++);const U=kt(a,c,p,C);return U>-1?(c=a[U],d||(c.fa=!1)):(c=new ns(c,this.src,D,!!p,C),c.fa=d,a.push(c)),c};function Ie(a,c){const d=c.type;if(d in a.g){var p=a.g[d],C=Array.prototype.indexOf.call(p,c,void 0),D;(D=C>=0)&&Array.prototype.splice.call(p,C,1),D&&(En(c),a.g[d].length==0&&(delete a.g[d],a.h--))}}function kt(a,c,d,p){for(let C=0;C<a.length;++C){const D=a[C];if(!D.da&&D.listener==c&&D.capture==!!d&&D.ha==p)return C}return-1}var Rt="closure_lm_"+(Math.random()*1e6|0),tn={};function nn(a,c,d,p,C){if(p&&p.once)return Hf(a,c,d,p,C);if(Array.isArray(c)){for(let D=0;D<c.length;D++)nn(a,c[D],d,p,C);return null}return d=Cu(d),a&&a[He]?a.J(c,d,l(p)?!!p.capture:!!p,C):zf(a,c,d,!1,p,C)}function zf(a,c,d,p,C,D){if(!c)throw Error("Invalid event type");const U=l(C)?!!C.capture:!!C;let Z=ku(a);if(Z||(a[Rt]=Z=new le(a)),d=Z.add(c,d,p,U,D),d.proxy)return d;if(p=kE(),d.proxy=p,p.src=a,p.listener=d,a.addEventListener)R||(C=U),C===void 0&&(C=!1),a.addEventListener(c.toString(),p,C);else if(a.attachEvent)a.attachEvent(Wf(c.toString()),p);else if(a.addListener&&a.removeListener)a.addListener(p);else throw Error("addEventListener and attachEvent are unavailable.");return d}function kE(){function a(d){return c.call(a.src,a.listener,d)}const c=RE;return a}function Hf(a,c,d,p,C){if(Array.isArray(c)){for(let D=0;D<c.length;D++)Hf(a,c[D],d,p,C);return null}return d=Cu(d),a&&a[He]?a.K(c,d,l(p)?!!p.capture:!!p,C):zf(a,c,d,!0,p,C)}function qf(a,c,d,p,C){if(Array.isArray(c))for(var D=0;D<c.length;D++)qf(a,c[D],d,p,C);else p=l(p)?!!p.capture:!!p,d=Cu(d),a&&a[He]?(a=a.i,D=String(c).toString(),D in a.g&&(c=a.g[D],d=kt(c,d,p,C),d>-1&&(En(c[d]),Array.prototype.splice.call(c,d,1),c.length==0&&(delete a.g[D],a.h--)))):a&&(a=ku(a))&&(c=a.g[c.toString()],a=-1,c&&(a=kt(c,d,p,C)),(d=a>-1?c[a]:null)&&Su(d))}function Su(a){if(typeof a!="number"&&a&&!a.da){var c=a.src;if(c&&c[He])Ie(c.i,a);else{var d=a.type,p=a.proxy;c.removeEventListener?c.removeEventListener(d,p,a.capture):c.detachEvent?c.detachEvent(Wf(d),p):c.addListener&&c.removeListener&&c.removeListener(p),(d=ku(c))?(Ie(d,a),d.h==0&&(d.src=null,c[Rt]=null)):En(a)}}}function Wf(a){return a in tn?tn[a]:tn[a]="on"+a}function RE(a,c){if(a.da)a=!0;else{c=new Ne(c,this);const d=a.listener,p=a.ha||a.src;a.fa&&Su(a),a=d.call(p,c)}return a}function ku(a){return a=a[Rt],a instanceof le?a:null}var Ru="__closure_events_fn_"+(Math.random()*1e9>>>0);function Cu(a){return typeof a=="function"?a:(a[Ru]||(a[Ru]=function(c){return a.handleEvent(c)}),a[Ru])}function qe(){A.call(this),this.i=new le(this),this.M=this,this.G=null}y(qe,A),qe.prototype[He]=!0,qe.prototype.removeEventListener=function(a,c,d,p){qf(this,a,c,d,p)};function et(a,c){var d,p=a.G;if(p)for(d=[];p;p=p.G)d.push(p);if(a=a.M,p=c.type||c,typeof c=="string")c=new S(c,a);else if(c instanceof S)c.target=c.target||a;else{var C=c;c=new S(p,a),J(c,C)}C=!0;let D,U;if(d)for(U=d.length-1;U>=0;U--)D=c.g=d[U],C=Jo(D,p,!0,c)&&C;if(D=c.g=a,C=Jo(D,p,!0,c)&&C,C=Jo(D,p,!1,c)&&C,d)for(U=0;U<d.length;U++)D=c.g=d[U],C=Jo(D,p,!1,c)&&C}qe.prototype.N=function(){if(qe.Z.N.call(this),this.i){var a=this.i;for(const c in a.g){const d=a.g[c];for(let p=0;p<d.length;p++)En(d[p]);delete a.g[c],a.h--}}this.G=null},qe.prototype.J=function(a,c,d,p){return this.i.add(String(a),c,!1,d,p)},qe.prototype.K=function(a,c,d,p){return this.i.add(String(a),c,!0,d,p)};function Jo(a,c,d,p){if(c=a.i.g[String(c)],!c)return!0;c=c.concat();let C=!0;for(let D=0;D<c.length;++D){const U=c[D];if(U&&!U.da&&U.capture==d){const Z=U.listener,De=U.ha||U.src;U.fa&&Ie(a.i,U),C=Z.call(De,p)!==!1&&C}}return C&&!p.defaultPrevented}function CE(a,c){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=h(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:o.setTimeout(a,c||0)}function Gf(a){a.g=CE(()=>{a.g=null,a.i&&(a.i=!1,Gf(a))},a.l);const c=a.h;a.h=null,a.m.apply(null,c)}class PE extends A{constructor(c,d){super();this.m=c,this.l=d,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:Gf(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function rs(a){A.call(this),this.h=a,this.g={}}y(rs,A);var Kf=[];function Qf(a){wn(a.g,function(c,d){this.g.hasOwnProperty(d)&&Su(c)},a),a.g={}}rs.prototype.N=function(){rs.Z.N.call(this),Qf(this)},rs.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var Pu=o.JSON.stringify,NE=o.JSON.parse,DE=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function Yf(){}function Xf(){}var is={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function Nu(){S.call(this,"d")}y(Nu,S);function Du(){S.call(this,"c")}y(Du,S);var vr={},Jf=null;function Zo(){return Jf=Jf||new qe}vr.Ia="serverreachability";function Zf(a){S.call(this,vr.Ia,a)}y(Zf,S);function ss(a){const c=Zo();et(c,new Zf(c))}vr.STAT_EVENT="statevent";function ep(a,c){S.call(this,vr.STAT_EVENT,a),this.stat=c}y(ep,S);function tt(a){const c=Zo();et(c,new ep(c,a))}vr.Ja="timingevent";function tp(a,c){S.call(this,vr.Ja,a),this.size=c}y(tp,S);function os(a,c){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},c)}function as(){this.g=!0}as.prototype.ua=function(){this.g=!1};function VE(a,c,d,p,C,D){a.info(function(){if(a.g)if(D){var U="",Z=D.split("&");for(let ae=0;ae<Z.length;ae++){var De=Z[ae].split("=");if(De.length>1){const xe=De[0];De=De[1];const bt=xe.split("_");U=bt.length>=2&&bt[1]=="type"?U+(xe+"="+De+"&"):U+(xe+"=redacted&")}}}else U=null;else U=D;return"XMLHTTP REQ ("+p+") [attempt "+C+"]: "+c+`
`+d+`
`+U})}function OE(a,c,d,p,C,D,U){a.info(function(){return"XMLHTTP RESP ("+p+") [ attempt "+C+"]: "+c+`
`+d+`
`+D+" "+U})}function ti(a,c,d,p){a.info(function(){return"XMLHTTP TEXT ("+c+"): "+ME(a,d)+(p?" "+p:"")})}function xE(a,c){a.info(function(){return"TIMEOUT: "+c})}as.prototype.info=function(){};function ME(a,c){if(!a.g)return c;if(!c)return null;try{const D=JSON.parse(c);if(D){for(a=0;a<D.length;a++)if(Array.isArray(D[a])){var d=D[a];if(!(d.length<2)){var p=d[1];if(Array.isArray(p)&&!(p.length<1)){var C=p[0];if(C!="noop"&&C!="stop"&&C!="close")for(let U=1;U<p.length;U++)p[U]=""}}}}return Pu(D)}catch{return c}}var ea={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},np={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},rp;function Vu(){}y(Vu,Yf),Vu.prototype.g=function(){return new XMLHttpRequest},rp=new Vu;function ls(a){return encodeURIComponent(String(a))}function bE(a){var c=1;a=a.split(":");const d=[];for(;c>0&&a.length;)d.push(a.shift()),c--;return a.length&&d.push(a.join(":")),d}function Tn(a,c,d,p){this.j=a,this.i=c,this.l=d,this.S=p||1,this.V=new rs(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new ip}function ip(){this.i=null,this.g="",this.h=!1}var sp={},Ou={};function xu(a,c,d){a.M=1,a.A=na(Mt(c)),a.u=d,a.R=!0,op(a,null)}function op(a,c){a.F=Date.now(),ta(a),a.B=Mt(a.A);var d=a.B,p=a.S;Array.isArray(p)||(p=[String(p)]),vp(d.i,"t",p),a.C=0,d=a.j.L,a.h=new ip,a.g=Lp(a.j,d?c:null,!a.u),a.P>0&&(a.O=new PE(h(a.Y,a,a.g),a.P)),c=a.V,d=a.g,p=a.ba;var C="readystatechange";Array.isArray(C)||(C&&(Kf[0]=C.toString()),C=Kf);for(let D=0;D<C.length;D++){const U=nn(d,C[D],p||c.handleEvent,!1,c.h||c);if(!U)break;c.g[U.key]=U}c=a.J?B(a.J):{},a.u?(a.v||(a.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,c)):(a.v="GET",a.g.ea(a.B,a.v,null,c)),ss(),VE(a.i,a.v,a.B,a.l,a.S,a.u)}Tn.prototype.ba=function(a){a=a.target;const c=this.O;c&&Sn(a)==3?c.j():this.Y(a)},Tn.prototype.Y=function(a){try{if(a==this.g)e:{const Z=Sn(this.g),De=this.g.ya(),ae=this.g.ca();if(!(Z<3)&&(Z!=3||this.g&&(this.h.h||this.g.la()||kp(this.g)))){this.K||Z!=4||De==7||(De==8||ae<=0?ss(3):ss(2)),Mu(this);var c=this.g.ca();this.X=c;var d=LE(this);if(this.o=c==200,OE(this.i,this.v,this.B,this.l,this.S,Z,c),this.o){if(this.U&&!this.L){t:{if(this.g){var p,C=this.g;if((p=C.g?C.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!T(p)){var D=p;break t}}D=null}if(a=D)ti(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,bu(this,a);else{this.o=!1,this.m=3,tt(12),Er(this),us(this);break e}}if(this.R){a=!0;let xe;for(;!this.K&&this.C<d.length;)if(xe=UE(this,d),xe==Ou){Z==4&&(this.m=4,tt(14),a=!1),ti(this.i,this.l,null,"[Incomplete Response]");break}else if(xe==sp){this.m=4,tt(15),ti(this.i,this.l,d,"[Invalid Chunk]"),a=!1;break}else ti(this.i,this.l,xe,null),bu(this,xe);if(ap(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Z!=4||d.length!=0||this.h.h||(this.m=1,tt(16),a=!1),this.o=this.o&&a,!a)ti(this.i,this.l,d,"[Invalid Chunked Response]"),Er(this),us(this);else if(d.length>0&&!this.W){this.W=!0;var U=this.j;U.g==this&&U.aa&&!U.P&&(U.j.info("Great, no buffering proxy detected. Bytes received: "+d.length),Hu(U),U.P=!0,tt(11))}}else ti(this.i,this.l,d,null),bu(this,d);Z==4&&Er(this),this.o&&!this.K&&(Z==4?Op(this.j,this):(this.o=!1,ta(this)))}else JE(this.g),c==400&&d.indexOf("Unknown SID")>0?(this.m=3,tt(12)):(this.m=0,tt(13)),Er(this),us(this)}}}catch{}finally{}};function LE(a){if(!ap(a))return a.g.la();const c=kp(a.g);if(c==="")return"";let d="";const p=c.length,C=Sn(a.g)==4;if(!a.h.i){if(typeof TextDecoder=="undefined")return Er(a),us(a),"";a.h.i=new o.TextDecoder}for(let D=0;D<p;D++)a.h.h=!0,d+=a.h.i.decode(c[D],{stream:!(C&&D==p-1)});return c.length=0,a.h.g+=d,a.C=0,a.h.g}function ap(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function UE(a,c){var d=a.C,p=c.indexOf(`
`,d);return p==-1?Ou:(d=Number(c.substring(d,p)),isNaN(d)?sp:(p+=1,p+d>c.length?Ou:(c=c.slice(p,p+d),a.C=p+d,c)))}Tn.prototype.cancel=function(){this.K=!0,Er(this)};function ta(a){a.T=Date.now()+a.H,lp(a,a.H)}function lp(a,c){if(a.D!=null)throw Error("WatchDog timer not null");a.D=os(h(a.aa,a),c)}function Mu(a){a.D&&(o.clearTimeout(a.D),a.D=null)}Tn.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(xE(this.i,this.B),this.M!=2&&(ss(),tt(17)),Er(this),this.m=2,us(this)):lp(this,this.T-a)};function us(a){a.j.I==0||a.K||Op(a.j,a)}function Er(a){Mu(a);var c=a.O;c&&typeof c.dispose=="function"&&c.dispose(),a.O=null,Qf(a.V),a.g&&(c=a.g,a.g=null,c.abort(),c.dispose())}function bu(a,c){try{var d=a.j;if(d.I!=0&&(d.g==a||Lu(d.h,a))){if(!a.L&&Lu(d.h,a)&&d.I==3){try{var p=d.Ba.g.parse(c)}catch{p=null}if(Array.isArray(p)&&p.length==3){var C=p;if(C[0]==0)e:if(!d.v){if(d.g)if(d.g.F+3e3<a.F)aa(d),sa(d);else break e;zu(d),tt(18)}else d.xa=C[1],0<d.xa-d.K&&C[2]<37500&&d.F&&d.A==0&&!d.C&&(d.C=os(h(d.Va,d),6e3));hp(d.h)<=1&&d.ta&&(d.ta=void 0)}else Tr(d,11)}else if((a.L||d.g==a)&&aa(d),!T(c))for(C=d.Ba.g.parse(c),c=0;c<C.length;c++){let ae=C[c];const xe=ae[0];if(!(xe<=d.K))if(d.K=xe,ae=ae[1],d.I==2)if(ae[0]=="c"){d.M=ae[1],d.ba=ae[2];const bt=ae[3];bt!=null&&(d.ka=bt,d.j.info("VER="+d.ka));const Ir=ae[4];Ir!=null&&(d.za=Ir,d.j.info("SVER="+d.za));const kn=ae[5];kn!=null&&typeof kn=="number"&&kn>0&&(p=1.5*kn,d.O=p,d.j.info("backChannelRequestTimeoutMs_="+p)),p=d;const Rn=a.g;if(Rn){const ua=Rn.g?Rn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(ua){var D=p.h;D.g||ua.indexOf("spdy")==-1&&ua.indexOf("quic")==-1&&ua.indexOf("h2")==-1||(D.j=D.l,D.g=new Set,D.h&&(Uu(D,D.h),D.h=null))}if(p.G){const qu=Rn.g?Rn.g.getResponseHeader("X-HTTP-Session-Id"):null;qu&&(p.wa=qu,he(p.J,p.G,qu))}}d.I=3,d.l&&d.l.ra(),d.aa&&(d.T=Date.now()-a.F,d.j.info("Handshake RTT: "+d.T+"ms")),p=d;var U=a;if(p.na=bp(p,p.L?p.ba:null,p.W),U.L){dp(p.h,U);var Z=U,De=p.O;De&&(Z.H=De),Z.D&&(Mu(Z),ta(Z)),p.g=U}else Dp(p);d.i.length>0&&oa(d)}else ae[0]!="stop"&&ae[0]!="close"||Tr(d,7);else d.I==3&&(ae[0]=="stop"||ae[0]=="close"?ae[0]=="stop"?Tr(d,7):$u(d):ae[0]!="noop"&&d.l&&d.l.qa(ae),d.A=0)}}ss(4)}catch{}}var FE=class{constructor(a,c){this.g=a,this.map=c}};function up(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function cp(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function hp(a){return a.h?1:a.g?a.g.size:0}function Lu(a,c){return a.h?a.h==c:a.g?a.g.has(c):!1}function Uu(a,c){a.g?a.g.add(c):a.h=c}function dp(a,c){a.h&&a.h==c?a.h=null:a.g&&a.g.has(c)&&a.g.delete(c)}up.prototype.cancel=function(){if(this.i=fp(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function fp(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let c=a.i;for(const d of a.g.values())c=c.concat(d.G);return c}return k(a.i)}var pp=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function jE(a,c){if(a){a=a.split("&");for(let d=0;d<a.length;d++){const p=a[d].indexOf("=");let C,D=null;p>=0?(C=a[d].substring(0,p),D=a[d].substring(p+1)):C=a[d],c(C,D?decodeURIComponent(D.replace(/\+/g," ")):"")}}}function In(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;a instanceof In?(this.l=a.l,cs(this,a.j),this.o=a.o,this.g=a.g,hs(this,a.u),this.h=a.h,Fu(this,Ep(a.i)),this.m=a.m):a&&(c=String(a).match(pp))?(this.l=!1,cs(this,c[1]||"",!0),this.o=ds(c[2]||""),this.g=ds(c[3]||"",!0),hs(this,c[4]),this.h=ds(c[5]||"",!0),Fu(this,c[6]||"",!0),this.m=ds(c[7]||"")):(this.l=!1,this.i=new ps(null,this.l))}In.prototype.toString=function(){const a=[];var c=this.j;c&&a.push(fs(c,mp,!0),":");var d=this.g;return(d||c=="file")&&(a.push("//"),(c=this.o)&&a.push(fs(c,mp,!0),"@"),a.push(ls(d).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),d=this.u,d!=null&&a.push(":",String(d))),(d=this.h)&&(this.g&&d.charAt(0)!="/"&&a.push("/"),a.push(fs(d,d.charAt(0)=="/"?zE:$E,!0))),(d=this.i.toString())&&a.push("?",d),(d=this.m)&&a.push("#",fs(d,qE)),a.join("")},In.prototype.resolve=function(a){const c=Mt(this);let d=!!a.j;d?cs(c,a.j):d=!!a.o,d?c.o=a.o:d=!!a.g,d?c.g=a.g:d=a.u!=null;var p=a.h;if(d)hs(c,a.u);else if(d=!!a.h){if(p.charAt(0)!="/")if(this.g&&!this.h)p="/"+p;else{var C=c.h.lastIndexOf("/");C!=-1&&(p=c.h.slice(0,C+1)+p)}if(C=p,C==".."||C==".")p="";else if(C.indexOf("./")!=-1||C.indexOf("/.")!=-1){p=C.lastIndexOf("/",0)==0,C=C.split("/");const D=[];for(let U=0;U<C.length;){const Z=C[U++];Z=="."?p&&U==C.length&&D.push(""):Z==".."?((D.length>1||D.length==1&&D[0]!="")&&D.pop(),p&&U==C.length&&D.push("")):(D.push(Z),p=!0)}p=D.join("/")}else p=C}return d?c.h=p:d=a.i.toString()!=="",d?Fu(c,Ep(a.i)):d=!!a.m,d&&(c.m=a.m),c};function Mt(a){return new In(a)}function cs(a,c,d){a.j=d?ds(c,!0):c,a.j&&(a.j=a.j.replace(/:$/,""))}function hs(a,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);a.u=c}else a.u=null}function Fu(a,c,d){c instanceof ps?(a.i=c,WE(a.i,a.l)):(d||(c=fs(c,HE)),a.i=new ps(c,a.l))}function he(a,c,d){a.i.set(c,d)}function na(a){return he(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function ds(a,c){return a?c?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function fs(a,c,d){return typeof a=="string"?(a=encodeURI(a).replace(c,BE),d&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function BE(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var mp=/[#\/\?@]/g,$E=/[#\?:]/g,zE=/[#\?]/g,HE=/[#\?@]/g,qE=/#/g;function ps(a,c){this.h=this.g=null,this.i=a||null,this.j=!!c}function wr(a){a.g||(a.g=new Map,a.h=0,a.i&&jE(a.i,function(c,d){a.add(decodeURIComponent(c.replace(/\+/g," ")),d)}))}t=ps.prototype,t.add=function(a,c){wr(this),this.i=null,a=ni(this,a);let d=this.g.get(a);return d||this.g.set(a,d=[]),d.push(c),this.h+=1,this};function gp(a,c){wr(a),c=ni(a,c),a.g.has(c)&&(a.i=null,a.h-=a.g.get(c).length,a.g.delete(c))}function yp(a,c){return wr(a),c=ni(a,c),a.g.has(c)}t.forEach=function(a,c){wr(this),this.g.forEach(function(d,p){d.forEach(function(C){a.call(c,C,p,this)},this)},this)};function _p(a,c){wr(a);let d=[];if(typeof c=="string")yp(a,c)&&(d=d.concat(a.g.get(ni(a,c))));else for(a=Array.from(a.g.values()),c=0;c<a.length;c++)d=d.concat(a[c]);return d}t.set=function(a,c){return wr(this),this.i=null,a=ni(this,a),yp(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[c]),this.h+=1,this},t.get=function(a,c){return a?(a=_p(this,a),a.length>0?String(a[0]):c):c};function vp(a,c,d){gp(a,c),d.length>0&&(a.i=null,a.g.set(ni(a,c),k(d)),a.h+=d.length)}t.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],c=Array.from(this.g.keys());for(let p=0;p<c.length;p++){var d=c[p];const C=ls(d);d=_p(this,d);for(let D=0;D<d.length;D++){let U=C;d[D]!==""&&(U+="="+ls(d[D])),a.push(U)}}return this.i=a.join("&")};function Ep(a){const c=new ps;return c.i=a.i,a.g&&(c.g=new Map(a.g),c.h=a.h),c}function ni(a,c){return c=String(c),a.j&&(c=c.toLowerCase()),c}function WE(a,c){c&&!a.j&&(wr(a),a.i=null,a.g.forEach(function(d,p){const C=p.toLowerCase();p!=C&&(gp(this,p),vp(this,C,d))},a)),a.j=c}function GE(a,c){const d=new as;if(o.Image){const p=new Image;p.onload=f(An,d,"TestLoadImage: loaded",!0,c,p),p.onerror=f(An,d,"TestLoadImage: error",!1,c,p),p.onabort=f(An,d,"TestLoadImage: abort",!1,c,p),p.ontimeout=f(An,d,"TestLoadImage: timeout",!1,c,p),o.setTimeout(function(){p.ontimeout&&p.ontimeout()},1e4),p.src=a}else c(!1)}function KE(a,c){const d=new as,p=new AbortController,C=setTimeout(()=>{p.abort(),An(d,"TestPingServer: timeout",!1,c)},1e4);fetch(a,{signal:p.signal}).then(D=>{clearTimeout(C),D.ok?An(d,"TestPingServer: ok",!0,c):An(d,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(C),An(d,"TestPingServer: error",!1,c)})}function An(a,c,d,p,C){try{C&&(C.onload=null,C.onerror=null,C.onabort=null,C.ontimeout=null),p(d)}catch{}}function QE(){this.g=new DE}function ju(a){this.i=a.Sb||null,this.h=a.ab||!1}y(ju,Yf),ju.prototype.g=function(){return new ra(this.i,this.h)};function ra(a,c){qe.call(this),this.H=a,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}y(ra,qe),t=ra.prototype,t.open=function(a,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=c,this.readyState=1,gs(this)},t.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(c.body=a),(this.H||o).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},t.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,ms(this)),this.readyState=0},t.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,gs(this)),this.g&&(this.readyState=3,gs(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream!="undefined"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;wp(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function wp(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}t.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var c=a.value?a.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!a.done}))&&(this.response=this.responseText+=c)}a.done?ms(this):gs(this),this.readyState==3&&wp(this)}},t.Oa=function(a){this.g&&(this.response=this.responseText=a,ms(this))},t.Na=function(a){this.g&&(this.response=a,ms(this))},t.ga=function(){this.g&&ms(this)};function ms(a){a.readyState=4,a.l=null,a.j=null,a.B=null,gs(a)}t.setRequestHeader=function(a,c){this.A.append(a,c)},t.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},t.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],c=this.h.entries();for(var d=c.next();!d.done;)d=d.value,a.push(d[0]+": "+d[1]),d=c.next();return a.join(`\r
`)};function gs(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(ra.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function Tp(a){let c="";return wn(a,function(d,p){c+=p,c+=":",c+=d,c+=`\r
`}),c}function Bu(a,c,d){e:{for(p in d){var p=!1;break e}p=!0}p||(d=Tp(d),typeof a=="string"?d!=null&&ls(d):he(a,c,d))}function _e(a){qe.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}y(_e,qe);var YE=/^https?$/i,XE=["POST","PUT"];t=_e.prototype,t.Fa=function(a){this.H=a},t.ea=function(a,c,d,p){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);c=c?c.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():rp.g(),this.g.onreadystatechange=g(h(this.Ca,this));try{this.B=!0,this.g.open(c,String(a),!0),this.B=!1}catch(D){Ip(this,D);return}if(a=d||"",d=new Map(this.headers),p)if(Object.getPrototypeOf(p)===Object.prototype)for(var C in p)d.set(C,p[C]);else if(typeof p.keys=="function"&&typeof p.get=="function")for(const D of p.keys())d.set(D,p.get(D));else throw Error("Unknown input type for opt_headers: "+String(p));p=Array.from(d.keys()).find(D=>D.toLowerCase()=="content-type"),C=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(XE,c,void 0)>=0)||p||C||d.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[D,U]of d)this.g.setRequestHeader(D,U);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(D){Ip(this,D)}};function Ip(a,c){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=c,a.o=5,Ap(a),ia(a)}function Ap(a){a.A||(a.A=!0,et(a,"complete"),et(a,"error"))}t.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,et(this,"complete"),et(this,"abort"),ia(this))},t.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),ia(this,!0)),_e.Z.N.call(this)},t.Ca=function(){this.u||(this.B||this.v||this.j?Sp(this):this.Xa())},t.Xa=function(){Sp(this)};function Sp(a){if(a.h&&typeof s!="undefined"){if(a.v&&Sn(a)==4)setTimeout(a.Ca.bind(a),0);else if(et(a,"readystatechange"),Sn(a)==4){a.h=!1;try{const D=a.ca();e:switch(D){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break e;default:c=!1}var d;if(!(d=c)){var p;if(p=D===0){let U=String(a.D).match(pp)[1]||null;!U&&o.self&&o.self.location&&(U=o.self.location.protocol.slice(0,-1)),p=!YE.test(U?U.toLowerCase():"")}d=p}if(d)et(a,"complete"),et(a,"success");else{a.o=6;try{var C=Sn(a)>2?a.g.statusText:""}catch{C=""}a.l=C+" ["+a.ca()+"]",Ap(a)}}finally{ia(a)}}}}function ia(a,c){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const d=a.g;a.g=null,c||et(a,"ready");try{d.onreadystatechange=null}catch{}}}t.isActive=function(){return!!this.g};function Sn(a){return a.g?a.g.readyState:0}t.ca=function(){try{return Sn(this)>2?this.g.status:-1}catch{return-1}},t.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},t.La=function(a){if(this.g){var c=this.g.responseText;return a&&c.indexOf(a)==0&&(c=c.substring(a.length)),NE(c)}};function kp(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function JE(a){const c={};a=(a.g&&Sn(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let p=0;p<a.length;p++){if(T(a[p]))continue;var d=bE(a[p]);const C=d[0];if(d=d[1],typeof d!="string")continue;d=d.trim();const D=c[C]||[];c[C]=D,D.push(d)}Au(c,function(p){return p.join(", ")})}t.ya=function(){return this.o},t.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function ys(a,c,d){return d&&d.internalChannelParams&&d.internalChannelParams[a]||c}function Rp(a){this.za=0,this.i=[],this.j=new as,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=ys("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=ys("baseRetryDelayMs",5e3,a),this.Za=ys("retryDelaySeedMs",1e4,a),this.Ta=ys("forwardChannelMaxRetries",2,a),this.va=ys("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new up(a&&a.concurrentRequestLimit),this.Ba=new QE,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}t=Rp.prototype,t.ka=8,t.I=1,t.connect=function(a,c,d,p){tt(0),this.W=a,this.H=c||{},d&&p!==void 0&&(this.H.OSID=d,this.H.OAID=p),this.F=this.X,this.J=bp(this,null,this.W),oa(this)};function $u(a){if(Cp(a),a.I==3){var c=a.V++,d=Mt(a.J);if(he(d,"SID",a.M),he(d,"RID",c),he(d,"TYPE","terminate"),_s(a,d),c=new Tn(a,a.j,c),c.M=2,c.A=na(Mt(d)),d=!1,o.navigator&&o.navigator.sendBeacon)try{d=o.navigator.sendBeacon(c.A.toString(),"")}catch{}!d&&o.Image&&(new Image().src=c.A,d=!0),d||(c.g=Lp(c.j,null),c.g.ea(c.A)),c.F=Date.now(),ta(c)}Mp(a)}function sa(a){a.g&&(Hu(a),a.g.cancel(),a.g=null)}function Cp(a){sa(a),a.v&&(o.clearTimeout(a.v),a.v=null),aa(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function oa(a){if(!cp(a.h)&&!a.m){a.m=!0;var c=a.Ea;F||m(),b||(F(),b=!0),w.add(c,a),a.D=0}}function ZE(a,c){return hp(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=c.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=os(h(a.Ea,a,c),xp(a,a.D)),a.D++,!0)}t.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const C=new Tn(this,this.j,a);let D=this.o;if(this.U&&(D?(D=B(D),J(D,this.U)):D=this.U),this.u!==null||this.R||(C.J=D,D=null),this.S)e:{for(var c=0,d=0;d<this.i.length;d++){t:{var p=this.i[d];if("__data__"in p.map&&(p=p.map.__data__,typeof p=="string")){p=p.length;break t}p=void 0}if(p===void 0)break;if(c+=p,c>4096){c=d;break e}if(c===4096||d===this.i.length-1){c=d+1;break e}}c=1e3}else c=1e3;c=Np(this,C,c),d=Mt(this.J),he(d,"RID",a),he(d,"CVER",22),this.G&&he(d,"X-HTTP-Session-Id",this.G),_s(this,d),D&&(this.R?c="headers="+ls(Tp(D))+"&"+c:this.u&&Bu(d,this.u,D)),Uu(this.h,C),this.Ra&&he(d,"TYPE","init"),this.S?(he(d,"$req",c),he(d,"SID","null"),C.U=!0,xu(C,d,null)):xu(C,d,c),this.I=2}}else this.I==3&&(a?Pp(this,a):this.i.length==0||cp(this.h)||Pp(this))};function Pp(a,c){var d;c?d=c.l:d=a.V++;const p=Mt(a.J);he(p,"SID",a.M),he(p,"RID",d),he(p,"AID",a.K),_s(a,p),a.u&&a.o&&Bu(p,a.u,a.o),d=new Tn(a,a.j,d,a.D+1),a.u===null&&(d.J=a.o),c&&(a.i=c.G.concat(a.i)),c=Np(a,d,1e3),d.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Uu(a.h,d),xu(d,p,c)}function _s(a,c){a.H&&wn(a.H,function(d,p){he(c,p,d)}),a.l&&wn({},function(d,p){he(c,p,d)})}function Np(a,c,d){d=Math.min(a.i.length,d);const p=a.l?h(a.l.Ka,a.l,a):null;e:{var C=a.i;let Z=-1;for(;;){const De=["count="+d];Z==-1?d>0?(Z=C[0].g,De.push("ofs="+Z)):Z=0:De.push("ofs="+Z);let ae=!0;for(let xe=0;xe<d;xe++){var D=C[xe].g;const bt=C[xe].map;if(D-=Z,D<0)Z=Math.max(0,C[xe].g-100),ae=!1;else try{D="req"+D+"_"||"";try{var U=bt instanceof Map?bt:Object.entries(bt);for(const[Ir,kn]of U){let Rn=kn;l(kn)&&(Rn=Pu(kn)),De.push(D+Ir+"="+encodeURIComponent(Rn))}}catch(Ir){throw De.push(D+"type="+encodeURIComponent("_badmap")),Ir}}catch{p&&p(bt)}}if(ae){U=De.join("&");break e}}U=void 0}return a=a.i.splice(0,d),c.G=a,U}function Dp(a){if(!a.g&&!a.v){a.Y=1;var c=a.Da;F||m(),b||(F(),b=!0),w.add(c,a),a.A=0}}function zu(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=os(h(a.Da,a),xp(a,a.A)),a.A++,!0)}t.Da=function(){if(this.v=null,Vp(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=os(h(this.Wa,this),a)}},t.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,tt(10),sa(this),Vp(this))};function Hu(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function Vp(a){a.g=new Tn(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var c=Mt(a.na);he(c,"RID","rpc"),he(c,"SID",a.M),he(c,"AID",a.K),he(c,"CI",a.F?"0":"1"),!a.F&&a.ia&&he(c,"TO",a.ia),he(c,"TYPE","xmlhttp"),_s(a,c),a.u&&a.o&&Bu(c,a.u,a.o),a.O&&(a.g.H=a.O);var d=a.g;a=a.ba,d.M=1,d.A=na(Mt(c)),d.u=null,d.R=!0,op(d,a)}t.Va=function(){this.C!=null&&(this.C=null,sa(this),zu(this),tt(19))};function aa(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function Op(a,c){var d=null;if(a.g==c){aa(a),Hu(a),a.g=null;var p=2}else if(Lu(a.h,c))d=c.G,dp(a.h,c),p=1;else return;if(a.I!=0){if(c.o)if(p==1){d=c.u?c.u.length:0,c=Date.now()-c.F;var C=a.D;p=Zo(),et(p,new tp(p,d)),oa(a)}else Dp(a);else if(C=c.m,C==3||C==0&&c.X>0||!(p==1&&ZE(a,c)||p==2&&zu(a)))switch(d&&d.length>0&&(c=a.h,c.i=c.i.concat(d)),C){case 1:Tr(a,5);break;case 4:Tr(a,10);break;case 3:Tr(a,6);break;default:Tr(a,2)}}}function xp(a,c){let d=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(d*=2),d*c}function Tr(a,c){if(a.j.info("Error code "+c),c==2){var d=h(a.bb,a),p=a.Ua;const C=!p;p=new In(p||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||cs(p,"https"),na(p),C?GE(p.toString(),d):KE(p.toString(),d)}else tt(2);a.I=0,a.l&&a.l.pa(c),Mp(a),Cp(a)}t.bb=function(a){a?(this.j.info("Successfully pinged google.com"),tt(2)):(this.j.info("Failed to ping google.com"),tt(1))};function Mp(a){if(a.I=0,a.ja=[],a.l){const c=fp(a.h);(c.length!=0||a.i.length!=0)&&(V(a.ja,c),V(a.ja,a.i),a.h.i.length=0,k(a.i),a.i.length=0),a.l.oa()}}function bp(a,c,d){var p=d instanceof In?Mt(d):new In(d);if(p.g!="")c&&(p.g=c+"."+p.g),hs(p,p.u);else{var C=o.location;p=C.protocol,c=c?c+"."+C.hostname:C.hostname,C=+C.port;const D=new In(null);p&&cs(D,p),c&&(D.g=c),C&&hs(D,C),d&&(D.h=d),p=D}return d=a.G,c=a.wa,d&&c&&he(p,d,c),he(p,"VER",a.ka),_s(a,p),p}function Lp(a,c,d){if(c&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=a.Aa&&!a.ma?new _e(new ju({ab:d})):new _e(a.ma),c.Fa(a.L),c}t.isActive=function(){return!!this.l&&this.l.isActive(this)};function Up(){}t=Up.prototype,t.ra=function(){},t.qa=function(){},t.pa=function(){},t.oa=function(){},t.isActive=function(){return!0},t.Ka=function(){};function la(){}la.prototype.g=function(a,c){return new ht(a,c)};function ht(a,c){qe.call(this),this.g=new Rp(c),this.l=a,this.h=c&&c.messageUrlParams||null,a=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(a?a["X-WebChannel-Content-Type"]=c.messageContentType:a={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(a?a["X-WebChannel-Client-Profile"]=c.sa:a={"X-WebChannel-Client-Profile":c.sa}),this.g.U=a,(a=c&&c.Qb)&&!T(a)&&(this.g.u=a),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!T(c)&&(this.g.G=c,a=this.h,a!==null&&c in a&&(a=this.h,c in a&&delete a[c])),this.j=new ri(this)}y(ht,qe),ht.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},ht.prototype.close=function(){$u(this.g)},ht.prototype.o=function(a){var c=this.g;if(typeof a=="string"){var d={};d.__data__=a,a=d}else this.v&&(d={},d.__data__=Pu(a),a=d);c.i.push(new FE(c.Ya++,a)),c.I==3&&oa(c)},ht.prototype.N=function(){this.g.l=null,delete this.j,$u(this.g),delete this.g,ht.Z.N.call(this)};function Fp(a){Nu.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var c=a.__sm__;if(c){e:{for(const d in c){a=d;break e}a=void 0}(this.i=a)&&(a=this.i,c=c!==null&&a in c?c[a]:void 0),this.data=c}else this.data=a}y(Fp,Nu);function jp(){Du.call(this),this.status=1}y(jp,Du);function ri(a){this.g=a}y(ri,Up),ri.prototype.ra=function(){et(this.g,"a")},ri.prototype.qa=function(a){et(this.g,new Fp(a))},ri.prototype.pa=function(a){et(this.g,new jp)},ri.prototype.oa=function(){et(this.g,"b")},la.prototype.createWebChannel=la.prototype.g,ht.prototype.send=ht.prototype.o,ht.prototype.open=ht.prototype.m,ht.prototype.close=ht.prototype.close,R_=function(){return new la},k_=function(){return Zo()},S_=vr,fd={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},ea.NO_ERROR=0,ea.TIMEOUT=8,ea.HTTP_ERROR=6,wl=ea,np.COMPLETE="complete",A_=np,Xf.EventType=is,is.OPEN="a",is.CLOSE="b",is.ERROR="c",is.MESSAGE="d",qe.prototype.listen=qe.prototype.J,vo=Xf,_e.prototype.listenOnce=_e.prototype.K,_e.prototype.getLastError=_e.prototype.Ha,_e.prototype.getLastErrorCode=_e.prototype.ya,_e.prototype.getStatus=_e.prototype.ca,_e.prototype.getResponseJson=_e.prototype.La,_e.prototype.getResponseText=_e.prototype.la,_e.prototype.send=_e.prototype.ea,_e.prototype.setWithCredentials=_e.prototype.Fa,I_=_e}).apply(typeof El!="undefined"?El:typeof self!="undefined"?self:typeof window!="undefined"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xe{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Xe.UNAUTHENTICATED=new Xe(null),Xe.GOOGLE_CREDENTIALS=new Xe("google-credentials-uid"),Xe.FIRST_PARTY=new Xe("first-party-uid"),Xe.MOCK_USER=new Xe("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Mi="12.12.0";function uS(t){Mi=t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zr=new td("@firebase/firestore");function bi(){return zr.logLevel}function z(t,...e){if(zr.logLevel<=ee.DEBUG){const n=e.map(pd);zr.debug(`Firestore (${Mi}): ${t}`,...n)}}function dn(t,...e){if(zr.logLevel<=ee.ERROR){const n=e.map(pd);zr.error(`Firestore (${Mi}): ${t}`,...n)}}function Hr(t,...e){if(zr.logLevel<=ee.WARN){const n=e.map(pd);zr.warn(`Firestore (${Mi}): ${t}`,...n)}}function pd(t){if(typeof t=="string")return t;try{return function(n){return JSON.stringify(n)}(t)}catch{return t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G(t,e,n){let r="Unexpected state";typeof e=="string"?r=e:n=e,C_(t,r,n)}function C_(t,e,n){let r=`FIRESTORE (${Mi}) INTERNAL ASSERTION FAILED: ${e} (ID: ${t.toString(16)})`;if(n!==void 0)try{r+=" CONTEXT: "+JSON.stringify(n)}catch{r+=" CONTEXT: "+n}throw dn(r),new Error(r)}function oe(t,e,n,r){let i="Unexpected state";typeof n=="string"?i=n:r=n,t||C_(e,i,r)}function X(t,e){return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const x={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class j extends Ht{constructor(e,n){super(e,n),this.code=e,this.message=n,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(){this.promise=new Promise((e,n)=>{this.resolve=e,this.reject=n})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class P_{constructor(e,n){this.user=n,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class cS{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,n){e.enqueueRetryable(()=>n(Xe.UNAUTHENTICATED))}shutdown(){}}class hS{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,n){this.changeListener=n,e.enqueueRetryable(()=>n(this.token.user))}shutdown(){this.changeListener=null}}class dS{constructor(e){this.t=e,this.currentUser=Xe.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(e,n){oe(this.o===void 0,42304);let r=this.i;const i=u=>this.i!==r?(r=this.i,n(u)):Promise.resolve();let s=new fn;this.o=()=>{this.i++,this.currentUser=this.u(),s.resolve(),s=new fn,e.enqueueRetryable(()=>i(this.currentUser))};const o=()=>{const u=s;e.enqueueRetryable(async()=>{await u.promise,await i(this.currentUser)})},l=u=>{z("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.o&&(this.auth.addAuthTokenListener(this.o),o())};this.t.onInit(u=>l(u)),setTimeout(()=>{if(!this.auth){const u=this.t.getImmediate({optional:!0});u?l(u):(z("FirebaseAuthCredentialsProvider","Auth not yet detected"),s.resolve(),s=new fn)}},0),o()}getToken(){const e=this.i,n=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(n).then(r=>this.i!==e?(z("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(oe(typeof r.accessToken=="string",31837,{l:r}),new P_(r.accessToken,this.currentUser)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const e=this.auth&&this.auth.getUid();return oe(e===null||typeof e=="string",2055,{h:e}),new Xe(e)}}class fS{constructor(e,n,r){this.P=e,this.T=n,this.I=r,this.type="FirstParty",this.user=Xe.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const e=this.A();return e&&this.R.set("Authorization",e),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class pS{constructor(e,n,r){this.P=e,this.T=n,this.I=r}getToken(){return Promise.resolve(new fS(this.P,this.T,this.I))}start(e,n){e.enqueueRetryable(()=>n(Xe.FIRST_PARTY))}shutdown(){}invalidateToken(){}}class N_{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class mS{constructor(e,n){this.V=n,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,pt(e)&&e.settings.appCheckToken&&(this.p=e.settings.appCheckToken)}start(e,n){oe(this.o===void 0,3512);const r=s=>{s.error!=null&&z("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${s.error.message}`);const o=s.token!==this.m;return this.m=s.token,z("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?n(s.token):Promise.resolve()};this.o=s=>{e.enqueueRetryable(()=>r(s))};const i=s=>{z("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=s,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit(s=>i(s)),setTimeout(()=>{if(!this.appCheck){const s=this.V.getImmediate({optional:!0});s?i(s):z("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}},0)}getToken(){if(this.p)return Promise.resolve(new N_(this.p));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then(n=>n?(oe(typeof n.token=="string",44558,{tokenResult:n}),this.m=n.token,new N_(n.token)):null):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gS(t){const e=typeof self!="undefined"&&(self.crypto||self.msCrypto),n=new Uint8Array(t);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(n);else for(let r=0;r<t;r++)n[r]=Math.floor(256*Math.random());return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class md{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",n=62*Math.floor(256/62);let r="";for(;r.length<20;){const i=gS(40);for(let s=0;s<i.length;++s)r.length<20&&i[s]<n&&(r+=e.charAt(i[s]%62))}return r}}function te(t,e){return t<e?-1:t>e?1:0}function gd(t,e){const n=Math.min(t.length,e.length);for(let r=0;r<n;r++){const i=t.charAt(r),s=e.charAt(r);if(i!==s)return yd(i)===yd(s)?te(i,s):yd(i)?1:-1}return te(t.length,e.length)}const yS=55296,_S=57343;function yd(t){const e=t.charCodeAt(0);return e>=yS&&e<=_S}function Li(t,e,n){return t.length===e.length&&t.every((r,i)=>n(r,e[i]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const D_="__name__";class Wt{constructor(e,n,r){n===void 0?n=0:n>e.length&&G(637,{offset:n,range:e.length}),r===void 0?r=e.length-n:r>e.length-n&&G(1746,{length:r,range:e.length-n}),this.segments=e,this.offset=n,this.len=r}get length(){return this.len}isEqual(e){return Wt.comparator(this,e)===0}child(e){const n=this.segments.slice(this.offset,this.limit());return e instanceof Wt?e.forEach(r=>{n.push(r)}):n.push(e),this.construct(n)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let n=0;n<this.length;n++)if(this.get(n)!==e.get(n))return!1;return!0}forEach(e){for(let n=this.offset,r=this.limit();n<r;n++)e(this.segments[n])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,n){const r=Math.min(e.length,n.length);for(let i=0;i<r;i++){const s=Wt.compareSegments(e.get(i),n.get(i));if(s!==0)return s}return te(e.length,n.length)}static compareSegments(e,n){const r=Wt.isNumericId(e),i=Wt.isNumericId(n);return r&&!i?-1:!r&&i?1:r&&i?Wt.extractNumericId(e).compare(Wt.extractNumericId(n)):gd(e,n)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return Xn.fromString(e.substring(4,e.length-2))}}class ce extends Wt{construct(e,n,r){return new ce(e,n,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const n=[];for(const r of e){if(r.indexOf("//")>=0)throw new j(x.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);n.push(...r.split("/").filter(i=>i.length>0))}return new ce(n)}static emptyPath(){return new ce([])}}const vS=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class Be extends Wt{construct(e,n,r){return new Be(e,n,r)}static isValidIdentifier(e){return vS.test(e)}canonicalString(){return this.toArray().map(e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),Be.isValidIdentifier(e)||(e="`"+e+"`"),e)).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===D_}static keyField(){return new Be([D_])}static fromServerFormat(e){const n=[];let r="",i=0;const s=()=>{if(r.length===0)throw new j(x.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);n.push(r),r=""};let o=!1;for(;i<e.length;){const l=e[i];if(l==="\\"){if(i+1===e.length)throw new j(x.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[i+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new j(x.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,i+=2}else l==="`"?(o=!o,i++):l!=="."||o?(r+=l,i++):(s(),i++)}if(s(),o)throw new j(x.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new Be(n)}static emptyPath(){return new Be([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class q{constructor(e){this.path=e}static fromPath(e){return new q(ce.fromString(e))}static fromName(e){return new q(ce.fromString(e).popFirst(5))}static empty(){return new q(ce.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&ce.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,n){return ce.comparator(e.path,n.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new q(new ce(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function V_(t,e,n){if(!n)throw new j(x.INVALID_ARGUMENT,`Function ${t}() cannot be called with an empty ${e}.`)}function ES(t,e,n,r){if(e===!0&&r===!0)throw new j(x.INVALID_ARGUMENT,`${t} and ${n} cannot be used together.`)}function O_(t){if(!q.isDocumentKey(t))throw new j(x.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${t} has ${t.length}.`)}function x_(t){if(q.isDocumentKey(t))throw new j(x.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${t} has ${t.length}.`)}function M_(t){return typeof t=="object"&&t!==null&&(Object.getPrototypeOf(t)===Object.prototype||Object.getPrototypeOf(t)===null)}function Tl(t){if(t===void 0)return"undefined";if(t===null)return"null";if(typeof t=="string")return t.length>20&&(t=`${t.substring(0,20)}...`),JSON.stringify(t);if(typeof t=="number"||typeof t=="boolean")return""+t;if(typeof t=="object"){if(t instanceof Array)return"an array";{const e=function(r){return r.constructor?r.constructor.name:null}(t);return e?`a custom ${e} object`:"an object"}}return typeof t=="function"?"a function":G(12329,{type:typeof t})}function At(t,e){if("_delegate"in t&&(t=t._delegate),!(t instanceof e)){if(e.name===t.constructor.name)throw new j(x.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const n=Tl(t);throw new j(x.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${n}`)}}return t}function wS(t,e){if(e<=0)throw new j(x.INVALID_ARGUMENT,`Function ${t}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Re(t,e){const n={typeString:t};return e&&(n.value=e),n}function Eo(t,e){if(!M_(t))throw new j(x.INVALID_ARGUMENT,"JSON must be an object");let n;for(const r in e)if(e[r]){const i=e[r].typeString,s="value"in e[r]?{value:e[r].value}:void 0;if(!(r in t)){n=`JSON missing required field: '${r}'`;break}const o=t[r];if(i&&typeof o!==i){n=`JSON field '${r}' must be a ${i}.`;break}if(s!==void 0&&o!==s.value){n=`Expected '${r}' field to equal '${s.value}'`;break}}if(n)throw new j(x.INVALID_ARGUMENT,n);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b_=-62135596800,L_=1e6;class pe{static now(){return pe.fromMillis(Date.now())}static fromDate(e){return pe.fromMillis(e.getTime())}static fromMillis(e){const n=Math.floor(e/1e3),r=Math.floor((e-1e3*n)*L_);return new pe(n,r)}constructor(e,n){if(this.seconds=e,this.nanoseconds=n,n<0)throw new j(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(n>=1e9)throw new j(x.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+n);if(e<b_)throw new j(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new j(x.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/L_}_compareTo(e){return this.seconds===e.seconds?te(this.nanoseconds,e.nanoseconds):te(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:pe._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Eo(e,pe._jsonSchema))return new pe(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-b_;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}pe._jsonSchemaVersion="firestore/timestamp/1.0",pe._jsonSchema={type:Re("string",pe._jsonSchemaVersion),seconds:Re("number"),nanoseconds:Re("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y{static fromTimestamp(e){return new Y(e)}static min(){return new Y(new pe(0,0))}static max(){return new Y(new pe(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wo=-1;function TS(t,e){const n=t.toTimestamp().seconds,r=t.toTimestamp().nanoseconds+1,i=Y.fromTimestamp(r===1e9?new pe(n+1,0):new pe(n,r));return new Jn(i,q.empty(),e)}function IS(t){return new Jn(t.readTime,t.key,wo)}class Jn{constructor(e,n,r){this.readTime=e,this.documentKey=n,this.largestBatchId=r}static min(){return new Jn(Y.min(),q.empty(),wo)}static max(){return new Jn(Y.max(),q.empty(),wo)}}function AS(t,e){let n=t.readTime.compareTo(e.readTime);return n!==0?n:(n=q.comparator(t.documentKey,e.documentKey),n!==0?n:te(t.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SS="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class kS{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach(e=>e())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ui(t){if(t.code!==x.FAILED_PRECONDITION||t.message!==SS)throw t;z("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e(n=>{this.isDone=!0,this.result=n,this.nextCallback&&this.nextCallback(n)},n=>{this.isDone=!0,this.error=n,this.catchCallback&&this.catchCallback(n)})}catch(e){return this.next(void 0,e)}next(e,n){return this.callbackAttached&&G(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(n,this.error):this.wrapSuccess(e,this.result):new M((r,i)=>{this.nextCallback=s=>{this.wrapSuccess(e,s).next(r,i)},this.catchCallback=s=>{this.wrapFailure(n,s).next(r,i)}})}toPromise(){return new Promise((e,n)=>{this.next(e,n)})}wrapUserFunction(e){try{const n=e();return n instanceof M?n:M.resolve(n)}catch(n){return M.reject(n)}}wrapSuccess(e,n){return e?this.wrapUserFunction(()=>e(n)):M.resolve(n)}wrapFailure(e,n){return e?this.wrapUserFunction(()=>e(n)):M.reject(n)}static resolve(e){return new M((n,r)=>{n(e)})}static reject(e){return new M((n,r)=>{r(e)})}static waitFor(e){return new M((n,r)=>{let i=0,s=0,o=!1;e.forEach(l=>{++i,l.next(()=>{++s,o&&s===i&&n()},u=>r(u))}),o=!0,s===i&&n()})}static or(e){let n=M.resolve(!1);for(const r of e)n=n.next(i=>i?M.resolve(i):r());return n}static forEach(e,n){const r=[];return e.forEach((i,s)=>{r.push(n.call(this,i,s))}),this.waitFor(r)}static mapArray(e,n){return new M((r,i)=>{const s=e.length,o=new Array(s);let l=0;for(let u=0;u<s;u++){const h=u;n(e[h]).next(f=>{o[h]=f,++l,l===s&&r(o)},f=>i(f))}})}static doWhile(e,n){return new M((r,i)=>{const s=()=>{e()===!0?n().next(()=>{s()},i):r()};s()})}}function RS(t){const e=t.match(/Android ([\d.]+)/i),n=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(n)}function Fi(t){return t.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Il{constructor(e,n){this.previousValue=e,n&&(n.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>n.writeSequenceNumber(r))}ae(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.ue&&this.ue(e),e}}Il.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _d=-1;function Al(t){return t==null}function Sl(t){return t===0&&1/t==-1/0}function CS(t){return typeof t=="number"&&Number.isInteger(t)&&!Sl(t)&&t<=Number.MAX_SAFE_INTEGER&&t>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const U_="";function PS(t){let e="";for(let n=0;n<t.length;n++)e.length>0&&(e=F_(e)),e=NS(t.get(n),e);return F_(e)}function NS(t,e){let n=e;const r=t.length;for(let i=0;i<r;i++){const s=t.charAt(i);switch(s){case"\0":n+="";break;case U_:n+="";break;default:n+=s}}return n}function F_(t){return t+U_+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j_(t){let e=0;for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e++;return e}function Zn(t,e){for(const n in t)Object.prototype.hasOwnProperty.call(t,n)&&e(n,t[n])}function B_(t){for(const e in t)if(Object.prototype.hasOwnProperty.call(t,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ye{constructor(e,n){this.comparator=e,this.root=n||$e.EMPTY}insert(e,n){return new ye(this.comparator,this.root.insert(e,n,this.comparator).copy(null,null,$e.BLACK,null,null))}remove(e){return new ye(this.comparator,this.root.remove(e,this.comparator).copy(null,null,$e.BLACK,null,null))}get(e){let n=this.root;for(;!n.isEmpty();){const r=this.comparator(e,n.key);if(r===0)return n.value;r<0?n=n.left:r>0&&(n=n.right)}return null}indexOf(e){let n=0,r=this.root;for(;!r.isEmpty();){const i=this.comparator(e,r.key);if(i===0)return n+r.left.size;i<0?r=r.left:(n+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal((n,r)=>(e(n,r),!1))}toString(){const e=[];return this.inorderTraversal((n,r)=>(e.push(`${n}:${r}`),!1)),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new kl(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new kl(this.root,e,this.comparator,!1)}getReverseIterator(){return new kl(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new kl(this.root,e,this.comparator,!0)}}class kl{constructor(e,n,r,i){this.isReverse=i,this.nodeStack=[];let s=1;for(;!e.isEmpty();)if(s=n?r(e.key,n):1,n&&i&&(s*=-1),s<0)e=this.isReverse?e.left:e.right;else{if(s===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const n={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return n}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class $e{constructor(e,n,r,i,s){this.key=e,this.value=n,this.color=r!=null?r:$e.RED,this.left=i!=null?i:$e.EMPTY,this.right=s!=null?s:$e.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,n,r,i,s){return new $e(e!=null?e:this.key,n!=null?n:this.value,r!=null?r:this.color,i!=null?i:this.left,s!=null?s:this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,n,r){let i=this;const s=r(e,i.key);return i=s<0?i.copy(null,null,null,i.left.insert(e,n,r),null):s===0?i.copy(null,n,null,null,null):i.copy(null,null,null,null,i.right.insert(e,n,r)),i.fixUp()}removeMin(){if(this.left.isEmpty())return $e.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,n){let r,i=this;if(n(e,i.key)<0)i.left.isEmpty()||i.left.isRed()||i.left.left.isRed()||(i=i.moveRedLeft()),i=i.copy(null,null,null,i.left.remove(e,n),null);else{if(i.left.isRed()&&(i=i.rotateRight()),i.right.isEmpty()||i.right.isRed()||i.right.left.isRed()||(i=i.moveRedRight()),n(e,i.key)===0){if(i.right.isEmpty())return $e.EMPTY;r=i.right.min(),i=i.copy(r.key,r.value,null,null,i.right.removeMin())}i=i.copy(null,null,null,null,i.right.remove(e,n))}return i.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,$e.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,$e.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),n=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,n)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw G(43730,{key:this.key,value:this.value});if(this.right.isRed())throw G(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw G(27949);return e+(this.isRed()?0:1)}}$e.EMPTY=null,$e.RED=!0,$e.BLACK=!1;$e.EMPTY=new class{constructor(){this.size=0}get key(){throw G(57766)}get value(){throw G(16141)}get color(){throw G(16727)}get left(){throw G(29726)}get right(){throw G(36894)}copy(e,n,r,i,s){return this}insert(e,n,r){return new $e(e,n)}remove(e,n){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{constructor(e){this.comparator=e,this.data=new ye(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal((n,r)=>(e(n),!1))}forEachInRange(e,n){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const i=r.getNext();if(this.comparator(i.key,e[1])>=0)return;n(i.key)}}forEachWhile(e,n){let r;for(r=n!==void 0?this.data.getIteratorFrom(n):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const n=this.data.getIteratorFrom(e);return n.hasNext()?n.getNext().key:null}getIterator(){return new $_(this.data.getIterator())}getIteratorFrom(e){return new $_(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let n=this;return n.size<e.size&&(n=e,e=this),e.forEach(r=>{n=n.add(r)}),n}isEqual(e){if(!(e instanceof Oe)||this.size!==e.size)return!1;const n=this.data.getIterator(),r=e.data.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(this.comparator(i,s)!==0)return!1}return!0}toArray(){const e=[];return this.forEach(n=>{e.push(n)}),e}toString(){const e=[];return this.forEach(n=>e.push(n)),"SortedSet("+e.toString()+")"}copy(e){const n=new Oe(this.comparator);return n.data=e,n}}class $_{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mt{constructor(e){this.fields=e,e.sort(Be.comparator)}static empty(){return new mt([])}unionWith(e){let n=new Oe(Be.comparator);for(const r of this.fields)n=n.add(r);for(const r of e)n=n.add(r);return new mt(n.toArray())}covers(e){for(const n of this.fields)if(n.isPrefixOf(e))return!0;return!1}isEqual(e){return Li(this.fields,e.fields,(n,r)=>n.isEqual(r))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class z_ extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{constructor(e){this.binaryString=e}static fromBase64String(e){const n=function(i){try{return atob(i)}catch(s){throw typeof DOMException!="undefined"&&s instanceof DOMException?new z_("Invalid base64 string: "+s):s}}(e);return new ze(n)}static fromUint8Array(e){const n=function(i){let s="";for(let o=0;o<i.length;++o)s+=String.fromCharCode(i[o]);return s}(e);return new ze(n)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return function(n){return btoa(n)}(this.binaryString)}toUint8Array(){return function(n){const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return te(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}ze.EMPTY_BYTE_STRING=new ze("");const DS=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function er(t){if(oe(!!t,39018),typeof t=="string"){let e=0;const n=DS.exec(t);if(oe(!!n,46558,{timestamp:t}),n[1]){let i=n[1];i=(i+"000000000").substr(0,9),e=Number(i)}const r=new Date(t);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:Se(t.seconds),nanos:Se(t.nanos)}}function Se(t){return typeof t=="number"?t:typeof t=="string"?Number(t):0}function tr(t){return typeof t=="string"?ze.fromBase64String(t):ze.fromUint8Array(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const H_="server_timestamp",q_="__type__",W_="__previous_value__",G_="__local_write_time__";function vd(t){var n,r;return((r=(((n=t==null?void 0:t.mapValue)==null?void 0:n.fields)||{})[q_])==null?void 0:r.stringValue)===H_}function Rl(t){const e=t.mapValue.fields[W_];return vd(e)?Rl(e):e}function To(t){const e=er(t.mapValue.fields[G_].timestampValue);return new pe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class VS{constructor(e,n,r,i,s,o,l,u,h,f,y){this.databaseId=e,this.appId=n,this.persistenceKey=r,this.host=i,this.ssl=s,this.forceLongPolling=o,this.autoDetectLongPolling=l,this.longPollingOptions=u,this.useFetchStreams=h,this.isUsingEmulator=f,this.apiKey=y}}const Cl="(default)";class Io{constructor(e,n){this.projectId=e,this.database=n||Cl}static empty(){return new Io("","")}get isDefaultDatabase(){return this.database===Cl}isEqual(e){return e instanceof Io&&e.projectId===this.projectId&&e.database===this.database}}function OS(t,e){if(!Object.prototype.hasOwnProperty.apply(t.options,["projectId"]))throw new j(x.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Io(t.options.projectId,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K_="__type__",Q_="__max__",Pl={mapValue:{fields:{__type__:{stringValue:Q_}}}},Y_="__vector__",Nl="value";function nr(t){return"nullValue"in t?0:"booleanValue"in t?1:"integerValue"in t||"doubleValue"in t?2:"timestampValue"in t?3:"stringValue"in t?5:"bytesValue"in t?6:"referenceValue"in t?7:"geoPointValue"in t?8:"arrayValue"in t?9:"mapValue"in t?vd(t)?4:MS(t)?9007199254740991:xS(t)?10:11:G(28295,{value:t})}function Gt(t,e){if(t===e)return!0;const n=nr(t);if(n!==nr(e))return!1;switch(n){case 0:case 9007199254740991:return!0;case 1:return t.booleanValue===e.booleanValue;case 4:return To(t).isEqual(To(e));case 3:return function(i,s){if(typeof i.timestampValue=="string"&&typeof s.timestampValue=="string"&&i.timestampValue.length===s.timestampValue.length)return i.timestampValue===s.timestampValue;const o=er(i.timestampValue),l=er(s.timestampValue);return o.seconds===l.seconds&&o.nanos===l.nanos}(t,e);case 5:return t.stringValue===e.stringValue;case 6:return function(i,s){return tr(i.bytesValue).isEqual(tr(s.bytesValue))}(t,e);case 7:return t.referenceValue===e.referenceValue;case 8:return function(i,s){return Se(i.geoPointValue.latitude)===Se(s.geoPointValue.latitude)&&Se(i.geoPointValue.longitude)===Se(s.geoPointValue.longitude)}(t,e);case 2:return function(i,s){if("integerValue"in i&&"integerValue"in s)return Se(i.integerValue)===Se(s.integerValue);if("doubleValue"in i&&"doubleValue"in s){const o=Se(i.doubleValue),l=Se(s.doubleValue);return o===l?Sl(o)===Sl(l):isNaN(o)&&isNaN(l)}return!1}(t,e);case 9:return Li(t.arrayValue.values||[],e.arrayValue.values||[],Gt);case 10:case 11:return function(i,s){const o=i.mapValue.fields||{},l=s.mapValue.fields||{};if(j_(o)!==j_(l))return!1;for(const u in o)if(o.hasOwnProperty(u)&&(l[u]===void 0||!Gt(o[u],l[u])))return!1;return!0}(t,e);default:return G(52216,{left:t})}}function Ao(t,e){return(t.values||[]).find(n=>Gt(n,e))!==void 0}function ji(t,e){if(t===e)return 0;const n=nr(t),r=nr(e);if(n!==r)return te(n,r);switch(n){case 0:case 9007199254740991:return 0;case 1:return te(t.booleanValue,e.booleanValue);case 2:return function(s,o){const l=Se(s.integerValue||s.doubleValue),u=Se(o.integerValue||o.doubleValue);return l<u?-1:l>u?1:l===u?0:isNaN(l)?isNaN(u)?0:-1:1}(t,e);case 3:return X_(t.timestampValue,e.timestampValue);case 4:return X_(To(t),To(e));case 5:return gd(t.stringValue,e.stringValue);case 6:return function(s,o){const l=tr(s),u=tr(o);return l.compareTo(u)}(t.bytesValue,e.bytesValue);case 7:return function(s,o){const l=s.split("/"),u=o.split("/");for(let h=0;h<l.length&&h<u.length;h++){const f=te(l[h],u[h]);if(f!==0)return f}return te(l.length,u.length)}(t.referenceValue,e.referenceValue);case 8:return function(s,o){const l=te(Se(s.latitude),Se(o.latitude));return l!==0?l:te(Se(s.longitude),Se(o.longitude))}(t.geoPointValue,e.geoPointValue);case 9:return J_(t.arrayValue,e.arrayValue);case 10:return function(s,o){var g,k,V,O;const l=s.fields||{},u=o.fields||{},h=(g=l[Nl])==null?void 0:g.arrayValue,f=(k=u[Nl])==null?void 0:k.arrayValue,y=te(((V=h==null?void 0:h.values)==null?void 0:V.length)||0,((O=f==null?void 0:f.values)==null?void 0:O.length)||0);return y!==0?y:J_(h,f)}(t.mapValue,e.mapValue);case 11:return function(s,o){if(s===Pl.mapValue&&o===Pl.mapValue)return 0;if(s===Pl.mapValue)return 1;if(o===Pl.mapValue)return-1;const l=s.fields||{},u=Object.keys(l),h=o.fields||{},f=Object.keys(h);u.sort(),f.sort();for(let y=0;y<u.length&&y<f.length;++y){const g=gd(u[y],f[y]);if(g!==0)return g;const k=ji(l[u[y]],h[f[y]]);if(k!==0)return k}return te(u.length,f.length)}(t.mapValue,e.mapValue);default:throw G(23264,{he:n})}}function X_(t,e){if(typeof t=="string"&&typeof e=="string"&&t.length===e.length)return te(t,e);const n=er(t),r=er(e),i=te(n.seconds,r.seconds);return i!==0?i:te(n.nanos,r.nanos)}function J_(t,e){const n=t.values||[],r=e.values||[];for(let i=0;i<n.length&&i<r.length;++i){const s=ji(n[i],r[i]);if(s)return s}return te(n.length,r.length)}function Bi(t){return Ed(t)}function Ed(t){return"nullValue"in t?"null":"booleanValue"in t?""+t.booleanValue:"integerValue"in t?""+t.integerValue:"doubleValue"in t?""+t.doubleValue:"timestampValue"in t?function(n){const r=er(n);return`time(${r.seconds},${r.nanos})`}(t.timestampValue):"stringValue"in t?t.stringValue:"bytesValue"in t?function(n){return tr(n).toBase64()}(t.bytesValue):"referenceValue"in t?function(n){return q.fromName(n).toString()}(t.referenceValue):"geoPointValue"in t?function(n){return`geo(${n.latitude},${n.longitude})`}(t.geoPointValue):"arrayValue"in t?function(n){let r="[",i=!0;for(const s of n.values||[])i?i=!1:r+=",",r+=Ed(s);return r+"]"}(t.arrayValue):"mapValue"in t?function(n){const r=Object.keys(n.fields||{}).sort();let i="{",s=!0;for(const o of r)s?s=!1:i+=",",i+=`${o}:${Ed(n.fields[o])}`;return i+"}"}(t.mapValue):G(61005,{value:t})}function Dl(t){switch(nr(t)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=Rl(t);return e?16+Dl(e):16;case 5:return 2*t.stringValue.length;case 6:return tr(t.bytesValue).approximateByteSize();case 7:return t.referenceValue.length;case 9:return function(r){return(r.values||[]).reduce((i,s)=>i+Dl(s),0)}(t.arrayValue);case 10:case 11:return function(r){let i=0;return Zn(r.fields,(s,o)=>{i+=s.length+Dl(o)}),i}(t.mapValue);default:throw G(13486,{value:t})}}function Z_(t,e){return{referenceValue:`projects/${t.projectId}/databases/${t.database}/documents/${e.path.canonicalString()}`}}function wd(t){return!!t&&"integerValue"in t}function Td(t){return!!t&&"arrayValue"in t}function e0(t){return!!t&&"nullValue"in t}function t0(t){return!!t&&"doubleValue"in t&&isNaN(Number(t.doubleValue))}function Vl(t){return!!t&&"mapValue"in t}function xS(t){var n,r;return((r=(((n=t==null?void 0:t.mapValue)==null?void 0:n.fields)||{})[K_])==null?void 0:r.stringValue)===Y_}function So(t){if(t.geoPointValue)return{geoPointValue:se({},t.geoPointValue)};if(t.timestampValue&&typeof t.timestampValue=="object")return{timestampValue:se({},t.timestampValue)};if(t.mapValue){const e={mapValue:{fields:{}}};return Zn(t.mapValue.fields,(n,r)=>e.mapValue.fields[n]=So(r)),e}if(t.arrayValue){const e={arrayValue:{values:[]}};for(let n=0;n<(t.arrayValue.values||[]).length;++n)e.arrayValue.values[n]=So(t.arrayValue.values[n]);return e}return se({},t)}function MS(t){return(((t.mapValue||{}).fields||{}).__type__||{}).stringValue===Q_}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ut{constructor(e){this.value=e}static empty(){return new ut({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let n=this.value;for(let r=0;r<e.length-1;++r)if(n=(n.mapValue.fields||{})[e.get(r)],!Vl(n))return null;return n=(n.mapValue.fields||{})[e.lastSegment()],n||null}}set(e,n){this.getFieldsMap(e.popLast())[e.lastSegment()]=So(n)}setAll(e){let n=Be.emptyPath(),r={},i=[];e.forEach((o,l)=>{if(!n.isImmediateParentOf(l)){const u=this.getFieldsMap(n);this.applyChanges(u,r,i),r={},i=[],n=l.popLast()}o?r[l.lastSegment()]=So(o):i.push(l.lastSegment())});const s=this.getFieldsMap(n);this.applyChanges(s,r,i)}delete(e){const n=this.field(e.popLast());Vl(n)&&n.mapValue.fields&&delete n.mapValue.fields[e.lastSegment()]}isEqual(e){return Gt(this.value,e.value)}getFieldsMap(e){let n=this.value;n.mapValue.fields||(n.mapValue={fields:{}});for(let r=0;r<e.length;++r){let i=n.mapValue.fields[e.get(r)];Vl(i)&&i.mapValue.fields||(i={mapValue:{fields:{}}},n.mapValue.fields[e.get(r)]=i),n=i}return n.mapValue.fields}applyChanges(e,n,r){Zn(n,(i,s)=>e[i]=s);for(const i of r)delete e[i]}clone(){return new ut(So(this.value))}}function n0(t){const e=[];return Zn(t.fields,(n,r)=>{const i=new Be([n]);if(Vl(r)){const s=n0(r.mapValue).fields;if(s.length===0)e.push(i);else for(const o of s)e.push(i.child(o))}else e.push(i)}),new mt(e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Je{constructor(e,n,r,i,s,o,l){this.key=e,this.documentType=n,this.version=r,this.readTime=i,this.createTime=s,this.data=o,this.documentState=l}static newInvalidDocument(e){return new Je(e,0,Y.min(),Y.min(),Y.min(),ut.empty(),0)}static newFoundDocument(e,n,r,i){return new Je(e,1,n,Y.min(),r,i,0)}static newNoDocument(e,n){return new Je(e,2,n,Y.min(),Y.min(),ut.empty(),0)}static newUnknownDocument(e,n){return new Je(e,3,n,Y.min(),Y.min(),ut.empty(),2)}convertToFoundDocument(e,n){return!this.createTime.isEqual(Y.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=n,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=ut.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=ut.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=Y.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof Je&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new Je(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ol{constructor(e,n){this.position=e,this.inclusive=n}}function r0(t,e,n){let r=0;for(let i=0;i<t.position.length;i++){const s=e[i],o=t.position[i];if(s.field.isKeyField()?r=q.comparator(q.fromName(o.referenceValue),n.key):r=ji(o,n.data.field(s.field)),s.dir==="desc"&&(r*=-1),r!==0)break}return r}function i0(t,e){if(t===null)return e===null;if(e===null||t.inclusive!==e.inclusive||t.position.length!==e.position.length)return!1;for(let n=0;n<t.position.length;n++)if(!Gt(t.position[n],e.position[n]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ko{constructor(e,n="asc"){this.field=e,this.dir=n}}function bS(t,e){return t.dir===e.dir&&t.field.isEqual(e.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class s0{}class Ce extends s0{constructor(e,n,r){super(),this.field=e,this.op=n,this.value=r}static create(e,n,r){return e.isKeyField()?n==="in"||n==="not-in"?this.createKeyFieldInFilter(e,n,r):new US(e,n,r):n==="array-contains"?new BS(e,r):n==="in"?new $S(e,r):n==="not-in"?new zS(e,r):n==="array-contains-any"?new HS(e,r):new Ce(e,n,r)}static createKeyFieldInFilter(e,n,r){return n==="in"?new FS(e,r):new jS(e,r)}matches(e){const n=e.data.field(this.field);return this.op==="!="?n!==null&&n.nullValue===void 0&&this.matchesComparison(ji(n,this.value)):n!==null&&nr(this.value)===nr(n)&&this.matchesComparison(ji(n,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return G(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Vt extends s0{constructor(e,n){super(),this.filters=e,this.op=n,this.Pe=null}static create(e,n){return new Vt(e,n)}matches(e){return o0(this)?this.filters.find(n=>!n.matches(e))===void 0:this.filters.find(n=>n.matches(e))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce((e,n)=>e.concat(n.getFlattenedFilters()),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function o0(t){return t.op==="and"}function a0(t){return LS(t)&&o0(t)}function LS(t){for(const e of t.filters)if(e instanceof Vt)return!1;return!0}function Id(t){if(t instanceof Ce)return t.field.canonicalString()+t.op.toString()+Bi(t.value);if(a0(t))return t.filters.map(e=>Id(e)).join(",");{const e=t.filters.map(n=>Id(n)).join(",");return`${t.op}(${e})`}}function l0(t,e){return t instanceof Ce?function(r,i){return i instanceof Ce&&r.op===i.op&&r.field.isEqual(i.field)&&Gt(r.value,i.value)}(t,e):t instanceof Vt?function(r,i){return i instanceof Vt&&r.op===i.op&&r.filters.length===i.filters.length?r.filters.reduce((s,o,l)=>s&&l0(o,i.filters[l]),!0):!1}(t,e):void G(19439)}function u0(t){return t instanceof Ce?function(n){return`${n.field.canonicalString()} ${n.op} ${Bi(n.value)}`}(t):t instanceof Vt?function(n){return n.op.toString()+" {"+n.getFilters().map(u0).join(" ,")+"}"}(t):"Filter"}class US extends Ce{constructor(e,n,r){super(e,n,r),this.key=q.fromName(r.referenceValue)}matches(e){const n=q.comparator(e.key,this.key);return this.matchesComparison(n)}}class FS extends Ce{constructor(e,n){super(e,"in",n),this.keys=c0("in",n)}matches(e){return this.keys.some(n=>n.isEqual(e.key))}}class jS extends Ce{constructor(e,n){super(e,"not-in",n),this.keys=c0("not-in",n)}matches(e){return!this.keys.some(n=>n.isEqual(e.key))}}function c0(t,e){var n;return(((n=e.arrayValue)==null?void 0:n.values)||[]).map(r=>q.fromName(r.referenceValue))}class BS extends Ce{constructor(e,n){super(e,"array-contains",n)}matches(e){const n=e.data.field(this.field);return Td(n)&&Ao(n.arrayValue,this.value)}}class $S extends Ce{constructor(e,n){super(e,"in",n)}matches(e){const n=e.data.field(this.field);return n!==null&&Ao(this.value.arrayValue,n)}}class zS extends Ce{constructor(e,n){super(e,"not-in",n)}matches(e){if(Ao(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const n=e.data.field(this.field);return n!==null&&n.nullValue===void 0&&!Ao(this.value.arrayValue,n)}}class HS extends Ce{constructor(e,n){super(e,"array-contains-any",n)}matches(e){const n=e.data.field(this.field);return!(!Td(n)||!n.arrayValue.values)&&n.arrayValue.values.some(r=>Ao(this.value.arrayValue,r))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qS{constructor(e,n=null,r=[],i=[],s=null,o=null,l=null){this.path=e,this.collectionGroup=n,this.orderBy=r,this.filters=i,this.limit=s,this.startAt=o,this.endAt=l,this.Te=null}}function h0(t,e=null,n=[],r=[],i=null,s=null,o=null){return new qS(t,e,n,r,i,s,o)}function Ad(t){const e=X(t);if(e.Te===null){let n=e.path.canonicalString();e.collectionGroup!==null&&(n+="|cg:"+e.collectionGroup),n+="|f:",n+=e.filters.map(r=>Id(r)).join(","),n+="|ob:",n+=e.orderBy.map(r=>function(s){return s.field.canonicalString()+s.dir}(r)).join(","),Al(e.limit)||(n+="|l:",n+=e.limit),e.startAt&&(n+="|lb:",n+=e.startAt.inclusive?"b:":"a:",n+=e.startAt.position.map(r=>Bi(r)).join(",")),e.endAt&&(n+="|ub:",n+=e.endAt.inclusive?"a:":"b:",n+=e.endAt.position.map(r=>Bi(r)).join(",")),e.Te=n}return e.Te}function Sd(t,e){if(t.limit!==e.limit||t.orderBy.length!==e.orderBy.length)return!1;for(let n=0;n<t.orderBy.length;n++)if(!bS(t.orderBy[n],e.orderBy[n]))return!1;if(t.filters.length!==e.filters.length)return!1;for(let n=0;n<t.filters.length;n++)if(!l0(t.filters[n],e.filters[n]))return!1;return t.collectionGroup===e.collectionGroup&&!!t.path.isEqual(e.path)&&!!i0(t.startAt,e.startAt)&&i0(t.endAt,e.endAt)}function kd(t){return q.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $i{constructor(e,n=null,r=[],i=[],s=null,o="F",l=null,u=null){this.path=e,this.collectionGroup=n,this.explicitOrderBy=r,this.filters=i,this.limit=s,this.limitType=o,this.startAt=l,this.endAt=u,this.Ee=null,this.Ie=null,this.Re=null,this.startAt,this.endAt}}function WS(t,e,n,r,i,s,o,l){return new $i(t,e,n,r,i,s,o,l)}function xl(t){return new $i(t)}function d0(t){return t.filters.length===0&&t.limit===null&&t.startAt==null&&t.endAt==null&&(t.explicitOrderBy.length===0||t.explicitOrderBy.length===1&&t.explicitOrderBy[0].field.isKeyField())}function GS(t){return q.isDocumentKey(t.path)&&t.collectionGroup===null&&t.filters.length===0}function f0(t){return t.collectionGroup!==null}function Ro(t){const e=X(t);if(e.Ee===null){e.Ee=[];const n=new Set;for(const s of e.explicitOrderBy)e.Ee.push(s),n.add(s.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let l=new Oe(Be.comparator);return o.filters.forEach(u=>{u.getFlattenedFilters().forEach(h=>{h.isInequality()&&(l=l.add(h.field))})}),l})(e).forEach(s=>{n.has(s.canonicalString())||s.isKeyField()||e.Ee.push(new ko(s,r))}),n.has(Be.keyField().canonicalString())||e.Ee.push(new ko(Be.keyField(),r))}return e.Ee}function Kt(t){const e=X(t);return e.Ie||(e.Ie=KS(e,Ro(t))),e.Ie}function KS(t,e){if(t.limitType==="F")return h0(t.path,t.collectionGroup,e,t.filters,t.limit,t.startAt,t.endAt);{e=e.map(i=>{const s=i.dir==="desc"?"asc":"desc";return new ko(i.field,s)});const n=t.endAt?new Ol(t.endAt.position,t.endAt.inclusive):null,r=t.startAt?new Ol(t.startAt.position,t.startAt.inclusive):null;return h0(t.path,t.collectionGroup,e,t.filters,t.limit,n,r)}}function Rd(t,e){const n=t.filters.concat([e]);return new $i(t.path,t.collectionGroup,t.explicitOrderBy.slice(),n,t.limit,t.limitType,t.startAt,t.endAt)}function QS(t,e){const n=t.explicitOrderBy.concat([e]);return new $i(t.path,t.collectionGroup,n,t.filters.slice(),t.limit,t.limitType,t.startAt,t.endAt)}function Ml(t,e,n){return new $i(t.path,t.collectionGroup,t.explicitOrderBy.slice(),t.filters.slice(),e,n,t.startAt,t.endAt)}function bl(t,e){return Sd(Kt(t),Kt(e))&&t.limitType===e.limitType}function p0(t){return`${Ad(Kt(t))}|lt:${t.limitType}`}function zi(t){return`Query(target=${function(n){let r=n.path.canonicalString();return n.collectionGroup!==null&&(r+=" collectionGroup="+n.collectionGroup),n.filters.length>0&&(r+=`, filters: [${n.filters.map(i=>u0(i)).join(", ")}]`),Al(n.limit)||(r+=", limit: "+n.limit),n.orderBy.length>0&&(r+=`, orderBy: [${n.orderBy.map(i=>function(o){return`${o.field.canonicalString()} (${o.dir})`}(i)).join(", ")}]`),n.startAt&&(r+=", startAt: ",r+=n.startAt.inclusive?"b:":"a:",r+=n.startAt.position.map(i=>Bi(i)).join(",")),n.endAt&&(r+=", endAt: ",r+=n.endAt.inclusive?"a:":"b:",r+=n.endAt.position.map(i=>Bi(i)).join(",")),`Target(${r})`}(Kt(t))}; limitType=${t.limitType})`}function Ll(t,e){return e.isFoundDocument()&&function(r,i){const s=i.key.path;return r.collectionGroup!==null?i.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(s):q.isDocumentKey(r.path)?r.path.isEqual(s):r.path.isImmediateParentOf(s)}(t,e)&&function(r,i){for(const s of Ro(r))if(!s.field.isKeyField()&&i.data.field(s.field)===null)return!1;return!0}(t,e)&&function(r,i){for(const s of r.filters)if(!s.matches(i))return!1;return!0}(t,e)&&function(r,i){return!(r.startAt&&!function(o,l,u){const h=r0(o,l,u);return o.inclusive?h<=0:h<0}(r.startAt,Ro(r),i)||r.endAt&&!function(o,l,u){const h=r0(o,l,u);return o.inclusive?h>=0:h>0}(r.endAt,Ro(r),i))}(t,e)}function YS(t){return t.collectionGroup||(t.path.length%2==1?t.path.lastSegment():t.path.get(t.path.length-2))}function m0(t){return(e,n)=>{let r=!1;for(const i of Ro(t)){const s=XS(i,e,n);if(s!==0)return s;r=r||i.field.isKeyField()}return 0}}function XS(t,e,n){const r=t.field.isKeyField()?q.comparator(e.key,n.key):function(s,o,l){const u=o.data.field(s),h=l.data.field(s);return u!==null&&h!==null?ji(u,h):G(42886)}(t.field,e,n);switch(t.dir){case"asc":return r;case"desc":return-1*r;default:return G(19790,{direction:t.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qr{constructor(e,n){this.mapKeyFn=e,this.equalsFn=n,this.inner={},this.innerSize=0}get(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r!==void 0){for(const[i,s]of r)if(this.equalsFn(i,e))return s}}has(e){return this.get(e)!==void 0}set(e,n){const r=this.mapKeyFn(e),i=this.inner[r];if(i===void 0)return this.inner[r]=[[e,n]],void this.innerSize++;for(let s=0;s<i.length;s++)if(this.equalsFn(i[s][0],e))return void(i[s]=[e,n]);i.push([e,n]),this.innerSize++}delete(e){const n=this.mapKeyFn(e),r=this.inner[n];if(r===void 0)return!1;for(let i=0;i<r.length;i++)if(this.equalsFn(r[i][0],e))return r.length===1?delete this.inner[n]:r.splice(i,1),this.innerSize--,!0;return!1}forEach(e){Zn(this.inner,(n,r)=>{for(const[i,s]of r)e(i,s)})}isEmpty(){return B_(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const JS=new ye(q.comparator);function pn(){return JS}const g0=new ye(q.comparator);function Co(...t){let e=g0;for(const n of t)e=e.insert(n.key,n);return e}function y0(t){let e=g0;return t.forEach((n,r)=>e=e.insert(n,r.overlayedDocument)),e}function Wr(){return Po()}function _0(){return Po()}function Po(){return new qr(t=>t.toString(),(t,e)=>t.isEqual(e))}const ZS=new ye(q.comparator),ek=new Oe(q.comparator);function ne(...t){let e=ek;for(const n of t)e=e.add(n);return e}const tk=new Oe(te);function nk(){return tk}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Cd(t,e){if(t.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Sl(e)?"-0":e}}function v0(t){return{integerValue:""+t}}function rk(t,e){return CS(e)?v0(e):Cd(t,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ul{constructor(){this._=void 0}}function ik(t,e,n){return t instanceof No?function(i,s){const o={fields:{[q_]:{stringValue:H_},[G_]:{timestampValue:{seconds:i.seconds,nanos:i.nanoseconds}}}};return s&&vd(s)&&(s=Rl(s)),s&&(o.fields[W_]=s),{mapValue:o}}(n,e):t instanceof Do?w0(t,e):t instanceof Vo?T0(t,e):function(i,s){const o=E0(i,s),l=I0(o)+I0(i.Ae);return wd(o)&&wd(i.Ae)?v0(l):Cd(i.serializer,l)}(t,e)}function sk(t,e,n){return t instanceof Do?w0(t,e):t instanceof Vo?T0(t,e):n}function E0(t,e){return t instanceof Fl?function(r){return wd(r)||function(s){return!!s&&"doubleValue"in s}(r)}(e)?e:{integerValue:0}:null}class No extends Ul{}class Do extends Ul{constructor(e){super(),this.elements=e}}function w0(t,e){const n=A0(e);for(const r of t.elements)n.some(i=>Gt(i,r))||n.push(r);return{arrayValue:{values:n}}}class Vo extends Ul{constructor(e){super(),this.elements=e}}function T0(t,e){let n=A0(e);for(const r of t.elements)n=n.filter(i=>!Gt(i,r));return{arrayValue:{values:n}}}class Fl extends Ul{constructor(e,n){super(),this.serializer=e,this.Ae=n}}function I0(t){return Se(t.integerValue||t.doubleValue)}function A0(t){return Td(t)&&t.arrayValue.values?t.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ok{constructor(e,n){this.field=e,this.transform=n}}function ak(t,e){return t.field.isEqual(e.field)&&function(r,i){return r instanceof Do&&i instanceof Do||r instanceof Vo&&i instanceof Vo?Li(r.elements,i.elements,Gt):r instanceof Fl&&i instanceof Fl?Gt(r.Ae,i.Ae):r instanceof No&&i instanceof No}(t.transform,e.transform)}class lk{constructor(e,n){this.version=e,this.transformResults=n}}class gt{constructor(e,n){this.updateTime=e,this.exists=n}static none(){return new gt}static exists(e){return new gt(void 0,e)}static updateTime(e){return new gt(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function jl(t,e){return t.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(t.updateTime):t.exists===void 0||t.exists===e.isFoundDocument()}class Bl{}function S0(t,e){if(!t.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return t.isNoDocument()?new Pd(t.key,gt.none()):new xo(t.key,t.data,gt.none());{const n=t.data,r=ut.empty();let i=new Oe(Be.comparator);for(let s of e.fields)if(!i.has(s)){let o=n.field(s);o===null&&s.length>1&&(s=s.popLast(),o=n.field(s)),o===null?r.delete(s):r.set(s,o),i=i.add(s)}return new rr(t.key,r,new mt(i.toArray()),gt.none())}}function uk(t,e,n){t instanceof xo?function(i,s,o){const l=i.value.clone(),u=C0(i.fieldTransforms,s,o.transformResults);l.setAll(u),s.convertToFoundDocument(o.version,l).setHasCommittedMutations()}(t,e,n):t instanceof rr?function(i,s,o){if(!jl(i.precondition,s))return void s.convertToUnknownDocument(o.version);const l=C0(i.fieldTransforms,s,o.transformResults),u=s.data;u.setAll(R0(i)),u.setAll(l),s.convertToFoundDocument(o.version,u).setHasCommittedMutations()}(t,e,n):function(i,s,o){s.convertToNoDocument(o.version).setHasCommittedMutations()}(0,e,n)}function Oo(t,e,n,r){return t instanceof xo?function(s,o,l,u){if(!jl(s.precondition,o))return l;const h=s.value.clone(),f=P0(s.fieldTransforms,u,o);return h.setAll(f),o.convertToFoundDocument(o.version,h).setHasLocalMutations(),null}(t,e,n,r):t instanceof rr?function(s,o,l,u){if(!jl(s.precondition,o))return l;const h=P0(s.fieldTransforms,u,o),f=o.data;return f.setAll(R0(s)),f.setAll(h),o.convertToFoundDocument(o.version,f).setHasLocalMutations(),l===null?null:l.unionWith(s.fieldMask.fields).unionWith(s.fieldTransforms.map(y=>y.field))}(t,e,n,r):function(s,o,l){return jl(s.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):l}(t,e,n)}function ck(t,e){let n=null;for(const r of t.fieldTransforms){const i=e.data.field(r.field),s=E0(r.transform,i||null);s!=null&&(n===null&&(n=ut.empty()),n.set(r.field,s))}return n||null}function k0(t,e){return t.type===e.type&&!!t.key.isEqual(e.key)&&!!t.precondition.isEqual(e.precondition)&&!!function(r,i){return r===void 0&&i===void 0||!(!r||!i)&&Li(r,i,(s,o)=>ak(s,o))}(t.fieldTransforms,e.fieldTransforms)&&(t.type===0?t.value.isEqual(e.value):t.type!==1||t.data.isEqual(e.data)&&t.fieldMask.isEqual(e.fieldMask))}class xo extends Bl{constructor(e,n,r,i=[]){super(),this.key=e,this.value=n,this.precondition=r,this.fieldTransforms=i,this.type=0}getFieldMask(){return null}}class rr extends Bl{constructor(e,n,r,i,s=[]){super(),this.key=e,this.data=n,this.fieldMask=r,this.precondition=i,this.fieldTransforms=s,this.type=1}getFieldMask(){return this.fieldMask}}function R0(t){const e=new Map;return t.fieldMask.fields.forEach(n=>{if(!n.isEmpty()){const r=t.data.field(n);e.set(n,r)}}),e}function C0(t,e,n){const r=new Map;oe(t.length===n.length,32656,{Ve:n.length,de:t.length});for(let i=0;i<n.length;i++){const s=t[i],o=s.transform,l=e.data.field(s.field);r.set(s.field,sk(o,l,n[i]))}return r}function P0(t,e,n){const r=new Map;for(const i of t){const s=i.transform,o=n.data.field(i.field);r.set(i.field,ik(s,o,e))}return r}class Pd extends Bl{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class hk extends Bl{constructor(e,n){super(),this.key=e,this.precondition=n,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dk{constructor(e,n,r,i){this.batchId=e,this.localWriteTime=n,this.baseMutations=r,this.mutations=i}applyToRemoteDocument(e,n){const r=n.mutationResults;for(let i=0;i<this.mutations.length;i++){const s=this.mutations[i];s.key.isEqual(e.key)&&uk(s,e,r[i])}}applyToLocalView(e,n){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(n=Oo(r,e,n,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(n=Oo(r,e,n,this.localWriteTime));return n}applyToLocalDocumentSet(e,n){const r=_0();return this.mutations.forEach(i=>{const s=e.get(i.key),o=s.overlayedDocument;let l=this.applyToLocalView(o,s.mutatedFields);l=n.has(i.key)?null:l;const u=S0(o,l);u!==null&&r.set(i.key,u),o.isValidDocument()||o.convertToNoDocument(Y.min())}),r}keys(){return this.mutations.reduce((e,n)=>e.add(n.key),ne())}isEqual(e){return this.batchId===e.batchId&&Li(this.mutations,e.mutations,(n,r)=>k0(n,r))&&Li(this.baseMutations,e.baseMutations,(n,r)=>k0(n,r))}}class Nd{constructor(e,n,r,i){this.batch=e,this.commitVersion=n,this.mutationResults=r,this.docVersions=i}static from(e,n,r){oe(e.mutations.length===r.length,58842,{me:e.mutations.length,fe:r.length});let i=function(){return ZS}();const s=e.mutations;for(let o=0;o<s.length;o++)i=i.insert(s[o].key,r[o].version);return new Nd(e,n,r,i)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fk{constructor(e,n){this.largestBatchId=e,this.mutation=n}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pk{constructor(e,n){this.count=e,this.unchangedNames=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Pe,re;function mk(t){switch(t){case x.OK:return G(64938);case x.CANCELLED:case x.UNKNOWN:case x.DEADLINE_EXCEEDED:case x.RESOURCE_EXHAUSTED:case x.INTERNAL:case x.UNAVAILABLE:case x.UNAUTHENTICATED:return!1;case x.INVALID_ARGUMENT:case x.NOT_FOUND:case x.ALREADY_EXISTS:case x.PERMISSION_DENIED:case x.FAILED_PRECONDITION:case x.ABORTED:case x.OUT_OF_RANGE:case x.UNIMPLEMENTED:case x.DATA_LOSS:return!0;default:return G(15467,{code:t})}}function N0(t){if(t===void 0)return dn("GRPC error has no .code"),x.UNKNOWN;switch(t){case Pe.OK:return x.OK;case Pe.CANCELLED:return x.CANCELLED;case Pe.UNKNOWN:return x.UNKNOWN;case Pe.DEADLINE_EXCEEDED:return x.DEADLINE_EXCEEDED;case Pe.RESOURCE_EXHAUSTED:return x.RESOURCE_EXHAUSTED;case Pe.INTERNAL:return x.INTERNAL;case Pe.UNAVAILABLE:return x.UNAVAILABLE;case Pe.UNAUTHENTICATED:return x.UNAUTHENTICATED;case Pe.INVALID_ARGUMENT:return x.INVALID_ARGUMENT;case Pe.NOT_FOUND:return x.NOT_FOUND;case Pe.ALREADY_EXISTS:return x.ALREADY_EXISTS;case Pe.PERMISSION_DENIED:return x.PERMISSION_DENIED;case Pe.FAILED_PRECONDITION:return x.FAILED_PRECONDITION;case Pe.ABORTED:return x.ABORTED;case Pe.OUT_OF_RANGE:return x.OUT_OF_RANGE;case Pe.UNIMPLEMENTED:return x.UNIMPLEMENTED;case Pe.DATA_LOSS:return x.DATA_LOSS;default:return G(39323,{code:t})}}(re=Pe||(Pe={}))[re.OK=0]="OK",re[re.CANCELLED=1]="CANCELLED",re[re.UNKNOWN=2]="UNKNOWN",re[re.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",re[re.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",re[re.NOT_FOUND=5]="NOT_FOUND",re[re.ALREADY_EXISTS=6]="ALREADY_EXISTS",re[re.PERMISSION_DENIED=7]="PERMISSION_DENIED",re[re.UNAUTHENTICATED=16]="UNAUTHENTICATED",re[re.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",re[re.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",re[re.ABORTED=10]="ABORTED",re[re.OUT_OF_RANGE=11]="OUT_OF_RANGE",re[re.UNIMPLEMENTED=12]="UNIMPLEMENTED",re[re.INTERNAL=13]="INTERNAL",re[re.UNAVAILABLE=14]="UNAVAILABLE",re[re.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Dd=null;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function gk(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yk=new Xn([4294967295,4294967295],0);function D0(t){const e=gk().encode(t),n=new T_;return n.update(e),new Uint8Array(n.digest())}function V0(t){const e=new DataView(t.buffer),n=e.getUint32(0,!0),r=e.getUint32(4,!0),i=e.getUint32(8,!0),s=e.getUint32(12,!0);return[new Xn([n,r],0),new Xn([i,s],0)]}class Vd{constructor(e,n,r){if(this.bitmap=e,this.padding=n,this.hashCount=r,n<0||n>=8)throw new Mo(`Invalid padding: ${n}`);if(r<0)throw new Mo(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Mo(`Invalid hash count: ${r}`);if(e.length===0&&n!==0)throw new Mo(`Invalid padding when bitmap length is 0: ${n}`);this.ge=8*e.length-n,this.pe=Xn.fromNumber(this.ge)}ye(e,n,r){let i=e.add(n.multiply(Xn.fromNumber(r)));return i.compare(yk)===1&&(i=new Xn([i.getBits(0),i.getBits(1)],0)),i.modulo(this.pe).toNumber()}we(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.ge===0)return!1;const n=D0(e),[r,i]=V0(n);for(let s=0;s<this.hashCount;s++){const o=this.ye(r,i,s);if(!this.we(o))return!1}return!0}static create(e,n,r){const i=e%8==0?0:8-e%8,s=new Uint8Array(Math.ceil(e/8)),o=new Vd(s,i,n);return r.forEach(l=>o.insert(l)),o}insert(e){if(this.ge===0)return;const n=D0(e),[r,i]=V0(n);for(let s=0;s<this.hashCount;s++){const o=this.ye(r,i,s);this.Se(o)}}Se(e){const n=Math.floor(e/8),r=e%8;this.bitmap[n]|=1<<r}}class Mo extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $l{constructor(e,n,r,i,s){this.snapshotVersion=e,this.targetChanges=n,this.targetMismatches=r,this.documentUpdates=i,this.resolvedLimboDocuments=s}static createSynthesizedRemoteEventForCurrentChange(e,n,r){const i=new Map;return i.set(e,bo.createSynthesizedTargetChangeForCurrentChange(e,n,r)),new $l(Y.min(),i,new ye(te),pn(),ne())}}class bo{constructor(e,n,r,i,s){this.resumeToken=e,this.current=n,this.addedDocuments=r,this.modifiedDocuments=i,this.removedDocuments=s}static createSynthesizedTargetChangeForCurrentChange(e,n,r){return new bo(r,n,ne(),ne(),ne())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zl{constructor(e,n,r,i){this.be=e,this.removedTargetIds=n,this.key=r,this.De=i}}class O0{constructor(e,n){this.targetId=e,this.Ce=n}}class x0{constructor(e,n,r=ze.EMPTY_BYTE_STRING,i=null){this.state=e,this.targetIds=n,this.resumeToken=r,this.cause=i}}class M0{constructor(){this.ve=0,this.Fe=b0(),this.Me=ze.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(e){e.approximateByteSize()>0&&(this.Oe=!0,this.Me=e)}ke(){let e=ne(),n=ne(),r=ne();return this.Fe.forEach((i,s)=>{switch(s){case 0:e=e.add(i);break;case 2:n=n.add(i);break;case 1:r=r.add(i);break;default:G(38017,{changeType:s})}}),new bo(this.Me,this.xe,e,n,r)}qe(){this.Oe=!1,this.Fe=b0()}Ke(e,n){this.Oe=!0,this.Fe=this.Fe.insert(e,n)}Ue(e){this.Oe=!0,this.Fe=this.Fe.remove(e)}$e(){this.ve+=1}We(){this.ve-=1,oe(this.ve>=0,3241,{ve:this.ve})}Qe(){this.Oe=!0,this.xe=!0}}class _k{constructor(e){this.Ge=e,this.ze=new Map,this.je=pn(),this.Je=Hl(),this.He=Hl(),this.Ze=new ye(te)}Xe(e){for(const n of e.be)e.De&&e.De.isFoundDocument()?this.Ye(n,e.De):this.et(n,e.key,e.De);for(const n of e.removedTargetIds)this.et(n,e.key,e.De)}tt(e){this.forEachTarget(e,n=>{const r=this.nt(n);switch(e.state){case 0:this.rt(n)&&r.Le(e.resumeToken);break;case 1:r.We(),r.Ne||r.qe(),r.Le(e.resumeToken);break;case 2:r.We(),r.Ne||this.removeTarget(n);break;case 3:this.rt(n)&&(r.Qe(),r.Le(e.resumeToken));break;case 4:this.rt(n)&&(this.it(n),r.Le(e.resumeToken));break;default:G(56790,{state:e.state})}})}forEachTarget(e,n){e.targetIds.length>0?e.targetIds.forEach(n):this.ze.forEach((r,i)=>{this.rt(i)&&n(i)})}st(e){const n=e.targetId,r=e.Ce.count,i=this.ot(n);if(i){const s=i.target;if(kd(s))if(r===0){const o=new q(s.path);this.et(n,o,Je.newNoDocument(o,Y.min()))}else oe(r===1,20013,{expectedCount:r});else{const o=this._t(n);if(o!==r){const l=this.ut(e),u=l?this.ct(l,e,o):1;if(u!==0){this.it(n);const h=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(n,h)}Dd==null||Dd.o(function(f,y,g,k,V){var E,I,P,N,F,b;const O={localCacheCount:f,existenceFilterCount:y.count,databaseId:g.database,projectId:g.projectId},v=y.unchangedNames;return v&&(O.bloomFilter={applied:V===0,hashCount:(E=v==null?void 0:v.hashCount)!=null?E:0,bitmapLength:(N=(P=(I=v==null?void 0:v.bits)==null?void 0:I.bitmap)==null?void 0:P.length)!=null?N:0,padding:(b=(F=v==null?void 0:v.bits)==null?void 0:F.padding)!=null?b:0,mightContain:w=>{var m;return(m=k==null?void 0:k.mightContain(w))!=null?m:!1}}),O}(o,e.Ce,this.Ge.ht(),l,u))}}}}ut(e){const n=e.Ce.unchangedNames;if(!n||!n.bits)return null;const{bits:{bitmap:r="",padding:i=0},hashCount:s=0}=n;let o,l;try{o=tr(r).toUint8Array()}catch(u){if(u instanceof z_)return Hr("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{l=new Vd(o,i,s)}catch(u){return Hr(u instanceof Mo?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return l.ge===0?null:l}ct(e,n,r){return n.Ce.count===r-this.Pt(e,n.targetId)?0:2}Pt(e,n){const r=this.Ge.getRemoteKeysForTarget(n);let i=0;return r.forEach(s=>{const o=this.Ge.ht(),l=`projects/${o.projectId}/databases/${o.database}/documents/${s.path.canonicalString()}`;e.mightContain(l)||(this.et(n,s,null),i++)}),i}Tt(e){const n=new Map;this.ze.forEach((s,o)=>{const l=this.ot(o);if(l){if(s.current&&kd(l.target)){const u=new q(l.target.path);this.Et(u).has(o)||this.It(o,u)||this.et(o,u,Je.newNoDocument(u,e))}s.Be&&(n.set(o,s.ke()),s.qe())}});let r=ne();this.He.forEach((s,o)=>{let l=!0;o.forEachWhile(u=>{const h=this.ot(u);return!h||h.purpose==="TargetPurposeLimboResolution"||(l=!1,!1)}),l&&(r=r.add(s))}),this.je.forEach((s,o)=>o.setReadTime(e));const i=new $l(e,n,this.Ze,this.je,r);return this.je=pn(),this.Je=Hl(),this.He=Hl(),this.Ze=new ye(te),i}Ye(e,n){if(!this.rt(e))return;const r=this.It(e,n.key)?2:0;this.nt(e).Ke(n.key,r),this.je=this.je.insert(n.key,n),this.Je=this.Je.insert(n.key,this.Et(n.key).add(e)),this.He=this.He.insert(n.key,this.Rt(n.key).add(e))}et(e,n,r){if(!this.rt(e))return;const i=this.nt(e);this.It(e,n)?i.Ke(n,1):i.Ue(n),this.He=this.He.insert(n,this.Rt(n).delete(e)),this.He=this.He.insert(n,this.Rt(n).add(e)),r&&(this.je=this.je.insert(n,r))}removeTarget(e){this.ze.delete(e)}_t(e){const n=this.nt(e).ke();return this.Ge.getRemoteKeysForTarget(e).size+n.addedDocuments.size-n.removedDocuments.size}$e(e){this.nt(e).$e()}nt(e){let n=this.ze.get(e);return n||(n=new M0,this.ze.set(e,n)),n}Rt(e){let n=this.He.get(e);return n||(n=new Oe(te),this.He=this.He.insert(e,n)),n}Et(e){let n=this.Je.get(e);return n||(n=new Oe(te),this.Je=this.Je.insert(e,n)),n}rt(e){const n=this.ot(e)!==null;return n||z("WatchChangeAggregator","Detected inactive target",e),n}ot(e){const n=this.ze.get(e);return n&&n.Ne?null:this.Ge.At(e)}it(e){this.ze.set(e,new M0),this.Ge.getRemoteKeysForTarget(e).forEach(n=>{this.et(e,n,null)})}It(e,n){return this.Ge.getRemoteKeysForTarget(e).has(n)}}function Hl(){return new ye(q.comparator)}function b0(){return new ye(q.comparator)}const vk=(()=>({asc:"ASCENDING",desc:"DESCENDING"}))(),Ek=(()=>({"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"}))(),wk=(()=>({and:"AND",or:"OR"}))();class Tk{constructor(e,n){this.databaseId=e,this.useProto3Json=n}}function Od(t,e){return t.useProto3Json||Al(e)?e:{value:e}}function ql(t,e){return t.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function L0(t,e){return t.useProto3Json?e.toBase64():e.toUint8Array()}function Ik(t,e){return ql(t,e.toTimestamp())}function Qt(t){return oe(!!t,49232),Y.fromTimestamp(function(n){const r=er(n);return new pe(r.seconds,r.nanos)}(t))}function xd(t,e){return Md(t,e).canonicalString()}function Md(t,e){const n=function(i){return new ce(["projects",i.projectId,"databases",i.database])}(t).child("documents");return e===void 0?n:n.child(e)}function U0(t){const e=ce.fromString(t);return oe(H0(e),10190,{key:e.toString()}),e}function bd(t,e){return xd(t.databaseId,e.path)}function Ld(t,e){const n=U0(e);if(n.get(1)!==t.databaseId.projectId)throw new j(x.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+n.get(1)+" vs "+t.databaseId.projectId);if(n.get(3)!==t.databaseId.database)throw new j(x.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+n.get(3)+" vs "+t.databaseId.database);return new q(j0(n))}function F0(t,e){return xd(t.databaseId,e)}function Ak(t){const e=U0(t);return e.length===4?ce.emptyPath():j0(e)}function Ud(t){return new ce(["projects",t.databaseId.projectId,"databases",t.databaseId.database]).canonicalString()}function j0(t){return oe(t.length>4&&t.get(4)==="documents",29091,{key:t.toString()}),t.popFirst(5)}function B0(t,e,n){return{name:bd(t,e),fields:n.value.mapValue.fields}}function Sk(t,e){let n;if("targetChange"in e){e.targetChange;const r=function(h){return h==="NO_CHANGE"?0:h==="ADD"?1:h==="REMOVE"?2:h==="CURRENT"?3:h==="RESET"?4:G(39313,{state:h})}(e.targetChange.targetChangeType||"NO_CHANGE"),i=e.targetChange.targetIds||[],s=function(h,f){return h.useProto3Json?(oe(f===void 0||typeof f=="string",58123),ze.fromBase64String(f||"")):(oe(f===void 0||f instanceof Buffer||f instanceof Uint8Array,16193),ze.fromUint8Array(f||new Uint8Array))}(t,e.targetChange.resumeToken),o=e.targetChange.cause,l=o&&function(h){const f=h.code===void 0?x.UNKNOWN:N0(h.code);return new j(f,h.message||"")}(o);n=new x0(r,i,s,l||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const i=Ld(t,r.document.name),s=Qt(r.document.updateTime),o=r.document.createTime?Qt(r.document.createTime):Y.min(),l=new ut({mapValue:{fields:r.document.fields}}),u=Je.newFoundDocument(i,s,o,l),h=r.targetIds||[],f=r.removedTargetIds||[];n=new zl(h,f,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const i=Ld(t,r.document),s=r.readTime?Qt(r.readTime):Y.min(),o=Je.newNoDocument(i,s),l=r.removedTargetIds||[];n=new zl([],l,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const i=Ld(t,r.document),s=r.removedTargetIds||[];n=new zl([],s,i,null)}else{if(!("filter"in e))return G(11601,{Vt:e});{e.filter;const r=e.filter;r.targetId;const{count:i=0,unchangedNames:s}=r,o=new pk(i,s),l=r.targetId;n=new O0(l,o)}}return n}function kk(t,e){let n;if(e instanceof xo)n={update:B0(t,e.key,e.value)};else if(e instanceof Pd)n={delete:bd(t,e.key)};else if(e instanceof rr)n={update:B0(t,e.key,e.data),updateMask:Mk(e.fieldMask)};else{if(!(e instanceof hk))return G(16599,{dt:e.type});n={verify:bd(t,e.key)}}return e.fieldTransforms.length>0&&(n.updateTransforms=e.fieldTransforms.map(r=>function(s,o){const l=o.transform;if(l instanceof No)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(l instanceof Do)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:l.elements}};if(l instanceof Vo)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:l.elements}};if(l instanceof Fl)return{fieldPath:o.field.canonicalString(),increment:l.Ae};throw G(20930,{transform:o.transform})}(0,r))),e.precondition.isNone||(n.currentDocument=function(i,s){return s.updateTime!==void 0?{updateTime:Ik(i,s.updateTime)}:s.exists!==void 0?{exists:s.exists}:G(27497)}(t,e.precondition)),n}function Rk(t,e){return t&&t.length>0?(oe(e!==void 0,14353),t.map(n=>function(i,s){let o=i.updateTime?Qt(i.updateTime):Qt(s);return o.isEqual(Y.min())&&(o=Qt(s)),new lk(o,i.transformResults||[])}(n,e))):[]}function Ck(t,e){return{documents:[F0(t,e.path)]}}function Pk(t,e){const n={structuredQuery:{}},r=e.path;let i;e.collectionGroup!==null?(i=r,n.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(i=r.popLast(),n.structuredQuery.from=[{collectionId:r.lastSegment()}]),n.parent=F0(t,i);const s=function(h){if(h.length!==0)return z0(Vt.create(h,"and"))}(e.filters);s&&(n.structuredQuery.where=s);const o=function(h){if(h.length!==0)return h.map(f=>function(g){return{field:Hi(g.field),direction:Vk(g.dir)}}(f))}(e.orderBy);o&&(n.structuredQuery.orderBy=o);const l=Od(t,e.limit);return l!==null&&(n.structuredQuery.limit=l),e.startAt&&(n.structuredQuery.startAt=function(h){return{before:h.inclusive,values:h.position}}(e.startAt)),e.endAt&&(n.structuredQuery.endAt=function(h){return{before:!h.inclusive,values:h.position}}(e.endAt)),{ft:n,parent:i}}function Nk(t){let e=Ak(t.parent);const n=t.structuredQuery,r=n.from?n.from.length:0;let i=null;if(r>0){oe(r===1,65062);const f=n.from[0];f.allDescendants?i=f.collectionId:e=e.child(f.collectionId)}let s=[];n.where&&(s=function(y){const g=$0(y);return g instanceof Vt&&a0(g)?g.getFilters():[g]}(n.where));let o=[];n.orderBy&&(o=function(y){return y.map(g=>function(V){return new ko(qi(V.field),function(v){switch(v){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}}(V.direction))}(g))}(n.orderBy));let l=null;n.limit&&(l=function(y){let g;return g=typeof y=="object"?y.value:y,Al(g)?null:g}(n.limit));let u=null;n.startAt&&(u=function(y){const g=!!y.before,k=y.values||[];return new Ol(k,g)}(n.startAt));let h=null;return n.endAt&&(h=function(y){const g=!y.before,k=y.values||[];return new Ol(k,g)}(n.endAt)),WS(e,i,o,s,l,"F",u,h)}function Dk(t,e){const n=function(i){switch(i){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return G(28987,{purpose:i})}}(e.purpose);return n==null?null:{"goog-listen-tags":n}}function $0(t){return t.unaryFilter!==void 0?function(n){switch(n.unaryFilter.op){case"IS_NAN":const r=qi(n.unaryFilter.field);return Ce.create(r,"==",{doubleValue:NaN});case"IS_NULL":const i=qi(n.unaryFilter.field);return Ce.create(i,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const s=qi(n.unaryFilter.field);return Ce.create(s,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=qi(n.unaryFilter.field);return Ce.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return G(61313);default:return G(60726)}}(t):t.fieldFilter!==void 0?function(n){return Ce.create(qi(n.fieldFilter.field),function(i){switch(i){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return G(58110);default:return G(50506)}}(n.fieldFilter.op),n.fieldFilter.value)}(t):t.compositeFilter!==void 0?function(n){return Vt.create(n.compositeFilter.filters.map(r=>$0(r)),function(i){switch(i){case"AND":return"and";case"OR":return"or";default:return G(1026)}}(n.compositeFilter.op))}(t):G(30097,{filter:t})}function Vk(t){return vk[t]}function Ok(t){return Ek[t]}function xk(t){return wk[t]}function Hi(t){return{fieldPath:t.canonicalString()}}function qi(t){return Be.fromServerFormat(t.fieldPath)}function z0(t){return t instanceof Ce?function(n){if(n.op==="=="){if(t0(n.value))return{unaryFilter:{field:Hi(n.field),op:"IS_NAN"}};if(e0(n.value))return{unaryFilter:{field:Hi(n.field),op:"IS_NULL"}}}else if(n.op==="!="){if(t0(n.value))return{unaryFilter:{field:Hi(n.field),op:"IS_NOT_NAN"}};if(e0(n.value))return{unaryFilter:{field:Hi(n.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Hi(n.field),op:Ok(n.op),value:n.value}}}(t):t instanceof Vt?function(n){const r=n.getFilters().map(i=>z0(i));return r.length===1?r[0]:{compositeFilter:{op:xk(n.op),filters:r}}}(t):G(54877,{filter:t})}function Mk(t){const e=[];return t.fields.forEach(n=>e.push(n.canonicalString())),{fieldPaths:e}}function H0(t){return t.length>=4&&t.get(0)==="projects"&&t.get(2)==="databases"}function q0(t){return!!t&&typeof t._toProto=="function"&&t._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ir{constructor(e,n,r,i,s=Y.min(),o=Y.min(),l=ze.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=n,this.purpose=r,this.sequenceNumber=i,this.snapshotVersion=s,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=l,this.expectedCount=u}withSequenceNumber(e){return new ir(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,n){return new ir(this.target,this.targetId,this.purpose,this.sequenceNumber,n,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new ir(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new ir(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bk{constructor(e){this.yt=e}}function Lk(t){const e=Nk({parent:t.parent,structuredQuery:t.structuredQuery});return t.limitType==="LAST"?Ml(e,e.limit,"L"):e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Uk{constructor(){this.bn=new Fk}addToCollectionParentIndex(e,n){return this.bn.add(n),M.resolve()}getCollectionParents(e,n){return M.resolve(this.bn.getEntries(n))}addFieldIndex(e,n){return M.resolve()}deleteFieldIndex(e,n){return M.resolve()}deleteAllFieldIndexes(e){return M.resolve()}createTargetIndexes(e,n){return M.resolve()}getDocumentsMatchingTarget(e,n){return M.resolve(null)}getIndexType(e,n){return M.resolve(0)}getFieldIndexes(e,n){return M.resolve([])}getNextCollectionGroupToUpdate(e){return M.resolve(null)}getMinOffset(e,n){return M.resolve(Jn.min())}getMinOffsetFromCollectionGroup(e,n){return M.resolve(Jn.min())}updateCollectionGroup(e,n,r){return M.resolve()}updateIndexEntries(e,n){return M.resolve()}}class Fk{constructor(){this.index={}}add(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n]||new Oe(ce.comparator),s=!i.has(r);return this.index[n]=i.add(r),s}has(e){const n=e.lastSegment(),r=e.popLast(),i=this.index[n];return i&&i.has(r)}getEntries(e){return(this.index[e]||new Oe(ce.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const W0={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},G0=41943040;class ct{static withCacheSize(e){return new ct(e,ct.DEFAULT_COLLECTION_PERCENTILE,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,n,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=n,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ct.DEFAULT_COLLECTION_PERCENTILE=10,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,ct.DEFAULT=new ct(G0,ct.DEFAULT_COLLECTION_PERCENTILE,ct.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),ct.DISABLED=new ct(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wi{constructor(e){this.sr=e}next(){return this.sr+=2,this.sr}static _r(){return new Wi(0)}static ar(){return new Wi(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const K0="LruGarbageCollector",jk=1048576;function Q0([t,e],[n,r]){const i=te(t,n);return i===0?te(e,r):i}class Bk{constructor(e){this.Pr=e,this.buffer=new Oe(Q0),this.Tr=0}Er(){return++this.Tr}Ir(e){const n=[e,this.Er()];if(this.buffer.size<this.Pr)this.buffer=this.buffer.add(n);else{const r=this.buffer.last();Q0(n,r)<0&&(this.buffer=this.buffer.delete(r).add(n))}}get maxValue(){return this.buffer.last()[0]}}class $k{constructor(e,n,r){this.garbageCollector=e,this.asyncQueue=n,this.localStore=r,this.Rr=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Ar(6e4)}stop(){this.Rr&&(this.Rr.cancel(),this.Rr=null)}get started(){return this.Rr!==null}Ar(e){z(K0,`Garbage collection scheduled in ${e}ms`),this.Rr=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,async()=>{this.Rr=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(n){Fi(n)?z(K0,"Ignoring IndexedDB error during garbage collection: ",n):await Ui(n)}await this.Ar(3e5)})}}class zk{constructor(e,n){this.Vr=e,this.params=n}calculateTargetCount(e,n){return this.Vr.dr(e).next(r=>Math.floor(n/100*r))}nthSequenceNumber(e,n){if(n===0)return M.resolve(Il.ce);const r=new Bk(n);return this.Vr.forEachTarget(e,i=>r.Ir(i.sequenceNumber)).next(()=>this.Vr.mr(e,i=>r.Ir(i))).next(()=>r.maxValue)}removeTargets(e,n,r){return this.Vr.removeTargets(e,n,r)}removeOrphanedDocuments(e,n){return this.Vr.removeOrphanedDocuments(e,n)}collect(e,n){return this.params.cacheSizeCollectionThreshold===-1?(z("LruGarbageCollector","Garbage collection skipped; disabled"),M.resolve(W0)):this.getCacheSize(e).next(r=>r<this.params.cacheSizeCollectionThreshold?(z("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),W0):this.gr(e,n))}getCacheSize(e){return this.Vr.getCacheSize(e)}gr(e,n){let r,i,s,o,l,u,h;const f=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next(y=>(y>this.params.maximumSequenceNumbersToCollect?(z("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${y}`),i=this.params.maximumSequenceNumbersToCollect):i=y,o=Date.now(),this.nthSequenceNumber(e,i))).next(y=>(r=y,l=Date.now(),this.removeTargets(e,r,n))).next(y=>(s=y,u=Date.now(),this.removeOrphanedDocuments(e,r))).next(y=>(h=Date.now(),bi()<=ee.DEBUG&&z("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-f}ms
	Determined least recently used ${i} in `+(l-o)+`ms
	Removed ${s} targets in `+(u-l)+`ms
	Removed ${y} documents in `+(h-u)+`ms
Total Duration: ${h-f}ms`),M.resolve({didRun:!0,sequenceNumbersCollected:i,targetsRemoved:s,documentsRemoved:y})))}}function Hk(t,e){return new zk(t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qk{constructor(){this.changes=new qr(e=>e.toString(),(e,n)=>e.isEqual(n)),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,n){this.assertNotApplied(),this.changes.set(e,Je.newInvalidDocument(e).setReadTime(n))}getEntry(e,n){this.assertNotApplied();const r=this.changes.get(n);return r!==void 0?M.resolve(r):this.getFromCache(e,n)}getEntries(e,n){return this.getAllFromCache(e,n)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wk{constructor(e,n){this.overlayedDocument=e,this.mutatedFields=n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gk{constructor(e,n,r,i){this.remoteDocumentCache=e,this.mutationQueue=n,this.documentOverlayCache=r,this.indexManager=i}getDocument(e,n){let r=null;return this.documentOverlayCache.getOverlay(e,n).next(i=>(r=i,this.remoteDocumentCache.getEntry(e,n))).next(i=>(r!==null&&Oo(r.mutation,i,mt.empty(),pe.now()),i))}getDocuments(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.getLocalViewOfDocuments(e,r,ne()).next(()=>r))}getLocalViewOfDocuments(e,n,r=ne()){const i=Wr();return this.populateOverlays(e,i,n).next(()=>this.computeViews(e,n,i,r).next(s=>{let o=Co();return s.forEach((l,u)=>{o=o.insert(l,u.overlayedDocument)}),o}))}getOverlayedDocuments(e,n){const r=Wr();return this.populateOverlays(e,r,n).next(()=>this.computeViews(e,n,r,ne()))}populateOverlays(e,n,r){const i=[];return r.forEach(s=>{n.has(s)||i.push(s)}),this.documentOverlayCache.getOverlays(e,i).next(s=>{s.forEach((o,l)=>{n.set(o,l)})})}computeViews(e,n,r,i){let s=pn();const o=Po(),l=function(){return Po()}();return n.forEach((u,h)=>{const f=r.get(h.key);i.has(h.key)&&(f===void 0||f.mutation instanceof rr)?s=s.insert(h.key,h):f!==void 0?(o.set(h.key,f.mutation.getFieldMask()),Oo(f.mutation,h,f.mutation.getFieldMask(),pe.now())):o.set(h.key,mt.empty())}),this.recalculateAndSaveOverlays(e,s).next(u=>(u.forEach((h,f)=>o.set(h,f)),n.forEach((h,f)=>{var y;return l.set(h,new Wk(f,(y=o.get(h))!=null?y:null))}),l))}recalculateAndSaveOverlays(e,n){const r=Po();let i=new ye((o,l)=>o-l),s=ne();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,n).next(o=>{for(const l of o)l.keys().forEach(u=>{const h=n.get(u);if(h===null)return;let f=r.get(u)||mt.empty();f=l.applyToLocalView(h,f),r.set(u,f);const y=(i.get(l.batchId)||ne()).add(u);i=i.insert(l.batchId,y)})}).next(()=>{const o=[],l=i.getReverseIterator();for(;l.hasNext();){const u=l.getNext(),h=u.key,f=u.value,y=_0();f.forEach(g=>{if(!s.has(g)){const k=S0(n.get(g),r.get(g));k!==null&&y.set(g,k),s=s.add(g)}}),o.push(this.documentOverlayCache.saveOverlays(e,h,y))}return M.waitFor(o)}).next(()=>r)}recalculateAndSaveOverlaysForDocumentKeys(e,n){return this.remoteDocumentCache.getEntries(e,n).next(r=>this.recalculateAndSaveOverlays(e,r))}getDocumentsMatchingQuery(e,n,r,i){return GS(n)?this.getDocumentsMatchingDocumentQuery(e,n.path):f0(n)?this.getDocumentsMatchingCollectionGroupQuery(e,n,r,i):this.getDocumentsMatchingCollectionQuery(e,n,r,i)}getNextDocuments(e,n,r,i){return this.remoteDocumentCache.getAllFromCollectionGroup(e,n,r,i).next(s=>{const o=i-s.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,n,r.largestBatchId,i-s.size):M.resolve(Wr());let l=wo,u=s;return o.next(h=>M.forEach(h,(f,y)=>(l<y.largestBatchId&&(l=y.largestBatchId),s.get(f)?M.resolve():this.remoteDocumentCache.getEntry(e,f).next(g=>{u=u.insert(f,g)}))).next(()=>this.populateOverlays(e,h,s)).next(()=>this.computeViews(e,u,h,ne())).next(f=>({batchId:l,changes:y0(f)})))})}getDocumentsMatchingDocumentQuery(e,n){return this.getDocument(e,new q(n)).next(r=>{let i=Co();return r.isFoundDocument()&&(i=i.insert(r.key,r)),i})}getDocumentsMatchingCollectionGroupQuery(e,n,r,i){const s=n.collectionGroup;let o=Co();return this.indexManager.getCollectionParents(e,s).next(l=>M.forEach(l,u=>{const h=function(y,g){return new $i(g,null,y.explicitOrderBy.slice(),y.filters.slice(),y.limit,y.limitType,y.startAt,y.endAt)}(n,u.child(s));return this.getDocumentsMatchingCollectionQuery(e,h,r,i).next(f=>{f.forEach((y,g)=>{o=o.insert(y,g)})})}).next(()=>o))}getDocumentsMatchingCollectionQuery(e,n,r,i){let s;return this.documentOverlayCache.getOverlaysForCollection(e,n.path,r.largestBatchId).next(o=>(s=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,n,r,s,i))).next(o=>{s.forEach((u,h)=>{const f=h.getKey();o.get(f)===null&&(o=o.insert(f,Je.newInvalidDocument(f)))});let l=Co();return o.forEach((u,h)=>{const f=s.get(u);f!==void 0&&Oo(f.mutation,h,mt.empty(),pe.now()),Ll(n,h)&&(l=l.insert(u,h))}),l})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kk{constructor(e){this.serializer=e,this.Nr=new Map,this.Br=new Map}getBundleMetadata(e,n){return M.resolve(this.Nr.get(n))}saveBundleMetadata(e,n){return this.Nr.set(n.id,function(i){return{id:i.id,version:i.version,createTime:Qt(i.createTime)}}(n)),M.resolve()}getNamedQuery(e,n){return M.resolve(this.Br.get(n))}saveNamedQuery(e,n){return this.Br.set(n.name,function(i){return{name:i.name,query:Lk(i.bundledQuery),readTime:Qt(i.readTime)}}(n)),M.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qk{constructor(){this.overlays=new ye(q.comparator),this.Lr=new Map}getOverlay(e,n){return M.resolve(this.overlays.get(n))}getOverlays(e,n){const r=Wr();return M.forEach(n,i=>this.getOverlay(e,i).next(s=>{s!==null&&r.set(i,s)})).next(()=>r)}saveOverlays(e,n,r){return r.forEach((i,s)=>{this.St(e,n,s)}),M.resolve()}removeOverlaysForBatchId(e,n,r){const i=this.Lr.get(r);return i!==void 0&&(i.forEach(s=>this.overlays=this.overlays.remove(s)),this.Lr.delete(r)),M.resolve()}getOverlaysForCollection(e,n,r){const i=Wr(),s=n.length+1,o=new q(n.child("")),l=this.overlays.getIteratorFrom(o);for(;l.hasNext();){const u=l.getNext().value,h=u.getKey();if(!n.isPrefixOf(h.path))break;h.path.length===s&&u.largestBatchId>r&&i.set(u.getKey(),u)}return M.resolve(i)}getOverlaysForCollectionGroup(e,n,r,i){let s=new ye((h,f)=>h-f);const o=this.overlays.getIterator();for(;o.hasNext();){const h=o.getNext().value;if(h.getKey().getCollectionGroup()===n&&h.largestBatchId>r){let f=s.get(h.largestBatchId);f===null&&(f=Wr(),s=s.insert(h.largestBatchId,f)),f.set(h.getKey(),h)}}const l=Wr(),u=s.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach((h,f)=>l.set(h,f)),!(l.size()>=i)););return M.resolve(l)}St(e,n,r){const i=this.overlays.get(r.key);if(i!==null){const o=this.Lr.get(i.largestBatchId).delete(r.key);this.Lr.set(i.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new fk(n,r));let s=this.Lr.get(n);s===void 0&&(s=ne(),this.Lr.set(n,s)),this.Lr.set(n,s.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yk{constructor(){this.sessionToken=ze.EMPTY_BYTE_STRING}getSessionToken(e){return M.resolve(this.sessionToken)}setSessionToken(e,n){return this.sessionToken=n,M.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fd{constructor(){this.kr=new Oe(Le.qr),this.Kr=new Oe(Le.Ur)}isEmpty(){return this.kr.isEmpty()}addReference(e,n){const r=new Le(e,n);this.kr=this.kr.add(r),this.Kr=this.Kr.add(r)}$r(e,n){e.forEach(r=>this.addReference(r,n))}removeReference(e,n){this.Wr(new Le(e,n))}Qr(e,n){e.forEach(r=>this.removeReference(r,n))}Gr(e){const n=new q(new ce([])),r=new Le(n,e),i=new Le(n,e+1),s=[];return this.Kr.forEachInRange([r,i],o=>{this.Wr(o),s.push(o.key)}),s}zr(){this.kr.forEach(e=>this.Wr(e))}Wr(e){this.kr=this.kr.delete(e),this.Kr=this.Kr.delete(e)}jr(e){const n=new q(new ce([])),r=new Le(n,e),i=new Le(n,e+1);let s=ne();return this.Kr.forEachInRange([r,i],o=>{s=s.add(o.key)}),s}containsKey(e){const n=new Le(e,0),r=this.kr.firstAfterOrEqual(n);return r!==null&&e.isEqual(r.key)}}class Le{constructor(e,n){this.key=e,this.Jr=n}static qr(e,n){return q.comparator(e.key,n.key)||te(e.Jr,n.Jr)}static Ur(e,n){return te(e.Jr,n.Jr)||q.comparator(e.key,n.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xk{constructor(e,n){this.indexManager=e,this.referenceDelegate=n,this.mutationQueue=[],this.Yn=1,this.Hr=new Oe(Le.qr)}checkEmpty(e){return M.resolve(this.mutationQueue.length===0)}addMutationBatch(e,n,r,i){const s=this.Yn;this.Yn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new dk(s,n,r,i);this.mutationQueue.push(o);for(const l of i)this.Hr=this.Hr.add(new Le(l.key,s)),this.indexManager.addToCollectionParentIndex(e,l.key.path.popLast());return M.resolve(o)}lookupMutationBatch(e,n){return M.resolve(this.Zr(n))}getNextMutationBatchAfterBatchId(e,n){const r=n+1,i=this.Xr(r),s=i<0?0:i;return M.resolve(this.mutationQueue.length>s?this.mutationQueue[s]:null)}getHighestUnacknowledgedBatchId(){return M.resolve(this.mutationQueue.length===0?_d:this.Yn-1)}getAllMutationBatches(e){return M.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,n){const r=new Le(n,0),i=new Le(n,Number.POSITIVE_INFINITY),s=[];return this.Hr.forEachInRange([r,i],o=>{const l=this.Zr(o.Jr);s.push(l)}),M.resolve(s)}getAllMutationBatchesAffectingDocumentKeys(e,n){let r=new Oe(te);return n.forEach(i=>{const s=new Le(i,0),o=new Le(i,Number.POSITIVE_INFINITY);this.Hr.forEachInRange([s,o],l=>{r=r.add(l.Jr)})}),M.resolve(this.Yr(r))}getAllMutationBatchesAffectingQuery(e,n){const r=n.path,i=r.length+1;let s=r;q.isDocumentKey(s)||(s=s.child(""));const o=new Le(new q(s),0);let l=new Oe(te);return this.Hr.forEachWhile(u=>{const h=u.key.path;return!!r.isPrefixOf(h)&&(h.length===i&&(l=l.add(u.Jr)),!0)},o),M.resolve(this.Yr(l))}Yr(e){const n=[];return e.forEach(r=>{const i=this.Zr(r);i!==null&&n.push(i)}),n}removeMutationBatch(e,n){oe(this.ei(n.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Hr;return M.forEach(n.mutations,i=>{const s=new Le(i.key,n.batchId);return r=r.delete(s),this.referenceDelegate.markPotentiallyOrphaned(e,i.key)}).next(()=>{this.Hr=r})}nr(e){}containsKey(e,n){const r=new Le(n,0),i=this.Hr.firstAfterOrEqual(r);return M.resolve(n.isEqual(i&&i.key))}performConsistencyCheck(e){return this.mutationQueue.length,M.resolve()}ei(e,n){return this.Xr(e)}Xr(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}Zr(e){const n=this.Xr(e);return n<0||n>=this.mutationQueue.length?null:this.mutationQueue[n]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jk{constructor(e){this.ti=e,this.docs=function(){return new ye(q.comparator)}(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,n){const r=n.key,i=this.docs.get(r),s=i?i.size:0,o=this.ti(n);return this.docs=this.docs.insert(r,{document:n.mutableCopy(),size:o}),this.size+=o-s,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const n=this.docs.get(e);n&&(this.docs=this.docs.remove(e),this.size-=n.size)}getEntry(e,n){const r=this.docs.get(n);return M.resolve(r?r.document.mutableCopy():Je.newInvalidDocument(n))}getEntries(e,n){let r=pn();return n.forEach(i=>{const s=this.docs.get(i);r=r.insert(i,s?s.document.mutableCopy():Je.newInvalidDocument(i))}),M.resolve(r)}getDocumentsMatchingQuery(e,n,r,i){let s=pn();const o=n.path,l=new q(o.child("__id-9223372036854775808__")),u=this.docs.getIteratorFrom(l);for(;u.hasNext();){const{key:h,value:{document:f}}=u.getNext();if(!o.isPrefixOf(h.path))break;h.path.length>o.length+1||AS(IS(f),r)<=0||(i.has(f.key)||Ll(n,f))&&(s=s.insert(f.key,f.mutableCopy()))}return M.resolve(s)}getAllFromCollectionGroup(e,n,r,i){G(9500)}ni(e,n){return M.forEach(this.docs,r=>n(r))}newChangeBuffer(e){return new Zk(this)}getSize(e){return M.resolve(this.size)}}class Zk extends qk{constructor(e){super(),this.Mr=e}applyChanges(e){const n=[];return this.changes.forEach((r,i)=>{i.isValidDocument()?n.push(this.Mr.addEntry(e,i)):this.Mr.removeEntry(r)}),M.waitFor(n)}getFromCache(e,n){return this.Mr.getEntry(e,n)}getAllFromCache(e,n){return this.Mr.getEntries(e,n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eR{constructor(e){this.persistence=e,this.ri=new qr(n=>Ad(n),Sd),this.lastRemoteSnapshotVersion=Y.min(),this.highestTargetId=0,this.ii=0,this.si=new Fd,this.targetCount=0,this.oi=Wi._r()}forEachTarget(e,n){return this.ri.forEach((r,i)=>n(i)),M.resolve()}getLastRemoteSnapshotVersion(e){return M.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return M.resolve(this.ii)}allocateTargetId(e){return this.highestTargetId=this.oi.next(),M.resolve(this.highestTargetId)}setTargetsMetadata(e,n,r){return r&&(this.lastRemoteSnapshotVersion=r),n>this.ii&&(this.ii=n),M.resolve()}lr(e){this.ri.set(e.target,e);const n=e.targetId;n>this.highestTargetId&&(this.oi=new Wi(n),this.highestTargetId=n),e.sequenceNumber>this.ii&&(this.ii=e.sequenceNumber)}addTargetData(e,n){return this.lr(n),this.targetCount+=1,M.resolve()}updateTargetData(e,n){return this.lr(n),M.resolve()}removeTargetData(e,n){return this.ri.delete(n.target),this.si.Gr(n.targetId),this.targetCount-=1,M.resolve()}removeTargets(e,n,r){let i=0;const s=[];return this.ri.forEach((o,l)=>{l.sequenceNumber<=n&&r.get(l.targetId)===null&&(this.ri.delete(o),s.push(this.removeMatchingKeysForTargetId(e,l.targetId)),i++)}),M.waitFor(s).next(()=>i)}getTargetCount(e){return M.resolve(this.targetCount)}getTargetData(e,n){const r=this.ri.get(n)||null;return M.resolve(r)}addMatchingKeys(e,n,r){return this.si.$r(n,r),M.resolve()}removeMatchingKeys(e,n,r){this.si.Qr(n,r);const i=this.persistence.referenceDelegate,s=[];return i&&n.forEach(o=>{s.push(i.markPotentiallyOrphaned(e,o))}),M.waitFor(s)}removeMatchingKeysForTargetId(e,n){return this.si.Gr(n),M.resolve()}getMatchingKeysForTargetId(e,n){const r=this.si.jr(n);return M.resolve(r)}containsKey(e,n){return M.resolve(this.si.containsKey(n))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Y0{constructor(e,n){this._i={},this.overlays={},this.ai=new Il(0),this.ui=!1,this.ui=!0,this.ci=new Yk,this.referenceDelegate=e(this),this.li=new eR(this),this.indexManager=new Uk,this.remoteDocumentCache=function(i){return new Jk(i)}(r=>this.referenceDelegate.hi(r)),this.serializer=new bk(n),this.Pi=new Kk(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ui=!1,Promise.resolve()}get started(){return this.ui}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let n=this.overlays[e.toKey()];return n||(n=new Qk,this.overlays[e.toKey()]=n),n}getMutationQueue(e,n){let r=this._i[e.toKey()];return r||(r=new Xk(n,this.referenceDelegate),this._i[e.toKey()]=r),r}getGlobalsCache(){return this.ci}getTargetCache(){return this.li}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.Pi}runTransaction(e,n,r){z("MemoryPersistence","Starting transaction:",e);const i=new tR(this.ai.next());return this.referenceDelegate.Ti(),r(i).next(s=>this.referenceDelegate.Ei(i).next(()=>s)).toPromise().then(s=>(i.raiseOnCommittedEvent(),s))}Ii(e,n){return M.or(Object.values(this._i).map(r=>()=>r.containsKey(e,n)))}}class tR extends kS{constructor(e){super(),this.currentSequenceNumber=e}}class jd{constructor(e){this.persistence=e,this.Ri=new Fd,this.Ai=null}static Vi(e){return new jd(e)}get di(){if(this.Ai)return this.Ai;throw G(60996)}addReference(e,n,r){return this.Ri.addReference(r,n),this.di.delete(r.toString()),M.resolve()}removeReference(e,n,r){return this.Ri.removeReference(r,n),this.di.add(r.toString()),M.resolve()}markPotentiallyOrphaned(e,n){return this.di.add(n.toString()),M.resolve()}removeTarget(e,n){this.Ri.Gr(n.targetId).forEach(i=>this.di.add(i.toString()));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,n.targetId).next(i=>{i.forEach(s=>this.di.add(s.toString()))}).next(()=>r.removeTargetData(e,n))}Ti(){this.Ai=new Set}Ei(e){const n=this.persistence.getRemoteDocumentCache().newChangeBuffer();return M.forEach(this.di,r=>{const i=q.fromPath(r);return this.mi(e,i).next(s=>{s||n.removeEntry(i,Y.min())})}).next(()=>(this.Ai=null,n.apply(e)))}updateLimboDocument(e,n){return this.mi(e,n).next(r=>{r?this.di.delete(n.toString()):this.di.add(n.toString())})}hi(e){return 0}mi(e,n){return M.or([()=>M.resolve(this.Ri.containsKey(n)),()=>this.persistence.getTargetCache().containsKey(e,n),()=>this.persistence.Ii(e,n)])}}class Wl{constructor(e,n){this.persistence=e,this.fi=new qr(r=>PS(r.path),(r,i)=>r.isEqual(i)),this.garbageCollector=Hk(this,n)}static Vi(e,n){return new Wl(e,n)}Ti(){}Ei(e){return M.resolve()}forEachTarget(e,n){return this.persistence.getTargetCache().forEachTarget(e,n)}dr(e){const n=this.pr(e);return this.persistence.getTargetCache().getTargetCount(e).next(r=>n.next(i=>r+i))}pr(e){let n=0;return this.mr(e,r=>{n++}).next(()=>n)}mr(e,n){return M.forEach(this.fi,(r,i)=>this.wr(e,r,i).next(s=>s?M.resolve():n(i)))}removeTargets(e,n,r){return this.persistence.getTargetCache().removeTargets(e,n,r)}removeOrphanedDocuments(e,n){let r=0;const i=this.persistence.getRemoteDocumentCache(),s=i.newChangeBuffer();return i.ni(e,o=>this.wr(e,o,n).next(l=>{l||(r++,s.removeEntry(o,Y.min()))})).next(()=>s.apply(e)).next(()=>r)}markPotentiallyOrphaned(e,n){return this.fi.set(n,e.currentSequenceNumber),M.resolve()}removeTarget(e,n){const r=n.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,n,r){return this.fi.set(r,e.currentSequenceNumber),M.resolve()}removeReference(e,n,r){return this.fi.set(r,e.currentSequenceNumber),M.resolve()}updateLimboDocument(e,n){return this.fi.set(n,e.currentSequenceNumber),M.resolve()}hi(e){let n=e.key.toString().length;return e.isFoundDocument()&&(n+=Dl(e.data.value)),n}wr(e,n,r){return M.or([()=>this.persistence.Ii(e,n),()=>this.persistence.getTargetCache().containsKey(e,n),()=>{const i=this.fi.get(n);return M.resolve(i!==void 0&&i>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bd{constructor(e,n,r,i){this.targetId=e,this.fromCache=n,this.Ts=r,this.Es=i}static Is(e,n){let r=ne(),i=ne();for(const s of n.docChanges)switch(s.type){case 0:r=r.add(s.doc.key);break;case 1:i=i.add(s.doc.key)}return new Bd(e,n.fromCache,r,i)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nR{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rR{constructor(){this.Rs=!1,this.As=!1,this.Vs=100,this.ds=function(){return HA()?8:RS(Ye())>0?6:4}()}initialize(e,n){this.fs=e,this.indexManager=n,this.Rs=!0}getDocumentsMatchingQuery(e,n,r,i){const s={result:null};return this.gs(e,n).next(o=>{s.result=o}).next(()=>{if(!s.result)return this.ps(e,n,i,r).next(o=>{s.result=o})}).next(()=>{if(s.result)return;const o=new nR;return this.ys(e,n,o).next(l=>{if(s.result=l,this.As)return this.ws(e,n,o,l.size)})}).next(()=>s.result)}ws(e,n,r,i){return r.documentReadCount<this.Vs?(bi()<=ee.DEBUG&&z("QueryEngine","SDK will not create cache indexes for query:",zi(n),"since it only creates cache indexes for collection contains","more than or equal to",this.Vs,"documents"),M.resolve()):(bi()<=ee.DEBUG&&z("QueryEngine","Query:",zi(n),"scans",r.documentReadCount,"local documents and returns",i,"documents as results."),r.documentReadCount>this.ds*i?(bi()<=ee.DEBUG&&z("QueryEngine","The SDK decides to create cache indexes for query:",zi(n),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Kt(n))):M.resolve())}gs(e,n){if(d0(n))return M.resolve(null);let r=Kt(n);return this.indexManager.getIndexType(e,r).next(i=>i===0?null:(n.limit!==null&&i===1&&(n=Ml(n,null,"F"),r=Kt(n)),this.indexManager.getDocumentsMatchingTarget(e,r).next(s=>{const o=ne(...s);return this.fs.getDocuments(e,o).next(l=>this.indexManager.getMinOffset(e,r).next(u=>{const h=this.Ss(n,l);return this.bs(n,h,o,u.readTime)?this.gs(e,Ml(n,null,"F")):this.Ds(e,h,n,u)}))})))}ps(e,n,r,i){return d0(n)||i.isEqual(Y.min())?M.resolve(null):this.fs.getDocuments(e,r).next(s=>{const o=this.Ss(n,s);return this.bs(n,o,r,i)?M.resolve(null):(bi()<=ee.DEBUG&&z("QueryEngine","Re-using previous result from %s to execute query: %s",i.toString(),zi(n)),this.Ds(e,o,n,TS(i,wo)).next(l=>l))})}Ss(e,n){let r=new Oe(m0(e));return n.forEach((i,s)=>{Ll(e,s)&&(r=r.add(s))}),r}bs(e,n,r,i){if(e.limit===null)return!1;if(r.size!==n.size)return!0;const s=e.limitType==="F"?n.last():n.first();return!!s&&(s.hasPendingWrites||s.version.compareTo(i)>0)}ys(e,n,r){return bi()<=ee.DEBUG&&z("QueryEngine","Using full collection scan to execute query:",zi(n)),this.fs.getDocumentsMatchingQuery(e,n,Jn.min(),r)}Ds(e,n,r,i){return this.fs.getDocumentsMatchingQuery(e,r,i).next(s=>(n.forEach(o=>{s=s.insert(o.key,o)}),s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $d="LocalStore",iR=3e8;class sR{constructor(e,n,r,i){this.persistence=e,this.Cs=n,this.serializer=i,this.vs=new ye(te),this.Fs=new qr(s=>Ad(s),Sd),this.Ms=new Map,this.xs=e.getRemoteDocumentCache(),this.li=e.getTargetCache(),this.Pi=e.getBundleCache(),this.Os(r)}Os(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new Gk(this.xs,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.xs.setIndexManager(this.indexManager),this.Cs.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",n=>e.collect(n,this.vs))}}function oR(t,e,n,r){return new sR(t,e,n,r)}async function X0(t,e){const n=X(t);return await n.persistence.runTransaction("Handle user change","readonly",r=>{let i;return n.mutationQueue.getAllMutationBatches(r).next(s=>(i=s,n.Os(e),n.mutationQueue.getAllMutationBatches(r))).next(s=>{const o=[],l=[];let u=ne();for(const h of i){o.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}for(const h of s){l.push(h.batchId);for(const f of h.mutations)u=u.add(f.key)}return n.localDocuments.getDocuments(r,u).next(h=>({Ns:h,removedBatchIds:o,addedBatchIds:l}))})})}function aR(t,e){const n=X(t);return n.persistence.runTransaction("Acknowledge batch","readwrite-primary",r=>{const i=e.batch.keys(),s=n.xs.newChangeBuffer({trackRemovals:!0});return function(l,u,h,f){const y=h.batch,g=y.keys();let k=M.resolve();return g.forEach(V=>{k=k.next(()=>f.getEntry(u,V)).next(O=>{const v=h.docVersions.get(V);oe(v!==null,48541),O.version.compareTo(v)<0&&(y.applyToRemoteDocument(O,h),O.isValidDocument()&&(O.setReadTime(h.commitVersion),f.addEntry(O)))})}),k.next(()=>l.mutationQueue.removeMutationBatch(u,y))}(n,r,e,s).next(()=>s.apply(r)).next(()=>n.mutationQueue.performConsistencyCheck(r)).next(()=>n.documentOverlayCache.removeOverlaysForBatchId(r,i,e.batch.batchId)).next(()=>n.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,function(l){let u=ne();for(let h=0;h<l.mutationResults.length;++h)l.mutationResults[h].transformResults.length>0&&(u=u.add(l.batch.mutations[h].key));return u}(e))).next(()=>n.localDocuments.getDocuments(r,i))})}function J0(t){const e=X(t);return e.persistence.runTransaction("Get last remote snapshot version","readonly",n=>e.li.getLastRemoteSnapshotVersion(n))}function lR(t,e){const n=X(t),r=e.snapshotVersion;let i=n.vs;return n.persistence.runTransaction("Apply remote event","readwrite-primary",s=>{const o=n.xs.newChangeBuffer({trackRemovals:!0});i=n.vs;const l=[];e.targetChanges.forEach((f,y)=>{const g=i.get(y);if(!g)return;l.push(n.li.removeMatchingKeys(s,f.removedDocuments,y).next(()=>n.li.addMatchingKeys(s,f.addedDocuments,y)));let k=g.withSequenceNumber(s.currentSequenceNumber);e.targetMismatches.get(y)!==null?k=k.withResumeToken(ze.EMPTY_BYTE_STRING,Y.min()).withLastLimboFreeSnapshotVersion(Y.min()):f.resumeToken.approximateByteSize()>0&&(k=k.withResumeToken(f.resumeToken,r)),i=i.insert(y,k),function(O,v,E){return O.resumeToken.approximateByteSize()===0||v.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=iR?!0:E.addedDocuments.size+E.modifiedDocuments.size+E.removedDocuments.size>0}(g,k,f)&&l.push(n.li.updateTargetData(s,k))});let u=pn(),h=ne();if(e.documentUpdates.forEach(f=>{e.resolvedLimboDocuments.has(f)&&l.push(n.persistence.referenceDelegate.updateLimboDocument(s,f))}),l.push(uR(s,o,e.documentUpdates).next(f=>{u=f.Bs,h=f.Ls})),!r.isEqual(Y.min())){const f=n.li.getLastRemoteSnapshotVersion(s).next(y=>n.li.setTargetsMetadata(s,s.currentSequenceNumber,r));l.push(f)}return M.waitFor(l).next(()=>o.apply(s)).next(()=>n.localDocuments.getLocalViewOfDocuments(s,u,h)).next(()=>u)}).then(s=>(n.vs=i,s))}function uR(t,e,n){let r=ne(),i=ne();return n.forEach(s=>r=r.add(s)),e.getEntries(t,r).next(s=>{let o=pn();return n.forEach((l,u)=>{const h=s.get(l);u.isFoundDocument()!==h.isFoundDocument()&&(i=i.add(l)),u.isNoDocument()&&u.version.isEqual(Y.min())?(e.removeEntry(l,u.readTime),o=o.insert(l,u)):!h.isValidDocument()||u.version.compareTo(h.version)>0||u.version.compareTo(h.version)===0&&h.hasPendingWrites?(e.addEntry(u),o=o.insert(l,u)):z($d,"Ignoring outdated watch update for ",l,". Current version:",h.version," Watch version:",u.version)}),{Bs:o,Ls:i}})}function cR(t,e){const n=X(t);return n.persistence.runTransaction("Get next mutation batch","readonly",r=>(e===void 0&&(e=_d),n.mutationQueue.getNextMutationBatchAfterBatchId(r,e)))}function hR(t,e){const n=X(t);return n.persistence.runTransaction("Allocate target","readwrite",r=>{let i;return n.li.getTargetData(r,e).next(s=>s?(i=s,M.resolve(i)):n.li.allocateTargetId(r).next(o=>(i=new ir(e,o,"TargetPurposeListen",r.currentSequenceNumber),n.li.addTargetData(r,i).next(()=>i))))}).then(r=>{const i=n.vs.get(r.targetId);return(i===null||r.snapshotVersion.compareTo(i.snapshotVersion)>0)&&(n.vs=n.vs.insert(r.targetId,r),n.Fs.set(e,r.targetId)),r})}async function zd(t,e,n){const r=X(t),i=r.vs.get(e),s=n?"readwrite":"readwrite-primary";try{n||await r.persistence.runTransaction("Release target",s,o=>r.persistence.referenceDelegate.removeTarget(o,i))}catch(o){if(!Fi(o))throw o;z($d,`Failed to update sequence numbers for target ${e}: ${o}`)}r.vs=r.vs.remove(e),r.Fs.delete(i.target)}function Z0(t,e,n){const r=X(t);let i=Y.min(),s=ne();return r.persistence.runTransaction("Execute query","readwrite",o=>function(u,h,f){const y=X(u),g=y.Fs.get(f);return g!==void 0?M.resolve(y.vs.get(g)):y.li.getTargetData(h,f)}(r,o,Kt(e)).next(l=>{if(l)return i=l.lastLimboFreeSnapshotVersion,r.li.getMatchingKeysForTargetId(o,l.targetId).next(u=>{s=u})}).next(()=>r.Cs.getDocumentsMatchingQuery(o,e,n?i:Y.min(),n?s:ne())).next(l=>(dR(r,YS(e),l),{documents:l,ks:s})))}function dR(t,e,n){let r=t.Ms.get(e)||Y.min();n.forEach((i,s)=>{s.readTime.compareTo(r)>0&&(r=s.readTime)}),t.Ms.set(e,r)}class e1{constructor(){this.activeTargetIds=nk()}Qs(e){this.activeTargetIds=this.activeTargetIds.add(e)}Gs(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Ws(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class fR{constructor(){this.vo=new e1,this.Fo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,n,r){}addLocalQueryTarget(e,n=!0){return n&&this.vo.Qs(e),this.Fo[e]||"not-current"}updateQueryState(e,n,r){this.Fo[e]=n}removeLocalQueryTarget(e){this.vo.Gs(e)}isLocalQueryTarget(e){return this.vo.activeTargetIds.has(e)}clearQueryState(e){delete this.Fo[e]}getAllActiveQueryTargets(){return this.vo.activeTargetIds}isActiveQueryTarget(e){return this.vo.activeTargetIds.has(e)}start(){return this.vo=new e1,Promise.resolve()}handleUserChange(e,n,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pR{Mo(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const t1="ConnectivityMonitor";class n1{constructor(){this.xo=()=>this.Oo(),this.No=()=>this.Bo(),this.Lo=[],this.ko()}Mo(e){this.Lo.push(e)}shutdown(){window.removeEventListener("online",this.xo),window.removeEventListener("offline",this.No)}ko(){window.addEventListener("online",this.xo),window.addEventListener("offline",this.No)}Oo(){z(t1,"Network connectivity changed: AVAILABLE");for(const e of this.Lo)e(0)}Bo(){z(t1,"Network connectivity changed: UNAVAILABLE");for(const e of this.Lo)e(1)}static v(){return typeof window!="undefined"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Gl=null;function Hd(){return Gl===null?Gl=function(){return 268435456+Math.round(2147483648*Math.random())}():Gl++,"0x"+Gl.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qd="RestConnection",mR={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class gR{get qo(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const n=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),i=encodeURIComponent(this.databaseId.database);this.Ko=n+"://"+e.host,this.Uo=`projects/${r}/databases/${i}`,this.$o=this.databaseId.database===Cl?`project_id=${r}`:`project_id=${r}&database_id=${i}`}Wo(e,n,r,i,s){const o=Hd(),l=this.Qo(e,n.toUriEncodedString());z(qd,`Sending RPC '${e}' ${o}:`,l,r);const u={"google-cloud-resource-prefix":this.Uo,"x-goog-request-params":this.$o};this.Go(u,i,s);const{host:h}=new URL(l),f=Fr(h);return this.zo(e,l,u,r,f).then(y=>(z(qd,`Received RPC '${e}' ${o}: `,y),y),y=>{throw Hr(qd,`RPC '${e}' ${o} failed with error: `,y,"url: ",l,"request:",r),y})}jo(e,n,r,i,s,o){return this.Wo(e,n,r,i,s)}Go(e,n,r){e["X-Goog-Api-Client"]=function(){return"gl-js/ fire/"+Mi}(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),n&&n.headers.forEach((i,s)=>e[s]=i),r&&r.headers.forEach((i,s)=>e[s]=i)}Qo(e,n){const r=mR[e];let i=`${this.Ko}/v1/${n}:${r}`;return this.databaseInfo.apiKey&&(i=`${i}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),i}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yR{constructor(e){this.Jo=e.Jo,this.Ho=e.Ho}Zo(e){this.Xo=e}Yo(e){this.e_=e}t_(e){this.n_=e}onMessage(e){this.r_=e}close(){this.Ho()}send(e){this.Jo(e)}i_(){this.Xo()}s_(){this.e_()}o_(e){this.n_(e)}__(e){this.r_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ze="WebChannelConnection",Lo=(t,e,n)=>{t.listen(e,r=>{try{n(r)}catch(i){setTimeout(()=>{throw i},0)}})};class Gi extends gR{constructor(e){super(e),this.a_=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static u_(){if(!Gi.c_){const e=k_();Lo(e,S_.STAT_EVENT,n=>{n.stat===fd.PROXY?z(Ze,"STAT_EVENT: detected buffering proxy"):n.stat===fd.NOPROXY&&z(Ze,"STAT_EVENT: detected no buffering proxy")}),Gi.c_=!0}}zo(e,n,r,i,s){const o=Hd();return new Promise((l,u)=>{const h=new I_;h.setWithCredentials(!0),h.listenOnce(A_.COMPLETE,()=>{try{switch(h.getLastErrorCode()){case wl.NO_ERROR:const y=h.getResponseJson();z(Ze,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(y)),l(y);break;case wl.TIMEOUT:z(Ze,`RPC '${e}' ${o} timed out`),u(new j(x.DEADLINE_EXCEEDED,"Request time out"));break;case wl.HTTP_ERROR:const g=h.getStatus();if(z(Ze,`RPC '${e}' ${o} failed with status:`,g,"response text:",h.getResponseText()),g>0){let k=h.getResponseJson();Array.isArray(k)&&(k=k[0]);const V=k==null?void 0:k.error;if(V&&V.status&&V.message){const O=function(E){const I=E.toLowerCase().replace(/_/g,"-");return Object.values(x).indexOf(I)>=0?I:x.UNKNOWN}(V.status);u(new j(O,V.message))}else u(new j(x.UNKNOWN,"Server responded with status "+h.getStatus()))}else u(new j(x.UNAVAILABLE,"Connection failed."));break;default:G(9055,{l_:e,streamId:o,h_:h.getLastErrorCode(),P_:h.getLastError()})}}finally{z(Ze,`RPC '${e}' ${o} completed.`)}});const f=JSON.stringify(i);z(Ze,`RPC '${e}' ${o} sending request:`,i),h.send(n,"POST",f,r,15)})}T_(e,n,r){const i=Hd(),s=[this.Ko,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),l={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(l.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(l.useFetchStreams=!0),this.Go(l.initMessageHeaders,n,r),l.encodeInitMessageHeaders=!0;const h=s.join("");z(Ze,`Creating RPC '${e}' stream ${i}: ${h}`,l);const f=o.createWebChannel(h,l);this.E_(f);let y=!1,g=!1;const k=new yR({Jo:V=>{g?z(Ze,`Not sending because RPC '${e}' stream ${i} is closed:`,V):(y||(z(Ze,`Opening RPC '${e}' stream ${i} transport.`),f.open(),y=!0),z(Ze,`RPC '${e}' stream ${i} sending:`,V),f.send(V))},Ho:()=>f.close()});return Lo(f,vo.EventType.OPEN,()=>{g||(z(Ze,`RPC '${e}' stream ${i} transport opened.`),k.i_())}),Lo(f,vo.EventType.CLOSE,()=>{g||(g=!0,z(Ze,`RPC '${e}' stream ${i} transport closed`),k.o_(),this.I_(f))}),Lo(f,vo.EventType.ERROR,V=>{g||(g=!0,Hr(Ze,`RPC '${e}' stream ${i} transport errored. Name:`,V.name,"Message:",V.message),k.o_(new j(x.UNAVAILABLE,"The operation could not be completed")))}),Lo(f,vo.EventType.MESSAGE,V=>{var O;if(!g){const v=V.data[0];oe(!!v,16349);const E=v,I=(E==null?void 0:E.error)||((O=E[0])==null?void 0:O.error);if(I){z(Ze,`RPC '${e}' stream ${i} received error:`,I);const P=I.status;let N=function(w){const m=Pe[w];if(m!==void 0)return N0(m)}(P),F=I.message;P==="NOT_FOUND"&&F.includes("database")&&F.includes("does not exist")&&F.includes(this.databaseId.database)&&Hr(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),N===void 0&&(N=x.INTERNAL,F="Unknown error status: "+P+" with message "+I.message),g=!0,k.o_(new j(N,F)),f.close()}else z(Ze,`RPC '${e}' stream ${i} received:`,v),k.__(v)}}),Gi.u_(),setTimeout(()=>{k.s_()},0),k}terminate(){this.a_.forEach(e=>e.close()),this.a_=[]}E_(e){this.a_.push(e)}I_(e){this.a_=this.a_.filter(n=>n===e)}Go(e,n,r){super.Go(e,n,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return R_()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _R(t){return new Gi(t)}function Wd(){return typeof document!="undefined"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Kl(t){return new Tk(t,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Gi.c_=!1;class r1{constructor(e,n,r=1e3,i=1.5,s=6e4){this.Ci=e,this.timerId=n,this.R_=r,this.A_=i,this.V_=s,this.d_=0,this.m_=null,this.f_=Date.now(),this.reset()}reset(){this.d_=0}g_(){this.d_=this.V_}p_(e){this.cancel();const n=Math.floor(this.d_+this.y_()),r=Math.max(0,Date.now()-this.f_),i=Math.max(0,n-r);i>0&&z("ExponentialBackoff",`Backing off for ${i} ms (base delay: ${this.d_} ms, delay with jitter: ${n} ms, last attempt: ${r} ms ago)`),this.m_=this.Ci.enqueueAfterDelay(this.timerId,i,()=>(this.f_=Date.now(),e())),this.d_*=this.A_,this.d_<this.R_&&(this.d_=this.R_),this.d_>this.V_&&(this.d_=this.V_)}w_(){this.m_!==null&&(this.m_.skipDelay(),this.m_=null)}cancel(){this.m_!==null&&(this.m_.cancel(),this.m_=null)}y_(){return(Math.random()-.5)*this.d_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const i1="PersistentStream";class s1{constructor(e,n,r,i,s,o,l,u){this.Ci=e,this.S_=r,this.b_=i,this.connection=s,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=l,this.listener=u,this.state=0,this.D_=0,this.C_=null,this.v_=null,this.stream=null,this.F_=0,this.M_=new r1(e,n)}x_(){return this.state===1||this.state===5||this.O_()}O_(){return this.state===2||this.state===3}start(){this.F_=0,this.state!==4?this.auth():this.N_()}async stop(){this.x_()&&await this.close(0)}B_(){this.state=0,this.M_.reset()}L_(){this.O_()&&this.C_===null&&(this.C_=this.Ci.enqueueAfterDelay(this.S_,6e4,()=>this.k_()))}q_(e){this.K_(),this.stream.send(e)}async k_(){if(this.O_())return this.close(0)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}U_(){this.v_&&(this.v_.cancel(),this.v_=null)}async close(e,n){this.K_(),this.U_(),this.M_.cancel(),this.D_++,e!==4?this.M_.reset():n&&n.code===x.RESOURCE_EXHAUSTED?(dn(n.toString()),dn("Using maximum backoff delay to prevent overloading the backend."),this.M_.g_()):n&&n.code===x.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.W_(),this.stream.close(),this.stream=null),this.state=e,await this.listener.t_(n)}W_(){}auth(){this.state=1;const e=this.Q_(this.D_),n=this.D_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then(([r,i])=>{this.D_===n&&this.G_(r,i)},r=>{e(()=>{const i=new j(x.UNKNOWN,"Fetching auth token failed: "+r.message);return this.z_(i)})})}G_(e,n){const r=this.Q_(this.D_);this.stream=this.j_(e,n),this.stream.Zo(()=>{r(()=>this.listener.Zo())}),this.stream.Yo(()=>{r(()=>(this.state=2,this.v_=this.Ci.enqueueAfterDelay(this.b_,1e4,()=>(this.O_()&&(this.state=3),Promise.resolve())),this.listener.Yo()))}),this.stream.t_(i=>{r(()=>this.z_(i))}),this.stream.onMessage(i=>{r(()=>++this.F_==1?this.J_(i):this.onNext(i))})}N_(){this.state=5,this.M_.p_(async()=>{this.state=0,this.start()})}z_(e){return z(i1,`close with error: ${e}`),this.stream=null,this.close(4,e)}Q_(e){return n=>{this.Ci.enqueueAndForget(()=>this.D_===e?n():(z(i1,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve()))}}}class vR extends s1{constructor(e,n,r,i,s,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}j_(e,n){return this.connection.T_("Listen",e,n)}J_(e){return this.onNext(e)}onNext(e){this.M_.reset();const n=Sk(this.serializer,e),r=function(s){if(!("targetChange"in s))return Y.min();const o=s.targetChange;return o.targetIds&&o.targetIds.length?Y.min():o.readTime?Qt(o.readTime):Y.min()}(e);return this.listener.H_(n,r)}Z_(e){const n={};n.database=Ud(this.serializer),n.addTarget=function(s,o){let l;const u=o.target;if(l=kd(u)?{documents:Ck(s,u)}:{query:Pk(s,u).ft},l.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){l.resumeToken=L0(s,o.resumeToken);const h=Od(s,o.expectedCount);h!==null&&(l.expectedCount=h)}else if(o.snapshotVersion.compareTo(Y.min())>0){l.readTime=ql(s,o.snapshotVersion.toTimestamp());const h=Od(s,o.expectedCount);h!==null&&(l.expectedCount=h)}return l}(this.serializer,e);const r=Dk(this.serializer,e);r&&(n.labels=r),this.q_(n)}X_(e){const n={};n.database=Ud(this.serializer),n.removeTarget=e,this.q_(n)}}class ER extends s1{constructor(e,n,r,i,s,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",n,r,i,o),this.serializer=s}get Y_(){return this.F_>0}start(){this.lastStreamToken=void 0,super.start()}W_(){this.Y_&&this.ea([])}j_(e,n){return this.connection.T_("Write",e,n)}J_(e){return oe(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,oe(!e.writeResults||e.writeResults.length===0,55816),this.listener.ta()}onNext(e){oe(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.M_.reset();const n=Rk(e.writeResults,e.commitTime),r=Qt(e.commitTime);return this.listener.na(r,n)}ra(){const e={};e.database=Ud(this.serializer),this.q_(e)}ea(e){const n={streamToken:this.lastStreamToken,writes:e.map(r=>kk(this.serializer,r))};this.q_(n)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wR{}class TR extends wR{constructor(e,n,r,i){super(),this.authCredentials=e,this.appCheckCredentials=n,this.connection=r,this.serializer=i,this.ia=!1}sa(){if(this.ia)throw new j(x.FAILED_PRECONDITION,"The client has already been terminated.")}Wo(e,n,r,i){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([s,o])=>this.connection.Wo(e,Md(n,r),i,s,o)).catch(s=>{throw s.name==="FirebaseError"?(s.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),s):new j(x.UNKNOWN,s.toString())})}jo(e,n,r,i,s){return this.sa(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then(([o,l])=>this.connection.jo(e,Md(n,r),i,o,l,s)).catch(o=>{throw o.name==="FirebaseError"?(o.code===x.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new j(x.UNKNOWN,o.toString())})}terminate(){this.ia=!0,this.connection.terminate()}}function IR(t,e,n,r){return new TR(t,e,n,r)}class AR{constructor(e,n){this.asyncQueue=e,this.onlineStateHandler=n,this.state="Unknown",this.oa=0,this._a=null,this.aa=!0}ua(){this.oa===0&&(this.ca("Unknown"),this._a=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,()=>(this._a=null,this.la("Backend didn't respond within 10 seconds."),this.ca("Offline"),Promise.resolve())))}ha(e){this.state==="Online"?this.ca("Unknown"):(this.oa++,this.oa>=1&&(this.Pa(),this.la(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ca("Offline")))}set(e){this.Pa(),this.oa=0,e==="Online"&&(this.aa=!1),this.ca(e)}ca(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}la(e){const n=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.aa?(dn(n),this.aa=!1):z("OnlineStateTracker",n)}Pa(){this._a!==null&&(this._a.cancel(),this._a=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gr="RemoteStore";class SR{constructor(e,n,r,i,s){this.localStore=e,this.datastore=n,this.asyncQueue=r,this.remoteSyncer={},this.Ta=[],this.Ea=new Map,this.Ia=new Set,this.Ra=[],this.Aa=s,this.Aa.Mo(o=>{r.enqueueAndForget(async()=>{Kr(this)&&(z(Gr,"Restarting streams for network reachability change."),await async function(u){const h=X(u);h.Ia.add(4),await Uo(h),h.Va.set("Unknown"),h.Ia.delete(4),await Ql(h)}(this))})}),this.Va=new AR(r,i)}}async function Ql(t){if(Kr(t))for(const e of t.Ra)await e(!0)}async function Uo(t){for(const e of t.Ra)await e(!1)}function o1(t,e){const n=X(t);n.Ea.has(e.targetId)||(n.Ea.set(e.targetId,e),Yd(n)?Qd(n):Ki(n).O_()&&Kd(n,e))}function Gd(t,e){const n=X(t),r=Ki(n);n.Ea.delete(e),r.O_()&&a1(n,e),n.Ea.size===0&&(r.O_()?r.L_():Kr(n)&&n.Va.set("Unknown"))}function Kd(t,e){if(t.da.$e(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(Y.min())>0){const n=t.remoteSyncer.getRemoteKeysForTarget(e.targetId).size;e=e.withExpectedCount(n)}Ki(t).Z_(e)}function a1(t,e){t.da.$e(e),Ki(t).X_(e)}function Qd(t){t.da=new _k({getRemoteKeysForTarget:e=>t.remoteSyncer.getRemoteKeysForTarget(e),At:e=>t.Ea.get(e)||null,ht:()=>t.datastore.serializer.databaseId}),Ki(t).start(),t.Va.ua()}function Yd(t){return Kr(t)&&!Ki(t).x_()&&t.Ea.size>0}function Kr(t){return X(t).Ia.size===0}function l1(t){t.da=void 0}async function kR(t){t.Va.set("Online")}async function RR(t){t.Ea.forEach((e,n)=>{Kd(t,e)})}async function CR(t,e){l1(t),Yd(t)?(t.Va.ha(e),Qd(t)):t.Va.set("Unknown")}async function PR(t,e,n){if(t.Va.set("Online"),e instanceof x0&&e.state===2&&e.cause)try{await async function(i,s){const o=s.cause;for(const l of s.targetIds)i.Ea.has(l)&&(await i.remoteSyncer.rejectListen(l,o),i.Ea.delete(l),i.da.removeTarget(l))}(t,e)}catch(r){z(Gr,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await Yl(t,r)}else if(e instanceof zl?t.da.Xe(e):e instanceof O0?t.da.st(e):t.da.tt(e),!n.isEqual(Y.min()))try{const r=await J0(t.localStore);n.compareTo(r)>=0&&await function(s,o){const l=s.da.Tt(o);return l.targetChanges.forEach((u,h)=>{if(u.resumeToken.approximateByteSize()>0){const f=s.Ea.get(h);f&&s.Ea.set(h,f.withResumeToken(u.resumeToken,o))}}),l.targetMismatches.forEach((u,h)=>{const f=s.Ea.get(u);if(!f)return;s.Ea.set(u,f.withResumeToken(ze.EMPTY_BYTE_STRING,f.snapshotVersion)),a1(s,u);const y=new ir(f.target,u,h,f.sequenceNumber);Kd(s,y)}),s.remoteSyncer.applyRemoteEvent(l)}(t,n)}catch(r){z(Gr,"Failed to raise snapshot:",r),await Yl(t,r)}}async function Yl(t,e,n){if(!Fi(e))throw e;t.Ia.add(1),await Uo(t),t.Va.set("Offline"),n||(n=()=>J0(t.localStore)),t.asyncQueue.enqueueRetryable(async()=>{z(Gr,"Retrying IndexedDB access"),await n(),t.Ia.delete(1),await Ql(t)})}function u1(t,e){return e().catch(n=>Yl(t,n,e))}async function Xl(t){const e=X(t),n=sr(e);let r=e.Ta.length>0?e.Ta[e.Ta.length-1].batchId:_d;for(;NR(e);)try{const i=await cR(e.localStore,r);if(i===null){e.Ta.length===0&&n.L_();break}r=i.batchId,DR(e,i)}catch(i){await Yl(e,i)}c1(e)&&h1(e)}function NR(t){return Kr(t)&&t.Ta.length<10}function DR(t,e){t.Ta.push(e);const n=sr(t);n.O_()&&n.Y_&&n.ea(e.mutations)}function c1(t){return Kr(t)&&!sr(t).x_()&&t.Ta.length>0}function h1(t){sr(t).start()}async function VR(t){sr(t).ra()}async function OR(t){const e=sr(t);for(const n of t.Ta)e.ea(n.mutations)}async function xR(t,e,n){const r=t.Ta.shift(),i=Nd.from(r,e,n);await u1(t,()=>t.remoteSyncer.applySuccessfulWrite(i)),await Xl(t)}async function MR(t,e){e&&sr(t).Y_&&await async function(r,i){if(function(o){return mk(o)&&o!==x.ABORTED}(i.code)){const s=r.Ta.shift();sr(r).B_(),await u1(r,()=>r.remoteSyncer.rejectFailedWrite(s.batchId,i)),await Xl(r)}}(t,e),c1(t)&&h1(t)}async function d1(t,e){const n=X(t);n.asyncQueue.verifyOperationInProgress(),z(Gr,"RemoteStore received new credentials");const r=Kr(n);n.Ia.add(3),await Uo(n),r&&n.Va.set("Unknown"),await n.remoteSyncer.handleCredentialChange(e),n.Ia.delete(3),await Ql(n)}async function bR(t,e){const n=X(t);e?(n.Ia.delete(2),await Ql(n)):e||(n.Ia.add(2),await Uo(n),n.Va.set("Unknown"))}function Ki(t){return t.ma||(t.ma=function(n,r,i){const s=X(n);return s.sa(),new vR(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Zo:kR.bind(null,t),Yo:RR.bind(null,t),t_:CR.bind(null,t),H_:PR.bind(null,t)}),t.Ra.push(async e=>{e?(t.ma.B_(),Yd(t)?Qd(t):t.Va.set("Unknown")):(await t.ma.stop(),l1(t))})),t.ma}function sr(t){return t.fa||(t.fa=function(n,r,i){const s=X(n);return s.sa(),new ER(r,s.connection,s.authCredentials,s.appCheckCredentials,s.serializer,i)}(t.datastore,t.asyncQueue,{Zo:()=>Promise.resolve(),Yo:VR.bind(null,t),t_:MR.bind(null,t),ta:OR.bind(null,t),na:xR.bind(null,t)}),t.Ra.push(async e=>{e?(t.fa.B_(),await Xl(t)):(await t.fa.stop(),t.Ta.length>0&&(z(Gr,`Stopping write stream with ${t.Ta.length} pending writes`),t.Ta=[]))})),t.fa}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xd{constructor(e,n,r,i,s){this.asyncQueue=e,this.timerId=n,this.targetTimeMs=r,this.op=i,this.removalCallback=s,this.deferred=new fn,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch(o=>{})}get promise(){return this.deferred.promise}static createAndSchedule(e,n,r,i,s){const o=Date.now()+r,l=new Xd(e,n,o,i,s);return l.start(r),l}start(e){this.timerHandle=setTimeout(()=>this.handleDelayElapsed(),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new j(x.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget(()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then(e=>this.deferred.resolve(e))):Promise.resolve())}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Jd(t,e){if(dn("AsyncQueue",`${e}: ${t}`),Fi(t))return new j(x.UNAVAILABLE,`${e}: ${t}`);throw t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{static emptySet(e){return new Qi(e.comparator)}constructor(e){this.comparator=e?(n,r)=>e(n,r)||q.comparator(n.key,r.key):(n,r)=>q.comparator(n.key,r.key),this.keyedMap=Co(),this.sortedSet=new ye(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const n=this.keyedMap.get(e);return n?this.sortedSet.indexOf(n):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal((n,r)=>(e(n),!1))}add(e){const n=this.delete(e.key);return n.copy(n.keyedMap.insert(e.key,e),n.sortedSet.insert(e,null))}delete(e){const n=this.get(e);return n?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(n)):this}isEqual(e){if(!(e instanceof Qi)||this.size!==e.size)return!1;const n=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;n.hasNext();){const i=n.getNext().key,s=r.getNext().key;if(!i.isEqual(s))return!1}return!0}toString(){const e=[];return this.forEach(n=>{e.push(n.toString())}),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`  
`)+`
)`}copy(e,n){const r=new Qi;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=n,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class f1{constructor(){this.ga=new ye(q.comparator)}track(e){const n=e.doc.key,r=this.ga.get(n);r?e.type!==0&&r.type===3?this.ga=this.ga.insert(n,e):e.type===3&&r.type!==1?this.ga=this.ga.insert(n,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.ga=this.ga.insert(n,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.ga=this.ga.remove(n):e.type===1&&r.type===2?this.ga=this.ga.insert(n,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.ga=this.ga.insert(n,{type:2,doc:e.doc}):G(63341,{Vt:e,pa:r}):this.ga=this.ga.insert(n,e)}ya(){const e=[];return this.ga.inorderTraversal((n,r)=>{e.push(r)}),e}}class Yi{constructor(e,n,r,i,s,o,l,u,h){this.query=e,this.docs=n,this.oldDocs=r,this.docChanges=i,this.mutatedKeys=s,this.fromCache=o,this.syncStateChanged=l,this.excludesMetadataChanges=u,this.hasCachedResults=h}static fromInitialDocuments(e,n,r,i,s){const o=[];return n.forEach(l=>{o.push({type:0,doc:l})}),new Yi(e,n,Qi.emptySet(n),o,r,i,!0,!1,s)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&bl(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const n=this.docChanges,r=e.docChanges;if(n.length!==r.length)return!1;for(let i=0;i<n.length;i++)if(n[i].type!==r[i].type||!n[i].doc.isEqual(r[i].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class LR{constructor(){this.wa=void 0,this.Sa=[]}ba(){return this.Sa.some(e=>e.Da())}}class UR{constructor(){this.queries=p1(),this.onlineState="Unknown",this.Ca=new Set}terminate(){(function(n,r){const i=X(n),s=i.queries;i.queries=p1(),s.forEach((o,l)=>{for(const u of l.Sa)u.onError(r)})})(this,new j(x.ABORTED,"Firestore shutting down"))}}function p1(){return new qr(t=>p0(t),bl)}async function Zd(t,e){const n=X(t);let r=3;const i=e.query;let s=n.queries.get(i);s?!s.ba()&&e.Da()&&(r=2):(s=new LR,r=e.Da()?0:1);try{switch(r){case 0:s.wa=await n.onListen(i,!0);break;case 1:s.wa=await n.onListen(i,!1);break;case 2:await n.onFirstRemoteStoreListen(i)}}catch(o){const l=Jd(o,`Initialization of query '${zi(e.query)}' failed`);return void e.onError(l)}n.queries.set(i,s),s.Sa.push(e),e.va(n.onlineState),s.wa&&e.Fa(s.wa)&&tf(n)}async function ef(t,e){const n=X(t),r=e.query;let i=3;const s=n.queries.get(r);if(s){const o=s.Sa.indexOf(e);o>=0&&(s.Sa.splice(o,1),s.Sa.length===0?i=e.Da()?0:1:!s.ba()&&e.Da()&&(i=2))}switch(i){case 0:return n.queries.delete(r),n.onUnlisten(r,!0);case 1:return n.queries.delete(r),n.onUnlisten(r,!1);case 2:return n.onLastRemoteStoreUnlisten(r);default:return}}function FR(t,e){const n=X(t);let r=!1;for(const i of e){const s=i.query,o=n.queries.get(s);if(o){for(const l of o.Sa)l.Fa(i)&&(r=!0);o.wa=i}}r&&tf(n)}function jR(t,e,n){const r=X(t),i=r.queries.get(e);if(i)for(const s of i.Sa)s.onError(n);r.queries.delete(e)}function tf(t){t.Ca.forEach(e=>{e.next()})}var nf,m1;(m1=nf||(nf={})).Ma="default",m1.Cache="cache";class rf{constructor(e,n,r){this.query=e,this.xa=n,this.Oa=!1,this.Na=null,this.onlineState="Unknown",this.options=r||{}}Fa(e){if(!this.options.includeMetadataChanges){const r=[];for(const i of e.docChanges)i.type!==3&&r.push(i);e=new Yi(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let n=!1;return this.Oa?this.Ba(e)&&(this.xa.next(e),n=!0):this.La(e,this.onlineState)&&(this.ka(e),n=!0),this.Na=e,n}onError(e){this.xa.error(e)}va(e){this.onlineState=e;let n=!1;return this.Na&&!this.Oa&&this.La(this.Na,e)&&(this.ka(this.Na),n=!0),n}La(e,n){if(!e.fromCache||!this.Da())return!0;const r=n!=="Offline";return(!this.options.qa||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||n==="Offline")}Ba(e){if(e.docChanges.length>0)return!0;const n=this.Na&&this.Na.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!n)&&this.options.includeMetadataChanges===!0}ka(e){e=Yi.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Oa=!0,this.xa.next(e)}Da(){return this.options.source!==nf.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class g1{constructor(e){this.key=e}}class y1{constructor(e){this.key=e}}class BR{constructor(e,n){this.query=e,this.Za=n,this.Xa=null,this.hasCachedResults=!1,this.current=!1,this.Ya=ne(),this.mutatedKeys=ne(),this.eu=m0(e),this.tu=new Qi(this.eu)}get nu(){return this.Za}ru(e,n){const r=n?n.iu:new f1,i=n?n.tu:this.tu;let s=n?n.mutatedKeys:this.mutatedKeys,o=i,l=!1;const u=this.query.limitType==="F"&&i.size===this.query.limit?i.last():null,h=this.query.limitType==="L"&&i.size===this.query.limit?i.first():null;if(e.inorderTraversal((f,y)=>{const g=i.get(f),k=Ll(this.query,y)?y:null,V=!!g&&this.mutatedKeys.has(g.key),O=!!k&&(k.hasLocalMutations||this.mutatedKeys.has(k.key)&&k.hasCommittedMutations);let v=!1;g&&k?g.data.isEqual(k.data)?V!==O&&(r.track({type:3,doc:k}),v=!0):this.su(g,k)||(r.track({type:2,doc:k}),v=!0,(u&&this.eu(k,u)>0||h&&this.eu(k,h)<0)&&(l=!0)):!g&&k?(r.track({type:0,doc:k}),v=!0):g&&!k&&(r.track({type:1,doc:g}),v=!0,(u||h)&&(l=!0)),v&&(k?(o=o.add(k),s=O?s.add(f):s.delete(f)):(o=o.delete(f),s=s.delete(f)))}),this.query.limit!==null)for(;o.size>this.query.limit;){const f=this.query.limitType==="F"?o.last():o.first();o=o.delete(f.key),s=s.delete(f.key),r.track({type:1,doc:f})}return{tu:o,iu:r,bs:l,mutatedKeys:s}}su(e,n){return e.hasLocalMutations&&n.hasCommittedMutations&&!n.hasLocalMutations}applyChanges(e,n,r,i){const s=this.tu;this.tu=e.tu,this.mutatedKeys=e.mutatedKeys;const o=e.iu.ya();o.sort((f,y)=>function(k,V){const O=v=>{switch(v){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return G(20277,{Vt:v})}};return O(k)-O(V)}(f.type,y.type)||this.eu(f.doc,y.doc)),this.ou(r),i=i!=null?i:!1;const l=n&&!i?this._u():[],u=this.Ya.size===0&&this.current&&!i?1:0,h=u!==this.Xa;return this.Xa=u,o.length!==0||h?{snapshot:new Yi(this.query,e.tu,s,o,e.mutatedKeys,u===0,h,!1,!!r&&r.resumeToken.approximateByteSize()>0),au:l}:{au:l}}va(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({tu:this.tu,iu:new f1,mutatedKeys:this.mutatedKeys,bs:!1},!1)):{au:[]}}uu(e){return!this.Za.has(e)&&!!this.tu.has(e)&&!this.tu.get(e).hasLocalMutations}ou(e){e&&(e.addedDocuments.forEach(n=>this.Za=this.Za.add(n)),e.modifiedDocuments.forEach(n=>{}),e.removedDocuments.forEach(n=>this.Za=this.Za.delete(n)),this.current=e.current)}_u(){if(!this.current)return[];const e=this.Ya;this.Ya=ne(),this.tu.forEach(r=>{this.uu(r.key)&&(this.Ya=this.Ya.add(r.key))});const n=[];return e.forEach(r=>{this.Ya.has(r)||n.push(new y1(r))}),this.Ya.forEach(r=>{e.has(r)||n.push(new g1(r))}),n}cu(e){this.Za=e.ks,this.Ya=ne();const n=this.ru(e.documents);return this.applyChanges(n,!0)}lu(){return Yi.fromInitialDocuments(this.query,this.tu,this.mutatedKeys,this.Xa===0,this.hasCachedResults)}}const sf="SyncEngine";class $R{constructor(e,n,r){this.query=e,this.targetId=n,this.view=r}}class zR{constructor(e){this.key=e,this.hu=!1}}class HR{constructor(e,n,r,i,s,o){this.localStore=e,this.remoteStore=n,this.eventManager=r,this.sharedClientState=i,this.currentUser=s,this.maxConcurrentLimboResolutions=o,this.Pu={},this.Tu=new qr(l=>p0(l),bl),this.Eu=new Map,this.Iu=new Set,this.Ru=new ye(q.comparator),this.Au=new Map,this.Vu=new Fd,this.du={},this.mu=new Map,this.fu=Wi.ar(),this.onlineState="Unknown",this.gu=void 0}get isPrimaryClient(){return this.gu===!0}}async function qR(t,e,n=!0){const r=S1(t);let i;const s=r.Tu.get(e);return s?(r.sharedClientState.addLocalQueryTarget(s.targetId),i=s.view.lu()):i=await _1(r,e,n,!0),i}async function WR(t,e){const n=S1(t);await _1(n,e,!0,!1)}async function _1(t,e,n,r){const i=await hR(t.localStore,Kt(e)),s=i.targetId,o=t.sharedClientState.addLocalQueryTarget(s,n);let l;return r&&(l=await GR(t,e,s,o==="current",i.resumeToken)),t.isPrimaryClient&&n&&o1(t.remoteStore,i),l}async function GR(t,e,n,r,i){t.pu=(y,g,k)=>async function(O,v,E,I){let P=v.view.ru(E);P.bs&&(P=await Z0(O.localStore,v.query,!1).then(({documents:w})=>v.view.ru(w,P)));const N=I&&I.targetChanges.get(v.targetId),F=I&&I.targetMismatches.get(v.targetId)!=null,b=v.view.applyChanges(P,O.isPrimaryClient,N,F);return A1(O,v.targetId,b.au),b.snapshot}(t,y,g,k);const s=await Z0(t.localStore,e,!0),o=new BR(e,s.ks),l=o.ru(s.documents),u=bo.createSynthesizedTargetChangeForCurrentChange(n,r&&t.onlineState!=="Offline",i),h=o.applyChanges(l,t.isPrimaryClient,u);A1(t,n,h.au);const f=new $R(e,n,o);return t.Tu.set(e,f),t.Eu.has(n)?t.Eu.get(n).push(e):t.Eu.set(n,[e]),h.snapshot}async function KR(t,e,n){const r=X(t),i=r.Tu.get(e),s=r.Eu.get(i.targetId);if(s.length>1)return r.Eu.set(i.targetId,s.filter(o=>!bl(o,e))),void r.Tu.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(i.targetId),r.sharedClientState.isActiveQueryTarget(i.targetId)||await zd(r.localStore,i.targetId,!1).then(()=>{r.sharedClientState.clearQueryState(i.targetId),n&&Gd(r.remoteStore,i.targetId),of(r,i.targetId)}).catch(Ui)):(of(r,i.targetId),await zd(r.localStore,i.targetId,!0))}async function QR(t,e){const n=X(t),r=n.Tu.get(e),i=n.Eu.get(r.targetId);n.isPrimaryClient&&i.length===1&&(n.sharedClientState.removeLocalQueryTarget(r.targetId),Gd(n.remoteStore,r.targetId))}async function YR(t,e,n){const r=rC(t);try{const i=await function(o,l){const u=X(o),h=pe.now(),f=l.reduce((k,V)=>k.add(V.key),ne());let y,g;return u.persistence.runTransaction("Locally write mutations","readwrite",k=>{let V=pn(),O=ne();return u.xs.getEntries(k,f).next(v=>{V=v,V.forEach((E,I)=>{I.isValidDocument()||(O=O.add(E))})}).next(()=>u.localDocuments.getOverlayedDocuments(k,V)).next(v=>{y=v;const E=[];for(const I of l){const P=ck(I,y.get(I.key).overlayedDocument);P!=null&&E.push(new rr(I.key,P,n0(P.value.mapValue),gt.exists(!0)))}return u.mutationQueue.addMutationBatch(k,h,E,l)}).next(v=>{g=v;const E=v.applyToLocalDocumentSet(y,O);return u.documentOverlayCache.saveOverlays(k,v.batchId,E)})}).then(()=>({batchId:g.batchId,changes:y0(y)}))}(r.localStore,e);r.sharedClientState.addPendingMutation(i.batchId),function(o,l,u){let h=o.du[o.currentUser.toKey()];h||(h=new ye(te)),h=h.insert(l,u),o.du[o.currentUser.toKey()]=h}(r,i.batchId,n),await Fo(r,i.changes),await Xl(r.remoteStore)}catch(i){const s=Jd(i,"Failed to persist write");n.reject(s)}}async function v1(t,e){const n=X(t);try{const r=await lR(n.localStore,e);e.targetChanges.forEach((i,s)=>{const o=n.Au.get(s);o&&(oe(i.addedDocuments.size+i.modifiedDocuments.size+i.removedDocuments.size<=1,22616),i.addedDocuments.size>0?o.hu=!0:i.modifiedDocuments.size>0?oe(o.hu,14607):i.removedDocuments.size>0&&(oe(o.hu,42227),o.hu=!1))}),await Fo(n,r,e)}catch(r){await Ui(r)}}function E1(t,e,n){const r=X(t);if(r.isPrimaryClient&&n===0||!r.isPrimaryClient&&n===1){const i=[];r.Tu.forEach((s,o)=>{const l=o.view.va(e);l.snapshot&&i.push(l.snapshot)}),function(o,l){const u=X(o);u.onlineState=l;let h=!1;u.queries.forEach((f,y)=>{for(const g of y.Sa)g.va(l)&&(h=!0)}),h&&tf(u)}(r.eventManager,e),i.length&&r.Pu.H_(i),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function XR(t,e,n){const r=X(t);r.sharedClientState.updateQueryState(e,"rejected",n);const i=r.Au.get(e),s=i&&i.key;if(s){let o=new ye(q.comparator);o=o.insert(s,Je.newNoDocument(s,Y.min()));const l=ne().add(s),u=new $l(Y.min(),new Map,new ye(te),o,l);await v1(r,u),r.Ru=r.Ru.remove(s),r.Au.delete(e),af(r)}else await zd(r.localStore,e,!1).then(()=>of(r,e,n)).catch(Ui)}async function JR(t,e){const n=X(t),r=e.batch.batchId;try{const i=await aR(n.localStore,e);T1(n,r,null),w1(n,r),n.sharedClientState.updateMutationState(r,"acknowledged"),await Fo(n,i)}catch(i){await Ui(i)}}async function ZR(t,e,n){const r=X(t);try{const i=await function(o,l){const u=X(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",h=>{let f;return u.mutationQueue.lookupMutationBatch(h,l).next(y=>(oe(y!==null,37113),f=y.keys(),u.mutationQueue.removeMutationBatch(h,y))).next(()=>u.mutationQueue.performConsistencyCheck(h)).next(()=>u.documentOverlayCache.removeOverlaysForBatchId(h,f,l)).next(()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(h,f)).next(()=>u.localDocuments.getDocuments(h,f))})}(r.localStore,e);T1(r,e,n),w1(r,e),r.sharedClientState.updateMutationState(e,"rejected",n),await Fo(r,i)}catch(i){await Ui(i)}}function w1(t,e){(t.mu.get(e)||[]).forEach(n=>{n.resolve()}),t.mu.delete(e)}function T1(t,e,n){const r=X(t);let i=r.du[r.currentUser.toKey()];if(i){const s=i.get(e);s&&(n?s.reject(n):s.resolve(),i=i.remove(e)),r.du[r.currentUser.toKey()]=i}}function of(t,e,n=null){t.sharedClientState.removeLocalQueryTarget(e);for(const r of t.Eu.get(e))t.Tu.delete(r),n&&t.Pu.yu(r,n);t.Eu.delete(e),t.isPrimaryClient&&t.Vu.Gr(e).forEach(r=>{t.Vu.containsKey(r)||I1(t,r)})}function I1(t,e){t.Iu.delete(e.path.canonicalString());const n=t.Ru.get(e);n!==null&&(Gd(t.remoteStore,n),t.Ru=t.Ru.remove(e),t.Au.delete(n),af(t))}function A1(t,e,n){for(const r of n)r instanceof g1?(t.Vu.addReference(r.key,e),eC(t,r)):r instanceof y1?(z(sf,"Document no longer in limbo: "+r.key),t.Vu.removeReference(r.key,e),t.Vu.containsKey(r.key)||I1(t,r.key)):G(19791,{wu:r})}function eC(t,e){const n=e.key,r=n.path.canonicalString();t.Ru.get(n)||t.Iu.has(r)||(z(sf,"New document in limbo: "+n),t.Iu.add(r),af(t))}function af(t){for(;t.Iu.size>0&&t.Ru.size<t.maxConcurrentLimboResolutions;){const e=t.Iu.values().next().value;t.Iu.delete(e);const n=new q(ce.fromString(e)),r=t.fu.next();t.Au.set(r,new zR(n)),t.Ru=t.Ru.insert(n,r),o1(t.remoteStore,new ir(Kt(xl(n.path)),r,"TargetPurposeLimboResolution",Il.ce))}}async function Fo(t,e,n){const r=X(t),i=[],s=[],o=[];r.Tu.isEmpty()||(r.Tu.forEach((l,u)=>{o.push(r.pu(u,e,n).then(h=>{var f;if((h||n)&&r.isPrimaryClient){const y=h?!h.fromCache:(f=n==null?void 0:n.targetChanges.get(u.targetId))==null?void 0:f.current;r.sharedClientState.updateQueryState(u.targetId,y?"current":"not-current")}if(h){i.push(h);const y=Bd.Is(u.targetId,h);s.push(y)}}))}),await Promise.all(o),r.Pu.H_(i),await async function(u,h){const f=X(u);try{await f.persistence.runTransaction("notifyLocalViewChanges","readwrite",y=>M.forEach(h,g=>M.forEach(g.Ts,k=>f.persistence.referenceDelegate.addReference(y,g.targetId,k)).next(()=>M.forEach(g.Es,k=>f.persistence.referenceDelegate.removeReference(y,g.targetId,k)))))}catch(y){if(!Fi(y))throw y;z($d,"Failed to update sequence numbers: "+y)}for(const y of h){const g=y.targetId;if(!y.fromCache){const k=f.vs.get(g),V=k.snapshotVersion,O=k.withLastLimboFreeSnapshotVersion(V);f.vs=f.vs.insert(g,O)}}}(r.localStore,s))}async function tC(t,e){const n=X(t);if(!n.currentUser.isEqual(e)){z(sf,"User change. New user:",e.toKey());const r=await X0(n.localStore,e);n.currentUser=e,function(s,o){s.mu.forEach(l=>{l.forEach(u=>{u.reject(new j(x.CANCELLED,o))})}),s.mu.clear()}(n,"'waitForPendingWrites' promise is rejected due to a user change."),n.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await Fo(n,r.Ns)}}function nC(t,e){const n=X(t),r=n.Au.get(e);if(r&&r.hu)return ne().add(r.key);{let i=ne();const s=n.Eu.get(e);if(!s)return i;for(const o of s){const l=n.Tu.get(o);i=i.unionWith(l.view.nu)}return i}}function S1(t){const e=X(t);return e.remoteStore.remoteSyncer.applyRemoteEvent=v1.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=nC.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=XR.bind(null,e),e.Pu.H_=FR.bind(null,e.eventManager),e.Pu.yu=jR.bind(null,e.eventManager),e}function rC(t){const e=X(t);return e.remoteStore.remoteSyncer.applySuccessfulWrite=JR.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=ZR.bind(null,e),e}class Jl{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Kl(e.databaseInfo.databaseId),this.sharedClientState=this.Du(e),this.persistence=this.Cu(e),await this.persistence.start(),this.localStore=this.vu(e),this.gcScheduler=this.Fu(e,this.localStore),this.indexBackfillerScheduler=this.Mu(e,this.localStore)}Fu(e,n){return null}Mu(e,n){return null}vu(e){return oR(this.persistence,new rR,e.initialUser,this.serializer)}Cu(e){return new Y0(jd.Vi,this.serializer)}Du(e){return new fR}async terminate(){var e,n;(e=this.gcScheduler)==null||e.stop(),(n=this.indexBackfillerScheduler)==null||n.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Jl.provider={build:()=>new Jl};class iC extends Jl{constructor(e){super(),this.cacheSizeBytes=e}Fu(e,n){oe(this.persistence.referenceDelegate instanceof Wl,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new $k(r,e.asyncQueue,n)}Cu(e){const n=this.cacheSizeBytes!==void 0?ct.withCacheSize(this.cacheSizeBytes):ct.DEFAULT;return new Y0(r=>Wl.Vi(r,n),this.serializer)}}class lf{async initialize(e,n){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(n),this.remoteStore=this.createRemoteStore(n),this.eventManager=this.createEventManager(n),this.syncEngine=this.createSyncEngine(n,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>E1(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=tC.bind(null,this.syncEngine),await bR(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return function(){return new UR}()}createDatastore(e){const n=Kl(e.databaseInfo.databaseId),r=_R(e.databaseInfo);return IR(e.authCredentials,e.appCheckCredentials,r,n)}createRemoteStore(e){return function(r,i,s,o,l){return new SR(r,i,s,o,l)}(this.localStore,this.datastore,e.asyncQueue,n=>E1(this.syncEngine,n,0),function(){return n1.v()?new n1:new pR}())}createSyncEngine(e,n){return function(i,s,o,l,u,h,f){const y=new HR(i,s,o,l,u,h);return f&&(y.gu=!0),y}(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,n)}async terminate(){var e,n;await async function(i){const s=X(i);z(Gr,"RemoteStore shutting down."),s.Ia.add(5),await Uo(s),s.Aa.shutdown(),s.Va.set("Unknown")}(this.remoteStore),(e=this.datastore)==null||e.terminate(),(n=this.eventManager)==null||n.terminate()}}lf.provider={build:()=>new lf};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class uf{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ou(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ou(this.observer.error,e):dn("Uncaught Error in snapshot listener:",e.toString()))}Nu(){this.muted=!0}Ou(e,n){setTimeout(()=>{this.muted||e(n)},0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const or="FirestoreClient";class sC{constructor(e,n,r,i,s){this.authCredentials=e,this.appCheckCredentials=n,this.asyncQueue=r,this._databaseInfo=i,this.user=Xe.UNAUTHENTICATED,this.clientId=md.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=s,this.authCredentials.start(r,async o=>{z(or,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o}),this.appCheckCredentials.start(r,o=>(z(or,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user)))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new fn;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted(async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(n){const r=Jd(n,"Failed to shutdown persistence");e.reject(r)}}),e.promise}}async function cf(t,e){t.asyncQueue.verifyOperationInProgress(),z(or,"Initializing OfflineComponentProvider");const n=t.configuration;await e.initialize(n);let r=n.initialUser;t.setCredentialChangeListener(async i=>{r.isEqual(i)||(await X0(e.localStore,i),r=i)}),e.persistence.setDatabaseDeletedListener(()=>t.terminate()),t._offlineComponents=e}async function k1(t,e){t.asyncQueue.verifyOperationInProgress();const n=await oC(t);z(or,"Initializing OnlineComponentProvider"),await e.initialize(n,t.configuration),t.setCredentialChangeListener(r=>d1(e.remoteStore,r)),t.setAppCheckTokenChangeListener((r,i)=>d1(e.remoteStore,i)),t._onlineComponents=e}async function oC(t){if(!t._offlineComponents)if(t._uninitializedComponentsProvider){z(or,"Using user provided OfflineComponentProvider");try{await cf(t,t._uninitializedComponentsProvider._offline)}catch(e){const n=e;if(!function(i){return i.name==="FirebaseError"?i.code===x.FAILED_PRECONDITION||i.code===x.UNIMPLEMENTED:!(typeof DOMException!="undefined"&&i instanceof DOMException)||i.code===22||i.code===20||i.code===11}(n))throw n;Hr("Error using user provided cache. Falling back to memory cache: "+n),await cf(t,new Jl)}}else z(or,"Using default OfflineComponentProvider"),await cf(t,new iC(void 0));return t._offlineComponents}async function R1(t){return t._onlineComponents||(t._uninitializedComponentsProvider?(z(or,"Using user provided OnlineComponentProvider"),await k1(t,t._uninitializedComponentsProvider._online)):(z(or,"Using default OnlineComponentProvider"),await k1(t,new lf))),t._onlineComponents}function aC(t){return R1(t).then(e=>e.syncEngine)}async function Zl(t){const e=await R1(t),n=e.eventManager;return n.onListen=qR.bind(null,e.syncEngine),n.onUnlisten=KR.bind(null,e.syncEngine),n.onFirstRemoteStoreListen=WR.bind(null,e.syncEngine),n.onLastRemoteStoreUnlisten=QR.bind(null,e.syncEngine),n}function lC(t,e,n,r){const i=new uf(r),s=new rf(e,i,n);return t.asyncQueue.enqueueAndForget(async()=>Zd(await Zl(t),s)),()=>{i.Nu(),t.asyncQueue.enqueueAndForget(async()=>ef(await Zl(t),s))}}function uC(t,e,n={}){const r=new fn;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,h){const f=new uf({next:g=>{f.Nu(),o.enqueueAndForget(()=>ef(s,y));const k=g.docs.has(l);!k&&g.fromCache?h.reject(new j(x.UNAVAILABLE,"Failed to get document because the client is offline.")):k&&g.fromCache&&u&&u.source==="server"?h.reject(new j(x.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):h.resolve(g)},error:g=>h.reject(g)}),y=new rf(xl(l.path),f,{includeMetadataChanges:!0,qa:!0});return Zd(s,y)}(await Zl(t),t.asyncQueue,e,n,r)),r.promise}function cC(t,e,n={}){const r=new fn;return t.asyncQueue.enqueueAndForget(async()=>function(s,o,l,u,h){const f=new uf({next:g=>{f.Nu(),o.enqueueAndForget(()=>ef(s,y)),g.fromCache&&u.source==="server"?h.reject(new j(x.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):h.resolve(g)},error:g=>h.reject(g)}),y=new rf(l,f,{includeMetadataChanges:!0,qa:!0});return Zd(s,y)}(await Zl(t),t.asyncQueue,e,n,r)),r.promise}function hC(t,e){const n=new fn;return t.asyncQueue.enqueueAndForget(async()=>YR(await aC(t),e,n)),n.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function C1(t){const e={};return t.timeoutSeconds!==void 0&&(e.timeoutSeconds=t.timeoutSeconds),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dC="ComponentProvider",P1=new Map;function fC(t,e,n,r,i){return new VS(t,e,n,i.host,i.ssl,i.experimentalForceLongPolling,i.experimentalAutoDetectLongPolling,C1(i.experimentalLongPollingOptions),i.useFetchStreams,i.isUsingEmulator,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const N1="firestore.googleapis.com",D1=!0;class V1{constructor(e){var n,r;if(e.host===void 0){if(e.ssl!==void 0)throw new j(x.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=N1,this.ssl=D1}else this.host=e.host,this.ssl=(n=e.ssl)!=null?n:D1;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e.cacheSizeBytes===void 0)this.cacheSizeBytes=G0;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<jk)throw new j(x.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}ES("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=C1((r=e.experimentalLongPollingOptions)!=null?r:{}),function(s){if(s.timeoutSeconds!==void 0){if(isNaN(s.timeoutSeconds))throw new j(x.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (must not be NaN)`);if(s.timeoutSeconds<5)throw new j(x.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (minimum allowed value is 5)`);if(s.timeoutSeconds>30)throw new j(x.INVALID_ARGUMENT,`invalid long polling timeout: ${s.timeoutSeconds} (maximum allowed value is 30)`)}}(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&function(r,i){return r.timeoutSeconds===i.timeoutSeconds}(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams}}class eu{constructor(e,n,r,i){this._authCredentials=e,this._appCheckCredentials=n,this._databaseId=r,this._app=i,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new V1({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new j(x.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new j(x.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new V1(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=function(r){if(!r)return new cS;switch(r.type){case"firstParty":return new pS(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new j(x.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}}(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return function(n){const r=P1.get(n);r&&(z(dC,"Removing Datastore"),P1.delete(n),r.terminate())}(this),Promise.resolve()}}function pC(t,e,n,r={}){var h;t=At(t,eu);const i=Fr(e),s=t._getSettings(),o=Lt(se({},s),{emulatorOptions:t._getEmulatorOptions()}),l=`${e}:${n}`;i&&ed(`https://${l}`),s.host!==N1&&s.host!==l&&Hr("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u=Lt(se({},s),{host:l,ssl:i,emulatorOptions:r});if(!Ur(u,o)&&(t._setSettings(u),r.mockUserToken)){let f,y;if(typeof r.mockUserToken=="string")f=r.mockUserToken,y=Xe.MOCK_USER;else{f=a_(r.mockUserToken,(h=t._app)==null?void 0:h.options.projectId);const g=r.mockUserToken.sub||r.mockUserToken.user_id;if(!g)throw new j(x.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");y=new Xe(g)}t._authCredentials=new hS(new P_(f,y))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mn{constructor(e,n,r){this.converter=n,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new mn(this.firestore,e,this._query)}}class ke{constructor(e,n,r){this.converter=n,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new ar(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ke(this.firestore,e,this._key)}toJSON(){return{type:ke._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,n,r){if(Eo(n,ke._jsonSchema))return new ke(e,r||null,new q(ce.fromString(n.referencePath)))}}ke._jsonSchemaVersion="firestore/documentReference/1.0",ke._jsonSchema={type:Re("string",ke._jsonSchemaVersion),referencePath:Re("string")};class ar extends mn{constructor(e,n,r){super(e,n,xl(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ke(this.firestore,null,new q(e))}withConverter(e){return new ar(this.firestore,e,this._path)}}function _O(t,e,...n){if(t=ge(t),V_("collection","path",e),t instanceof eu){const r=ce.fromString(e,...n);return x_(r),new ar(t,null,r)}{if(!(t instanceof ke||t instanceof ar))throw new j(x.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ce.fromString(e,...n));return x_(r),new ar(t.firestore,null,r)}}function mC(t,e,...n){if(t=ge(t),arguments.length===1&&(e=md.newId()),V_("doc","path",e),t instanceof eu){const r=ce.fromString(e,...n);return O_(r),new ke(t,null,new q(r))}{if(!(t instanceof ke||t instanceof ar))throw new j(x.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=t._path.child(ce.fromString(e,...n));return O_(r),new ke(t.firestore,t instanceof ar?t.converter:null,new q(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const O1="AsyncQueue";class x1{constructor(e=Promise.resolve()){this.Yu=[],this.ec=!1,this.tc=[],this.nc=null,this.rc=!1,this.sc=!1,this.oc=[],this.M_=new r1(this,"async_queue_retry"),this._c=()=>{const r=Wd();r&&z(O1,"Visibility state changed to "+r.visibilityState),this.M_.w_()},this.ac=e;const n=Wd();n&&typeof n.addEventListener=="function"&&n.addEventListener("visibilitychange",this._c)}get isShuttingDown(){return this.ec}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.uc(),this.cc(e)}enterRestrictedMode(e){if(!this.ec){this.ec=!0,this.sc=e||!1;const n=Wd();n&&typeof n.removeEventListener=="function"&&n.removeEventListener("visibilitychange",this._c)}}enqueue(e){if(this.uc(),this.ec)return new Promise(()=>{});const n=new fn;return this.cc(()=>this.ec&&this.sc?Promise.resolve():(e().then(n.resolve,n.reject),n.promise)).then(()=>n.promise)}enqueueRetryable(e){this.enqueueAndForget(()=>(this.Yu.push(e),this.lc()))}async lc(){if(this.Yu.length!==0){try{await this.Yu[0](),this.Yu.shift(),this.M_.reset()}catch(e){if(!Fi(e))throw e;z(O1,"Operation failed with retryable error: "+e)}this.Yu.length>0&&this.M_.p_(()=>this.lc())}}cc(e){const n=this.ac.then(()=>(this.rc=!0,e().catch(r=>{throw this.nc=r,this.rc=!1,dn("INTERNAL UNHANDLED ERROR: ",M1(r)),r}).then(r=>(this.rc=!1,r))));return this.ac=n,n}enqueueAfterDelay(e,n,r){this.uc(),this.oc.indexOf(e)>-1&&(n=0);const i=Xd.createAndSchedule(this,e,n,r,s=>this.hc(s));return this.tc.push(i),i}uc(){this.nc&&G(47125,{Pc:M1(this.nc)})}verifyOperationInProgress(){}async Tc(){let e;do e=this.ac,await e;while(e!==this.ac)}Ec(e){for(const n of this.tc)if(n.timerId===e)return!0;return!1}Ic(e){return this.Tc().then(()=>{this.tc.sort((n,r)=>n.targetTimeMs-r.targetTimeMs);for(const n of this.tc)if(n.skipDelay(),e!=="all"&&n.timerId===e)break;return this.Tc()})}Rc(e){this.oc.push(e)}hc(e){const n=this.tc.indexOf(e);this.tc.splice(n,1)}}function M1(t){let e=t.message||"";return t.stack&&(e=t.stack.includes(t.message)?t.stack:t.message+`
`+t.stack),e}class lr extends eu{constructor(e,n,r,i){super(e,n,r,i),this.type="firestore",this._queue=new x1,this._persistenceKey=(i==null?void 0:i.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new x1(e),this._firestoreClient=void 0,await e}}}function vO(t,e){const n=typeof t=="object"?t:hd(),r=typeof t=="string"?t:e||Cl,i=vl(n,"firestore").getImmediate({identifier:r});if(!i._initialized){const s=i_("firestore");s&&pC(i,...s)}return i}function jo(t){if(t._terminated)throw new j(x.FAILED_PRECONDITION,"The client has already been terminated.");return t._firestoreClient||gC(t),t._firestoreClient}function gC(t){var r,i,s,o;const e=t._freezeSettings(),n=fC(t._databaseId,((r=t._app)==null?void 0:r.options.appId)||"",t._persistenceKey,(i=t._app)==null?void 0:i.options.apiKey,e);t._componentsProvider||((s=e.localCache)==null?void 0:s._offlineComponentProvider)&&((o=e.localCache)==null?void 0:o._onlineComponentProvider)&&(t._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),t._firestoreClient=new sC(t._authCredentials,t._appCheckCredentials,t._queue,n,t._componentsProvider&&function(u){const h=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(h),_online:h}}(t._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class St{constructor(e){this._byteString=e}static fromBase64String(e){try{return new St(ze.fromBase64String(e))}catch(n){throw new j(x.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+n)}}static fromUint8Array(e){return new St(ze.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:St._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Eo(e,St._jsonSchema))return St.fromBase64String(e.bytes)}}St._jsonSchemaVersion="firestore/bytes/1.0",St._jsonSchema={type:Re("string",St._jsonSchemaVersion),bytes:Re("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tu{constructor(...e){for(let n=0;n<e.length;++n)if(e[n].length===0)throw new j(x.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Be(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nu{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Yt{constructor(e,n){if(!isFinite(e)||e<-90||e>90)throw new j(x.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(n)||n<-180||n>180)throw new j(x.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+n);this._lat=e,this._long=n}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return te(this._lat,e._lat)||te(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Yt._jsonSchemaVersion}}static fromJSON(e){if(Eo(e,Yt._jsonSchema))return new Yt(e.latitude,e.longitude)}}Yt._jsonSchemaVersion="firestore/geoPoint/1.0",Yt._jsonSchema={type:Re("string",Yt._jsonSchemaVersion),latitude:Re("number"),longitude:Re("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ot{constructor(e){this._values=(e||[]).map(n=>n)}toArray(){return this._values.map(e=>e)}isEqual(e){return function(r,i){if(r.length!==i.length)return!1;for(let s=0;s<r.length;++s)if(r[s]!==i[s])return!1;return!0}(this._values,e._values)}toJSON(){return{type:Ot._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Eo(e,Ot._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every(n=>typeof n=="number"))return new Ot(e.vectorValues);throw new j(x.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Ot._jsonSchemaVersion="firestore/vectorValue/1.0",Ot._jsonSchema={type:Re("string",Ot._jsonSchemaVersion),vectorValues:Re("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yC=/^__.*__$/;class _C{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return this.fieldMask!==null?new rr(e,this.data,this.fieldMask,n,this.fieldTransforms):new xo(e,this.data,n,this.fieldTransforms)}}class b1{constructor(e,n,r){this.data=e,this.fieldMask=n,this.fieldTransforms=r}toMutation(e,n){return new rr(e,this.data,this.fieldMask,n,this.fieldTransforms)}}function L1(t){switch(t){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw G(40011,{dataSource:t})}}class hf{constructor(e,n,r,i,s,o){this.settings=e,this.databaseId=n,this.serializer=r,this.ignoreUndefinedProperties=i,s===void 0&&this.Ac(),this.fieldTransforms=s||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(e){return new hf(se(se({},this.settings),e),this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}dc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.i({path:n,arrayElement:!1});return r.mc(e),r}fc(e){var i;const n=(i=this.path)==null?void 0:i.child(e),r=this.i({path:n,arrayElement:!1});return r.Ac(),r}gc(e){return this.i({path:void 0,arrayElement:!0})}yc(e){return su(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find(n=>e.isPrefixOf(n))!==void 0||this.fieldTransforms.find(n=>e.isPrefixOf(n.field))!==void 0}Ac(){if(this.path)for(let e=0;e<this.path.length;e++)this.mc(this.path.get(e))}mc(e){if(e.length===0)throw this.yc("Document fields must not be empty");if(L1(this.dataSource)&&yC.test(e))throw this.yc('Document fields cannot begin and end with "__"')}}class vC{constructor(e,n,r){this.databaseId=e,this.ignoreUndefinedProperties=n,this.serializer=r||Kl(e)}I(e,n,r,i=!1){return new hf({dataSource:e,methodName:n,targetDoc:r,path:Be.emptyPath(),arrayElement:!1,hasConverter:i},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function ru(t){const e=t._freezeSettings(),n=Kl(t._databaseId);return new vC(t._databaseId,!!e.ignoreUndefinedProperties,n)}function U1(t,e,n,r,i,s={}){const o=t.I(s.merge||s.mergeFields?2:0,e,n,i);ff("Data must be an object, but it was:",o,r);const l=B1(r,o);let u,h;if(s.merge)u=new mt(o.fieldMask),h=o.fieldTransforms;else if(s.mergeFields){const f=[];for(const y of s.mergeFields){const g=Qr(e,y,n);if(!o.contains(g))throw new j(x.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);H1(f,g)||f.push(g)}u=new mt(f),h=o.fieldTransforms.filter(y=>u.covers(y.field))}else u=null,h=o.fieldTransforms;return new _C(new ut(l),u,h)}class iu extends nu{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.yc(`${this._methodName}() can only appear at the top level of your update data`):e.yc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof iu}}class df extends nu{_toFieldTransform(e){return new ok(e.path,new No)}isEqual(e){return e instanceof df}}function F1(t,e,n,r){const i=t.I(1,e,n);ff("Data must be an object, but it was:",i,r);const s=[],o=ut.empty();Zn(r,(u,h)=>{const f=z1(e,u,n);h=ge(h);const y=i.fc(f);if(h instanceof iu)s.push(f);else{const g=Bo(h,y);g!=null&&(s.push(f),o.set(f,g))}});const l=new mt(s);return new b1(o,l,i.fieldTransforms)}function j1(t,e,n,r,i,s){const o=t.I(1,e,n),l=[Qr(e,r,n)],u=[i];if(s.length%2!=0)throw new j(x.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<s.length;g+=2)l.push(Qr(e,s[g])),u.push(s[g+1]);const h=[],f=ut.empty();for(let g=l.length-1;g>=0;--g)if(!H1(h,l[g])){const k=l[g];let V=u[g];V=ge(V);const O=o.fc(k);if(V instanceof iu)h.push(k);else{const v=Bo(V,O);v!=null&&(h.push(k),f.set(k,v))}}const y=new mt(h);return new b1(f,y,o.fieldTransforms)}function EC(t,e,n,r=!1){return Bo(n,t.I(r?4:3,e))}function Bo(t,e){if($1(t=ge(t)))return ff("Unsupported field value:",e,t),B1(t,e);if(t instanceof nu)return function(r,i){if(!L1(i.dataSource))throw i.yc(`${r._methodName}() can only be used with update() and set()`);if(!i.path)throw i.yc(`${r._methodName}() is not currently supported inside arrays`);const s=r._toFieldTransform(i);s&&i.fieldTransforms.push(s)}(t,e),null;if(t===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),t instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.yc("Nested arrays are not supported");return function(r,i){const s=[];let o=0;for(const l of r){let u=Bo(l,i.gc(o));u==null&&(u={nullValue:"NULL_VALUE"}),s.push(u),o++}return{arrayValue:{values:s}}}(t,e)}return function(r,i){if((r=ge(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return rk(i.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const s=pe.fromDate(r);return{timestampValue:ql(i.serializer,s)}}if(r instanceof pe){const s=new pe(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:ql(i.serializer,s)}}if(r instanceof Yt)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof St)return{bytesValue:L0(i.serializer,r._byteString)};if(r instanceof ke){const s=i.databaseId,o=r.firestore._databaseId;if(!o.isEqual(s))throw i.yc(`Document reference is for database ${o.projectId}/${o.database} but should be for database ${s.projectId}/${s.database}`);return{referenceValue:xd(r.firestore._databaseId||i.databaseId,r._key.path)}}if(r instanceof Ot)return function(o,l){const u=o instanceof Ot?o.toArray():o;return{mapValue:{fields:{[K_]:{stringValue:Y_},[Nl]:{arrayValue:{values:u.map(f=>{if(typeof f!="number")throw l.yc("VectorValues must only contain numeric values.");return Cd(l.serializer,f)})}}}}}}(r,i);if(q0(r))return r._toProto(i.serializer);throw i.yc(`Unsupported field value: ${Tl(r)}`)}(t,e)}function B1(t,e){const n={};return B_(t)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Zn(t,(r,i)=>{const s=Bo(i,e.dc(r));s!=null&&(n[r]=s)}),{mapValue:{fields:n}}}function $1(t){return!(typeof t!="object"||t===null||t instanceof Array||t instanceof Date||t instanceof pe||t instanceof Yt||t instanceof St||t instanceof ke||t instanceof nu||t instanceof Ot||q0(t))}function ff(t,e,n){if(!$1(n)||!M_(n)){const r=Tl(n);throw r==="an object"?e.yc(t+" a custom object"):e.yc(t+" "+r)}}function Qr(t,e,n){if((e=ge(e))instanceof tu)return e._internalPath;if(typeof e=="string")return z1(t,e);throw su("Field path arguments must be of type string or ",t,!1,void 0,n)}const wC=new RegExp("[~\\*/\\[\\]]");function z1(t,e,n){if(e.search(wC)>=0)throw su(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,t,!1,void 0,n);try{return new tu(...e.split("."))._internalPath}catch{throw su(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,t,!1,void 0,n)}}function su(t,e,n,r,i){const s=r&&!r.isEmpty(),o=i!==void 0;let l=`Function ${e}() called with invalid data`;n&&(l+=" (via `toFirestore()`)"),l+=". ";let u="";return(s||o)&&(u+=" (found",s&&(u+=` in field ${r}`),o&&(u+=` in document ${i}`),u+=")"),new j(x.INVALID_ARGUMENT,l+t+u)}function H1(t,e){return t.some(n=>n.isEqual(e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class TC{convertValue(e,n="none"){switch(nr(e)){case 0:return null;case 1:return e.booleanValue;case 2:return Se(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,n);case 5:return e.stringValue;case 6:return this.convertBytes(tr(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,n);case 11:return this.convertObject(e.mapValue,n);case 10:return this.convertVectorValue(e.mapValue);default:throw G(62114,{value:e})}}convertObject(e,n){return this.convertObjectMap(e.fields,n)}convertObjectMap(e,n="none"){const r={};return Zn(e,(i,s)=>{r[i]=this.convertValue(s,n)}),r}convertVectorValue(e){var r,i,s;const n=(s=(i=(r=e.fields)==null?void 0:r[Nl].arrayValue)==null?void 0:i.values)==null?void 0:s.map(o=>Se(o.doubleValue));return new Ot(n)}convertGeoPoint(e){return new Yt(Se(e.latitude),Se(e.longitude))}convertArray(e,n){return(e.values||[]).map(r=>this.convertValue(r,n))}convertServerTimestamp(e,n){switch(n){case"previous":const r=Rl(e);return r==null?null:this.convertValue(r,n);case"estimate":return this.convertTimestamp(To(e));default:return null}}convertTimestamp(e){const n=er(e);return new pe(n.seconds,n.nanos)}convertDocumentKey(e,n){const r=ce.fromString(e);oe(H0(r),9688,{name:e});const i=new Io(r.get(1),r.get(3)),s=new q(r.popFirst(5));return i.isEqual(n)||dn(`Document ${s} contains a document reference within a different database (${i.projectId}/${i.database}) which is not supported. It will be treated as a reference in the current database (${n.projectId}/${n.database}) instead.`),s}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pf extends TC{constructor(e){super(),this.firestore=e}convertBytes(e){return new St(e)}convertReference(e){const n=this.convertDocumentKey(e,this.firestore._databaseId);return new ke(this.firestore,null,n)}}function EO(){return new df("serverTimestamp")}const q1="@firebase/firestore",W1="4.14.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function G1(t){return function(n,r){if(typeof n!="object"||n===null)return!1;const i=n;for(const s of r)if(s in i&&typeof i[s]=="function")return!0;return!1}(t,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class K1{constructor(e,n,r,i,s){this._firestore=e,this._userDataWriter=n,this._key=r,this._document=i,this._converter=s}get id(){return this._key.path.lastSegment()}get ref(){return new ke(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new IC(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e,n;return(n=(e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)!=null?n:void 0}get(e){if(this._document){const n=this._document.data.field(Qr("DocumentSnapshot.get",e));if(n!==null)return this._userDataWriter.convertValue(n)}}}class IC extends K1{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Q1(t){if(t.limitType==="L"&&t.explicitOrderBy.length===0)throw new j(x.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class mf{}class gf extends mf{}function wO(t,e,...n){let r=[];e instanceof mf&&r.push(e),r=r.concat(n),function(s){const o=s.filter(u=>u instanceof yf).length,l=s.filter(u=>u instanceof ou).length;if(o>1||o>0&&l>0)throw new j(x.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")}(r);for(const i of r)t=i._apply(t);return t}class ou extends gf{constructor(e,n,r){super(),this._field=e,this._op=n,this._value=r,this.type="where"}static _create(e,n,r){return new ou(e,n,r)}_apply(e){const n=this._parse(e);return J1(e._query,n),new mn(e.firestore,e.converter,Rd(e._query,n))}_parse(e){const n=ru(e.firestore);return function(s,o,l,u,h,f,y){let g;if(h.isKeyField()){if(f==="array-contains"||f==="array-contains-any")throw new j(x.INVALID_ARGUMENT,`Invalid Query. You can't perform '${f}' queries on documentId().`);if(f==="in"||f==="not-in"){X1(y,f);const V=[];for(const O of y)V.push(Y1(u,s,O));g={arrayValue:{values:V}}}else g=Y1(u,s,y)}else f!=="in"&&f!=="not-in"&&f!=="array-contains-any"||X1(y,f),g=EC(l,o,y,f==="in"||f==="not-in");return Ce.create(h,f,g)}(e._query,"where",n,e.firestore._databaseId,this._field,this._op,this._value)}}function TO(t,e,n){const r=e,i=Qr("where",t);return ou._create(i,r,n)}class yf extends mf{constructor(e,n){super(),this.type=e,this._queryConstraints=n}static _create(e,n){return new yf(e,n)}_parse(e){const n=this._queryConstraints.map(r=>r._parse(e)).filter(r=>r.getFilters().length>0);return n.length===1?n[0]:Vt.create(n,this._getOperator())}_apply(e){const n=this._parse(e);return n.getFilters().length===0?e:(function(i,s){let o=i;const l=s.getFlattenedFilters();for(const u of l)J1(o,u),o=Rd(o,u)}(e._query,n),new mn(e.firestore,e.converter,Rd(e._query,n)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class _f extends gf{constructor(e,n){super(),this._field=e,this._direction=n,this.type="orderBy"}static _create(e,n){return new _f(e,n)}_apply(e){const n=function(i,s,o){if(i.startAt!==null)throw new j(x.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(i.endAt!==null)throw new j(x.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new ko(s,o)}(e._query,this._field,this._direction);return new mn(e.firestore,e.converter,QS(e._query,n))}}function IO(t,e="asc"){const n=e,r=Qr("orderBy",t);return _f._create(r,n)}class vf extends gf{constructor(e,n,r){super(),this.type=e,this._limit=n,this._limitType=r}static _create(e,n,r){return new vf(e,n,r)}_apply(e){return new mn(e.firestore,e.converter,Ml(e._query,this._limit,this._limitType))}}function AO(t){return wS("limit",t),vf._create("limit",t,"F")}function Y1(t,e,n){if(typeof(n=ge(n))=="string"){if(n==="")throw new j(x.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!f0(e)&&n.indexOf("/")!==-1)throw new j(x.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${n}' contains a '/' character.`);const r=e.path.child(ce.fromString(n));if(!q.isDocumentKey(r))throw new j(x.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Z_(t,new q(r))}if(n instanceof ke)return Z_(t,n._key);throw new j(x.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Tl(n)}.`)}function X1(t,e){if(!Array.isArray(t)||t.length===0)throw new j(x.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function J1(t,e){const n=function(i,s){for(const o of i)for(const l of o.getFlattenedFilters())if(s.indexOf(l.op)>=0)return l.op;return null}(t.filters,function(i){switch(i){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}}(e.op));if(n!==null)throw n===e.op?new j(x.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new j(x.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${n.toString()}' filters.`)}function Z1(t,e,n){let r;return r=t?n&&(n.merge||n.mergeFields)?t.toFirestore(e,n):t.toFirestore(e):e,r}class $o{constructor(e,n){this.hasPendingWrites=e,this.fromCache=n}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class Yr extends K1{constructor(e,n,r,i,s,o){super(e,n,r,i,o),this._firestore=e,this._firestoreImpl=e,this.metadata=s}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const n=new au(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(n,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,n={}){if(this._document){const r=this._document.data.field(Qr("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,n.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new j(x.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,n={};return n.type=Yr._jsonSchemaVersion,n.bundle="",n.bundleSource="DocumentSnapshot",n.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?n:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),n.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),n)}}Yr._jsonSchemaVersion="firestore/documentSnapshot/1.0",Yr._jsonSchema={type:Re("string",Yr._jsonSchemaVersion),bundleSource:Re("string","DocumentSnapshot"),bundleName:Re("string"),bundle:Re("string")};class au extends Yr{data(e={}){return super.data(e)}}class Xr{constructor(e,n,r,i){this._firestore=e,this._userDataWriter=n,this._snapshot=i,this.metadata=new $o(i.hasPendingWrites,i.fromCache),this.query=r}get docs(){const e=[];return this.forEach(n=>e.push(n)),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,n){this._snapshot.docs.forEach(r=>{e.call(n,new au(this._firestore,this._userDataWriter,r.key,r,new $o(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))})}docChanges(e={}){const n=!!e.includeMetadataChanges;if(n&&this._snapshot.excludesMetadataChanges)throw new j(x.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===n||(this._cachedChanges=function(i,s){if(i._snapshot.oldDocs.isEmpty()){let o=0;return i._snapshot.docChanges.map(l=>{const u=new au(i._firestore,i._userDataWriter,l.doc.key,l.doc,new $o(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);return l.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}})}{let o=i._snapshot.oldDocs;return i._snapshot.docChanges.filter(l=>s||l.type!==3).map(l=>{const u=new au(i._firestore,i._userDataWriter,l.doc.key,l.doc,new $o(i._snapshot.mutatedKeys.has(l.doc.key),i._snapshot.fromCache),i.query.converter);let h=-1,f=-1;return l.type!==0&&(h=o.indexOf(l.doc.key),o=o.delete(l.doc.key)),l.type!==1&&(o=o.add(l.doc),f=o.indexOf(l.doc.key)),{type:AC(l.type),doc:u,oldIndex:h,newIndex:f}})}}(this,n),this._cachedChangesIncludeMetadataChanges=n),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new j(x.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=Xr._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=md.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const n=[],r=[],i=[];return this.docs.forEach(s=>{s._document!==null&&(n.push(s._document),r.push(this._userDataWriter.convertObjectMap(s._document.data.value.mapValue.fields,"previous")),i.push(s.ref.path))}),e.bundle=(this._firestore,this.query._query,"NOT SUPPORTED"),e}}function AC(t){switch(t){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return G(61501,{type:t})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Xr._jsonSchemaVersion="firestore/querySnapshot/1.0",Xr._jsonSchema={type:Re("string",Xr._jsonSchemaVersion),bundleSource:Re("string","QuerySnapshot"),bundleName:Re("string"),bundle:Re("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class SC{constructor(e,n){this._firestore=e,this._commitHandler=n,this._mutations=[],this._committed=!1,this._dataReader=ru(e)}set(e,n,r){this._verifyNotCommitted();const i=Ef(e,this._firestore),s=Z1(i.converter,n,r),o=U1(this._dataReader,"WriteBatch.set",i._key,s,i.converter!==null,r);return this._mutations.push(o.toMutation(i._key,gt.none())),this}update(e,n,r,...i){this._verifyNotCommitted();const s=Ef(e,this._firestore);let o;return o=typeof(n=ge(n))=="string"||n instanceof tu?j1(this._dataReader,"WriteBatch.update",s._key,n,r,i):F1(this._dataReader,"WriteBatch.update",s._key,n),this._mutations.push(o.toMutation(s._key,gt.exists(!0))),this}delete(e){this._verifyNotCommitted();const n=Ef(e,this._firestore);return this._mutations=this._mutations.concat(new Pd(n._key,gt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new j(x.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function Ef(t,e){if((t=ge(t)).firestore!==e)throw new j(x.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function SO(t){t=At(t,ke);const e=At(t.firestore,lr),n=jo(e);return uC(n,t._key).then(r=>ev(e,t,r))}function kO(t){t=At(t,mn);const e=At(t.firestore,lr),n=jo(e),r=new pf(e);return Q1(t._query),cC(n,t._query).then(i=>new Xr(e,r,t,i))}function RO(t,e,n,...r){t=At(t,ke);const i=At(t.firestore,lr),s=ru(i);let o;return o=typeof(e=ge(e))=="string"||e instanceof tu?j1(s,"updateDoc",t._key,e,n,r):F1(s,"updateDoc",t._key,e),wf(i,[o.toMutation(t._key,gt.exists(!0))])}function CO(t,e){const n=At(t.firestore,lr),r=mC(t),i=Z1(t.converter,e),s=ru(t.firestore);return wf(n,[U1(s,"addDoc",r._key,i,t.converter!==null,{}).toMutation(r._key,gt.exists(!1))]).then(()=>r)}function PO(t,...e){var h,f,y;t=ge(t);let n={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||G1(e[r])||(n=e[r++]);const i={includeMetadataChanges:n.includeMetadataChanges,source:n.source};if(G1(e[r])){const g=e[r];e[r]=(h=g.next)==null?void 0:h.bind(g),e[r+1]=(f=g.error)==null?void 0:f.bind(g),e[r+2]=(y=g.complete)==null?void 0:y.bind(g)}let s,o,l;if(t instanceof ke)o=At(t.firestore,lr),l=xl(t._key.path),s={next:g=>{e[r]&&e[r](ev(o,t,g))},error:e[r+1],complete:e[r+2]};else{const g=At(t,mn);o=At(g.firestore,lr),l=g._query;const k=new pf(o);s={next:V=>{e[r]&&e[r](new Xr(o,k,g,V))},error:e[r+1],complete:e[r+2]},Q1(t._query)}const u=jo(o);return lC(u,l,i,s)}function wf(t,e){const n=jo(t);return hC(n,e)}function ev(t,e,n){const r=n.docs.get(e._key),i=new pf(t);return new Yr(t,i,e._key,r,new $o(n.hasPendingWrites,n.fromCache),e.converter)}function NO(t){return t=At(t,lr),jo(t),new SC(t,e=>wf(t,e))}(function(e,n=!0){uS($r),Br(new Kn("firestore",(r,{instanceIdentifier:i,options:s})=>{const o=r.getProvider("app").getImmediate(),l=new lr(new dS(r.getProvider("auth-internal")),new mS(o,r.getProvider("app-check-internal")),OS(o,i),o);return s=se({useFetchStreams:n},s),l._setSettings(s),l},"PUBLIC").setMultipleInstances(!0)),qt(q1,W1,e),qt(q1,W1,"esm2020")})();function tv(){return{["dependent-sdk-initialized-before-auth"]:"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const kC=tv,nv=new mo("auth","Firebase",tv());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lu=new td("@firebase/auth");function RC(t,...e){lu.logLevel<=ee.WARN&&lu.warn(`Auth (${$r}): ${t}`,...e)}function uu(t,...e){lu.logLevel<=ee.ERROR&&lu.error(`Auth (${$r}): ${t}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xt(t,...e){throw If(t,...e)}function Jt(t,...e){return If(t,...e)}function Tf(t,e,n){const r=Lt(se({},kC()),{[e]:n});return new mo("auth","Firebase",r).create(e,{appName:t.name})}function gn(t){return Tf(t,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function CC(t,e,n){const r=n;if(!(e instanceof r))throw r.name!==e.constructor.name&&Xt(t,"argument-error"),Tf(t,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function If(t,...e){if(typeof t!="string"){const n=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=t.name),t._errorFactory.create(n,...r)}return nv.create(t,...e)}function W(t,e,...n){if(!t)throw If(e,...n)}function yn(t){const e="INTERNAL ASSERTION FAILED: "+t;throw uu(e),new Error(e)}function _n(t,e){t||yn(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Af(){var t;return typeof self!="undefined"&&((t=self.location)==null?void 0:t.href)||""}function PC(){return rv()==="http:"||rv()==="https:"}function rv(){var t;return typeof self!="undefined"&&((t=self.location)==null?void 0:t.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function NC(){return typeof navigator!="undefined"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(PC()||BA()||"connection"in navigator)?navigator.onLine:!0}function DC(){if(typeof navigator=="undefined")return null;const t=navigator;return t.languages&&t.languages[0]||t.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zo{constructor(e,n){this.shortDelay=e,this.longDelay=n,_n(n>e,"Short delay should be less than long delay!"),this.isMobile=UA()||$A()}get(){return NC()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sf(t,e){_n(t.emulator,"Emulator should always be set here");const{url:n}=t.emulator;return e?`${n}${e.startsWith("/")?e.slice(1):e}`:n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iv{static initialize(e,n,r){this.fetchImpl=e,n&&(this.headersImpl=n),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self!="undefined"&&"fetch"in self)return self.fetch;if(typeof globalThis!="undefined"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch!="undefined")return fetch;yn("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self!="undefined"&&"Headers"in self)return self.Headers;if(typeof globalThis!="undefined"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers!="undefined")return Headers;yn("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self!="undefined"&&"Response"in self)return self.Response;if(typeof globalThis!="undefined"&&globalThis.Response)return globalThis.Response;if(typeof Response!="undefined")return Response;yn("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const VC={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OC=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],xC=new zo(3e4,6e4);function Xi(t,e){return t.tenantId&&!e.tenantId?Lt(se({},e),{tenantId:t.tenantId}):e}async function ur(t,e,n,r,i={}){return sv(t,i,async()=>{let s={},o={};r&&(e==="GET"?o=r:s={body:JSON.stringify(r)});const l=go(se({key:t.config.apiKey},o)).slice(1),u=await t._getAdditionalHeaders();u["Content-Type"]="application/json",t.languageCode&&(u["X-Firebase-Locale"]=t.languageCode);const h=se({method:e,headers:u},s);return jA()||(h.referrerPolicy="no-referrer"),t.emulatorConfig&&Fr(t.emulatorConfig.host)&&(h.credentials="include"),iv.fetch()(await av(t,t.config.apiHost,n,l),h)})}async function sv(t,e,n){t._canInitEmulator=!1;const r=se(se({},VC),e);try{const i=new bC(t),s=await Promise.race([n(),i.promise]);i.clearNetworkTimeout();const o=await s.json();if("needConfirmation"in o)throw cu(t,"account-exists-with-different-credential",o);if(s.ok&&!("errorMessage"in o))return o;{const l=s.ok?o.errorMessage:o.error.message,[u,h]=l.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw cu(t,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw cu(t,"email-already-in-use",o);if(u==="USER_DISABLED")throw cu(t,"user-disabled",o);const f=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(h)throw Tf(t,f,h);Xt(t,f)}}catch(i){if(i instanceof Ht)throw i;Xt(t,"network-request-failed",{message:String(i)})}}async function ov(t,e,n,r,i={}){const s=await ur(t,e,n,r,i);return"mfaPendingCredential"in s&&Xt(t,"multi-factor-auth-required",{_serverResponse:s}),s}async function av(t,e,n,r){const i=`${e}${n}?${r}`,s=t,o=s.config.emulator?Sf(t.config,i):`${t.config.apiScheme}://${i}`;return OC.includes(n)&&(await s._persistenceManagerAvailable,s._getPersistenceType()==="COOKIE")?s._getPersistence()._getFinalTarget(o).toString():o}function MC(t){switch(t){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class bC{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((n,r)=>{this.timer=setTimeout(()=>r(Jt(this.auth,"network-request-failed")),xC.get())})}}function cu(t,e,n){const r={appName:t.name};n.email&&(r.email=n.email),n.phoneNumber&&(r.phoneNumber=n.phoneNumber);const i=Jt(t,e,r);return i.customData._tokenResponse=n,i}function lv(t){return t!==void 0&&t.enterprise!==void 0}class LC{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const n of this.recaptchaEnforcementState)if(n.provider&&n.provider===e)return MC(n.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function UC(t,e){return ur(t,"GET","/v2/recaptchaConfig",Xi(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function FC(t,e){return ur(t,"POST","/v1/accounts:delete",e)}async function hu(t,e){return ur(t,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ho(t){if(!!t)try{const e=new Date(Number(t));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function jC(t,e=!1){const n=ge(t),r=await n.getIdToken(e),i=Rf(r);W(i&&i.exp&&i.auth_time&&i.iat,n.auth,"internal-error");const s=typeof i.firebase=="object"?i.firebase:void 0,o=s==null?void 0:s.sign_in_provider;return{claims:i,token:r,authTime:Ho(kf(i.auth_time)),issuedAtTime:Ho(kf(i.iat)),expirationTime:Ho(kf(i.exp)),signInProvider:o||null,signInSecondFactor:(s==null?void 0:s.sign_in_second_factor)||null}}function kf(t){return Number(t)*1e3}function Rf(t){const[e,n,r]=t.split(".");if(e===void 0||n===void 0||r===void 0)return uu("JWT malformed, contained fewer than 3 sections"),null;try{const i=n_(n);return i?JSON.parse(i):(uu("Failed to decode base64 JWT payload"),null)}catch(i){return uu("Caught error parsing JWT payload as JSON",i==null?void 0:i.toString()),null}}function uv(t){const e=Rf(t);return W(e,"internal-error"),W(typeof e.exp!="undefined","internal-error"),W(typeof e.iat!="undefined","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qo(t,e,n=!1){if(n)return e;try{return await e}catch(r){throw r instanceof Ht&&BC(r)&&t.auth.currentUser===t&&await t.auth.signOut(),r}}function BC({code:t}){return t==="auth/user-disabled"||t==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $C{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){!this.isRunning||(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){var n;if(e){const r=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),r}else{this.errorBackoff=3e4;const i=((n=this.user.stsTokenManager.expirationTime)!=null?n:0)-Date.now()-3e5;return Math.max(0,i)}}schedule(e=!1){if(!this.isRunning)return;const n=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},n)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cf{constructor(e,n){this.createdAt=e,this.lastLoginAt=n,this._initializeTime()}_initializeTime(){this.lastSignInTime=Ho(this.lastLoginAt),this.creationTime=Ho(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function du(t){var y;const e=t.auth,n=await t.getIdToken(),r=await qo(t,hu(e,{idToken:n}));W(r==null?void 0:r.users.length,e,"internal-error");const i=r.users[0];t._notifyReloadListener(i);const s=((y=i.providerUserInfo)==null?void 0:y.length)?cv(i.providerUserInfo):[],o=HC(t.providerData,s),l=t.isAnonymous,u=!(t.email&&i.passwordHash)&&!(o==null?void 0:o.length),h=l?u:!1,f={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:o,metadata:new Cf(i.createdAt,i.lastLoginAt),isAnonymous:h};Object.assign(t,f)}async function zC(t){const e=ge(t);await du(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function HC(t,e){return[...t.filter(r=>!e.some(i=>i.providerId===r.providerId)),...e]}function cv(t){return t.map(r=>{var i=r,{providerId:e}=i,n=ii(i,["providerId"]);return{providerId:e,uid:n.rawId||"",displayName:n.displayName||null,email:n.email||null,phoneNumber:n.phoneNumber||null,photoURL:n.photoUrl||null}})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qC(t,e){const n=await sv(t,{},async()=>{const r=go({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:i,apiKey:s}=t.config,o=await av(t,i,"/v1/token",`key=${s}`),l=await t._getAdditionalHeaders();l["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:l,body:r};return t.emulatorConfig&&Fr(t.emulatorConfig.host)&&(u.credentials="include"),iv.fetch()(o,u)});return{accessToken:n.access_token,expiresIn:n.expires_in,refreshToken:n.refresh_token}}async function WC(t,e){return ur(t,"POST","/v2/accounts:revokeToken",Xi(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ji{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){W(e.idToken,"internal-error"),W(typeof e.idToken!="undefined","internal-error"),W(typeof e.refreshToken!="undefined","internal-error");const n="expiresIn"in e&&typeof e.expiresIn!="undefined"?Number(e.expiresIn):uv(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,n)}updateFromIdToken(e){W(e.length!==0,"internal-error");const n=uv(e);this.updateTokensAndExpiration(e,null,n)}async getToken(e,n=!1){return!n&&this.accessToken&&!this.isExpired?this.accessToken:(W(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,n){const{accessToken:r,refreshToken:i,expiresIn:s}=await qC(e,n);this.updateTokensAndExpiration(r,i,Number(s))}updateTokensAndExpiration(e,n,r){this.refreshToken=n||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,n){const{refreshToken:r,accessToken:i,expirationTime:s}=n,o=new Ji;return r&&(W(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),i&&(W(typeof i=="string","internal-error",{appName:e}),o.accessToken=i),s&&(W(typeof s=="number","internal-error",{appName:e}),o.expirationTime=s),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new Ji,this.toJSON())}_performRefresh(){return yn("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cr(t,e){W(typeof t=="string"||typeof t=="undefined","internal-error",{appName:e})}class xt{constructor(s){var o=s,{uid:e,auth:n,stsTokenManager:r}=o,i=ii(o,["uid","auth","stsTokenManager"]);this.providerId="firebase",this.proactiveRefresh=new $C(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=n,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new Cf(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){const n=await qo(this,this.stsTokenManager.getToken(this.auth,e));return W(n,this.auth,"internal-error"),this.accessToken!==n&&(this.accessToken=n,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),n}getIdTokenResult(e){return jC(this,e)}reload(){return zC(this)}_assign(e){this!==e&&(W(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(n=>se({},n)),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const n=new xt(Lt(se({},this),{auth:e,stsTokenManager:this.stsTokenManager._clone()}));return n.metadata._copy(this.metadata),n}_onReload(e){W(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,n=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),n&&await du(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(pt(this.auth.app))return Promise.reject(gn(this.auth));const e=await this.getIdToken();return await qo(this,FC(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return Lt(se({uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>se({},e)),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId},this.metadata.toJSON()),{apiKey:this.auth.config.apiKey,appName:this.auth.name})}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,n){var I,P,N,F,b,w,m,_;const r=(I=n.displayName)!=null?I:void 0,i=(P=n.email)!=null?P:void 0,s=(N=n.phoneNumber)!=null?N:void 0,o=(F=n.photoURL)!=null?F:void 0,l=(b=n.tenantId)!=null?b:void 0,u=(w=n._redirectEventId)!=null?w:void 0,h=(m=n.createdAt)!=null?m:void 0,f=(_=n.lastLoginAt)!=null?_:void 0,{uid:y,emailVerified:g,isAnonymous:k,providerData:V,stsTokenManager:O}=n;W(y&&O,e,"internal-error");const v=Ji.fromJSON(this.name,O);W(typeof y=="string",e,"internal-error"),cr(r,e.name),cr(i,e.name),W(typeof g=="boolean",e,"internal-error"),W(typeof k=="boolean",e,"internal-error"),cr(s,e.name),cr(o,e.name),cr(l,e.name),cr(u,e.name),cr(h,e.name),cr(f,e.name);const E=new xt({uid:y,auth:e,email:i,emailVerified:g,displayName:r,isAnonymous:k,photoURL:o,phoneNumber:s,tenantId:l,stsTokenManager:v,createdAt:h,lastLoginAt:f});return V&&Array.isArray(V)&&(E.providerData=V.map(A=>se({},A))),u&&(E._redirectEventId=u),E}static async _fromIdTokenResponse(e,n,r=!1){const i=new Ji;i.updateFromServerResponse(n);const s=new xt({uid:n.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await du(s),s}static async _fromGetAccountInfoResponse(e,n,r){const i=n.users[0];W(i.localId!==void 0,"internal-error");const s=i.providerUserInfo!==void 0?cv(i.providerUserInfo):[],o=!(i.email&&i.passwordHash)&&!(s==null?void 0:s.length),l=new Ji;l.updateFromIdToken(r);const u=new xt({uid:i.localId,auth:e,stsTokenManager:l,isAnonymous:o}),h={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:s,metadata:new Cf(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!(s==null?void 0:s.length)};return Object.assign(u,h),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv=new Map;function vn(t){_n(t instanceof Function,"Expected a class definition");let e=hv.get(t);return e?(_n(e instanceof t,"Instance stored in cache mismatched with class"),e):(e=new t,hv.set(t,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dv{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,n){this.storage[e]=n}async _get(e){const n=this.storage[e];return n===void 0?null:n}async _remove(e){delete this.storage[e]}_addListener(e,n){}_removeListener(e,n){}}dv.type="NONE";const fv=dv;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fu(t,e,n){return`firebase:${t}:${e}:${n}`}class Zi{constructor(e,n,r){this.persistence=e,this.auth=n,this.userKey=r;const{config:i,name:s}=this.auth;this.fullUserKey=fu(this.userKey,i.apiKey,s),this.fullPersistenceKey=fu("persistence",i.apiKey,s),this.boundEventHandler=n._onStorageEvent.bind(n),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const n=await hu(this.auth,{idToken:e}).catch(()=>{});return n?xt._fromGetAccountInfoResponse(this.auth,n,e):null}return xt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const n=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,n)return this.setCurrentUser(n)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,n,r="authUser"){if(!n.length)return new Zi(vn(fv),e,r);const i=(await Promise.all(n.map(async h=>{if(await h._isAvailable())return h}))).filter(h=>h);let s=i[0]||vn(fv);const o=fu(r,e.config.apiKey,e.name);let l=null;for(const h of n)try{const f=await h._get(o);if(f){let y;if(typeof f=="string"){const g=await hu(e,{idToken:f}).catch(()=>{});if(!g)break;y=await xt._fromGetAccountInfoResponse(e,g,f)}else y=xt._fromJSON(e,f);h!==s&&(l=y),s=h;break}}catch{}const u=i.filter(h=>h._shouldAllowMigration);return!s._shouldAllowMigration||!u.length?new Zi(s,e,r):(s=u[0],l&&await s._set(o,l.toJSON()),await Promise.all(n.map(async h=>{if(h!==s)try{await h._remove(o)}catch{}})),new Zi(s,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pv(t){const e=t.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(_v(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(mv(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Ev(e))return"Blackberry";if(wv(e))return"Webos";if(gv(e))return"Safari";if((e.includes("chrome/")||yv(e))&&!e.includes("edge/"))return"Chrome";if(vv(e))return"Android";{const n=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=t.match(n);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function mv(t=Ye()){return/firefox\//i.test(t)}function gv(t=Ye()){const e=t.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function yv(t=Ye()){return/crios\//i.test(t)}function _v(t=Ye()){return/iemobile/i.test(t)}function vv(t=Ye()){return/android/i.test(t)}function Ev(t=Ye()){return/blackberry/i.test(t)}function wv(t=Ye()){return/webos/i.test(t)}function Pf(t=Ye()){return/iphone|ipad|ipod/i.test(t)||/macintosh/i.test(t)&&/mobile/i.test(t)}function GC(t=Ye()){var e;return Pf(t)&&!!((e=window.navigator)==null?void 0:e.standalone)}function KC(){return zA()&&document.documentMode===10}function Tv(t=Ye()){return Pf(t)||vv(t)||wv(t)||Ev(t)||/windows phone/i.test(t)||_v(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Iv(t,e=[]){let n;switch(t){case"Browser":n=pv(Ye());break;case"Worker":n=`${pv(Ye())}-${t}`;break;default:n=t}const r=e.length?e.join(","):"FirebaseCore-web";return`${n}/JsCore/${$r}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class QC{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,n){const r=s=>new Promise((o,l)=>{try{const u=e(s);o(u)}catch(u){l(u)}});r.onAbort=n,this.queue.push(r);const i=this.queue.length-1;return()=>{this.queue[i]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const n=[];try{for(const r of this.queue)await r(e),r.onAbort&&n.push(r.onAbort)}catch(r){n.reverse();for(const i of n)try{i()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function YC(t,e={}){return ur(t,"GET","/v2/passwordPolicy",Xi(t,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const XC=6;class JC{constructor(e){var r,i,s,o;const n=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=(r=n.minPasswordLength)!=null?r:XC,n.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=n.maxPasswordLength),n.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=n.containsLowercaseCharacter),n.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=n.containsUppercaseCharacter),n.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=n.containsNumericCharacter),n.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=n.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=(s=(i=e.allowedNonAlphanumericCharacters)==null?void 0:i.join(""))!=null?s:"",this.forceUpgradeOnSignin=(o=e.forceUpgradeOnSignin)!=null?o:!1,this.schemaVersion=e.schemaVersion}validatePassword(e){var r,i,s,o,l,u;const n={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,n),this.validatePasswordCharacterOptions(e,n),n.isValid&&(n.isValid=(r=n.meetsMinPasswordLength)!=null?r:!0),n.isValid&&(n.isValid=(i=n.meetsMaxPasswordLength)!=null?i:!0),n.isValid&&(n.isValid=(s=n.containsLowercaseLetter)!=null?s:!0),n.isValid&&(n.isValid=(o=n.containsUppercaseLetter)!=null?o:!0),n.isValid&&(n.isValid=(l=n.containsNumericCharacter)!=null?l:!0),n.isValid&&(n.isValid=(u=n.containsNonAlphanumericCharacter)!=null?u:!0),n}validatePasswordLengthOptions(e,n){const r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(n.meetsMinPasswordLength=e.length>=r),i&&(n.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,n){this.updatePasswordCharacterOptionsStatuses(n,!1,!1,!1,!1);let r;for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(n,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,n,r,i,s){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=n)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=s))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ZC{constructor(e,n,r,i){this.app=e,this.heartbeatServiceProvider=n,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Av(this),this.idTokenSubscription=new Av(this),this.beforeStateQueue=new QC(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=nv,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(s=>this._resolvePersistenceManagerAvailable=s)}_initializeWithPersistence(e,n){return n&&(this._popupRedirectResolver=vn(n)),this._initializationPromise=this.queue(async()=>{var r,i,s;if(!this._deleted&&(this.persistenceManager=await Zi.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((i=this._popupRedirectResolver)==null?void 0:i._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(n),this.lastNotifiedUid=((s=this.currentUser)==null?void 0:s.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const n=await hu(this,{idToken:e}),r=await xt._fromGetAccountInfoResponse(this,n,e);await this.directlySetCurrentUser(r)}catch(n){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",n),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var s;if(pt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(l=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(l,l))}):this.directlySetCurrentUser(null)}const n=await this.assertedPersistence.getCurrentUser();let r=n,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(s=this.redirectUser)==null?void 0:s._redirectEventId,l=r==null?void 0:r._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===l)&&(u==null?void 0:u.user)&&(r=u.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=n,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return W(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let n=null;try{n=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return n}async reloadAndSetCurrentUserOrClear(e){try{await du(e)}catch(n){if((n==null?void 0:n.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=DC()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(pt(this.app))return Promise.reject(gn(this));const n=e?ge(e):null;return n&&W(n.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(n&&n._clone(this))}async _updateCurrentUser(e,n=!1){if(!this._deleted)return e&&W(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),n||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return pt(this.app)?Promise.reject(gn(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return pt(this.app)?Promise.reject(gn(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(vn(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const n=this._getPasswordPolicyInternal();return n.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):n.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await YC(this),n=new JC(e);this.tenantId===null?this._projectPasswordPolicy=n:this._tenantPasswordPolicies[this.tenantId]=n}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new mo("auth","Firebase",e())}onAuthStateChanged(e,n,r){return this.registerStateListener(this.authStateSubscription,e,n,r)}beforeAuthStateChanged(e,n){return this.beforeStateQueue.pushCallback(e,n)}onIdTokenChanged(e,n,r){return this.registerStateListener(this.idTokenSubscription,e,n,r)}authStateReady(){return new Promise((e,n)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},n)}})}async revokeAccessToken(e){if(this.currentUser){const n=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:n};this.tenantId!=null&&(r.tenantId=this.tenantId),await WC(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,n){const r=await this.getOrInitRedirectPersistenceManager(n);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const n=e&&vn(e)||this._popupRedirectResolver;W(n,this,"argument-error"),this.redirectPersistenceManager=await Zi.create(this,[vn(n._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var n,r;return this._isInitialized&&await this.queue(async()=>{}),((n=this._currentUser)==null?void 0:n._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var n,r;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=(r=(n=this.currentUser)==null?void 0:n.uid)!=null?r:null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,n,r,i){if(this._deleted)return()=>{};const s=typeof n=="function"?n:n.next.bind(n);let o=!1;const l=this._isInitialized?Promise.resolve():this._initializationPromise;if(W(l,this,"internal-error"),l.then(()=>{o||s(this.currentUser)}),typeof n=="function"){const u=e.addObserver(n,r,i);return()=>{o=!0,u()}}else{const u=e.addObserver(n);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return W(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Iv(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var i;const e={["X-Client-Version"]:this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const n=await((i=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:i.getHeartbeatsHeader());n&&(e["X-Firebase-Client"]=n);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var n;if(pt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((n=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:n.getToken());return(e==null?void 0:e.error)&&RC(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function hr(t){return ge(t)}class Av{constructor(e){this.auth=e,this.observer=null,this.addObserver=XA(n=>this.observer=n)}get next(){return W(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let pu={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function eP(t){pu=t}function Sv(t){return pu.loadJS(t)}function tP(){return pu.recaptchaEnterpriseScript}function nP(){return pu.gapiScript}function rP(t){return`__${t}${Math.floor(Math.random()*1e6)}`}class iP{constructor(){this.enterprise=new sP}ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}class sP{ready(e){e()}execute(e,n){return Promise.resolve("token")}render(e,n){return""}}const oP="recaptcha-enterprise",kv="NO_RECAPTCHA";class aP{constructor(e){this.type=oP,this.auth=hr(e)}async verify(e="verify",n=!1){async function r(s){if(!n){if(s.tenantId==null&&s._agentRecaptchaConfig!=null)return s._agentRecaptchaConfig.siteKey;if(s.tenantId!=null&&s._tenantRecaptchaConfigs[s.tenantId]!==void 0)return s._tenantRecaptchaConfigs[s.tenantId].siteKey}return new Promise(async(o,l)=>{UC(s,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)l(new Error("recaptcha Enterprise site key undefined"));else{const h=new LC(u);return s.tenantId==null?s._agentRecaptchaConfig=h:s._tenantRecaptchaConfigs[s.tenantId]=h,o(h.siteKey)}}).catch(u=>{l(u)})})}function i(s,o,l){const u=window.grecaptcha;lv(u)?u.enterprise.ready(()=>{u.enterprise.execute(s,{action:e}).then(h=>{o(h)}).catch(()=>{o(kv)})}):l(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new iP().execute("siteKey",{action:"verify"}):new Promise((s,o)=>{r(this.auth).then(l=>{if(!n&&lv(window.grecaptcha))i(l,s,o);else{if(typeof window=="undefined"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=tP();u.length!==0&&(u+=l),Sv(u).then(()=>{i(l,s,o)}).catch(h=>{o(h)})}}).catch(l=>{o(l)})})}}async function Wo(t,e,n,r=!1,i=!1){const s=new aP(t);let o;if(i)o=kv;else try{o=await s.verify(n)}catch{o=await s.verify(n,!0)}const l=se({},e);if(n==="mfaSmsEnrollment"||n==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in l){const u=l.phoneEnrollmentInfo.phoneNumber,h=l.phoneEnrollmentInfo.recaptchaToken;Object.assign(l,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:h,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in l){const u=l.phoneSignInInfo.recaptchaToken;Object.assign(l,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return l}return r?Object.assign(l,{captchaResp:o}):Object.assign(l,{captchaResponse:o}),Object.assign(l,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(l,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),l}async function lP(t,e,n,r,i){var s,o;if(i==="EMAIL_PASSWORD_PROVIDER")if((s=t._getRecaptchaConfig())==null?void 0:s.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const l=await Wo(t,e,n,n==="getOobCode");return r(t,l)}else return r(t,e).catch(async l=>{if(l.code==="auth/missing-recaptcha-token"){console.log(`${n} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const u=await Wo(t,e,n,n==="getOobCode");return r(t,u)}else return Promise.reject(l)});else if(i==="PHONE_PROVIDER")if((o=t._getRecaptchaConfig())==null?void 0:o.isProviderEnabled("PHONE_PROVIDER")){const l=await Wo(t,e,n);return r(t,l).catch(async u=>{var h;if(((h=t._getRecaptchaConfig())==null?void 0:h.getProviderEnforcementState("PHONE_PROVIDER"))==="AUDIT"&&(u.code==="auth/missing-recaptcha-token"||u.code==="auth/invalid-app-credential")){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${n} flow.`);const f=await Wo(t,e,n,!1,!0);return r(t,f)}return Promise.reject(u)})}else{const l=await Wo(t,e,n,!1,!0);return r(t,l)}else return Promise.reject(i+" provider is not supported.")}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uP(t,e){const n=vl(t,"auth");if(n.isInitialized()){const i=n.getImmediate(),s=n.getOptions();if(Ur(s,e!=null?e:{}))return i;Xt(i,"already-initialized")}return n.initialize({options:e})}function cP(t,e){const n=(e==null?void 0:e.persistence)||[],r=(Array.isArray(n)?n:[n]).map(vn);(e==null?void 0:e.errorMap)&&t._updateErrorMap(e.errorMap),t._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function hP(t,e,n){const r=hr(t);W(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const i=!!(n==null?void 0:n.disableWarnings),s=Rv(e),{host:o,port:l}=dP(e),u=l===null?"":`:${l}`,h={url:`${s}//${o}${u}/`},f=Object.freeze({host:o,port:l,protocol:s.replace(":",""),options:Object.freeze({disableWarnings:i})});if(!r._canInitEmulator){W(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),W(Ur(h,r.config.emulator)&&Ur(f,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=h,r.emulatorConfig=f,r.settings.appVerificationDisabledForTesting=!0,Fr(o)?ed(`${s}//${o}${u}`):i||fP()}function Rv(t){const e=t.indexOf(":");return e<0?"":t.substr(0,e+1)}function dP(t){const e=Rv(t),n=/(\/\/)?([^?#/]+)/.exec(t.substr(e.length));if(!n)return{host:"",port:null};const r=n[2].split("@").pop()||"",i=/^(\[[^\]]+\])(:|$)/.exec(r);if(i){const s=i[1];return{host:s,port:Cv(r.substr(s.length+1))}}else{const[s,o]=r.split(":");return{host:s,port:Cv(o)}}}function Cv(t){if(!t)return null;const e=Number(t);return isNaN(e)?null:e}function fP(){function t(){const e=document.createElement("p"),n=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",n.position="fixed",n.width="100%",n.backgroundColor="#ffffff",n.border=".1em solid #000000",n.color="#b50000",n.bottom="0px",n.left="0px",n.margin="0px",n.zIndex="10000",n.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console!="undefined"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window!="undefined"&&typeof document!="undefined"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",t):t())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pv{constructor(e,n){this.providerId=e,this.signInMethod=n}toJSON(){return yn("not implemented")}_getIdTokenResponse(e){return yn("not implemented")}_linkToIdToken(e,n){return yn("not implemented")}_getReauthenticationResolver(e){return yn("not implemented")}}async function pP(t,e){return ur(t,"POST","/v1/accounts:sendOobCode",Xi(t,e))}async function mP(t,e){return pP(t,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function es(t,e){return ov(t,"POST","/v1/accounts:signInWithIdp",Xi(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gP="http://localhost";class Jr extends Pv{constructor(){super(...arguments);this.pendingToken=null}static _fromParams(e){const n=new Jr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(n.idToken=e.idToken),e.accessToken&&(n.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(n.nonce=e.nonce),e.pendingToken&&(n.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(n.accessToken=e.oauthToken,n.secret=e.oauthTokenSecret):Xt("argument-error"),n}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const l=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:i}=l,s=ii(l,["providerId","signInMethod"]);if(!r||!i)return null;const o=new Jr(r,i);return o.idToken=s.idToken||void 0,o.accessToken=s.accessToken||void 0,o.secret=s.secret,o.nonce=s.nonce,o.pendingToken=s.pendingToken||null,o}_getIdTokenResponse(e){const n=this.buildRequest();return es(e,n)}_linkToIdToken(e,n){const r=this.buildRequest();return r.idToken=n,es(e,r)}_getReauthenticationResolver(e){const n=this.buildRequest();return n.autoCreate=!1,es(e,n)}buildRequest(){const e={requestUri:gP,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const n={};this.idToken&&(n.id_token=this.idToken),this.accessToken&&(n.access_token=this.accessToken),this.secret&&(n.oauth_token_secret=this.secret),n.providerId=this.providerId,this.nonce&&!this.pendingToken&&(n.nonce=this.nonce),e.postBody=go(n)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nf{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Go extends Nf{constructor(){super(...arguments);this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dr extends Go{constructor(){super("facebook.com")}static credential(e){return Jr._fromParams({providerId:dr.PROVIDER_ID,signInMethod:dr.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return dr.credentialFromTaggedObject(e)}static credentialFromError(e){return dr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return dr.credential(e.oauthAccessToken)}catch{return null}}}dr.FACEBOOK_SIGN_IN_METHOD="facebook.com";dr.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fr extends Go{constructor(){super("google.com");this.addScope("profile")}static credential(e,n){return Jr._fromParams({providerId:fr.PROVIDER_ID,signInMethod:fr.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:n})}static credentialFromResult(e){return fr.credentialFromTaggedObject(e)}static credentialFromError(e){return fr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:n,oauthAccessToken:r}=e;if(!n&&!r)return null;try{return fr.credential(n,r)}catch{return null}}}fr.GOOGLE_SIGN_IN_METHOD="google.com";fr.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr extends Go{constructor(){super("github.com")}static credential(e){return Jr._fromParams({providerId:pr.PROVIDER_ID,signInMethod:pr.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return pr.credentialFromTaggedObject(e)}static credentialFromError(e){return pr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return pr.credential(e.oauthAccessToken)}catch{return null}}}pr.GITHUB_SIGN_IN_METHOD="github.com";pr.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr extends Go{constructor(){super("twitter.com")}static credential(e,n){return Jr._fromParams({providerId:mr.PROVIDER_ID,signInMethod:mr.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:n})}static credentialFromResult(e){return mr.credentialFromTaggedObject(e)}static credentialFromError(e){return mr.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:n,oauthTokenSecret:r}=e;if(!n||!r)return null;try{return mr.credential(n,r)}catch{return null}}}mr.TWITTER_SIGN_IN_METHOD="twitter.com";mr.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yP(t,e){return ov(t,"POST","/v1/accounts:signUp",Xi(t,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gr{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,n,r,i=!1){const s=await xt._fromIdTokenResponse(e,r,i),o=Nv(r);return new gr({user:s,providerId:o,_tokenResponse:r,operationType:n})}static async _forOperation(e,n,r){await e._updateTokensIfNecessary(r,!0);const i=Nv(r);return new gr({user:e,providerId:i,_tokenResponse:r,operationType:n})}}function Nv(t){return t.providerId?t.providerId:"phoneNumber"in t?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function DO(t){var i;if(pt(t.app))return Promise.reject(gn(t));const e=hr(t);if(await e._initializationPromise,(i=e.currentUser)==null?void 0:i.isAnonymous)return new gr({user:e.currentUser,providerId:null,operationType:"signIn"});const n=await yP(e,{returnSecureToken:!0}),r=await gr._fromIdTokenResponse(e,"signIn",n,!0);return await e._updateCurrentUser(r.user),r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mu extends Ht{constructor(e,n,r,i){super(n.code,n.message);var s;this.operationType=r,this.user=i,Object.setPrototypeOf(this,mu.prototype),this.customData={appName:e.name,tenantId:(s=e.tenantId)!=null?s:void 0,_serverResponse:n.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,n,r,i){return new mu(e,n,r,i)}}function Dv(t,e,n,r){return(e==="reauthenticate"?n._getReauthenticationResolver(t):n._getIdTokenResponse(t)).catch(s=>{throw s.code==="auth/multi-factor-auth-required"?mu._fromErrorAndOperation(t,s,e,r):s})}async function _P(t,e,n=!1){const r=await qo(t,e._linkToIdToken(t.auth,await t.getIdToken()),n);return gr._forOperation(t,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function vP(t,e,n=!1){const{auth:r}=t;if(pt(r.app))return Promise.reject(gn(r));const i="reauthenticate";try{const s=await qo(t,Dv(r,i,e,t),n);W(s.idToken,r,"internal-error");const o=Rf(s.idToken);W(o,r,"internal-error");const{sub:l}=o;return W(t.uid===l,r,"user-mismatch"),gr._forOperation(t,i,s)}catch(s){throw(s==null?void 0:s.code)==="auth/user-not-found"&&Xt(r,"user-mismatch"),s}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function EP(t,e,n=!1){if(pt(t.app))return Promise.reject(gn(t));const r="signIn",i=await Dv(t,r,e),s=await gr._fromIdTokenResponse(t,r,i);return n||await t._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wP(t,e,n){var r;W(((r=n.url)==null?void 0:r.length)>0,t,"invalid-continue-uri"),W(typeof n.dynamicLinkDomain=="undefined"||n.dynamicLinkDomain.length>0,t,"invalid-dynamic-link-domain"),W(typeof n.linkDomain=="undefined"||n.linkDomain.length>0,t,"invalid-hosting-link-domain"),e.continueUrl=n.url,e.dynamicLinkDomain=n.dynamicLinkDomain,e.linkDomain=n.linkDomain,e.canHandleCodeInApp=n.handleCodeInApp,n.iOS&&(W(n.iOS.bundleId.length>0,t,"missing-ios-bundle-id"),e.iOSBundleId=n.iOS.bundleId),n.android&&(W(n.android.packageName.length>0,t,"missing-android-pkg-name"),e.androidInstallApp=n.android.installApp,e.androidMinimumVersionCode=n.android.minimumVersion,e.androidPackageName=n.android.packageName)}async function VO(t,e,n){const r=hr(t),i={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};n&&wP(r,i,n),await lP(r,i,"getOobCode",mP,"EMAIL_PASSWORD_PROVIDER")}function TP(t,e,n,r){return ge(t).onIdTokenChanged(e,n,r)}function IP(t,e,n){return ge(t).beforeAuthStateChanged(e,n)}function OO(t,e,n,r){return ge(t).onAuthStateChanged(e,n,r)}function xO(t){return ge(t).signOut()}const gu="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vv{constructor(e,n){this.storageRetriever=e,this.type=n}_isAvailable(){try{return this.storage?(this.storage.setItem(gu,"1"),this.storage.removeItem(gu),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,n){return this.storage.setItem(e,JSON.stringify(n)),Promise.resolve()}_get(e){const n=this.storage.getItem(e);return Promise.resolve(n?JSON.parse(n):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AP=1e3,SP=10;class Ov extends Vv{constructor(){super(()=>window.localStorage,"LOCAL");this.boundEventHandler=(e,n)=>this.onStorageEvent(e,n),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Tv(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const n of Object.keys(this.listeners)){const r=this.storage.getItem(n),i=this.localCache[n];r!==i&&e(n,i,r)}}onStorageEvent(e,n=!1){if(!e.key){this.forAllChangedKeys((o,l,u)=>{this.notifyListeners(o,u)});return}const r=e.key;n?this.detachListener():this.stopPolling();const i=()=>{const o=this.storage.getItem(r);!n&&this.localCache[r]===o||this.notifyListeners(r,o)},s=this.storage.getItem(r);KC()&&s!==e.newValue&&e.newValue!==e.oldValue?setTimeout(i,SP):i()}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n&&JSON.parse(n))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,n,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:n,newValue:r}),!0)})},AP)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,n){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,n){await super._set(e,n),this.localCache[e]=JSON.stringify(n)}async _get(e){const n=await super._get(e);return this.localCache[e]=JSON.stringify(n),n}async _remove(e){await super._remove(e),delete this.localCache[e]}}Ov.type="LOCAL";const kP=Ov;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xv extends Vv{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,n){}_removeListener(e,n){}}xv.type="SESSION";const Mv=xv;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RP(t){return Promise.all(t.map(async e=>{try{const n=await e;return{fulfilled:!0,value:n}}catch(n){return{fulfilled:!1,reason:n}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yu{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const n=this.receivers.find(i=>i.isListeningto(e));if(n)return n;const r=new yu(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const n=e,{eventId:r,eventType:i,data:s}=n.data,o=this.handlersMap[i];if(!(o==null?void 0:o.size))return;n.ports[0].postMessage({status:"ack",eventId:r,eventType:i});const l=Array.from(o).map(async h=>h(n.origin,s)),u=await RP(l);n.ports[0].postMessage({status:"done",eventId:r,eventType:i,response:u})}_subscribe(e,n){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(n)}_unsubscribe(e,n){this.handlersMap[e]&&n&&this.handlersMap[e].delete(n),(!n||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}yu.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Df(t="",e=10){let n="";for(let r=0;r<e;r++)n+=Math.floor(Math.random()*10);return t+n}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class CP{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,n,r=50){const i=typeof MessageChannel!="undefined"?new MessageChannel:null;if(!i)throw new Error("connection_unavailable");let s,o;return new Promise((l,u)=>{const h=Df("",20);i.port1.start();const f=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:i,onMessage(y){const g=y;if(g.data.eventId===h)switch(g.data.status){case"ack":clearTimeout(f),s=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(s),l(g.data.response);break;default:clearTimeout(f),clearTimeout(s),u(new Error("invalid_response"));break}}},this.handlers.add(o),i.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:h,data:n},[i.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Zt(){return window}function PP(t){Zt().location.href=t}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function bv(){return typeof Zt().WorkerGlobalScope!="undefined"&&typeof Zt().importScripts=="function"}async function NP(){if(!(navigator==null?void 0:navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function DP(){var t;return((t=navigator==null?void 0:navigator.serviceWorker)==null?void 0:t.controller)||null}function VP(){return bv()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lv="firebaseLocalStorageDb",OP=1,_u="firebaseLocalStorage",Uv="fbase_key";class Ko{constructor(e){this.request=e}toPromise(){return new Promise((e,n)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{n(this.request.error)})})}}function vu(t,e){return t.transaction([_u],e?"readwrite":"readonly").objectStore(_u)}function xP(){const t=indexedDB.deleteDatabase(Lv);return new Ko(t).toPromise()}function Vf(){const t=indexedDB.open(Lv,OP);return new Promise((e,n)=>{t.addEventListener("error",()=>{n(t.error)}),t.addEventListener("upgradeneeded",()=>{const r=t.result;try{r.createObjectStore(_u,{keyPath:Uv})}catch(i){n(i)}}),t.addEventListener("success",async()=>{const r=t.result;r.objectStoreNames.contains(_u)?e(r):(r.close(),await xP(),e(await Vf()))})})}async function Fv(t,e,n){const r=vu(t,!0).put({[Uv]:e,value:n});return new Ko(r).toPromise()}async function MP(t,e){const n=vu(t,!1).get(e),r=await new Ko(n).toPromise();return r===void 0?null:r.value}function jv(t,e){const n=vu(t,!0).delete(e);return new Ko(n).toPromise()}const bP=800,LP=3;class Bv{constructor(){this.type="LOCAL",this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.db?this.db:(this.db=await Vf(),this.db)}async _withRetries(e){let n=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(n++>LP)throw r;this.db&&(this.db.close(),this.db=void 0)}}async initializeServiceWorkerMessaging(){return bv()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=yu._getInstance(VP()),this.receiver._subscribe("keyChanged",async(e,n)=>({keyProcessed:(await this._poll()).includes(n.key)})),this.receiver._subscribe("ping",async(e,n)=>["keyChanged"])}async initializeSender(){var n,r;if(this.activeServiceWorker=await NP(),!this.activeServiceWorker)return;this.sender=new CP(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);!e||((n=e[0])==null?void 0:n.fulfilled)&&((r=e[0])==null?void 0:r.value.includes("keyChanged"))&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||DP()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;const e=await Vf();return await Fv(e,gu,"1"),await jv(e,gu),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,n){return this._withPendingWrite(async()=>(await this._withRetries(r=>Fv(r,e,n)),this.localCache[e]=n,this.notifyServiceWorker(e)))}async _get(e){const n=await this._withRetries(r=>MP(r,e));return this.localCache[e]=n,n}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(n=>jv(n,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){const e=await this._withRetries(i=>{const s=vu(i,!1).getAll();return new Ko(s).toPromise()});if(!e)return[];if(this.pendingWrites!==0)return[];const n=[],r=new Set;if(e.length!==0)for(const{fbase_key:i,value:s}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(s)&&(this.notifyListeners(i,s),n.push(i));for(const i of Object.keys(this.localCache))this.localCache[i]&&!r.has(i)&&(this.notifyListeners(i,null),n.push(i));return n}notifyListeners(e,n){this.localCache[e]=n;const r=this.listeners[e];if(r)for(const i of Array.from(r))i(n)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),bP)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,n){Object.keys(this.listeners).length===0&&this.startPolling(),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(n)}_removeListener(e,n){this.listeners[e]&&(this.listeners[e].delete(n),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&this.stopPolling()}}Bv.type="LOCAL";const UP=Bv;new zo(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $v(t,e){return e?vn(e):(W(t._popupRedirectResolver,t,"argument-error"),t._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Of extends Pv{constructor(e){super("custom","custom");this.params=e}_getIdTokenResponse(e){return es(e,this._buildIdpRequest())}_linkToIdToken(e,n){return es(e,this._buildIdpRequest(n))}_getReauthenticationResolver(e){return es(e,this._buildIdpRequest())}_buildIdpRequest(e){const n={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(n.idToken=e),n}}function FP(t){return EP(t.auth,new Of(t),t.bypassAuthState)}function jP(t){const{auth:e,user:n}=t;return W(n,e,"internal-error"),vP(n,new Of(t),t.bypassAuthState)}async function BP(t){const{auth:e,user:n}=t;return W(n,e,"internal-error"),_P(n,new Of(t),t.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zv{constructor(e,n,r,i,s=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=s,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(n)?n:[n]}execute(){return new Promise(async(e,n)=>{this.pendingPromise={resolve:e,reject:n};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:n,sessionId:r,postBody:i,tenantId:s,error:o,type:l}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:n,sessionId:r,tenantId:s||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(l)(u))}catch(h){this.reject(h)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return FP;case"linkViaPopup":case"linkViaRedirect":return BP;case"reauthViaPopup":case"reauthViaRedirect":return jP;default:Xt(this.auth,"internal-error")}}resolve(e){_n(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){_n(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $P=new zo(2e3,1e4);class ts extends zv{constructor(e,n,r,i,s){super(e,n,i,s);this.provider=r,this.authWindow=null,this.pollId=null,ts.currentPopupAction&&ts.currentPopupAction.cancel(),ts.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return W(e,this.auth,"internal-error"),e}async onExecution(){_n(this.filter.length===1,"Popup operations only handle one event");const e=Df();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(n=>{this.reject(n)}),this.resolver._isIframeWebStorageSupported(this.auth,n=>{n||this.reject(Jt(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Jt(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,ts.currentPopupAction=null}pollUserCancellation(){const e=()=>{var n,r;if((r=(n=this.authWindow)==null?void 0:n.window)==null?void 0:r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Jt(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,$P.get())};e()}}ts.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zP="pendingRedirect",Eu=new Map;class HP extends zv{constructor(e,n,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],n,void 0,r);this.eventId=null}async execute(){let e=Eu.get(this.auth._key());if(!e){try{const r=await qP(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(n){e=()=>Promise.reject(n)}Eu.set(this.auth._key(),e)}return this.bypassAuthState||Eu.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const n=await this.auth._redirectUserForId(e.eventId);if(n)return this.user=n,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function qP(t,e){const n=qv(e),r=Hv(t);if(!await r._isAvailable())return!1;const i=await r._get(n)==="true";return await r._remove(n),i}async function WP(t,e){return Hv(t)._set(qv(e),"true")}function GP(t,e){Eu.set(t._key(),e)}function Hv(t){return vn(t._redirectPersistence)}function qv(t){return fu(zP,t.config.apiKey,t.name)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function MO(t,e,n){return KP(t,e,n)}async function KP(t,e,n){if(pt(t.app))return Promise.reject(gn(t));const r=hr(t);CC(t,e,Nf),await r._initializationPromise;const i=$v(r,n);return await WP(i,r),i._openRedirect(r,e,"signInViaRedirect")}async function bO(t,e){return await hr(t)._initializationPromise,Wv(t,e,!1)}async function Wv(t,e,n=!1){if(pt(t.app))return Promise.reject(gn(t));const r=hr(t),i=$v(r,e),o=await new HP(r,i,n).execute();return o&&!n&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const QP=10*60*1e3;class YP{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let n=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(n=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!XP(e)||(this.hasHandledPotentialRedirect=!0,n||(this.queuedRedirectEvent=e,n=!0)),n}sendToConsumer(e,n){var r;if(e.error&&!Kv(e)){const i=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";n.onError(Jt(this.auth,i))}else n.onAuthEvent(e)}isEventForConsumer(e,n){const r=n.eventId===null||!!e.eventId&&e.eventId===n.eventId;return n.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=QP&&this.cachedEventUids.clear(),this.cachedEventUids.has(Gv(e))}saveEventToCache(e){this.cachedEventUids.add(Gv(e)),this.lastProcessedEventTime=Date.now()}}function Gv(t){return[t.type,t.eventId,t.sessionId,t.tenantId].filter(e=>e).join("-")}function Kv({type:t,error:e}){return t==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function XP(t){switch(t.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Kv(t);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function JP(t,e={}){return ur(t,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZP=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,eN=/^https?/;async function tN(t){if(t.config.emulator)return;const{authorizedDomains:e}=await JP(t);for(const n of e)try{if(nN(n))return}catch{}Xt(t,"unauthorized-domain")}function nN(t){const e=Af(),{protocol:n,hostname:r}=new URL(e);if(t.startsWith("chrome-extension://")){const o=new URL(t);return o.hostname===""&&r===""?n==="chrome-extension:"&&t.replace("chrome-extension://","")===e.replace("chrome-extension://",""):n==="chrome-extension:"&&o.hostname===r}if(!eN.test(n))return!1;if(ZP.test(t))return r===t;const i=t.replace(/\./g,"\\.");return new RegExp("^(.+\\."+i+"|"+i+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rN=new zo(3e4,6e4);function Qv(){const t=Zt().___jsl;if(t==null?void 0:t.H){for(const e of Object.keys(t.H))if(t.H[e].r=t.H[e].r||[],t.H[e].L=t.H[e].L||[],t.H[e].r=[...t.H[e].L],t.CP)for(let n=0;n<t.CP.length;n++)t.CP[n]=null}}function iN(t){return new Promise((e,n)=>{var i,s,o;function r(){Qv(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{Qv(),n(Jt(t,"network-request-failed"))},timeout:rN.get()})}if((s=(i=Zt().gapi)==null?void 0:i.iframes)==null?void 0:s.Iframe)e(gapi.iframes.getContext());else if((o=Zt().gapi)==null?void 0:o.load)r();else{const l=rP("iframefcb");return Zt()[l]=()=>{gapi.load?r():n(Jt(t,"network-request-failed"))},Sv(`${nP()}?onload=${l}`).catch(u=>n(u))}}).catch(e=>{throw wu=null,e})}let wu=null;function sN(t){return wu=wu||iN(t),wu}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const oN=new zo(5e3,15e3),aN="__/auth/iframe",lN="emulator/auth/iframe",uN={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},cN=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function hN(t){const e=t.config;W(e.authDomain,t,"auth-domain-config-required");const n=e.emulator?Sf(e,lN):`https://${t.config.authDomain}/${aN}`,r={apiKey:e.apiKey,appName:t.name,v:$r},i=cN.get(t.config.apiHost);i&&(r.eid=i);const s=t._getFrameworks();return s.length&&(r.fw=s.join(",")),`${n}?${go(r).slice(1)}`}async function dN(t){const e=await sN(t),n=Zt().gapi;return W(n,t,"internal-error"),e.open({where:document.body,url:hN(t),messageHandlersFilter:n.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:uN,dontclear:!0},r=>new Promise(async(i,s)=>{await r.restyle({setHideOnLeave:!1});const o=Jt(t,"network-request-failed"),l=Zt().setTimeout(()=>{s(o)},oN.get());function u(){Zt().clearTimeout(l),i(r)}r.ping(u).then(u,()=>{s(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fN={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},pN=500,mN=600,gN="_blank",yN="http://localhost";class Yv{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function _N(t,e,n,r=pN,i=mN){const s=Math.max((window.screen.availHeight-i)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let l="";const u=Lt(se({},fN),{width:r.toString(),height:i.toString(),top:s,left:o}),h=Ye().toLowerCase();n&&(l=yv(h)?gN:n),mv(h)&&(e=e||yN,u.scrollbars="yes");const f=Object.entries(u).reduce((g,[k,V])=>`${g}${k}=${V},`,"");if(GC(h)&&l!=="_self")return vN(e||"",l),new Yv(null);const y=window.open(e||"",l,f);W(y,t,"popup-blocked");try{y.focus()}catch{}return new Yv(y)}function vN(t,e){const n=document.createElement("a");n.href=t,n.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),n.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const EN="__/auth/handler",wN="emulator/auth/handler",TN=encodeURIComponent("fac");async function Xv(t,e,n,r,i,s){W(t.config.authDomain,t,"auth-domain-config-required"),W(t.config.apiKey,t,"invalid-api-key");const o={apiKey:t.config.apiKey,appName:t.name,authType:n,redirectUrl:r,v:$r,eventId:i};if(e instanceof Nf){e.setDefaultLanguage(t.languageCode),o.providerId=e.providerId||"",YA(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[f,y]of Object.entries(s||{}))o[f]=y}if(e instanceof Go){const f=e.getScopes().filter(y=>y!=="");f.length>0&&(o.scopes=f.join(","))}t.tenantId&&(o.tid=t.tenantId);const l=o;for(const f of Object.keys(l))l[f]===void 0&&delete l[f];const u=await t._getAppCheckToken(),h=u?`#${TN}=${encodeURIComponent(u)}`:"";return`${IN(t)}?${go(l).slice(1)}${h}`}function IN({config:t}){return t.emulator?Sf(t,wN):`https://${t.authDomain}/${EN}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const xf="webStorageSupport";class AN{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=Mv,this._completeRedirectFn=Wv,this._overrideRedirectResult=GP}async _openPopup(e,n,r,i){var o;_n((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const s=await Xv(e,n,r,Af(),i);return _N(e,s,Df())}async _openRedirect(e,n,r,i){await this._originValidation(e);const s=await Xv(e,n,r,Af(),i);return PP(s),new Promise(()=>{})}_initialize(e){const n=e._key();if(this.eventManagers[n]){const{manager:i,promise:s}=this.eventManagers[n];return i?Promise.resolve(i):(_n(s,"If manager is not set, promise should be"),s)}const r=this.initAndGetManager(e);return this.eventManagers[n]={promise:r},r.catch(()=>{delete this.eventManagers[n]}),r}async initAndGetManager(e){const n=await dN(e),r=new YP(e);return n.register("authEvent",i=>(W(i==null?void 0:i.authEvent,e,"invalid-auth-event"),{status:r.onEvent(i.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=n,r}_isIframeWebStorageSupported(e,n){this.iframes[e._key()].send(xf,{type:xf},i=>{var o;const s=(o=i==null?void 0:i[0])==null?void 0:o[xf];s!==void 0&&n(!!s),Xt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const n=e._key();return this.originValidationPromises[n]||(this.originValidationPromises[n]=tN(e)),this.originValidationPromises[n]}get _shouldInitProactively(){return Tv()||gv()||Pf()}}const SN=AN;var Jv="@firebase/auth",Zv="1.13.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kN{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const n=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,n),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const n=this.internalListeners.get(e);!n||(this.internalListeners.delete(e),n(),this.updateProactiveRefresh())}assertAuthConfigured(){W(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function RN(t){switch(t){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function CN(t){Br(new Kn("auth",(e,{options:n})=>{const r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),s=e.getProvider("app-check-internal"),{apiKey:o,authDomain:l}=r.options;W(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:l,clientPlatform:t,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Iv(t)},h=new ZC(r,i,s,u);return cP(h,n),h},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,n,r)=>{e.getProvider("auth-internal").initialize()})),Br(new Kn("auth-internal",e=>{const n=hr(e.getProvider("auth").getImmediate());return(r=>new kN(r))(n)},"PRIVATE").setInstantiationMode("EXPLICIT")),qt(Jv,Zv,RN(t)),qt(Jv,Zv,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const PN=5*60,NN=o_("authIdTokenMaxAge")||PN;let eE=null;const DN=t=>async e=>{const n=e&&await e.getIdTokenResult(),r=n&&(new Date().getTime()-Date.parse(n.issuedAtTime))/1e3;if(r&&r>NN)return;const i=n==null?void 0:n.token;eE!==i&&(eE=i,await fetch(t,{method:i?"POST":"DELETE",headers:i?{Authorization:`Bearer ${i}`}:{}}))};function LO(t=hd()){const e=vl(t,"auth");if(e.isInitialized())return e.getImmediate();const n=uP(t,{popupRedirectResolver:SN,persistence:[UP,kP,Mv]}),r=o_("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const s=new URL(r,location.origin);if(location.origin===s.origin){const o=DN(s.toString());IP(n,o,()=>o(n.currentUser)),TP(n,l=>o(l))}}const i=r_("auth");return i&&hP(n,`http://${i}`),n}function VN(){var t,e;return(e=(t=document.getElementsByTagName("head"))==null?void 0:t[0])!=null?e:document}eP({loadJS(t){return new Promise((e,n)=>{const r=document.createElement("script");r.setAttribute("src",t),r.onload=e,r.onerror=i=>{const s=Jt("internal-error");s.customData=i,n(s)},r.type="text/javascript",r.charset="UTF-8",VN().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});CN("Browser");var ON="firebase",xN="12.12.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */qt(ON,xN,"app");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tE="firebasestorage.googleapis.com",nE="storageBucket",MN=2*60*1e3,bN=10*60*1e3;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class we extends Ht{constructor(e,n,r=0){super(Mf(e),`Firebase Storage: ${n} (${Mf(e)})`);this.status_=r,this.customData={serverResponse:null},this._baseMessage=this.message,Object.setPrototypeOf(this,we.prototype)}get status(){return this.status_}set status(e){this.status_=e}_codeEquals(e){return Mf(e)===this.code}get serverResponse(){return this.customData.serverResponse}set serverResponse(e){this.customData.serverResponse=e,this.customData.serverResponse?this.message=`${this._baseMessage}
${this.customData.serverResponse}`:this.message=this._baseMessage}}var Te;(function(t){t.UNKNOWN="unknown",t.OBJECT_NOT_FOUND="object-not-found",t.BUCKET_NOT_FOUND="bucket-not-found",t.PROJECT_NOT_FOUND="project-not-found",t.QUOTA_EXCEEDED="quota-exceeded",t.UNAUTHENTICATED="unauthenticated",t.UNAUTHORIZED="unauthorized",t.UNAUTHORIZED_APP="unauthorized-app",t.RETRY_LIMIT_EXCEEDED="retry-limit-exceeded",t.INVALID_CHECKSUM="invalid-checksum",t.CANCELED="canceled",t.INVALID_EVENT_NAME="invalid-event-name",t.INVALID_URL="invalid-url",t.INVALID_DEFAULT_BUCKET="invalid-default-bucket",t.NO_DEFAULT_BUCKET="no-default-bucket",t.CANNOT_SLICE_BLOB="cannot-slice-blob",t.SERVER_FILE_WRONG_SIZE="server-file-wrong-size",t.NO_DOWNLOAD_URL="no-download-url",t.INVALID_ARGUMENT="invalid-argument",t.INVALID_ARGUMENT_COUNT="invalid-argument-count",t.APP_DELETED="app-deleted",t.INVALID_ROOT_OPERATION="invalid-root-operation",t.INVALID_FORMAT="invalid-format",t.INTERNAL_ERROR="internal-error",t.UNSUPPORTED_ENVIRONMENT="unsupported-environment"})(Te||(Te={}));function Mf(t){return"storage/"+t}function bf(){const t="An unknown error occurred, please check the error payload for server response.";return new we(Te.UNKNOWN,t)}function LN(t){return new we(Te.OBJECT_NOT_FOUND,"Object '"+t+"' does not exist.")}function UN(t){return new we(Te.QUOTA_EXCEEDED,"Quota for bucket '"+t+"' exceeded, please view quota on https://firebase.google.com/pricing/.")}function FN(){const t="User is not authenticated, please authenticate using Firebase Authentication and try again.";return new we(Te.UNAUTHENTICATED,t)}function jN(){return new we(Te.UNAUTHORIZED_APP,"This app does not have permission to access Firebase Storage on this project.")}function BN(t){return new we(Te.UNAUTHORIZED,"User does not have permission to access '"+t+"'.")}function $N(){return new we(Te.RETRY_LIMIT_EXCEEDED,"Max retry time for operation exceeded, please try again.")}function zN(){return new we(Te.CANCELED,"User canceled the upload/download.")}function HN(t){return new we(Te.INVALID_URL,"Invalid URL '"+t+"'.")}function qN(t){return new we(Te.INVALID_DEFAULT_BUCKET,"Invalid default bucket '"+t+"'.")}function WN(){return new we(Te.NO_DEFAULT_BUCKET,"No default bucket found. Did you set the '"+nE+"' property when initializing the app?")}function GN(){return new we(Te.CANNOT_SLICE_BLOB,"Cannot slice blob for upload. Please retry the upload.")}function KN(){return new we(Te.NO_DOWNLOAD_URL,"The given file does not have any download URLs.")}function QN(t){return new we(Te.UNSUPPORTED_ENVIRONMENT,`${t} is missing. Make sure to install the required polyfills. See https://firebase.google.com/docs/web/environments-js-sdk#polyfills for more information.`)}function Lf(t){return new we(Te.INVALID_ARGUMENT,t)}function rE(){return new we(Te.APP_DELETED,"The Firebase app was deleted.")}function YN(t){return new we(Te.INVALID_ROOT_OPERATION,"The operation '"+t+"' cannot be performed on a root reference, create a non-root reference using child, such as .child('file.png').")}function Qo(t,e){return new we(Te.INVALID_FORMAT,"String does not match format '"+t+"': "+e)}function Yo(t){throw new we(Te.INTERNAL_ERROR,"Internal error: "+t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yt{constructor(e,n){this.bucket=e,this.path_=n}get path(){return this.path_}get isRoot(){return this.path.length===0}fullServerUrl(){const e=encodeURIComponent;return"/b/"+e(this.bucket)+"/o/"+e(this.path)}bucketOnlyServerUrl(){return"/b/"+encodeURIComponent(this.bucket)+"/o"}static makeFromBucketSpec(e,n){let r;try{r=yt.makeFromUrl(e,n)}catch{return new yt(e,"")}if(r.path==="")return r;throw qN(e)}static makeFromUrl(e,n){let r=null;const i="([A-Za-z0-9.\\-_]+)";function s(N){N.path.charAt(N.path.length-1)==="/"&&(N.path_=N.path_.slice(0,-1))}const o="(/(.*))?$",l=new RegExp("^gs://"+i+o,"i"),u={bucket:1,path:3};function h(N){N.path_=decodeURIComponent(N.path)}const f="v[A-Za-z0-9_]+",y=n.replace(/[.]/g,"\\."),g="(/([^?#]*).*)?$",k=new RegExp(`^https?://${y}/${f}/b/${i}/o${g}`,"i"),V={bucket:1,path:3},O=n===tE?"(?:storage.googleapis.com|storage.cloud.google.com)":n,v="([^?#]*)",E=new RegExp(`^https?://${O}/${i}/${v}`,"i"),P=[{regex:l,indices:u,postModify:s},{regex:k,indices:V,postModify:h},{regex:E,indices:{bucket:1,path:2},postModify:h}];for(let N=0;N<P.length;N++){const F=P[N],b=F.regex.exec(e);if(b){const w=b[F.indices.bucket];let m=b[F.indices.path];m||(m=""),r=new yt(w,m),F.postModify(r);break}}if(r==null)throw HN(e);return r}}class XN{constructor(e){this.promise_=Promise.reject(e)}getPromise(){return this.promise_}cancel(e=!1){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function JN(t,e,n){let r=1,i=null,s=null,o=!1,l=0;function u(){return l===2}let h=!1;function f(...v){h||(h=!0,e.apply(null,v))}function y(v){i=setTimeout(()=>{i=null,t(k,u())},v)}function g(){s&&clearTimeout(s)}function k(v,...E){if(h){g();return}if(v){g(),f.call(null,v,...E);return}if(u()||o){g(),f.call(null,v,...E);return}r<64&&(r*=2);let P;l===1?(l=2,P=0):P=(r+Math.random())*1e3,y(P)}let V=!1;function O(v){V||(V=!0,g(),!h&&(i!==null?(v||(l=2),clearTimeout(i),y(0)):v||(l=1)))}return y(0),s=setTimeout(()=>{o=!0,O(!0)},n),O}function ZN(t){t(!1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function eD(t){return t!==void 0}function tD(t){return typeof t=="object"&&!Array.isArray(t)}function Uf(t){return typeof t=="string"||t instanceof String}function iE(t){return Ff()&&t instanceof Blob}function Ff(){return typeof Blob!="undefined"}function sE(t,e,n,r){if(r<e)throw Lf(`Invalid value for '${t}'. Expected ${e} or greater.`);if(r>n)throw Lf(`Invalid value for '${t}'. Expected ${n} or less.`)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function jf(t,e,n){let r=e;return n==null&&(r=`https://${e}`),`${n}://${r}/v0${t}`}function oE(t){const e=encodeURIComponent;let n="?";for(const r in t)if(t.hasOwnProperty(r)){const i=e(r)+"="+e(t[r]);n=n+i+"&"}return n=n.slice(0,-1),n}var Zr;(function(t){t[t.NO_ERROR=0]="NO_ERROR",t[t.NETWORK_ERROR=1]="NETWORK_ERROR",t[t.ABORT=2]="ABORT"})(Zr||(Zr={}));/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nD(t,e){const n=t>=500&&t<600,i=[408,429].indexOf(t)!==-1,s=e.indexOf(t)!==-1;return n||i||s}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rD{constructor(e,n,r,i,s,o,l,u,h,f,y,g=!0,k=!1){this.url_=e,this.method_=n,this.headers_=r,this.body_=i,this.successCodes_=s,this.additionalRetryCodes_=o,this.callback_=l,this.errorCallback_=u,this.timeout_=h,this.progressCallback_=f,this.connectionFactory_=y,this.retry=g,this.isUsingEmulator=k,this.pendingConnection_=null,this.backoffId_=null,this.canceled_=!1,this.appDelete_=!1,this.promise_=new Promise((V,O)=>{this.resolve_=V,this.reject_=O,this.start_()})}start_(){const e=(r,i)=>{if(i){r(!1,new Tu(!1,null,!0));return}const s=this.connectionFactory_();this.pendingConnection_=s;const o=l=>{const u=l.loaded,h=l.lengthComputable?l.total:-1;this.progressCallback_!==null&&this.progressCallback_(u,h)};this.progressCallback_!==null&&s.addUploadProgressListener(o),s.send(this.url_,this.method_,this.isUsingEmulator,this.body_,this.headers_).then(()=>{this.progressCallback_!==null&&s.removeUploadProgressListener(o),this.pendingConnection_=null;const l=s.getErrorCode()===Zr.NO_ERROR,u=s.getStatus();if(!l||nD(u,this.additionalRetryCodes_)&&this.retry){const f=s.getErrorCode()===Zr.ABORT;r(!1,new Tu(!1,null,f));return}const h=this.successCodes_.indexOf(u)!==-1;r(!0,new Tu(h,s))})},n=(r,i)=>{const s=this.resolve_,o=this.reject_,l=i.connection;if(i.wasSuccessCode)try{const u=this.callback_(l,l.getResponse());eD(u)?s(u):s()}catch(u){o(u)}else if(l!==null){const u=bf();u.serverResponse=l.getErrorText(),this.errorCallback_?o(this.errorCallback_(l,u)):o(u)}else if(i.canceled){const u=this.appDelete_?rE():zN();o(u)}else{const u=$N();o(u)}};this.canceled_?n(!1,new Tu(!1,null,!0)):this.backoffId_=JN(e,n,this.timeout_)}getPromise(){return this.promise_}cancel(e){this.canceled_=!0,this.appDelete_=e||!1,this.backoffId_!==null&&ZN(this.backoffId_),this.pendingConnection_!==null&&this.pendingConnection_.abort()}}class Tu{constructor(e,n,r){this.wasSuccessCode=e,this.connection=n,this.canceled=!!r}}function iD(t,e){e!==null&&e.length>0&&(t.Authorization="Firebase "+e)}function sD(t,e){t["X-Firebase-Storage-Version"]="webjs/"+(e!=null?e:"AppManager")}function oD(t,e){e&&(t["X-Firebase-GMPID"]=e)}function aD(t,e){e!==null&&(t["X-Firebase-AppCheck"]=e)}function lD(t,e,n,r,i,s,o=!0,l=!1){const u=oE(t.urlParams),h=t.url+u,f=Object.assign({},t.headers);return oD(f,e),iD(f,n),sD(f,s),aD(f,r),new rD(h,t.method,f,t.body,t.successCodes,t.additionalRetryCodes,t.handler,t.errorHandler,t.timeout,t.progressCallback,i,o,l)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function uD(){return typeof BlobBuilder!="undefined"?BlobBuilder:typeof WebKitBlobBuilder!="undefined"?WebKitBlobBuilder:void 0}function cD(...t){const e=uD();if(e!==void 0){const n=new e;for(let r=0;r<t.length;r++)n.append(t[r]);return n.getBlob()}else{if(Ff())return new Blob(t);throw new we(Te.UNSUPPORTED_ENVIRONMENT,"This browser doesn't seem to support creating Blobs")}}function hD(t,e,n){return t.webkitSlice?t.webkitSlice(e,n):t.mozSlice?t.mozSlice(e,n):t.slice?t.slice(e,n):null}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dD(t){if(typeof atob=="undefined")throw QN("base-64");return atob(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const en={RAW:"raw",BASE64:"base64",BASE64URL:"base64url",DATA_URL:"data_url"};class Bf{constructor(e,n){this.data=e,this.contentType=n||null}}function fD(t,e){switch(t){case en.RAW:return new Bf(aE(e));case en.BASE64:case en.BASE64URL:return new Bf(lE(t,e));case en.DATA_URL:return new Bf(mD(e),gD(e))}throw bf()}function aE(t){const e=[];for(let n=0;n<t.length;n++){let r=t.charCodeAt(n);if(r<=127)e.push(r);else if(r<=2047)e.push(192|r>>6,128|r&63);else if((r&64512)==55296)if(!(n<t.length-1&&(t.charCodeAt(n+1)&64512)==56320))e.push(239,191,189);else{const s=r,o=t.charCodeAt(++n);r=65536|(s&1023)<<10|o&1023,e.push(240|r>>18,128|r>>12&63,128|r>>6&63,128|r&63)}else(r&64512)==56320?e.push(239,191,189):e.push(224|r>>12,128|r>>6&63,128|r&63)}return new Uint8Array(e)}function pD(t){let e;try{e=decodeURIComponent(t)}catch{throw Qo(en.DATA_URL,"Malformed data URL.")}return aE(e)}function lE(t,e){switch(t){case en.BASE64:{const i=e.indexOf("-")!==-1,s=e.indexOf("_")!==-1;if(i||s)throw Qo(t,"Invalid character '"+(i?"-":"_")+"' found: is it base64url encoded?");break}case en.BASE64URL:{const i=e.indexOf("+")!==-1,s=e.indexOf("/")!==-1;if(i||s)throw Qo(t,"Invalid character '"+(i?"+":"/")+"' found: is it base64 encoded?");e=e.replace(/-/g,"+").replace(/_/g,"/");break}}let n;try{n=dD(e)}catch(i){throw i.message.includes("polyfill")?i:Qo(t,"Invalid character found")}const r=new Uint8Array(n.length);for(let i=0;i<n.length;i++)r[i]=n.charCodeAt(i);return r}class uE{constructor(e){this.base64=!1,this.contentType=null;const n=e.match(/^data:([^,]+)?,/);if(n===null)throw Qo(en.DATA_URL,"Must be formatted 'data:[<mediatype>][;base64],<data>");const r=n[1]||null;r!=null&&(this.base64=yD(r,";base64"),this.contentType=this.base64?r.substring(0,r.length-";base64".length):r),this.rest=e.substring(e.indexOf(",")+1)}}function mD(t){const e=new uE(t);return e.base64?lE(en.BASE64,e.rest):pD(e.rest)}function gD(t){return new uE(t).contentType}function yD(t,e){return t.length>=e.length?t.substring(t.length-e.length)===e:!1}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(e,n){let r=0,i="";iE(e)?(this.data_=e,r=e.size,i=e.type):e instanceof ArrayBuffer?(n?this.data_=new Uint8Array(e):(this.data_=new Uint8Array(e.byteLength),this.data_.set(new Uint8Array(e))),r=this.data_.length):e instanceof Uint8Array&&(n?this.data_=e:(this.data_=new Uint8Array(e.length),this.data_.set(e)),r=e.length),this.size_=r,this.type_=i}size(){return this.size_}type(){return this.type_}slice(e,n){if(iE(this.data_)){const r=this.data_,i=hD(r,e,n);return i===null?null:new yr(i)}else{const r=new Uint8Array(this.data_.buffer,e,n-e);return new yr(r,!0)}}static getBlob(...e){if(Ff()){const n=e.map(r=>r instanceof yr?r.data_:r);return new yr(cD.apply(null,n))}else{const n=e.map(o=>Uf(o)?fD(en.RAW,o).data:o.data_);let r=0;n.forEach(o=>{r+=o.byteLength});const i=new Uint8Array(r);let s=0;return n.forEach(o=>{for(let l=0;l<o.length;l++)i[s++]=o[l]}),new yr(i,!0)}}uploadData(){return this.data_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cE(t){let e;try{e=JSON.parse(t)}catch{return null}return tD(e)?e:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _D(t){if(t.length===0)return null;const e=t.lastIndexOf("/");return e===-1?"":t.slice(0,e)}function vD(t,e){const n=e.split("/").filter(r=>r.length>0).join("/");return t.length===0?n:t+"/"+n}function hE(t){const e=t.lastIndexOf("/",t.length-2);return e===-1?t:t.slice(e+1)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ED(t,e){return e}class it{constructor(e,n,r,i){this.server=e,this.local=n||e,this.writable=!!r,this.xform=i||ED}}let Iu=null;function wD(t){return!Uf(t)||t.length<2?t:hE(t)}function dE(){if(Iu)return Iu;const t=[];t.push(new it("bucket")),t.push(new it("generation")),t.push(new it("metageneration")),t.push(new it("name","fullPath",!0));function e(s,o){return wD(o)}const n=new it("name");n.xform=e,t.push(n);function r(s,o){return o!==void 0?Number(o):o}const i=new it("size");return i.xform=r,t.push(i),t.push(new it("timeCreated")),t.push(new it("updated")),t.push(new it("md5Hash",null,!0)),t.push(new it("cacheControl",null,!0)),t.push(new it("contentDisposition",null,!0)),t.push(new it("contentEncoding",null,!0)),t.push(new it("contentLanguage",null,!0)),t.push(new it("contentType",null,!0)),t.push(new it("metadata","customMetadata",!0)),Iu=t,Iu}function TD(t,e){function n(){const r=t.bucket,i=t.fullPath,s=new yt(r,i);return e._makeStorageReference(s)}Object.defineProperty(t,"ref",{get:n})}function ID(t,e,n){const r={};r.type="file";const i=n.length;for(let s=0;s<i;s++){const o=n[s];r[o.local]=o.xform(r,e[o.server])}return TD(r,t),r}function fE(t,e,n){const r=cE(e);return r===null?null:ID(t,r,n)}function AD(t,e,n,r){const i=cE(e);if(i===null||!Uf(i.downloadTokens))return null;const s=i.downloadTokens;if(s.length===0)return null;const o=encodeURIComponent;return s.split(",").map(h=>{const f=t.bucket,y=t.fullPath,g="/b/"+o(f)+"/o/"+o(y),k=jf(g,n,r),V=oE({alt:"media",token:h});return k+V})[0]}function SD(t,e){const n={},r=e.length;for(let i=0;i<r;i++){const s=e[i];s.writable&&(n[s.server]=t[s.local])}return JSON.stringify(n)}class pE{constructor(e,n,r,i){this.url=e,this.method=n,this.handler=r,this.timeout=i,this.urlParams={},this.headers={},this.body=null,this.errorHandler=null,this.progressCallback=null,this.successCodes=[200],this.additionalRetryCodes=[]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mE(t){if(!t)throw bf()}function kD(t,e){function n(r,i){const s=fE(t,i,e);return mE(s!==null),s}return n}function RD(t,e){function n(r,i){const s=fE(t,i,e);return mE(s!==null),AD(s,i,t.host,t._protocol)}return n}function gE(t){function e(n,r){let i;return n.getStatus()===401?n.getErrorText().includes("Firebase App Check token is invalid")?i=jN():i=FN():n.getStatus()===402?i=UN(t.bucket):n.getStatus()===403?i=BN(t.path):i=r,i.status=n.getStatus(),i.serverResponse=r.serverResponse,i}return e}function CD(t){const e=gE(t);function n(r,i){let s=e(r,i);return r.getStatus()===404&&(s=LN(t.path)),s.serverResponse=i.serverResponse,s}return n}function PD(t,e,n){const r=e.fullServerUrl(),i=jf(r,t.host,t._protocol),s="GET",o=t.maxOperationRetryTime,l=new pE(i,s,RD(t,n),o);return l.errorHandler=CD(e),l}function ND(t,e){return t&&t.contentType||e&&e.type()||"application/octet-stream"}function DD(t,e,n){const r=Object.assign({},n);return r.fullPath=t.path,r.size=e.size(),r.contentType||(r.contentType=ND(null,e)),r}function VD(t,e,n,r,i){const s=e.bucketOnlyServerUrl(),o={"X-Goog-Upload-Protocol":"multipart"};function l(){let P="";for(let N=0;N<2;N++)P=P+Math.random().toString().slice(2);return P}const u=l();o["Content-Type"]="multipart/related; boundary="+u;const h=DD(e,r,i),f=SD(h,n),y="--"+u+`\r
Content-Type: application/json; charset=utf-8\r
\r
`+f+`\r
--`+u+`\r
Content-Type: `+h.contentType+`\r
\r
`,g=`\r
--`+u+"--",k=yr.getBlob(y,r,g);if(k===null)throw GN();const V={name:h.fullPath},O=jf(s,t.host,t._protocol),v="POST",E=t.maxUploadRetryTime,I=new pE(O,v,kD(t,n),E);return I.urlParams=V,I.headers=o,I.body=k.uploadData(),I.errorHandler=gE(e),I}class OD{constructor(){this.sent_=!1,this.xhr_=new XMLHttpRequest,this.initXhr(),this.errorCode_=Zr.NO_ERROR,this.sendPromise_=new Promise(e=>{this.xhr_.addEventListener("abort",()=>{this.errorCode_=Zr.ABORT,e()}),this.xhr_.addEventListener("error",()=>{this.errorCode_=Zr.NETWORK_ERROR,e()}),this.xhr_.addEventListener("load",()=>{e()})})}send(e,n,r,i,s){if(this.sent_)throw Yo("cannot .send() more than once");if(Fr(e)&&r&&(this.xhr_.withCredentials=!0),this.sent_=!0,this.xhr_.open(n,e,!0),s!==void 0)for(const o in s)s.hasOwnProperty(o)&&this.xhr_.setRequestHeader(o,s[o].toString());return i!==void 0?this.xhr_.send(i):this.xhr_.send(),this.sendPromise_}getErrorCode(){if(!this.sent_)throw Yo("cannot .getErrorCode() before sending");return this.errorCode_}getStatus(){if(!this.sent_)throw Yo("cannot .getStatus() before sending");try{return this.xhr_.status}catch{return-1}}getResponse(){if(!this.sent_)throw Yo("cannot .getResponse() before sending");return this.xhr_.response}getErrorText(){if(!this.sent_)throw Yo("cannot .getErrorText() before sending");return this.xhr_.statusText}abort(){this.xhr_.abort()}getResponseHeader(e){return this.xhr_.getResponseHeader(e)}addUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.addEventListener("progress",e)}removeUploadProgressListener(e){this.xhr_.upload!=null&&this.xhr_.upload.removeEventListener("progress",e)}}class xD extends OD{initXhr(){this.xhr_.responseType="text"}}function yE(){return new xD}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ei{constructor(e,n){this._service=e,n instanceof yt?this._location=n:this._location=yt.makeFromUrl(n,e.host)}toString(){return"gs://"+this._location.bucket+"/"+this._location.path}_newRef(e,n){return new ei(e,n)}get root(){const e=new yt(this._location.bucket,"");return this._newRef(this._service,e)}get bucket(){return this._location.bucket}get fullPath(){return this._location.path}get name(){return hE(this._location.path)}get storage(){return this._service}get parent(){const e=_D(this._location.path);if(e===null)return null;const n=new yt(this._location.bucket,e);return new ei(this._service,n)}_throwIfRoot(e){if(this._location.path==="")throw YN(e)}}function MD(t,e,n){t._throwIfRoot("uploadBytes");const r=VD(t.storage,t._location,dE(),new yr(e,!0),n);return t.storage.makeRequestWithTokens(r,yE).then(i=>({metadata:i,ref:t}))}function bD(t){t._throwIfRoot("getDownloadURL");const e=PD(t.storage,t._location,dE());return t.storage.makeRequestWithTokens(e,yE).then(n=>{if(n===null)throw KN();return n})}function LD(t,e){const n=vD(t._location.path,e),r=new yt(t._location.bucket,n);return new ei(t.storage,r)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function UD(t){return/^[A-Za-z]+:\/\//.test(t)}function FD(t,e){return new ei(t,e)}function _E(t,e){if(t instanceof $f){const n=t;if(n._bucket==null)throw WN();const r=new ei(n,n._bucket);return e!=null?_E(r,e):r}else return e!==void 0?LD(t,e):t}function jD(t,e){if(e&&UD(e)){if(t instanceof $f)return FD(t,e);throw Lf("To use ref(service, url), the first argument must be a Storage instance.")}else return _E(t,e)}function vE(t,e){const n=e==null?void 0:e[nE];return n==null?null:yt.makeFromBucketSpec(n,t)}function BD(t,e,n,r={}){t.host=`${e}:${n}`;const i=Fr(e);i&&ed(`https://${t.host}/b`),t._isUsingEmulator=!0,t._protocol=i?"https":"http";const{mockUserToken:s}=r;s&&(t._overrideAuthToken=typeof s=="string"?s:a_(s,t.app.options.projectId))}class $f{constructor(e,n,r,i,s,o=!1){this.app=e,this._authProvider=n,this._appCheckProvider=r,this._url=i,this._firebaseVersion=s,this._isUsingEmulator=o,this._bucket=null,this._host=tE,this._protocol="https",this._appId=null,this._deleted=!1,this._maxOperationRetryTime=MN,this._maxUploadRetryTime=bN,this._requests=new Set,i!=null?this._bucket=yt.makeFromBucketSpec(i,this._host):this._bucket=vE(this._host,this.app.options)}get host(){return this._host}set host(e){this._host=e,this._url!=null?this._bucket=yt.makeFromBucketSpec(this._url,e):this._bucket=vE(e,this.app.options)}get maxUploadRetryTime(){return this._maxUploadRetryTime}set maxUploadRetryTime(e){sE("time",0,Number.POSITIVE_INFINITY,e),this._maxUploadRetryTime=e}get maxOperationRetryTime(){return this._maxOperationRetryTime}set maxOperationRetryTime(e){sE("time",0,Number.POSITIVE_INFINITY,e),this._maxOperationRetryTime=e}async _getAuthToken(){if(this._overrideAuthToken)return this._overrideAuthToken;const e=this._authProvider.getImmediate({optional:!0});if(e){const n=await e.getToken();if(n!==null)return n.accessToken}return null}async _getAppCheckToken(){if(pt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=this._appCheckProvider.getImmediate({optional:!0});return e?(await e.getToken()).token:null}_delete(){return this._deleted||(this._deleted=!0,this._requests.forEach(e=>e.cancel()),this._requests.clear()),Promise.resolve()}_makeStorageReference(e){return new ei(this,e)}_makeRequest(e,n,r,i,s=!0){if(this._deleted)return new XN(rE());{const o=lD(e,this._appId,r,i,n,this._firebaseVersion,s,this._isUsingEmulator);return this._requests.add(o),o.getPromise().then(()=>this._requests.delete(o),()=>this._requests.delete(o)),o}}async makeRequestWithTokens(e,n){const[r,i]=await Promise.all([this._getAuthToken(),this._getAppCheckToken()]);return this._makeRequest(e,n,r,i).getPromise()}}const EE="@firebase/storage",wE="0.14.2";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TE="storage";function UO(t,e,n){return t=ge(t),MD(t,e,n)}function FO(t){return t=ge(t),bD(t)}function jO(t,e){return t=ge(t),jD(t,e)}function BO(t=hd(),e){t=ge(t);const r=vl(t,TE).getImmediate({identifier:e}),i=i_("storage");return i&&$D(r,...i),r}function $D(t,e,n,r={}){BD(t,e,n,r)}function zD(t,{instanceIdentifier:e}){const n=t.getProvider("app").getImmediate(),r=t.getProvider("auth-internal"),i=t.getProvider("app-check-internal");return new $f(n,r,i,e,$r)}function HD(){Br(new Kn(TE,zD,"PUBLIC").setMultipleInstances(!0)),qt(EE,wE,""),qt(EE,wE,"esm2020")}HD();var qD={exports:{}},Xo={};/** @license React v17.0.2
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var WD=Ct.exports,IE=60103;Xo.Fragment=60107;if(typeof Symbol=="function"&&Symbol.for){var AE=Symbol.for;IE=AE("react.element"),Xo.Fragment=AE("react.fragment")}var GD=WD.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,KD=Object.prototype.hasOwnProperty,QD={key:!0,ref:!0,__self:!0,__source:!0};function SE(t,e,n){var r,i={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(r in e)KD.call(e,r)&&!QD.hasOwnProperty(r)&&(i[r]=e[r]);if(t&&t.defaultProps)for(r in e=t.defaultProps,e)i[r]===void 0&&(i[r]=e[r]);return{$$typeof:IE,type:t,key:s,ref:o,props:i,_owner:GD.current}}Xo.jsx=SE;Xo.jsxs=SE;qD.exports=Xo;export{QV as $,vV as A,XV as B,mV as C,pV as D,RV as E,NV as F,fr as G,ZD as H,zV as I,lV as J,FV as K,uO as L,BV as M,wV as N,EO as O,KV as P,gV as Q,XD as R,nO as S,_V as T,lO as U,dO as V,fO as W,pO as X,cO as Y,dV as Z,aO as _,hd as a,YV as a0,NO as a1,PO as a2,mO as a3,tV as a4,eV as a5,ZV as a6,eO as a7,uV as a8,iO as a9,rV as aA,sV as aB,nV as aC,rO as aD,AV as aE,$V as aF,OO as aG,AO as aH,OV as aI,UV as aJ,MV as aK,EV as aL,bV as aM,DO as aN,JD as aO,VV as aa,iV as ab,xV as ac,oV as ad,kV as ae,JV as af,IO as ag,sO as ah,oO as ai,hO as aj,jV as ak,hV as al,DV as am,jO as an,UO as ao,FO as ap,PV as aq,tO as ar,GV as as,qV as at,yV as au,LV as av,TV as aw,HV as ax,SV as ay,WV as az,LO as b,vO as c,BO as d,bO as e,xO as f,gO as g,mC as h,J2 as i,SO as j,qD as k,_O as l,kO as m,am as n,CV as o,VO as p,wO as q,Ct as r,MO as s,CO as t,RO as u,fV as v,TO as w,aV as x,IV as y,cV as z};
