﻿(function () {
    keylolApp.controller('ShortReviewController', [
        '$scope', 'close', 'window', 'notification', '$http', 'options', '$location', '$state', 'union',
        function ($scope, close, window, notification, $http, options, $location, $state, union) {
            $scope.options = options;

            $scope.vm = $.extend({
                TypeName: '简评',
                Title: `${options.point.Name} 的简评`,
                Content: '',
                Vote: null,
                VoteForPointId: options.point.Id,
            }, options.vm);
            $scope.count = $scope.vm.Content.length;

            $scope.cancel = function () {
                close();
            };

            // $scope.changeToLong = function () {
            //     notification.attention('切换为长评时会覆盖之前未发布的草稿', [
            //         {action: '覆盖', value: true},
            //         {action: '取消'}
            //     ]).then(function (result) {
            //         if (result) {
            //             window.show({
            //                 templateUrl: 'src/windows/editor.html',
            //                 controller: 'EditorController',
            //                 inputs: {
            //                     options: {
            //                         doNotLoadDraft: true,
            //                         vm: {
            //                             Id: $scope.vm.Id,
            //                             TypeName: '评',
            //                             Title: '',
            //                             Content: $scope.vm.Content,
            //                             Vote: $scope.vm.Vote,
            //                             Summary: '',
            //                             Pros: [],
            //                             Cons: []
            //                         },
            //                         voteForPoint: options.point
            //                     }
            //                 }
            //             });
            //             close();
            //         }
            //     });
            // };

            $scope.submitLock = false;
            function checkEmpty () {
                if (!$scope.vm.Content) return '简评内容';
                if (!$scope.vm.Vote) return '简评评分';
                return null;
            }
            $scope.submit = function () {
                if ($scope.submitLock || $scope.vm.Content.length > 99)
                    return;
                const emptyString = checkEmpty();
                if (emptyString) {
                    return notification.error(`${emptyString}不能为空`);
                }
                $scope.submitLock = true;
                if ($scope.vm.Id) {
                    $http.put(`${apiEndpoint}article/${$scope.vm.Id}`, $scope.vm)
                        .then(() => {
                            close();
                            $state.reload();
                            notification.success('简评已发布');
                        }, response => {
                            notification.error('发生未知错误，请重试或与站务职员联系', response);
                            $scope.submitLock = false;
                        });
                } else {
                    $http.post(`${apiEndpoint}article`, $scope.vm)
                        .then(response => {
                            close();
                            $location.url(`article/${union.$localStorage.user.IdCode}/${response.data.SequenceNumberForAuthor}`);
                            notification.success('简评已发布');
                        }, response => {
                            if (response.status === 401) {
                                notification.error('现有文券数量不足，无法发文');
                            } else {
                                notification.error('发生未知错误，请重试或与站务职员联系', response);
                            }
                            $scope.submitLock = false;
                        });
                }
            };
        },
    ]);
}());
