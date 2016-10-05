angular.module("nodercms-console",["ngAnimate","ipCookie","ui.router","ngFileUpload","angular-img-cropper","controllers","services","directives","filters","views"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(t,e,n,a){"use strict";a.defaults.headers.common={"content-type":"application/json;charset=utf-8"},a.interceptors.push("authorityInterceptor"),n.html5Mode(!0),e.otherwise(function(t){t.get("$state").go("main")}),t.state("signIn",{url:"^/admin/sign-in",controller:"signIn",templateProvider:["$templateCache",function(t){return t.get("sign-in.view.html")}]}).state("main",{url:"^/admin",controller:"main",templateProvider:["$templateCache",function(t){return t.get("main.view.html")}]}).state("main.sites",{url:"^/admin/sites",controller:"sites",templateProvider:["$templateCache",function(t){return t.get("sites.view.html")}]})}]).run(["checkSignIn","$templateCache",function(t){t()}]),angular.module("controllers",[]),angular.module("services",[]),angular.module("directives",[]),angular.module("filters",[]),angular.module("views",[]),angular.module("controllers").controller("main",["$scope","$http",function(t,e){"use strict";t.website={hostname:window.location.hostname,origin:window.location.origin},t.systemInfo={},t.nodeInfo={},t.databaseInfo={},t.sitesTotal="",e.get("/api/dashboard").then(function(e){var n=e.data;t.systemInfo=n.systemInfo,t.nodeInfo=n.nodeInfo,t.databaseInfo=n.databaseInfo,t.sitesTotal=n.sitesTotal},function(){t.$emit("notification",{type:"danger",message:"读取控制面板数据失败"})})}]),angular.module("controllers").controller("signIn",["$scope","$timeout","$state","$http",function(t,e,n,a){"use strict";function i(){t.wrongEmailOrPassword=!1}function s(){t.wrongCaptcha=!1}t.transmitting=!1,t.password="",t.captcha="",t.captchaData="",t.autoSignIn=!1,t.wrongEmailOrPassword=!1,t.wrongCaptcha=!1,t.$watch("password",i),t.$watch("captcha",s),t.getCaptcha=function(){a.get("/api/account/captcha").then(function(e){t.captchaData=e.data})},t.getCaptcha(),t.signIn=function(){t.transmitting=!0,a.put("/api/account/sign-in",{password:t.password,captcha:t.captcha.toLowerCase(),autoSignIn:t.autoSignIn}).then(function(){n.go("main")},function(n){t.getCaptcha();var a=n.data;switch(_.get(a,"error.code")){case"WRONG_EMAIL_OR_PASSWORD":t.wrongEmailOrPassword=!0;break;case"WRONG_CAPTCHA":t.wrongCaptcha=!0}t.animateShake=!0,e(function(){t.animateShake=!1,t.transmitting=!1},600)})}}]),angular.module("controllers").controller("sites",["$scope","$state","$stateParams","$http",function(t,e,n,a){"use strict";t.transmitting=!1,t.sites=[],t.currentPage=1,t.totalPages=0,a.get("/api/sites",{params:{currentPage:t.currentPage,pageSize:20}}).then(function(e){var n=e.data;t.sites=n.sites,t.totalPages=n.pages})}]),angular.module("services").factory("authorityInterceptor",["$q","$injector",function(t,e){"use strict";return{responseError:function(n){return 401===n.status&&n.data&&n.data.error&&e.get("$state").go("signIn"),t.reject(n)}}}]),angular.module("services").factory("checkSignIn",["$rootScope","$state","ipCookie",function(t,e,n){"use strict";return function(){t.$on("$stateChangeStart",function(t,a,i,s,o){n("nodercmsConsoleSid")||"signIn"===a.name||(t.preventDefault(),e.go("signIn"))})}}]),angular.module("directives").directive("ndNavigation",["$templateCache","$rootScope","$state","$timeout","$http","$filter",function(t,e,n,a,i,s){return{restrict:"E",template:t.get("navigation.view.html"),link:function(t,s){function o(){a(function(){$(".sub-list").each(function(){var t=$(this);t.children(".item").hasClass("active")?t.siblings(".item").addClass("active select"):t.slideUp("fast",function(){t.siblings(".sub-list-heading").removeClass("select")}).siblings(".sub-list-heading").removeClass("active")})})}t.notFoundPages=!1,t.notFoundContents=!1,t.auth={},t.categories=[],t.user={},t.signOut=function(){i.put("/api/account/sign-out").then(function(){n.go("signIn")},function(){t.$emit("notification",{type:"danger",message:"退出登录失败"})})},e.$on("$stateChangeSuccess",function(){a(function(){o()})}),e.$on("mainCategoriesUpdate",function(){loadCategories()}),e.$on("mainUserUpdate",function(){account.reset(),loadUser()}),$(".navigation").on("click",".sub-list-heading",function(){var t=$(this);t.hasClass("select")?t.siblings(".sub-list").slideUp("fast",function(){$(this).siblings(".sub-list-heading").removeClass("select")}):t.siblings(".sub-list").slideDown("fast",function(){$(this).siblings(".sub-list-heading").addClass("select")}),$(".sub-list:visible").not(t.siblings(".sub-list")).slideUp("fast",function(){$(this).siblings(".sub-list-heading").removeClass("select")})})}}}]);