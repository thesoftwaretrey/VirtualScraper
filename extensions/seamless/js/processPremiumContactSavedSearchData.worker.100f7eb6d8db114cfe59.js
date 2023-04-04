(()=>{"use strict";const e=Symbol("Comlink.proxy"),t=Symbol("Comlink.endpoint"),n=Symbol("Comlink.releaseProxy"),r=Symbol("Comlink.thrown"),a=e=>"object"==typeof e&&null!==e||"function"==typeof e,i=new Map([["proxy",{canHandle:t=>a(t)&&t[e],serialize(e){const{port1:t,port2:n}=new MessageChannel;return l(e,t),[n,[n]]},deserialize:e=>(e.start(),c(e,[],undefined))}],["throw",{canHandle:e=>a(e)&&r in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function l(t,n=self){n.addEventListener("message",(function a(i){if(!i||!i.data)return;const{id:o,type:c,path:u}=Object.assign({path:[]},i.data),d=(i.data.argumentList||[]).map(y);let f;try{const n=u.slice(0,-1).reduce(((e,t)=>e[t]),t),r=u.reduce(((e,t)=>e[t]),t);switch(c){case"GET":f=r;break;case"SET":n[u.slice(-1)[0]]=y(i.data.value),f=!0;break;case"APPLY":f=r.apply(n,d);break;case"CONSTRUCT":f=function(t){return Object.assign(t,{[e]:!0})}(new r(...d));break;case"ENDPOINT":{const{port1:e,port2:n}=new MessageChannel;l(t,n),f=function(e,t){return m.set(e,t),e}(e,[e])}break;case"RELEASE":f=void 0;break;default:return}}catch(e){f={value:e,[r]:0}}Promise.resolve(f).catch((e=>({value:e,[r]:0}))).then((e=>{const[t,r]=p(e);n.postMessage(Object.assign(Object.assign({},t),{id:o}),r),"RELEASE"===c&&(n.removeEventListener("message",a),s(n))}))})),n.start&&n.start()}function s(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function o(e){if(e)throw new Error("Proxy has been released and is not useable")}function c(e,r=[],a=function(){}){let i=!1;const l=new Proxy(a,{get(t,a){if(o(i),a===n)return()=>d(e,{type:"RELEASE",path:r.map((e=>e.toString()))}).then((()=>{s(e),i=!0}));if("then"===a){if(0===r.length)return{then:()=>l};const t=d(e,{type:"GET",path:r.map((e=>e.toString()))}).then(y);return t.then.bind(t)}return c(e,[...r,a])},set(t,n,a){o(i);const[l,s]=p(a);return d(e,{type:"SET",path:[...r,n].map((e=>e.toString())),value:l},s).then(y)},apply(n,a,l){o(i);const s=r[r.length-1];if(s===t)return d(e,{type:"ENDPOINT"}).then(y);if("bind"===s)return c(e,r.slice(0,-1));const[m,p]=u(l);return d(e,{type:"APPLY",path:r.map((e=>e.toString())),argumentList:m},p).then(y)},construct(t,n){o(i);const[a,l]=u(n);return d(e,{type:"CONSTRUCT",path:r.map((e=>e.toString())),argumentList:a},l).then(y)}});return l}function u(e){const t=e.map(p);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const m=new WeakMap;function p(e){for(const[t,n]of i)if(n.canHandle(e)){const[r,a]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},a]}return[{type:"RAW",value:e},m.get(e)||[]]}function y(e){switch(e.type){case"HANDLER":return i.get(e.name).deserialize(e.value);case"RAW":return e.value}}function d(e,t,n){return new Promise((r=>{const a=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===a&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:a},t),n)}))}const f=/(?:\w+:(\(?))+(?::[\w_]+(?:member|company):)?(?<memberId>[\d]+)?/i,h=/(?:\w+:)+fs(?:d)?_(?:sales|mini|profile)?(Profile|Card):(?:\()?(?<salesNavId>[\w_À&-ÿ%-][^,]+)?,?(?<type>.[^,]+)?/i;function g(e){return e.match(f)?.groups?.memberId}function N(e,t){try{let n;return t?.length?n=t:e&&"string"==typeof e&&e.length?n=e:e?.emailAddress?n=e.emailAddress:Array.isArray(e)&&e.length&&(n=e[0].emailAddress),n}catch(e){return null}}const b=e=>{if(!e)return{};const t=e;return Object.entries(t).forEach((([e,n])=>{n&&"object"==typeof n&&b(n),(n&&"object"==typeof n&&!Object.keys(n).length||null==n)&&(Array.isArray(t)?t.splice(e,1):delete t[e])})),t},v=e=>e.replace(/(\r\n|\n|\r)/gm," ").replace(/^Greater /,"").replace(/ Area$/,"").replace(/ Metropolitan$/,""),A=e=>{let t=e&&"string"==typeof e&&e.trim();return t?(/^https?:\/([^/].*|\/\/+.+)$/i.test(t)&&(t=t.replace(/:\/+/,"://")),t):e},O=e=>{try{let t=e;if(t&&"object"==typeof t){const{artifacts:e,rootUrl:n}=t;if(n?.length&&n.includes("http")&&e&&Array.isArray(e)?t=n+e[e.length-1].fileIdentifyingUrlPathSegment:n&&n.length||!e?.length||!e[e.length-1].fileIdentifyingUrlPathSegment||!e[e.length-1].fileIdentifyingUrlPathSegment.includes("http")||(t=e[e.length-1].fileIdentifyingUrlPathSegment),!t||!t.length)return}return t=t&&A(t),t}catch(e){return}},w=(e=[])=>{try{let t=e;return t&&"object"==typeof t&&!Array.isArray(t)&&(t=Object.values(t)),t=t.reduce(((e,t)=>{const n=("string"==typeof t&&t||t.name||"").trim();return n&&e.push(n),e}),[]),t.length?t:null}catch(e){return null}},E=function(e){return Array.isArray(e)?e:null==e?[]:[e]};function S(e){try{return e.filter((e=>e)).map((e=>{const{schoolName:t,degree:n,degreeName:r,activities:a=[],fieldOfStudy:i,dateRange:{start:{year:l}={},end:{year:s}={}}={},startedOn:{year:o}={},endedOn:{year:c}={},endDateOn:{year:u}={},startDateOn:{year:m}={},startDateYear:p,endDateYear:y}=e,d=l||o||m||p,f=s||c||u||y;let{fieldsOfStudy:h}=e;Array.isArray(h)&&h.length&&(h=h.join());const g="string"==typeof h?h:i;return{companyName:t,degreeName:r||n,activities:a&&E(a),fieldOfStudy:g,...d&&{startDate:{year:d}},...f&&{endDate:{year:f}}}}))}catch(e){return null}}function j(e=[]){try{return e.reduce(((e,t)=>{const n=e;return t.name&&n.push(t.name),n}),[])}catch(e){return null}}function I(e=[]){try{return e.reduce(((e,t)=>{const n=e;return t.name&&n.push(t.name),n}),[])}catch(e){return null}}const P=e=>{const t=e&&(e.indexOf(" at ")>-1&&e.split(" at ")||e.indexOf(" @ ")>-1&&e.split(" @ ")||e.indexOf(" - ")>-1&&e.split(" - "));let n,r;return t?(n=t?.length&&1!==t.length?t.pop():void 0,r=t?.length?t.join(" "):void 0):r=e,{companyName:n,title:r}};function k(e){return e.filter((e=>!e.endDate&&e.startDate||e.current))}const R=e=>{return Array.isArray(e)&&!(null==(t=e)||(Array.isArray(t)?0===t.length:(e=>{const t=typeof e;return!!e&&("function"===t||"object"===t)})(t)&&0===Object.keys(t).length));var t},D=e=>Boolean("string"==typeof e&&e.length),U=e=>{const{liMemberId:t,publicIdentifier:n,salesNavIdentifier:r,recruiterIdentifier:a,flagshipProfileUrl:i,firstName:l,lastName:s,fullName:o,birthDateOn:c,profilePicture:u,summary:m,emails:p,phoneNumbers:y,primaryEmail:d,location:f,social:h,awards:U,certifications:T,courses:L,educations:C,industries:M,languages:x,organizations:z,patents:$,projects:H,publications:_,skills:G,volunteeringExperiences:Y,occupation:W,positions:F}=e;let B=o;!B?.length&&l&&s&&(B=`${l} ${s}`);const X=i||n&&`https://www.linkedin.com/in/${n}`,q=r&&`https://www.linkedin.com/sales/lead/${r}`,J=a&&`https://www.linkedin.com/talent/search/profile/${a}`;let K,Q,V=R(F)?F.map((e=>"object"==typeof e&&Object.keys(e).length&&(e=>{const{company:t,companyName:n,companyUrn:r,companyUrnResolutionResult:a,companyResolutionResult:i,current:l,dateRange:s,description:o,"*employmentType":c,endDateOn:u,endedOn:m,location:p,locationName:y,startDateOn:d,startedOn:f,title:h}=e,{industry:N,location:b}=a||{},{industries:A}=i||{},{start:O,startDate:w,end:S,endDate:j}=s||{},I=t&&"string"==typeof t&&t||r,P=O||w||d||f,k=j||S||u||m;let R,D=p?.displayName??p;return!D&&b&&(D=b),!D&&y&&(D=y),A?R=E(A):N&&(R=E(N)),{companyName:n?.trim(),current:l,description:o,employmentType:c,endDate:k&&"object"==typeof k&&Object.keys(k).length?{...k.month&&{month:k.month},...k.year&&{year:k.year}}:null,fullString:D&&v(D),industries:R&&Array.isArray(R)&&R.length?R:null,linkedInCompanyId:I&&g(I),startDate:P&&"object"==typeof P&&Object.keys(P).length?{...P.month&&{month:P.month},...P.year&&{year:P.year}}:null,titleName:h}})(e))):null;R(V)&&(V=V.filter((e=>!!e?.companyName&&!!e?.titleName)),V=((e,t)=>{const n=e.reduce(((e,n)=>{const r=e;return r[t.map((e=>n[e])).join("-")]=n,r}),{});return Object.values(n)})(V,["companyName","titleName","employmentType"])),W&&({companyName:K,title:Q}=P(W)),!K&&F?.length&&(K=F[0].companyName);let Z={liMemberId:t,liPublicIdentifier:n&&decodeURI(n),liSalesNavId:r,liRecruiterId:a,liProfileUrl:D(X)?A(X):null,liSalesNavUrl:D(q)?A(q):null,liRecruiterUrl:D(J)?A(J):null,firstName:l,lastName:s,contactName:B,birthday:c,liImageUrl:u&&O(u),contactEmail:N(p,d),phoneNumbers:y,locationFullString:D(f)?v(f):null,social:h,...m&&{meta:{summary:m}},awards:R(U)?U:null,certifications:R(T)?T:null,courses:R(L)?L:null,educations:R(C)?S(C):null,industries:w(M),languages:R(x)?I(x):null,organizations:R(z)?z:null,patents:R($)?$.filter((e=>!!e)):null,projects:R(H)?H.filter((e=>!!e)):null,publications:R(_)?_.filter((e=>!!e)):null,skills:R(G)?j(G):null,volunteeringExperiences:R(Y)?Y:null,companyName:K,title:Q,occupation:W,positions:V,itemType:"contact"};return Z=function(e){const t=e;let n,r;if(R(t.positions)){const e=k(t.positions);R(e)&&(t.companyName=e[0].companyName,t.title=e[0].titleName)}if(t.companyName&&t.title||!t.occupation||(({companyName:n,title:r}=P(t.occupation)),n&&(t.companyName=n),r&&(t.title=r)),R(t.positions)){const e=k(t.positions);!R(e)||t.companyName===e[0].companyName&&t.title===e[0].titleName||(t.companyName=e[0].companyName,t.title=e[0].titleName)}return t}(Z),Z=b(Z),Z},T=["firstName","contactName"],L=["liRecruiterId","liSalesNavId","liPublicIdentifier"],C=e=>{const{currentPositions:t,entityUrn:n,geoRegion:r,firstName:a,fullName:i,lastName:l,objectUrn:s,pastPositions:o,profilePictureDisplayImage:c}=e;let u=[];Array.isArray(t)&&t?.length&&(u=[...u,...t]),Array.isArray(o)&&o?.length&&(u=[...u,...o]);const m={liMemberId:s&&g(s),salesNavIdentifier:n&&(p=n,p.match(h)?.groups?.salesNavId),firstName:a,lastName:l,fullName:i,profilePicture:c,location:r,positions:u?.length?u:null};var p;const y=U(m);return y.pageSectionSourced="premiumContactSavedSearch",y.itemType="contact",d=y,T.some((e=>Object.prototype.hasOwnProperty.call(d,e)))&&L.some((e=>Object.prototype.hasOwnProperty.call(d,e)))&&T.every((e=>!d[e]?.toLowerCase().includes("linkedin member")))?y:null;var d};l((async e=>{let t=[],n=[];return null!=e.metadata?.savedSearchName&&(n=e.elements.map((e=>C(e)))),n.length&&(t=await Promise.all(n)),{parsedItems:t}}),self)})();