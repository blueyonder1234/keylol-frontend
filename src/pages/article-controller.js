﻿(function () {
    class ArticleController {
        constructor ($scope, stateTree) {
            $scope.stateTree = stateTree;
            stateTree.pointTheme = {
                main: '#1BB676',
                light: '#299EC4',
                icon: '//storage.keylol.com/2ea0474aa5757a04658790f12e144e61.png',
            };
        }
    }

    keylolApp.controller('ArticleController', ArticleController);
}());
