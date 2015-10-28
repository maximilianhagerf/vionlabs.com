'use strict';

angular.module('app', ['ngSanitize', 
    'ngAnimate',
    'angular-inview',
    ])

.controller('mainCtrl', ['$scope', '$interval', function ($scope, $interval) {
     /*
    VARIABLES
    *****************/
    $scope.wHeight = window.innerHeight;

    $scope.mh = {
        start: {
            id: 1,
            className: "start center",
            background: "",
            title: "<h1>We make your TV experience smarter</h1>",
            socialLinks: [{
                title: "ABOUT US",
                icon: "fui-info-circle",
                linkID: "2",
            }]
        },
        about: {
            id: 2,
            className: "about",
            sectionName: "About Us",
            background: "",
            title: "<h1>We are a Stockholm based tech startup focused on entertainment.</h1>"
        },
        contact: {
            id: 3,
            className: "contact center",
            sectionName: "Get in touch",
            title: "<h1>Interested in what we do or need more information? Send us an e-mail and we would love to help you out!</h1>",
            email: "maximilian.hagerf@gmail.com",
            phone: "+46 73-6 24 99 34",
            socialLinks: [{
                title: "E-mail",
                icon: "fui-mail",
                link: "mailto:info@vionlabs.com",
            },{
                title: "Facebook",
                icon: "fui-facebook",
                link: "https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b",
            },{
                title: "Twitter",
                icon: "fui-twitter",
                link: "https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b",
            }]
        },
        location: {
            id: 4,
            backgroundImage: "/images/backgrounds/map.jpg",
            className: "location",
            // sectionName: "Visit Us",
            // title: "<h1>Interested in what we do or need more information? Send us an e-mail and we would love to help you out!</h1>",
            email: "maximilian.hagerf@gmail.com",
            phone: "+46 73-6 24 99 34",
            info: [{
                title: "EMAIL ADDRESS",
                text: "info@vionlabs.com",
            },{
                title: "TELEPHONE NUMBER",
                text: "08-xxx xxxx",
            },{
                title: "PHYSICAL ADDRESS",
                text: "St Eriksgatan 63",
            }]
        }
        
    };

    /*
    INIT
    *****************/
   

    /*
    FUNCTIONS
    *****************/
    $scope.slides = function() {
        $scope.slides = "rendered";
    }

    $scope.inviewFun = function(item, index){
        var element = ('#section' + (index + 1)).toString();
        // console.log("item",item, "index", index, "element",element);
        angular.element(element).addClass('inview');
        
        item.isActive = true;
    };

    $scope.navigateTo = function(target){
        $('html, body').animate({
            scrollTop: $("#section" + target).offset().top
        }, 500);
    };

    $scope.openMedia = function(gallery, startIndex, contentType, autoplay) {
        console.log('gallllery: ', gallery);
        var mediaGallery = [], videoId,
            autoplay = autoplay === 1,
            startIndex = startIndex === undefined ? 0 : startIndex;

        if(contentType === 'video') {

            for (var i=0; i < gallery.length; i++) {
                var videoId = gallery[i].url.split('v=')[1].split('&')[0],
                    image = gallery[i].thumbnailUrl ? gallery[i].thumbnailUrl : null;
                
                mediaGallery.push({
                    title: "" + (i+1) + "/" + gallery.length,
                    href: gallery[i].url,
                    type: 'text/html',
                    youtube: videoId,
                    poster: image
                });
            }

        }else if(contentType === 'images' ) {
            console.log('Loool: ', gallery);

            for (var i=0; i < gallery.length; i++) {
                mediaGallery.push({
                    title: "" + (i+1) + "/" + gallery.length,
                    href: gallery[i].url
                });
            }

        }

        window.blueimp.Gallery(mediaGallery, {
            container: '#blueimp-gallery',
            enableKeyboardNavigation: true,
            // transitionSpeed: 1,
            transitionSpeed: 200,
            index: startIndex,
            youTubeClickToPlay: false,
            onopened: function() {
                if (autoplay) {
                    angular.element('.video-content a')[startIndex].click();
                }
            }
        });

    };

}])

.run([ '$rootScope', function($rootScope) {
    
    // browser & version detection
    $rootScope.browser = navigator.sayswho= (function(){
        var ua= navigator.userAgent, tem, M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'ie ie_'+(tem[1] || '').toLowerCase();
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
            if(tem!== null){return tem.slice(1).join(' ').replace('OPR', 'Opera');}
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem= ua.match(/version\/(\d+)/i))!== null){M.splice(1, 1, tem[1]);}
        return M.join('_').toLowerCase();
    })();

}])

.factory('preload', ['$q', function ($q) {
    return function (url) {
        var deffered = $q.defer(),
        image = new Image();
        image.src = url;

        if (image.complete) {

            deffered.resolve();

        } else {

            image.addEventListener('load', function () {
                deffered.resolve();
            });

            image.addEventListener('error', function () {
                deffered.reject();
            });
        }

        return deffered.promise;
    };
}])

.directive('background', ['preload', function (preload) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            options: '@',
        },
        replace: true,
        template: '<div class="background"><div class="background__image" ng-style="{\'background-image\': \'url(\' + url + \')\'}"></div></div>',
        link: function (scope, element, attrs, tabsCtrl) {

            element.addClass('tp-hide');

            var imageWaiter = scope.$watch('image', function (newVal) {
                if (newVal) {
                    /* Select best image url */
                    scope.url = scope.image;
                    imageWaiter();
                }else{
                    /*no image*/
                    scope.url = false;
                }

                /* Call the image preloader factory and show image when done */
                preload(scope.image).then(function () {
                    element.removeClass('tp-hide');
                    element.addClass('tp-show');
                });
            }, true);

        }
    };
}])

.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    }
})

/*
 RESIZE
 **************/
.directive('resize', ['$window', '$rootScope', function ($window, $rootScope) {
    return function (scope) {
        let w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {'h': w.height(), 'w': w.width()};
        };
        scope.$watch(scope.getWindowDimensions, function (newValue) {
            // scope.windowHeight = newValue.h;
            let d;

            if(newValue.w < 768){
                d = "sm";
            }
            if(newValue.w > 767 && newValue.w < 991){
                d = "md";
            }
            if(newValue.w > 992 && newValue.w < 1199){
                d = "lg";
            }
            if(newValue.w > 1200){
                d = "xl";
            }
            if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && newValue.w < 768) {
                scope.isDevice = true;
                angular.element('body').addClass('is-device');
            } else {
                scope.isDevice = false;
            }

            angular.element('body').removeClass('xs sm md lg xl');
            angular.element('body').addClass(d);

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    };
}])

;