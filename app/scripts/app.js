'use strict';

angular.module('app', 
    ['ngSanitize']
    )

.controller('mainCtrl', ['$scope', function ($scope) {
    
    /*
    VARIABLES
    *****************/

    $scope.mh = {
        about: {
            id: 1,
            sectionName: "Hello & welcome",
            title: "<h1>I'm <strong>Maximilian Hagerf</strong> a passionate <strong>Digital Artist & Interaction Designer</strong> with several years of experience, spanning from the concept up to the final result. </h1><h1><strong>I’m based in Stockholm</strong>, Sweden. <small>I have my coffee like my women… microwaved three times…</small></h1>"
        },
        work: {
            id: 2,
            sectionName: "My work",
            title: "<h2></h2>",
            jobs: [{
                jobName: "Rummet - Oct • 2015",
                jobLink: "http://www.rummet-music.com",
                jobDescription: "Full graphical profile, logotype, albumcover, website",
                jobImages: ['/images/image2.jpg'],
            },{
                jobName: "Vionel @ Vionlabs - Sep • 2013 UNGOING",
                jobLink: "http://www.vionlabs.com",
                jobDescription: "",
                jobImages: ['/images/image3.jpg'],
            },{
                jobName: "Haukås",
                jobLink: "http://www.haukas.se/",
                jobDescription: "",
                jobImages: ['/images/image1.jpg'],
            },{
                jobName: "F12-Gruppen",
                jobLink: "",
                jobDescription: "",
                jobImages: ['/images/image4.jpg'],
            }]
        },
        /*art: {
            id: 3,
            sectionName: "Art & Fun",
            galleries: [{
                type: "images",
                items: [{
                    title: "photo",
                    thumbnailUrl: '/images/photos/photo001.JPG',
                    url: '/images/photos/photo001.JPG'
                },{
                    title: "photo",
                    thumbnailUrl: '/images/photos/photo003.JPG',
                    url: '/images/photos/photo003.JPG'
                },{
                    title: "photo",
                    thumbnailUrl: '/images/photos/photo004.JPG',
                    url: '/images/photos/photo004.JPG'
                }]
            }]
        },*/
        contact: {
            id: 4,
            sectionName: "Contact me",
            title: "Don't be shy",
            email: "maximilian.hagerf@gmail.com",
            phone: "+46 73-6 24 99 34",
            linkedIn: "https://www.linkedin.com/pub/maximilian-hagerf/37/b38/85b",
        }
    };

    /*
    FUNCTIONS
    *****************/

    $scope.navigateTo = function(target){
        $('html, body').animate({
            scrollTop: $("#" + target).offset().top
        }, 1000);
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
            imagew: '=',
            imageh: '=',
            options: '@',
        },
        replace: true,
        template: '<div class="background" ng-style="{\'width\': imagew, \'height\': imageh,}"><div class="background__image" ng-style="{\'background-image\': \'url(\' + url + \')\'}"></div></div>',
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