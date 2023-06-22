var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

/*! For license information please see webcomponents-loader.js.LICENSE.txt */
!function(){"use strict";var e,n=!1,t=[],o=!1;function d(){window.WebComponents.ready=!0,document.dispatchEvent(new CustomEvent("WebComponentsReady",{bubbles:!0}))}function i(){window.customElements&&customElements.polyfillWrapFlushCallback&&customElements.polyfillWrapFlushCallback((function(n){e=n,o&&e()}))}function r(){window.HTMLTemplateElement&&HTMLTemplateElement.bootstrap&&HTMLTemplateElement.bootstrap(window.document),n=!0,c().then(d)}function c(){o=!1;var n=t.map((function(e){return e instanceof Function?e():e}));return t=[],Promise.all(n).then((function(){o=!0,e&&e()})).catch((function(e){console.error(e)}))}window.WebComponents=window.WebComponents||{},window.WebComponents.ready=window.WebComponents.ready||!1,window.WebComponents.waitFor=window.WebComponents.waitFor||function(e){e&&(t.push(e),n&&c())},window.WebComponents._batchCustomElements=i;var a="webcomponents-loader.js",l=[];(!("attachShadow"in Element.prototype)||!("getRootNode"in Element.prototype)||window.ShadyDOM&&window.ShadyDOM.force)&&l.push("sd"),window.customElements&&!window.customElements.forcePolyfill||l.push("ce");var s=function(){var e=document.createElement("template");if(!("content"in e))return!0;if(!(e.content.cloneNode()instanceof DocumentFragment))return!0;var n=document.createElement("template");n.content.appendChild(document.createElement("div")),e.content.appendChild(n);var t=e.cloneNode(!0);return 0===t.content.childNodes.length||0===t.content.firstChild.content.childNodes.length}();if(window.Promise&&Array.from&&window.URL&&window.Symbol&&!s||(l=["sd-ce-pf"]),l.length){var m,w="bundles/webcomponents-"+l.join("-")+".js";if(window.WebComponents.root)m=window.WebComponents.root+w;else{var u=document.querySelector('script[src*="'+a+'"]');m=u.src.replace(a,w)}var p=document.createElement("script");p.src=m,"loading"===document.readyState?(p.setAttribute("onload","window.WebComponents._batchCustomElements()"),document.write(p.outerHTML),document.addEventListener("DOMContentLoaded",r)):(p.addEventListener("load",(function(){i(),r()})),p.addEventListener("error",(function(){throw new Error("Could not load polyfill bundle"+m)})),document.head.appendChild(p))}else"complete"===document.readyState?(n=!0,d()):(window.addEventListener("load",r),window.addEventListener("DOMContentLoaded",(function(){window.removeEventListener("load",r),r()})))}();

}
/*
     FILE ARCHIVED ON 05:55:06 Mar 29, 2023 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 15:03:18 Jun 22, 2023.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 131.13
  exclusion.robots: 0.08
  exclusion.robots.policy: 0.066
  cdx.remote: 0.059
  esindex: 0.01
  LoadShardBlock: 97.589 (3)
  PetaboxLoader3.datanode: 172.922 (6)
  load_resource: 563.128 (2)
  PetaboxLoader3.resolve: 175.514 (2)
  loaddict: 255.267
*/