﻿(function () {
    class DiscoveryController {
        constructor ($scope, pageHead, stateTree, $location, pageLoad, $window, $element, $http, apiEndpoint, notification) {
            pageHead.setTitle('广场 - 其乐');
            if ($location.path() !== '/') {
                pageLoad('entrance.discovery');
            }

            $scope.stateTree = stateTree;

            const $$window = $($window);
            const scrollCallback = () => {
                const shouldWindowScrollTop = $$window.scrollTop() + 94;
                const windowHeight = $$window.height();
                const elementOffsetTop = $element.offset().top;
                const $elementHeight = $element.height();
                if (shouldWindowScrollTop + windowHeight > elementOffsetTop + $elementHeight && stateTree.currentUser) {
                    $scope.$apply(() => {
                        $http.get(`${apiEndpoint}states/entrance/timeline`).then(response => {
                            stateTree.entrance.timeline = response.data;
                        }, response => {
                            notification.error({ message: '发生未知错误，请重试或与站务职员联系' }, response);
                        });
                    });
                    $$window.unbind('scroll', scrollCallback);
                    cancelListenRoute();
                }
            };
            $$window.bind('scroll.loadTimeline', scrollCallback);

            const cancelListenRoute = $scope.$on('$destroy', () => {
                $$window.unbind('scroll', scrollCallback);
                cancelListenRoute();
            });
        }
    }

    keylolApp.controller('DiscoveryController', DiscoveryController);
}());