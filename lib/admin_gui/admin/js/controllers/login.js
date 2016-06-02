
materialAdmin
    .controller('loginCtrl', function($filter, $sce, ngTableParams, tableService,$http,$scope,$rootScope,
                                      PatchObjectFactory) {
        $scope.user = {};
        $scope.login_user = function () {
            var url =   '/users/sign_in.json';
            var post_data = {};
            var user_for_post = jQuery.extend(true, {}, $scope.user);
            user_for_post.remember_me = 0;
            if (user_for_post.remember_me == true) {
                user_for_post.remember_me = 1;
            }
            post_data['user'] = user_for_post;
            PatchObjectFactory.patchObject(url, post_data, 'post', $scope.goto_personal_zone);

        }
        $scope.goto_personal_zone = function(){
            window.location.assign("#/");
        }


    });