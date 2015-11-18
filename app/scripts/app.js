'use strict';
angular
/*
APP
*****************/
    .module('app', ['ngSanitize', 'ngAnimate', 'angular-inview', 'ui.bootstrap', 'ui.bootstrap.modal', 'pasvaz.bindonce'])
    /*
    MAINCTRL
    *****************/
    .controller('mainCtrl', ['$scope', '$uibModal', '$log', '$http', function($scope, $uibModal, $log, $http) {
        /*
        INIT
        *****************/
        $http.get('scripts/settings.json').then(function(res) {
            $scope.vionlabs = res.data.vionlabs;
        });
        $scope.inViewOffset = (window.innerWidth < 769) ? 0 : 300;
        $scope.wHeight = window.innerHeight;
        if ((window.matchMedia && (window.matchMedia('only screen and (min-resolution: 124dpi), only screen and (min-resolution: 1.3dppx), only screen and (min-resolution: 48.8dpcm)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3)').matches)) || (window.devicePixelRatio && window.devicePixelRatio > 1.3)) {
            angular.element('body').addClass('high-density');
        }
        /*
        FUNCTIONS
        *****************/
        $scope.openModal = function(id, size) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'templates/modal.tpl.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    modalContent: function() {
                        return $scope.vionlabs.modals['modal' + id];
                    }
                }
            });
            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
        $scope.slides = function() {
            $scope.slides = 'rendered';
        };
        $scope.inviewFun = function(item, section, slide) {
            var element = ('#section' + section + '_' + slide).toString();
            // var element = ('#section' + index).toString();
            // console.log('item',item, 'index', index, 'element',element);
            angular.element(element).addClass('inview');
            $scope.currentSection = section;
            item.isActive = true;
        };
        $scope.navigateTo = function(section, slide) {
            slide = (slide) ? slide : 1;
            var element = ('#section' + section + '_' + slide).toString();
            $('html, body').animate({
                scrollTop: angular.element(element).offset().top
            }, 500);
        };
        $scope.openMedia = function(gallery, index, contentType, auto) {
            console.log('gallllery: ', gallery);
            var mediaGallery = [],
                videoId, image,
                autoplay = auto === 1,
                startIndex = index === undefined ? 0 : startIndex;
            if (contentType === 'video') {
                for (var i = 0; i < gallery.length; i++) {
                    videoId = gallery[i].url.split('v=')[1].split('&')[0];
                    image = gallery[i].thumbnailUrl ? gallery[i].thumbnailUrl : null;
                    mediaGallery.push({
                        title: '' + (i + 1) + '/' + gallery.length,
                        href: gallery[i].url,
                        type: 'text/html',
                        youtube: videoId,
                        poster: image
                    });
                }
            } else if (contentType === 'images') {
                console.log('Loool: ', gallery);
                for (var x = 0; x < gallery.length; x++) {
                    mediaGallery.push({
                        title: '' + (x + 1) + '/' + gallery.length,
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
    MODALINSTANCECTRL
    *****************/
    .controller('ModalInstanceCtrl', function($scope, $uibModalInstance, modalContent) {
        $scope.modalContent = modalContent;
        // $scope.selected = {
        //   item: $scope.items[0]
        // };
        // $scope.ok = function () {
        //   $uibModalInstance.close($scope.selected.item);
        // };
        $scope.closeModal = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
        };
        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    })
    /*
    RUN
    **********/
    .run(['$rootScope', function($rootScope) {
        // browser & version detection
        $rootScope.browser = navigator.sayswho = (function() {
            var ua = navigator.userAgent,
                tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            if (/trident/i.test(M[1])) {
                tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return 'ie ie_' + (tem[1] || '').toLowerCase();
            }
            if (M[1] === 'Chrome') {
                tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (tem !== null) {
                    return tem.slice(1).join(' ').replace('OPR', 'Opera');
                }
            }
            M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
                M.splice(1, 1, tem[1]);
            }
            return M.join('_').toLowerCase();
        })();
    }])
    /*
    FACTORIES
    **********/
    .factory('preload', ['$q', function($q) {
        return function(url) {
            var deffered = $q.defer(),
                image = new Image();
            image.src = url;
            if (image.complete) {
                deffered.resolve();
            } else {
                image.addEventListener('load', function() {
                    deffered.resolve();
                });
                image.addEventListener('error', function() {
                    deffered.reject();
                });
            }
            return deffered.promise;
        };
    }])
    /*
    BACKGROUND
    **********/
    .directive('background', ['preload', function(preload) {
        return {
            restrict: 'E',
            scope: {
                image: '=',
                options: '@',
            },
            replace: true,
            template: '<div class="background"><div class="background__image" ng-style="{\'background-image\': \'url(\' + url + \')\'}"></div></div>',
            link: function(scope, element) {
                element.addClass('tp-hide');
                var imageWaiter = scope.$watch('image', function(newVal) {
                    if (newVal) {
                        /* Select best image url */
                        scope.url = scope.image;
                        imageWaiter();
                    } else {
                        /*no image*/
                        scope.url = false;
                    }
                    /* Call the image preloader factory and show image when done */
                    preload(scope.image).then(function() {
                        element.removeClass('tp-hide');
                        element.addClass('tp-show');
                    });
                }, true);
            }
        };
    }])
    /*
    SCROLL
    **********/
    .directive('vlScroll', function($window) {
        return function(scope) {
            angular.element($window).bind('scroll', function() {
                if (this.pageYOffset > 0) {
                    scope.isTop = true;
                } else {
                    scope.isTop = false;
                }
                scope.$digest();
            });
        };
    })
    /*
    ONFINISHRENDER
    **********/
    .directive('onFinishRender', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attr) {
                if (scope.$last === true) {
                    scope.$evalAsync(attr.onFinishRender);
                }
            }
        };
    })
    /*
    RESIZE
    **********/
    .directive('resize', ['$window', function($window) {
        return function(scope) {
            var w = angular.element($window);
            scope.getWindowDimensions = function() {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function(newValue) {
                // scope.w = newValue.w;
                // scope.windowHeight = newValue.h;
                var d;
                if (newValue.w < 768) {
                    d = 'sm';
                    scope.inViewOffset = 0;
                }
                if (newValue.w > 767 && newValue.w < 991) {
                    d = 'md';
                }
                if (newValue.w > 992 && newValue.w < 1199) {
                    d = 'lg';
                }
                if (newValue.w > 1200) {
                    d = 'xl';
                }
                if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) && newValue.w < 768) {
                    scope.isDevice = true;
                    angular.element('body').addClass('is-device');
                } else {
                    scope.isDevice = false;
                }
                angular.element('body').removeClass('xs sm md lg xl');
                angular.element('body').addClass(d);
            }, true);
            w.bind('resize', function() {
                scope.$digest();
            });
        };
    }]);