
/* ===== زر الرجوع في الهاتف: يرجع للصفحة السابقة، وفي الرئيسية يطلب ضغطتين للخروج ===== */
(function(){const TABS=['list','updates','comm','calls'],ROOTV=['wait','pending','rejected'];let stk=[],pop=0,exitT=0;
const key=()=>[S.v,S.chat||'',S.ob||'',S.ss||'',S.sheet?S.sheet.t:''].join('|');
const snap=()=>{const s={...S,ob:S.ob||null,ss:S.ss||0,chat:S.chat||null};delete s.sheet;return{k:key(),s}};
const isRoot=()=>!S.sheet&&(TABS.includes(S.v)||ROOTV.includes(S.v)||(S.v=='auth'&&(S.ob||'welcome')=='welcome')||(S.v=='setup'&&(S.ss||1)==1));
stk.push(snap());
const r0=render;render=function(){r0();if(pop)return;const k=key(),top=stk[stk.length-1];if(top&&k===top.k)return;
if(isRoot()){if(TABS.includes(S.v)&&S.v!='list'){stk=[{k:'list|||||',s:{...S,v:'list',chat:null,ob:null,ss:0}},snap()]}else stk=[snap()];return}
if(stk.length>1&&stk[stk.length-2].k===k){stk.pop();return}
stk.push(snap())};
function handleBack(){const cu=$('callui');if(cu&&cu.style.display=='flex')return true;
if(S.sheet){S.sheet=null;render();return true}
if(stk.length>1){stk.pop();const t=stk[stk.length-1];Object.assign(S,t.s,{sheet:null});pop=1;try{render()}finally{pop=0}return true}
return false}
window.goBack=handleBack;
const rearm=()=>{try{history.pushState({s:1},'')}catch(e){}};
try{history.replaceState({s:0},'');history.pushState({s:1},'')}catch(e){}
window.addEventListener('popstate',()=>{if(handleBack())return rearm();
if(Date.now()-exitT<2200){const A=window.Capacitor&&Capacitor.Plugins&&Capacitor.Plugins.App;if(A&&A.exitApp)A.exitApp();else history.back();return}
exitT=Date.now();toast('اضغط رجوع مرة أخرى للخروج');rearm()})})();
render();


;(window.__ck=window.__ck||[]).push(4);
