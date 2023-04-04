(()=>{"use strict";const e=Symbol("Comlink.proxy"),t=Symbol("Comlink.endpoint"),n=Symbol("Comlink.releaseProxy"),r=Symbol("Comlink.thrown"),a=e=>"object"==typeof e&&null!==e||"function"==typeof e,i=new Map([["proxy",{canHandle:t=>a(t)&&t[e],serialize(e){const{port1:t,port2:n}=new MessageChannel;return o(e,t),[n,[n]]},deserialize:e=>(e.start(),c(e,[],undefined))}],["throw",{canHandle:e=>a(e)&&r in e,serialize({value:e}){let t;return t=e instanceof Error?{isError:!0,value:{message:e.message,name:e.name,stack:e.stack}}:{isError:!1,value:e},[t,[]]},deserialize(e){if(e.isError)throw Object.assign(new Error(e.value.message),e.value);throw e.value}}]]);function o(t,n=self){n.addEventListener("message",(function a(i){if(!i||!i.data)return;const{id:s,type:c,path:u}=Object.assign({path:[]},i.data),y=(i.data.argumentList||[]).map(d);let f;try{const n=u.slice(0,-1).reduce(((e,t)=>e[t]),t),r=u.reduce(((e,t)=>e[t]),t);switch(c){case"GET":f=r;break;case"SET":n[u.slice(-1)[0]]=d(i.data.value),f=!0;break;case"APPLY":f=r.apply(n,y);break;case"CONSTRUCT":f=function(t){return Object.assign(t,{[e]:!0})}(new r(...y));break;case"ENDPOINT":{const{port1:e,port2:n}=new MessageChannel;o(t,n),f=function(e,t){return m.set(e,t),e}(e,[e])}break;case"RELEASE":f=void 0;break;default:return}}catch(e){f={value:e,[r]:0}}Promise.resolve(f).catch((e=>({value:e,[r]:0}))).then((e=>{const[t,r]=p(e);n.postMessage(Object.assign(Object.assign({},t),{id:s}),r),"RELEASE"===c&&(n.removeEventListener("message",a),l(n))}))})),n.start&&n.start()}function l(e){(function(e){return"MessagePort"===e.constructor.name})(e)&&e.close()}function s(e){if(e)throw new Error("Proxy has been released and is not useable")}function c(e,r=[],a=function(){}){let i=!1;const o=new Proxy(a,{get(t,a){if(s(i),a===n)return()=>y(e,{type:"RELEASE",path:r.map((e=>e.toString()))}).then((()=>{l(e),i=!0}));if("then"===a){if(0===r.length)return{then:()=>o};const t=y(e,{type:"GET",path:r.map((e=>e.toString()))}).then(d);return t.then.bind(t)}return c(e,[...r,a])},set(t,n,a){s(i);const[o,l]=p(a);return y(e,{type:"SET",path:[...r,n].map((e=>e.toString())),value:o},l).then(d)},apply(n,a,o){s(i);const l=r[r.length-1];if(l===t)return y(e,{type:"ENDPOINT"}).then(d);if("bind"===l)return c(e,r.slice(0,-1));const[m,p]=u(o);return y(e,{type:"APPLY",path:r.map((e=>e.toString())),argumentList:m},p).then(d)},construct(t,n){s(i);const[a,o]=u(n);return y(e,{type:"CONSTRUCT",path:r.map((e=>e.toString())),argumentList:a},o).then(d)}});return o}function u(e){const t=e.map(p);return[t.map((e=>e[0])),(n=t.map((e=>e[1])),Array.prototype.concat.apply([],n))];var n}const m=new WeakMap;function p(e){for(const[t,n]of i)if(n.canHandle(e)){const[r,a]=n.serialize(e);return[{type:"HANDLER",name:t,value:r},a]}return[{type:"RAW",value:e},m.get(e)||[]]}function d(e){switch(e.type){case"HANDLER":return i.get(e.name).deserialize(e.value);case"RAW":return e.value}}function y(e,t,n){return new Promise((r=>{const a=new Array(4).fill(0).map((()=>Math.floor(Math.random()*Number.MAX_SAFE_INTEGER).toString(16))).join("-");e.addEventListener("message",(function t(n){n.data&&n.data.id&&n.data.id===a&&(e.removeEventListener("message",t),r(n.data))})),e.start&&e.start(),e.postMessage(Object.assign({id:a},t),n)}))}const f=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/in\/(?<publicIdentifier>[\w_À&&-ÿ%-][^/?]+)\/?/i,h=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/sales\/(people|lead)\/(?<publicIdentifier>[\w_À&-ÿ%-][^,?/]+)?/i,g=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/company\/(?<publicIdentifier>[\w_À&-ÿ%-][^/?]+)\/?/i,b=/(?:https?:)?(?:\/\/)?(?:[\w]+\.)?(?:linkedin\.com)?\/sales\/company\/(?<publicIdentifier>[\d][^/?]+)\/?/i,N=/(?:\/profile)\/(?<publicIdentifier>[\w_À&-ÿ%-][^?/]+)\/?/i,P=/(?:\w+:(\(?))+(?::[\w_]+(?:member|company):)?(?<memberId>[\d]+)?/i,S=/(?:\w+:)+(ts_profile|ts_linkedin_member_profile):\(?(?<recruiterId>[\w_À&-ÿ%-][^,?]+)?/i,w={premiumCompanySearch:b,premiumCompanyProfile:b,premiumSavedAccounts:b,premiumCompanyRecommendedLeads:b,premiumCompanyAccountMapEntries:b,premiumCompanyPeopleAlsoViewed:b,premiumSavedLeads:h,premiumContactSavedSearch:h,premiumContactSearch:h,premiumContactProfile:h,premiumContactRecommendations:h,premiumContactRecommendedLeads:h,premiumContactSimilarLeads:h,standardCompanySearch:g,standardCompanyProfile:g,standardCompanyPeopleYouMayKnow:f,standardBlendedSearchCompany:g,standardContactProfile:f,standardContactPeopleYouMayKnow:f,standardContactPeopleAlsoViewed:f,standardContactRecommendationsReceived:f,standardContactRecommendationsGiven:f,standardContactSearch:f,standardBlendedSearchContact:f,recruiterContactProfile:N,recruiterContactRecommendations:N,recruiterContactSimilarProfiles:N,recruiterContactSearch:N,recruiterSavedContactSearch:N};function v(e,t){if(!e||!t)return null;const n=w[t],r=e.match(n)?.groups?.publicIdentifier;return r?decodeURI(r):null}function C(e){return e.match(S)?.groups?.recruiterId}const I=function(e){return Array.isArray(e)?e:null==e?[]:[e]},O=e=>{if(!e)return{};const t=e;return Object.entries(t).forEach((([e,n])=>{n&&"object"==typeof n&&O(n),(n&&"object"==typeof n&&!Object.keys(n).length||null==n)&&(Array.isArray(t)?t.splice(e,1):delete t[e])})),t},R=e=>e.replace(/(\r\n|\n|\r)/gm," ").replace(/^Greater /,"").replace(/ Area$/,"").replace(/ Metropolitan$/,""),A=e=>{let t=e&&"string"==typeof e&&e.trim();return t?(/^https?:\/([^/].*|\/\/+.+)$/i.test(t)&&(t=t.replace(/:\/+/,"://")),t):e},j=e=>{const t=e&&(e.indexOf(" at ")>-1&&e.split(" at ")||e.indexOf(" @ ")>-1&&e.split(" @ ")||e.indexOf(" - ")>-1&&e.split(" - "));let n,r;return t?(n=t?.length&&1!==t.length?t.pop():void 0,r=t?.length?t.join(" "):void 0):r=e,{companyName:n,title:r}};function E(e,t){try{let n;return t?.length?n=t:e&&"string"==typeof e&&e.length?n=e:e?.emailAddress?n=e.emailAddress:Array.isArray(e)&&e.length&&(n=e[0].emailAddress),n}catch(e){return null}}const k=e=>{try{let t=e;if(t&&"object"==typeof t){const{artifacts:e,rootUrl:n}=t;if(n?.length&&n.includes("http")&&e&&Array.isArray(e)?t=n+e[e.length-1].fileIdentifyingUrlPathSegment:n&&n.length||!e?.length||!e[e.length-1].fileIdentifyingUrlPathSegment||!e[e.length-1].fileIdentifyingUrlPathSegment.includes("http")||(t=e[e.length-1].fileIdentifyingUrlPathSegment),!t||!t.length)return}return t=t&&A(t),t}catch(e){return}},U=(e=[])=>{try{let t=e;return t&&"object"==typeof t&&!Array.isArray(t)&&(t=Object.values(t)),t=t.reduce(((e,t)=>{const n=("string"==typeof t&&t||t.name||"").trim();return n&&e.push(n),e}),[]),t.length?t:null}catch(e){return null}};function L(e){try{return e.filter((e=>e)).map((e=>{const{schoolName:t,degree:n,degreeName:r,activities:a=[],fieldOfStudy:i,dateRange:{start:{year:o}={},end:{year:l}={}}={},startedOn:{year:s}={},endedOn:{year:c}={},endDateOn:{year:u}={},startDateOn:{year:m}={},startDateYear:p,endDateYear:d}=e,y=o||s||m||p,f=l||c||u||d;let{fieldsOfStudy:h}=e;Array.isArray(h)&&h.length&&(h=h.join());const g="string"==typeof h?h:i;return{companyName:t,degreeName:r||n,activities:a&&I(a),fieldOfStudy:g,...y&&{startDate:{year:y}},...f&&{endDate:{year:f}}}}))}catch(e){return null}}function D(e=[]){try{return e.reduce(((e,t)=>{const n=e;return t.name&&n.push(t.name),n}),[])}catch(e){return null}}function T(e=[]){try{return e.reduce(((e,t)=>{const n=e;return t.name&&n.push(t.name),n}),[])}catch(e){return null}}function M(e){return e.filter((e=>!e.endDate&&e.startDate||e.current))}const _=e=>null==e||(Array.isArray(e)?0===e.length:(e=>{const t=typeof e;return!!e&&("function"===t||"object"===t)})(e)&&0===Object.keys(e).length),x=e=>Array.isArray(e)&&!_(e),z=e=>Boolean("string"==typeof e&&e.length),$=e=>{const{liMemberId:t,publicIdentifier:n,salesNavIdentifier:r,recruiterIdentifier:a,flagshipProfileUrl:i,firstName:o,lastName:l,fullName:s,birthDateOn:c,profilePicture:u,summary:m,emails:p,phoneNumbers:d,primaryEmail:y,location:f,social:h,awards:g,certifications:b,courses:N,educations:S,industries:w,languages:v,organizations:C,patents:_,projects:$,publications:Y,skills:G,volunteeringExperiences:H,occupation:W,positions:B}=e;let F=s;!F?.length&&o&&l&&(F=`${o} ${l}`);const K=i||n&&`https://www.linkedin.com/in/${n}`,V=r&&`https://www.linkedin.com/sales/lead/${r}`,X=a&&`https://www.linkedin.com/talent/search/profile/${a}`;let q,J,Q=x(B)?B.map((e=>"object"==typeof e&&Object.keys(e).length&&(e=>{const{company:t,companyName:n,companyUrn:r,companyUrnResolutionResult:a,companyResolutionResult:i,current:o,dateRange:l,description:s,"*employmentType":c,endDateOn:u,endedOn:m,location:p,locationName:d,startDateOn:y,startedOn:f,title:h}=e,{industry:g,location:b}=a||{},{industries:N}=i||{},{start:S,startDate:w,end:v,endDate:C}=l||{},O=t&&"string"==typeof t&&t||r,A=S||w||y||f,j=C||v||u||m;let E,k=p?.displayName??p;return!k&&b&&(k=b),!k&&d&&(k=d),N?E=I(N):g&&(E=I(g)),{companyName:n?.trim(),current:o,description:s,employmentType:c,endDate:j&&"object"==typeof j&&Object.keys(j).length?{...j.month&&{month:j.month},...j.year&&{year:j.year}}:null,fullString:k&&R(k),industries:E&&Array.isArray(E)&&E.length?E:null,linkedInCompanyId:O&&(U=O,U.match(P)?.groups?.memberId),startDate:A&&"object"==typeof A&&Object.keys(A).length?{...A.month&&{month:A.month},...A.year&&{year:A.year}}:null,titleName:h};var U})(e))):null;x(Q)&&(Q=Q.filter((e=>!!e?.companyName&&!!e?.titleName)),Q=((e,t)=>{const n=e.reduce(((e,n)=>{const r=e;return r[t.map((e=>n[e])).join("-")]=n,r}),{});return Object.values(n)})(Q,["companyName","titleName","employmentType"])),W&&({companyName:q,title:J}=j(W)),!q&&B?.length&&(q=B[0].companyName);let Z={liMemberId:t,liPublicIdentifier:n&&decodeURI(n),liSalesNavId:r,liRecruiterId:a,liProfileUrl:z(K)?A(K):null,liSalesNavUrl:z(V)?A(V):null,liRecruiterUrl:z(X)?A(X):null,firstName:o,lastName:l,contactName:F,birthday:c,liImageUrl:u&&k(u),contactEmail:E(p,y),phoneNumbers:d,locationFullString:z(f)?R(f):null,social:h,...m&&{meta:{summary:m}},awards:x(g)?g:null,certifications:x(b)?b:null,courses:x(N)?N:null,educations:x(S)?L(S):null,industries:U(w),languages:x(v)?T(v):null,organizations:x(C)?C:null,patents:x(_)?_.filter((e=>!!e)):null,projects:x($)?$.filter((e=>!!e)):null,publications:x(Y)?Y.filter((e=>!!e)):null,skills:x(G)?D(G):null,volunteeringExperiences:x(H)?H:null,companyName:q,title:J,occupation:W,positions:Q,itemType:"contact"};return Z=function(e){const t=e;let n,r;if(x(t.positions)){const e=M(t.positions);x(e)&&(t.companyName=e[0].companyName,t.title=e[0].titleName)}if(t.companyName&&t.title||!t.occupation||(({companyName:n,title:r}=j(t.occupation)),n&&(t.companyName=n),r&&(t.title=r)),x(t.positions)){const e=M(t.positions);!x(e)||t.companyName===e[0].companyName&&t.title===e[0].titleName||(t.companyName=e[0].companyName,t.title=e[0].titleName)}return t}(Z),Z=O(Z),Z},Y=["firstName","contactName"],G=["liRecruiterId","liSalesNavId","liPublicIdentifier"],H=e=>Y.some((t=>Object.prototype.hasOwnProperty.call(e,t)))&&G.some((t=>Object.prototype.hasOwnProperty.call(e,t)))&&Y.every((t=>!e[t]?.toLowerCase().includes("linkedin member"))),W="linkedInMemberProfileUrnResolutionResult";o((async e=>{if(t=e,Object.prototype.hasOwnProperty.call(t,"similarLinkedInProfilesResolutionResults")){const t=Object.values(e.similarLinkedInProfilesResolutionResults).map((e=>(e=>{const{entityUrn:t,firstName:n,headline:r,lastName:a,location:i,vectorProfilePicture:o}=e,l={recruiterIdentifier:t&&C(t),firstName:n,lastName:a,location:i?.displayName,occupation:r,profilePicture:o},s=$(l);return s.pageSectionSourced="recruiterContactSimilarProfiles",s.itemType="contact",H(s)?s:null})(e)));let n=[];return t?.length&&(n=await Promise.all(t)),{parsedItems:n}}var t;if(function(e){return e.elements?.some?.((e=>"object"==typeof e&&Object.prototype.hasOwnProperty.call(e,W)))}(e)){let t=[];const n=e.elements[0][W],r=(e=>{const{accomplishments:t,currentPositions:n,educations:r,entityUrn:a,firstName:i,groupedWorkExperience:o,headline:l,industryName:s,lastName:c,location:u,publicProfileUrl:m,skills:p,summary:d,vectorProfilePicture:y}=e;let f,h,g,b,N,P,S=n;x(o)&&(S=(e=>e.reduce(((e,t)=>{let n=e;return n=[...n||[],...t.positions||[]],n}),[]))(o)),_(t)||({certifications:f,courses:h,languages:g,patents:b,projects:N,publications:P}=t);const w={publicIdentifier:m&&v(m,"standardContactProfile"),recruiterIdentifier:a&&C(a),flagshipProfileUrl:m,firstName:i,lastName:c,profilePicture:y,location:u?.displayName,educations:r,industries:s?[s]:null,skills:p,summary:d,occupation:l,positions:S,certifications:f,courses:h,languages:g,patents:b,projects:N,publications:P},I=$(w);return I.pageSectionSourced="recruiterContactProfile",I.itemType="contact",H(I)?I:null})(n);if(t.push(r),n?.recommendations?.length){const e=n.recommendations.filter((e=>e?.recommenderResolutionResult&&!_(e.recommenderResolutionResult))).map((e=>(e=>{const{entityUrn:t,firstName:n,headline:r,lastName:a,publicProfileUrl:i,vectorProfilePicture:o}=e.recommenderResolutionResult||{},l={publicIdentifier:i&&v(i,"recruiterContactRecommendations"),recruiterIdentifier:t&&C(t),flagshipProfileUrl:i,firstName:n,lastName:a,profilePicture:o,occupation:r},s=$(l);return s.pageSectionSourced="recruiterContactRecommendations",s.itemType="contact",H(s)?s:null})(e)));let r=[];e?.length&&(r=await Promise.all(e)),t=[...t,...r?.length?r:[]]}return{parsedItems:t}}}),self)})();