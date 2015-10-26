'use strict';

angular.module('app', 
    ['ngSanitize']
    )

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
                title: "Contact us now",
                link: "https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b",
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
                title: "Facebook",
                icon: "fui-facebook",
                link: "https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b",
            },{
                title: "Twitter",
                icon: "fui-twitter",
                link: "https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b",
            },{
                title: "LinkedIn",
                icon: "fui-linkedin",
                link: "https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b",
            }]
        },
        location: {
            id: 4,
            className: "location",
            sectionName: "Contact",
            // title: "<h1>Interested in what we do or need more information? Send us an e-mail and we would love to help you out!</h1>",
            email: "maximilian.hagerf@gmail.com",
            phone: "+46 73-6 24 99 34",
            info: [{
                title: "EMAIL ADDRESS",
                text: "St Eriksgatan 63",
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

    $scope.navigateTo = function(target){
        $('html, body').animate({
            scrollTop: $("#" + target).offset().top
        }, 500);
    };

    $scope.openMedia = function(gallery, startIndex, contentType, autoplay) {
        console.log('gallllery: ', gallery);
        var mediaGallery = [], videoId,
            autoplay = autoplay === 1,
            startIndex = startIndex === undefined ? 0 : startIndex;

        if(contentType === 'video') {

            for (let i=0; i < gallery.length; i++) {
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

            for (let i=0; i < gallery.length; i++) {
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

;