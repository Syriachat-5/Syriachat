/* ===== v7 (يُحمَّل بعد app3) ===== */

/* 1) إقلاع مباشر بلا وميض شاشة الدخول */
let READY7=0,AUTOFAIL7=0;
auth.onAuthStateChanged(()=>{READY7=1;render()});
setTimeout(()=>{if(!READY7){READY7=1;render()}},5000);
setTimeout(()=>{AUTOFAIL7=1;if(!D.me)render()},8000);

/* 2) رقم الهاتف 9 خانات */
function fix9(){if(S.v!='auth'||!['phone','login'].includes(S.ob))return;const e=$('ph');if(!e)return;
e.maxLength=9;if(e.value.length>9){e.value=e.value.slice(0,9);S.ph=e.value}
const ok=(S.ph||'').length==9,b=$('phn');if(b){b.disabled=!ok;b.style.background=ok?'':'#eceff1';b.style.color=ok?'':'#9aa0a6'}
const c=$('phc');if(c)c.textContent=(S.ph||'').length+'/9';
document.querySelectorAll('#app p.mu').forEach(p=>{if(p.textContent.includes('10 خانات'))p.textContent=p.textContent.replace('10 خانات','9 خانات')})}
phIn=function(e){S.perr='';const pe=$('perr');if(pe)pe.remove();
const v=e.value.replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\D/g,'').slice(0,9);e.value=v;S.ph=v;
const b=$('phn'),ok=v.length==9;if(b){b.disabled=!ok;b.style.background=ok?'':'#eceff1';b.style.color=ok?'':'#9aa0a6'}
const c=$('phc');if(c)c.textContent=v.length+'/9'};
doLoginPhone=async function(){const num=S.ph||'',cc=S.cc||'963';
if(!/^\d{9}$/.test(num))return toast('يجب أن يتكون الرقم من 9 خانات');
const tryL=async u=>{const p=pwFor(u);await auth.signInWithEmailAndPassword(em(u),p);saveCred(u,p)};
try{await tryL(cc+num)}catch(e){
if(e&&/not-found|invalid-credential|wrong-password/.test(e.code)){
try{await tryL(cc+'0'+num);return}catch(e2){}/* حسابات قديمة سُجّلت بصفر في البداية */
toast('هذا الرقم غير مسجَّل. أنشئ حساباً أولاً')}
else toast('تعذر الدخول: '+((e&&e.code)||''))}};
doPhone=async function(){const num=S.ph||'',cc=S.cc||'963';
if(!/^\d{9}$/.test(num))return toast('يجب أن يتكون الرقم من 9 خانات');
if(D.cfg.reg===false)return toast('التسجيل متوقف حالياً');
const dv=devId();let n=0,ex=0;try{const d=await fs.doc('devs/'+dv).get();if(d.exists){n=d.data().n||0;ex=d.data().extra||0}}catch(e){}
if(n>=(+D.cfg.maxAcc||1)+ex)return toast('لا يمكنك إنشاء المزيد من الحسابات على هذا الجهاز. تواصل مع الإدارة');
try{const ms=await auth.fetchSignInMethodsForEmail(em(cc+'0'+num));if(ms&&ms.length){S.perr='هذا الرقم مسجَّل مسبقاً، ولا يمكن إنشاء حساب آخر على نفس الرقم.';return render()}}catch(e){}
const u=cc+num,pw=pwFor(u);SIGNING=1;render();
try{const r=await auth.createUserWithEmailAndPassword(em(u),pw);saveCred(u,pw);
try{await fs.doc('users/'+r.user.uid).set({user:u,phone:num,cc,name:'',bio:'',bal:100,verified:false,vreq:false,banned:false,admin:false,contacts:[],status:'pending',setup:false,dev:dv,t:Date.now()})}catch(e2){try{await r.user.delete()}catch(e3){}clearCred();throw e2}
try{await fs.doc('devs/'+dv).set({n:n+1,extra:ex,t:Date.now()})}catch(e4){}
SIGNING=0;S.ph='';render()}
catch(e){SIGNING=0;if(e&&e.code=='auth/email-already-in-use'){S.perr='هذا الرقم مسجَّل مسبقاً، ولا يمكن إنشاء حساب آخر على نفس الرقم.'}else toast('تعذر إرسال الطلب: '+((e&&e.code)||''));render()}};

/* 3) زر السماعة في شاشة المكالمة */
Object.assign(IX,{spk:'<path d="M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/>'});
let SPK7=0;
function spkBtn7(){const u=$('callui'),m=$('cm');if(!u||!m||$('spk'))return;
const b=document.createElement('button');b.id='spk';b.type='button';b.className=m.className.replace(/\boff\b/,'').trim();b.innerHTML=ix('spk');b.title='مكبّر الصوت';b.onclick=togSpk7;m.parentNode.insertBefore(b,m)}
async function togSpk7(){const v=$('rv'),b=$('spk');SPK7=!SPK7;if(b)b.classList.toggle('on',!!SPK7);let ok=false;
try{if(v&&v.setSinkId&&navigator.mediaDevices&&navigator.mediaDevices.enumerateDevices){
const o=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind=='audiooutput');
const sp=o.find(d=>/speaker|loud|مكبر/i.test(d.label)),ea=o.find(d=>/earpiece|handset|phone|سماعة الأذن/i.test(d.label))||o.find(d=>d.deviceId=='default'),t=SPK7?sp:ea;
if(t){await v.setSinkId(t.deviceId);ok=true}}}catch(e){}
toast(ok?(SPK7?'مكبّر الصوت مفعّل':'السماعة الأذنية'):'تعذر تبديل المخرج من داخل التطبيق، استخدم أزرار الصوت في الهاتف')}
const _cu7=callUI;callUI=function(on,name,v){_cu7(on,name,v);SPK7=0;const b=$('spk');if(b)b.classList.remove('on');if(on)spkBtn7()};

