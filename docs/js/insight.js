!function(n,t){function e(e,r,i,a,s){return n("<div>").addClass("ins-selectable").addClass("ins-search-item").append(n("<header>").append(n("<i>").addClass("fa").addClass("fa-"+e)).append(null!=r&&""!=r?r:t.TRANSLATION.UNTITLED).append(i?n("<span>").addClass("ins-slug").text(i):null)).append(a?n("<p>").addClass("ins-search-preview").text(function(n){var t=document.createElement("textarea");return t.innerHTML=n,t.value}(a)):null).attr("data-url",s)}function r(n,t){var e={};n.pages.concat(n.posts).forEach(function(n){n[t]&&n[t].forEach(function(n){e[n.name]=n})});var r=[];for(var t in e)r.push(e[t]);return r}function i(n){return n.split(" ").filter(function(n){return!!n}).map(function(n){return n.toUpperCase()})}function a(n,t,e){var r=i(n);return r.filter(function(n){return e.filter(function(e){return!!t.hasOwnProperty(e)&&(t[e].toUpperCase().indexOf(n)>-1||void 0)}).length>0}).length===r.length}function s(n,t,e,r){var a=0;return i(n).forEach(function(n){var i=new RegExp(n,"img");e.forEach(function(n,e){if(t.hasOwnProperty(n)){var s=t[n].match(i);a+=s?s.length*r[e]:0}})}),a}function o(t){var e=n.makeArray(p.find(".ins-selectable")),r=-1;e.forEach(function(t,e){n(t).hasClass("active")&&(r=e)});var i=(e.length+r+t)%e.length;n(e[r]).removeClass("active"),n(e[i]).addClass("active"),function(n){if(0!==n.length){var t=f[0].clientHeight,e=n.position().top-f.scrollTop(),r=n[0].clientHeight+n.position().top;r>t+f.scrollTop()&&f.scrollTop(r-f[0].clientHeight),e<0&&f.scrollTop(n.position().top)}}(n(e[i]))}function c(n){n&&n.length&&(location.href=n.attr("data-url"))}var u=n(".ins-search"),l=u.find(".ins-search-input"),f=u.find(".ins-section-wrapper"),p=u.find(".ins-section-container");u.parent().remove(".ins-search"),n("body").append(u),n.getJSON(t.CONTENT_URL,function(i){"#ins-search"===location.hash.trim()&&u.addClass("show"),l.on("input",function(){var o=n(this).val();!function(r){p.empty();for(var i in r)p.append(function(r,i){var a,s;if(0===i.length)return null;switch(a=t.TRANSLATION[r],r){case"POSTS":case"PAGES":s=i.map(function(n){return e("file",n.title,null,n.text.slice(0,150),t.ROOT_URL+n.path)});break;case"CATEGORIES":case"TAGS":s=i.map(function(n){return e("CATEGORIES"===r?"folder":"tag",n.name,n.slug,null,n.permalink)});break;default:return null}return function(t){return n("<section>").addClass("ins-section").append(n("<header>").addClass("ins-section-header").text(t))}(a).append(s)}(i.toUpperCase(),r[i]))}(function(n,t){var e=function(n){return{POST:function(t){return s(n,t,["title","text"],[3,1])},PAGE:function(t){return s(n,t,["title","text"],[3,1])},CATEGORY:function(t){return s(n,t,["name","slug"],[1,1])},TAG:function(t){return s(n,t,["name","slug"],[1,1])}}}(t),i=function(n){return{POST:function(t){return a(n,t,["title","text"])},PAGE:function(t){return a(n,t,["title","text"])},CATEGORY:function(t){return a(n,t,["name","slug"])},TAG:function(t){return a(n,t,["name","slug"])}}}(t),o=n.posts,c=n.pages,u=r(n,"tags"),l=r(n,"categories");return{posts:o.filter(i.POST).sort(function(n,t){return e.POST(t)-e.POST(n)}).slice(0,5),pages:c.filter(i.PAGE).sort(function(n,t){return e.PAGE(t)-e.PAGE(n)}).slice(0,5),categories:l.filter(i.CATEGORY).sort(function(n,t){return e.CATEGORY(t)-e.CATEGORY(n)}).slice(0,5),tags:u.filter(i.TAG).sort(function(n,t){return e.TAG(t)-e.TAG(n)}).slice(0,5)}}(i,o))}),l.trigger("input")}),n(document).on("click focus",".search-form-input",function(){u.addClass("show"),u.find(".ins-search-input").focus()}).on("click",".ins-search-item",function(){c(n(this))}).on("click",".ins-close",function(){u.removeClass("show")}).on("keydown",function(n){if(u.hasClass("show"))switch(n.keyCode){case 27:u.removeClass("show");break;case 38:o(-1);break;case 40:o(1);break;case 13:c(p.find(".ins-selectable.active").eq(0))}})}(jQuery,window.INSIGHT_CONFIG);