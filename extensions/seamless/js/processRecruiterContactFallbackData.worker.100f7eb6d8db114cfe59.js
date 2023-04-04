(()=>{"use strict";const e=Symbol("Comlink.proxy"),t=Symbol("Comlink.endpoint"),n=Symbol("Comlink.releaseProxy"),r=Symbol("Comlink.thrown"),a=e=>"object"==typeof e&&null!==e||"function"==typeof e,i=new Map([["proxy",{canHandle:t=>a(t)&&t[e],serialize(e){const{port1:t,port2:n}=new MessageChannel;return o(e,t),[n,[n]]},deserialize:e=>(e.start(),c(e,[],undefined))}],["throw",{canHandle:e=>a(e)&&r in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function o(t,n=self){n.addEventListener("message",(function a(i){if(!i||!i.data)return;const{id:l,type:c,path:u}=Object.assign({path:[]},i.data),y=(i.data.argumentList||[]).map(d);let f;try{const n=u.slice(0,-1).reduce(((e,t)=>e[t]),t),r=u.reduce(((e,t)=>e[t]),t);switch(c){case"GET":f=r;break;case"SET":n[u.slice(-1)[0]]=d(i.data.value),f=!0;break;case"APPLY":f=r.apply(n,y);break;case"CONSTRUCT":f=function(t){return Object.assign(t,{[e]:!0})}(new r(...y));break;case"ENDPOINT":{const{port1:e,port2:n}=new MessageChannel;o(t,n),f=function(e,t){return m.set(e,t),e}(e,[e])}break;case"RELEASE":f=void 0;break;default:return}}catch(e){f={value:e,[r]:0}}Promise.resolve(f).catch((e=>({value:e,[r]:0}))).then((e=>{const[t,r]=p(e);n.postMessage(Object.assign(Object.assign({},t),{id:l}),r),"RELEASE"===c&&(n.removeEventListener("message",a),s(n))}))})),n.start&&n.start()}function s(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function l(e){if(e)throw new Error("Proxy has been released and is not useable")}function c(e,r=[],a=function(){}){let i=!1;const o=new Proxy(a,{get(t,a){if(l(i),a===n)return()=>y(e,{type:"RELEASE",path:r.map((e=>e.toString()))}).then((()=>{s(e),i=!0}));if("then"===a){if(0===r.length)return{then:()=>o};const t=y(e,{type:"GET",path:r.map((e=>e.toString()))}).then(d);return t.then.bind(t)}return c(e,[...r,a])},set(t,n,a){l(i);const[o,s]=p(a);return y(e,{type:"SET",path:[...r,n].map((e=>e.toString())),value:o},s).then(d)},apply(n,a,o){l(i);const s=r[r.length-1];if(s===t)return y(e,{type:"ENDPOINT"}).then(d);if("bind"===s)return c(e,r.slice(0,-1));const[m,p]=u(o);return y(e,{type:"APPLY",path:r.map((e=>e.toString())),argumentList:m},p).then(d)},construct(t,n){l(i);const[a,o]=u(n);return y(e,{type:"CONSTRUCT",path:r.map((e=>e.toString())),argumentList:a},o).then(d)}});return o}function u(e){const t=e.map(p);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const m=new WeakMap;function p(e){for(const[t,n]of i)if(n.canHandle(e)){const[r,a]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},a]}return[{type:"RAW",value:e},m.get(e)||[]]}function d(e){switch(e.type){case"HANDLER":return i.get(e.name).deserialize(e.value);case"RAW":return e.value}}function y(e,t,n){return new Promise((r=>{const a=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===a&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:a},t),n)}))}const f=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/in\/(?<publicIdentifier>[\w_À&&-ÿ%-][^/?]+)\/?/i,h=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/sales\/(people|lead)\/(?<publicIdentifier>[\w_À&-ÿ%-][^,?/]+)?/i,g=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/company\/(?<publicIdentifier>[\w_À&-ÿ%-][^/?]+)\/?/i,b=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/sales\/company\/(?<publicIdentifier>[\d][^/?]+)\/?/i,N=/(?:\/profile)\/(?<publicIdentifier>[\w_À&-ÿ%-][^?/]+)\/?/i,v=/(?:\w+:(\(?))+(?::[\w_]+(?:member|company):)?(?<memberId>[\d]+)?/i,w=/(?:\w+:)+(ts_profile|ts_linkedin_member_profile):\(?(?<recruiterId>[\w_À&-ÿ%-][^,?]+)?/i,S={premiumCompanySearch:b,premiumCompanyProfile:b,premiumSavedAccounts:b,premiumCompanyRecommendedLeads:b,premiumCompanyAccountMapEntries:b,premiumCompanyPeopleAlsoViewed:b,premiumSavedLeads:h,premiumContactSavedSearch:h,premiumContactSearch:h,premiumContactProfile:h,premiumContactRecommendations:h,premiumContactRecommendedLeads:h,premiumContactSimilarLeads:h,standardCompanySearch:g,standardCompanyProfile:g,standardCompanyPeopleYouMayKnow:f,standardBlendedSearchCompany:g,standardContactProfile:f,standardContactPeopleYouMayKnow:f,standardContactPeopleAlsoViewed:f,standardContactRecommendationsReceived:f,standardContactRecommendationsGiven:f,standardContactSearch:f,standardBlendedSearchContact:f,recruiterContactProfile:N,recruiterContactRecommendations:N,recruiterContactSimilarProfiles:N,recruiterContactSearch:N,recruiterSavedContactSearch:N};function C(e,t){if(!e||!t)return null;const n=S[t],r=e.match(n)?.groups?.publicIdentifier;return r?decodeURI(r):null}const P=function(e){return Array.isArray(e)?e:null==e?[]:[e]},A=e=>{if(!e)return{};const t=e;return Object.entries(t).forEach((([e,n])=>{n&&"object"==typeof n&&A(n),(n&&"object"==typeof n&&!Object.keys(n).length||null==n)&&(Array.isArray(t)?t.splice(e,1):delete t[e])})),t},E=e=>e.replace(/(\r\n|\n|\r)/gm," ").replace(/^Greater /,"").replace(/ Area$/,"").replace(/ Metropolitan$/,""),O=e=>{let t=e&&"string"==typeof e&&e.trim();return t?(/^https?:\/([^/].*|\/\/+.+)$/i.test(t)&&(t=t.replace(/:\/+/,"://")),t):e},I=e=>{const t=e&&(e.indexOf(" at ")>-1&&e.split(" at ")||e.indexOf(" @ ")>-1&&e.split(" @ ")||e.indexOf(" - ")>-1&&e.split(" - "));let n,r;return t?(n=t?.length&&1!==t.length?t.pop():void 0,r=t?.length?t.join(" "):void 0):r=e,{companyName:n,title:r}};function j(e,t){try{let n;return t?.length?n=t:e&&"string"==typeof e&&e.length?n=e:e?.emailAddress?n=e.emailAddress:Array.isArray(e)&&e.length&&(n=e[0].emailAddress),n}catch(e){return null}}const k=e=>{try{let t=e;if(t&&"object"==typeof t){const{artifacts:e,rootUrl:n}=t;if(n?.length&&n.includes("http")&&e&&Array.isArray(e)?t=n+e[e.length-1].fileIdentifyingUrlPathSegment:n&&n.length||!e?.length||!e[e.length-1].fileIdentifyingUrlPathSegment||!e[e.length-1].fileIdentifyingUrlPathSegment.includes("http")||(t=e[e.length-1].fileIdentifyingUrlPathSegment),!t||!t.length)return}return t=t&&O(t),t}catch(e){return}},R=(e=[])=>{try{let t=e;return t&&"object"==typeof t&&!Array.isArray(t)&&(t=Object.values(t)),t=t.reduce(((e,t)=>{const n=("string"==typeof t&&t||t.name||"").trim();return n&&e.push(n),e}),[]),t.length?t:null}catch(e){return null}};function D(e){try{return e.filter((e=>e)).map((e=>{const{schoolName:t,degree:n,degreeName:r,activities:a=[],fieldOfStudy:i,dateRange:{start:{year:o}={},end:{year:s}={}}={},startedOn:{year:l}={},endedOn:{year:c}={},endDateOn:{year:u}={},startDateOn:{year:m}={},startDateYear:p,endDateYear:d}=e,y=o||l||m||p,f=s||c||u||d;let{fieldsOfStudy:h}=e;Array.isArray(h)&&h.length&&(h=h.join());const g="string"==typeof h?h:i;return{companyName:t,degreeName:r||n,activities:a&&P(a),fieldOfStudy:g,...y&&{startDate:{year:y}},...f&&{endDate:{year:f}}}}))}catch(e){return null}}function L(e=[]){try{return e.reduce(((e,t)=>{const n=e;return t.name&&n.push(t.name),n}),[])}catch(e){return null}}function U(e=[]){try{return e.reduce(((e,t)=>{const n=e;return t.name&&n.push(t.name),n}),[])}catch(e){return null}}function M(e){return e.filter((e=>!e.endDate&&e.startDate||e.current))}const T=e=>null==e||(Array.isArray(e)?0===e.length:(e=>{const t=typeof e;return!!e&&("function"===t||"object"===t)})(e)&&0===Object.keys(e).length),_=e=>Array.isArray(e)&&!T(e),x=e=>Boolean("string"==typeof e&&e.length),z=e=>{const{liMemberId:t,publicIdentifier:n,salesNavIdentifier:r,recruiterIdentifier:a,flagshipProfileUrl:i,firstName:o,lastName:s,fullName:l,birthDateOn:c,profilePicture:u,summary:m,emails:p,phoneNumbers:d,primaryEmail:y,location:f,social:h,awards:g,certifications:b,courses:N,educations:w,industries:S,languages:C,organizations:T,patents:z,projects:$,publications:Y,skills:G,volunteeringExperiences:H,occupation:W,positions:B}=e;let F=l;!F?.length&&o&&s&&(F=`${o} ${s}`);const K=i||n&&`https://www.linkedin.com/in/${n}`,V=r&&`https://www.linkedin.com/sales/lead/${r}`,X=a&&`https://www.linkedin.com/talent/search/profile/${a}`;let q,J,Q=_(B)?B.map((e=>"object"==typeof e&&Object.keys(e).length&&(e=>{const{company:t,companyName:n,companyUrn:r,companyUrnResolutionResult:a,companyResolutionResult:i,current:o,dateRange:s,description:l,"*employmentType":c,endDateOn:u,endedOn:m,location:p,locationName:d,startDateOn:y,startedOn:f,title:h}=e,{industry:g,location:b}=a||{},{industries:N}=i||{},{start:w,startDate:S,end:C,endDate:A}=s||{},O=t&&"string"==typeof t&&t||r,I=w||S||y||f,j=A||C||u||m;let k,R=p?.displayName??p;return!R&&b&&(R=b),!R&&d&&(R=d),N?k=P(N):g&&(k=P(g)),{companyName:n?.trim(),current:o,description:l,employmentType:c,endDate:j&&"object"==typeof j&&Object.keys(j).length?{...j.month&&{month:j.month},...j.year&&{year:j.year}}:null,fullString:R&&E(R),industries:k&&Array.isArray(k)&&k.length?k:null,linkedInCompanyId:O&&(D=O,D.match(v)?.groups?.memberId),startDate:I&&"object"==typeof I&&Object.keys(I).length?{...I.month&&{month:I.month},...I.year&&{year:I.year}}:null,titleName:h};var D})(e))):null;_(Q)&&(Q=Q.filter((e=>!!e?.companyName&&!!e?.titleName)),Q=((e,t)=>{const n=e.reduce(((e,n)=>{const r=e;return r[t.map((e=>n[e])).join("-")]=n,r}),{});return Object.values(n)})(Q,["companyName","titleName","employmentType"])),W&&({companyName:q,title:J}=I(W)),!q&&B?.length&&(q=B[0].companyName);let Z={liMemberId:t,liPublicIdentifier:n&&decodeURI(n),liSalesNavId:r,liRecruiterId:a,liProfileUrl:x(K)?O(K):null,liSalesNavUrl:x(V)?O(V):null,liRecruiterUrl:x(X)?O(X):null,firstName:o,lastName:s,contactName:F,birthday:c,liImageUrl:u&&k(u),contactEmail:j(p,y),phoneNumbers:d,locationFullString:x(f)?E(f):null,social:h,...m&&{meta:{summary:m}},awards:_(g)?g:null,certifications:_(b)?b:null,courses:_(N)?N:null,educations:_(w)?D(w):null,industries:R(S),languages:_(C)?U(C):null,organizations:_(T)?T:null,patents:_(z)?z.filter((e=>!!e)):null,projects:_($)?$.filter((e=>!!e)):null,publications:_(Y)?Y.filter((e=>!!e)):null,skills:_(G)?L(G):null,volunteeringExperiences:_(H)?H:null,companyName:q,title:J,occupation:W,positions:Q,itemType:"contact"};return Z=function(e){const t=e;let n,r;if(_(t.positions)){const e=M(t.positions);_(e)&&(t.companyName=e[0].companyName,t.title=e[0].titleName)}if(t.companyName&&t.title||!t.occupation||(({companyName:n,title:r}=I(t.occupation)),n&&(t.companyName=n),r&&(t.title=r)),_(t.positions)){const e=M(t.positions);!_(e)||t.companyName===e[0].companyName&&t.title===e[0].titleName||(t.companyName=e[0].companyName,t.title=e[0].titleName)}return t}(Z),Z=A(Z),Z},$=["firstName","contactName"],Y=["liRecruiterId","liSalesNavId","liPublicIdentifier"];o((e=>{const{accomplishments:t,currentPositions:n,educations:r,entityUrn:a,firstName:i,groupedWorkExperience:o,headline:s,industryName:l,lastName:c,location:u,publicProfileUrl:m,skills:p,summary:d,vectorProfilePicture:y}=e;let f,h,g,b,N,v,S=n;_(o)&&(S=(e=>e.reduce(((e,t)=>{let n=e;return n=[...n||[],...t.positions||[]],n}),[]))(o)),T(t)||({certifications:f,courses:h,languages:g,patents:b,projects:N,publications:v}=t);const P={publicIdentifier:m&&C(m,"standardContactProfile"),recruiterIdentifier:a&&(A=a,A.match(w)?.groups?.recruiterId),flagshipProfileUrl:m,firstName:i,lastName:c,profilePicture:y,location:u?.displayName,educations:r,industries:l?[l]:null,skills:p,summary:d,occupation:s,positions:S,certifications:f,courses:h,languages:g,patents:b,projects:N,publications:v};var A;const E=z(P);return E.pageSectionSourced="recruiterContactProfile",E.itemType="contact",{parsedItems:(O=E,$.some((e=>Object.prototype.hasOwnProperty.call(O,e)))&&Y.some((e=>Object.prototype.hasOwnProperty.call(O,e)))&&$.every((e=>!O[e]?.toLowerCase().includes("linkedin member")))?[E]:void 0)};var O}),self)})();