/* 4) حفظ أسماء جهات الاتصال (على هذا الجهاز) */
const CNK='tgcn';
const cnAll=()=>{try{return JSON.parse(localStorage.getItem(CNK)||'{}')}catch(e){return{}}};
function applyCN(){const m=cnAll();D.users.forEach(u=>{if(u.sn===undefined)u.sn=u.name;u.name=(u.id!=D.me&&m[u.id])||u.sn})}
const _ui7=ui;ui=function(){applyCN();return _ui7()};
function saveCN(id){const u=U(id);if(!u)return;const m=cnAll();
const n=prompt('اسم جهة الاتصال (اتركه فارغاً لاستعادة الاسم الأصلي)',m[id]||u.sn||u.name);if(n===null)return;
if(n.trim())m[id]=n.trim().slice(0,30);else delete m[id];
try{localStorage.setItem(CNK,JSON.stringify(m))}catch(e){}applyCN();render();toast(n.trim()?'تم حفظ الاسم':'أُعيد الاسم الأصلي')}
const _ci7=V.cinfo;V.cinfo=function(){const h=_ci7(),c=C(S.chat),o=c&&c.type=='private'?other(c):null;if(!o)return h;const cn=cnAll()[o.id];
const row=`<div class="isec"><div class="ir" onclick="saveCN('${o.id}')"><div class="ii">${ix('user')}</div><div class="t"><b>${cn?'تعديل اسم جهة الاتصال':'حفظ كجهة اتصال'}</b><small>${cn?'الاسم الأصلي: '+esc(o.sn||''):'اختر الاسم الذي يظهر لك'}</small></div></div></div><div class="isec">`;
return h.replace('<div class="isec">',()=>row)};

/* 5) شريط «إضافة» أعلى الدردشة للغرباء */
async function addBar7(id){try{await fs.doc('users/'+D.me).update({contacts:FV.arrayUnion(id)});toast('أُضيف إلى جهات الاتصال');saveCN(id)}catch(e){toast('تعذرت الإضافة')}}
const _vc7=V.chat;V.chat=function(){const h=_vc7(),c=C(S.chat);if(!c||c.type!='private')return h;const o=other(c);
if(!o||o.id==D.me||PF(c.id).nobar||(me().contacts||[]).includes(o.id))return h;
const bar=`<div class="addbar7"><span>${esc(o.sn||o.name)} ليس في جهات اتصالك</span><button onclick="addBar7('${o.id}')">إضافة</button><button class="g" onclick="blockU('${o.id}')">حظر</button><button class="x" onclick="setPF('${c.id}','nobar',1);render()">✕</button></div>`;
return h.replace('<div id="msgs"',()=>bar+'<div id="msgs"')};

/* 6) مظهر الدردشة */
(function(){const s=document.createElement('style');s.textContent=`
.addbar7{display:flex;align-items:center;gap:8px;padding:8px 12px;background:var(--bg2,#f0f2f5);border-bottom:1px solid var(--bd,#ddd);font-size:14px}
.addbar7 span{flex:1}
.addbar7 button{border:0;border-radius:16px;padding:6px 14px;background:var(--pr);color:#fff;font:inherit}
.addbar7 button.g{background:transparent;color:#e5484d}
.addbar7 button.x{background:transparent;color:var(--mu,#888);padding:6px}
#app .msgs .b{border-radius:14px;box-shadow:0 1px 1.5px rgba(0,0,0,.14);padding:7px 11px 5px;line-height:1.55}
#app .msgs .b em{font-size:11px;opacity:.65;margin-inline-start:8px}
#app .msgs .dsep{width:fit-content;margin:10px auto;padding:3px 12px;border-radius:10px;background:rgba(0,0,0,.08);font-size:12px}
[data-theme=dark] #app .msgs .dsep{background:rgba(255,255,255,.1)}
#app .cp2 .pill{border-radius:24px;box-shadow:0 1px 2px rgba(0,0,0,.15)}
#app .cp2 .micb{width:46px;height:46px;border-radius:50%;background:var(--pr);color:#fff;box-shadow:0 2px 4px rgba(0,0,0,.2)}
#spk svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
#spk.on{background:#fff!important;color:#111!important}
`;document.head.appendChild(s)})();

/* 7) غلاف render النهائي */
const _r7=render;render=function(){
if(!READY7||(!D.me&&AL&&!AUTOFAIL7&&getCred())){document.documentElement.dataset.theme=D.dark?'dark':'light';$('app').innerHTML='<div style="display:flex;min-height:100dvh;align-items:center;justify-content:center;font-size:42px">⏳</div>';return}
_r7();fix9();spkBtn7()};

;(window.__ck=window.__ck||[]).push(4);
