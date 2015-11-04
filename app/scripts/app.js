'use strict';

angular.module('app', ['ngSanitize', 
    'ngAnimate',
    'angular-inview',
    ])

.controller('mainCtrl', ['$scope', function ($scope) {
     /*
    VARIABLES
    *****************/
    $scope.wHeight = window.innerHeight - 78;
    $scope.inViewOffset = (window.innerWidth<769)?0:300;

    $scope.vionlabs = {
        info: {
            email: 'info@vionlabs.com',
            phone: '08-xxx xxxx',
            adress: 'St Eriksgatan 63',
            backgroundImage: 'images/backgrounds/map.jpg',
            copyright: '© Copyright VionLabs 2015.'
        },
        sections: {
            start: {
                id: 1,
                className: 'center',
                sectionName: 'home',
                backgroundImage: 'images/budapest.jpg',
                title: '<h1>We enhance your <br>VOD & TV service</h1>',
                paragraphs: [{
                    id: 1,
                    text: 'We provide a unique and customized <strong>search and recommendation engine</strong> for TV and movies that truly understands the content and the user behavior.'
                }],
                socialLinks: [{
                    id: 1,
                    title: 'CONTACT US',
                    icon: 'fi-compass',
                    linkID: '4',
                }],
                layers: [{
                    id: 1,
                    image: 'images/vionlabs.png',
                    className: 'center-top'
                }]
            },
            about: {
                id: 2,
                className: 'center white',
                sectionName: 'About',
                title: '<h1>WHAT WE DO</h1>',
            // backgroundImage: 'images/vionel.jpg',
            // layers: [{
            //     id: 1,
            //     width: '300px',
            //     image: 'images/iphone_vionel-small.png',
            //     className: 'right'
            // }],
            paragraphs: [{
                id: 1,
                text: 'We are passionate about movies, data and great viewer experience. That’s why we have created a solution that <strong>analyzes movies and TV series</strong> to understand the characteristics which creates a unique fingerprint. We help you as a customer to present the right content at the right time creating a higher engagement and more satisfied/loyal consumers, leading to a better churn rate'
            },{
                id: 2,
                text: 'We have 4 products but we give you the freedom of choosing what is right for you...'
            }],
            infoCircle:[{
                id: 1,
                text: 'Discovery'
            },{
                id: 2,
                text: 'Metadata'
            },{
                id: 3,
                text: 'Bitframe'
            },{
                id: 4,
                text: 'Vionel Insight'
            }]
        },
        vionel: {
            id: 3,
            className: 'left',
            sectionName: 'vionel',
            title: '<h1>What\'s <br>Vionel™?</h1>',
            backgroundImage: 'images/vionel.jpg',
            paragraphs: [{
                id: 1,
                text: 'It is our in-house product for demonstrating and showcasing our vast datasets & it\'s customizable capabilities.'
            },{
                id: 2,
                text: 'Vionel™ exists as an app for iPhone, and on the web.'
            }],
            layers: [{
                id: 1,
                width: '300px',
                image: 'images/iphone_vionel-small.png',
                className: 'right'
            }],
            socialLinks: [{
                id: 1,
                title: 'VIONEL.com',
                icon: 'fi-mail',
                link: 'vionel.com',
            }]
        },
        work: {
            id: 4,
            className: 'right',
            sectionName: 'Career',
            backgroundImage: 'images/independence.jpg',
            title: '<h1>join our<br>adventure</h1>',
            paragraphs: [{
                id: 1,
                text: 'We are always looking for new talents to work with, send and e-mail and tell us about yourself!'
            }],
            socialLinks: [{
                id: 1,
                title: 'E-mail',
                icon: 'fi-mail',
                link: 'mailto:info@vionlabs.com',
            }],
            layers: [{
                id: 1,
                image: 'images/treasure-map.png',
                className: 'left'
            }]
        },
        contact: {
            id: 5,
            className: 'contact center',
            backgroundImage: 'images/info-2.jpg',
            sectionName: 'Contact',
            title: '<h1>Interested in what we do or need more information?</h1>',
            email: 'maximilian.hagerf@gmail.com',
            phone: '+46 73-6 24 99 34',
            paragraphs: [{
                id: 1,
                text: 'Send us an e-mail and we would love to help you out!'
            }],
            socialLinks: [{
                id: 1,
                title: 'E-mail',
                icon: 'fi-mail',
                link: 'mailto:info@vionlabs.com',
            },{
                id: 2,
                title: 'Facebook',
                icon: 'fi-social-facebook',
                link: 'https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b',
            },{
                id: 3,
                title: 'Twitter',
                icon: 'fi-social-twitter',
                link: 'https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b',
            }]
        }
    }
    };

    /*
    INIT
    *****************/
    if ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3)) {
        angular.element('body').addClass('high-density');
    }
    /*
    FUNCTIONS
    *****************/
    $scope.slides = function() {
        $scope.slides = 'rendered';
    };

    $scope.inviewFun = function(item, index){
        var element = ('#section' + (index + 1)).toString();
        // console.log('item',item, 'index', index, 'element',element);
        angular.element(element).addClass('inview');
        $scope.currentSection = index;
        item.isActive = true;
    };

    $scope.navigateTo = function(target){
        $('html, body').animate({
            scrollTop: $('#section' + target).offset().top - 78
        }, 500);
    };

    $scope.openMedia = function(gallery, index, contentType, auto) {
        console.log('gallllery: ', gallery);
        var mediaGallery = [], videoId, image,
            autoplay = auto === 1,
            startIndex = index === undefined ? 0 : startIndex;

        if(contentType === 'video') {

            for (var i=0; i < gallery.length; i++) {
                videoId = gallery[i].url.split('v=')[1].split('&')[0];
                image = gallery[i].thumbnailUrl ? gallery[i].thumbnailUrl : null;
                
                mediaGallery.push({
                    title: '' + (i+1) + '/' + gallery.length,
                    href: gallery[i].url,
                    type: 'text/html',
                    youtube: videoId,
                    poster: image
                });
            }

        }else if(contentType === 'images' ) {
            console.log('Loool: ', gallery);

            for (var x=0; x < gallery.length; x++) {
                mediaGallery.push({
                    title: '' + (x+1) + '/' + gallery.length,
                    href: gallery[x].url
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
/*
RUN
**********/
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
/*
factories
**********/
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

/*
directives
**********/
.directive('background', ['preload', function (preload) {
    return {
        restrict: 'E',
        scope: {
            image: '=',
            options: '@',
        },
        replace: true,
        template: '<div class="background"><div class="background__image" ng-style="{\'background-image\': \'url(\' + url + \')\'}"></div></div>',
        link: function (scope, element) {

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

.directive('onFinishRender', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                scope.$evalAsync(attr.onFinishRender);
            }
        }
    };
})

.directive('resize', ['$window', function ($window) {
    return function (scope) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return {'h': w.height(), 'w': w.width()};
        };
        scope.$watch(scope.getWindowDimensions, function (newValue) {
            // scope.w = newValue.w;
            // scope.windowHeight = newValue.h;
            var d;

            if(newValue.w < 768){
                d = 'sm';
                scope.inViewOffset = 0;
            }
            if(newValue.w > 767 && newValue.w < 991){
                d = 'md';
            }
            if(newValue.w > 992 && newValue.w < 1199){
                d = 'lg';
            }
            if(newValue.w > 1200){
                d = 'xl';
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