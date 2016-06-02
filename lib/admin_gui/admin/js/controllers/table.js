materialAdmin
    .controller('tableCtrl', function($filter, $sce, ngTableParams, tableService,$http,$scope) {
        var data = tableService.data;
        $scope.users_url = '/activeadmin/users.json?';
        $scope.per_page = 20;
        $scope.page = 1;
        $scope.name_query = '';
        $scope.id_query = '';
        $scope.options = [
            {label: '5', value: 5},
            {label: '10', value: 10},
            {label: '20', value: 20},
            {label: '50', value: 50}
        ];
        $scope.page_size = $scope.options[2];
        //Basic Example
        this.tableBasic = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: data.length, // length of data
            getData: function ($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        })
        
        //Sorting
        this.tableSorting = new ngTableParams({
            page: 1,            // show first page
            count: 10,           // count per page
            sorting: {
                name: 'asc'     // initial sorting
            }
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
    
                $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        })
        
        //Filtering
        this.tableFilter = new ngTableParams({
            page: 1,            // show first page
            count: 10
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                // use build-in angular filter
                var orderedData = params.filter() ? $filter('filter')(data, params.filter()) : data;

                this.id = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.name = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.email = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.username = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                this.contact = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());

                params.total(orderedData.length); // set total for recalc pagination
                $defer.resolve(this.id, this.name, this.email, this.username, this.contact);
            }
        })
        
        //Editable
        this.tableEdit = new ngTableParams({
            page: 1,            // show first page
            count: 10           // count per page
        }, {
            total: data.length, // length of data
            getData: function($defer, params) {
                $defer.resolve(data.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
        });
        $scope.get_all_users = function () {
            var paging = '&per_page=' + $scope.page_size.value + '&page=' + $scope.page;
            var params = 'utf8=%E2%9C%93&order=id_asc' + paging;
            if ($scope.user_id_query) {
                if ($scope.user_id_query != '') {
                    params = params + '&q%5Bid_equals%5D=' + $scope.user_id_query;
                }
            }
            if ($scope.user_name_query) {
                if ($scope.user_name_query.length) {
                    params = params + '&q%5Bfirst_name_contains%5D=' + $scope.user_name_query;
                }
            }
            var url = $scope.users_url + params;
            var res = null
            $.ajax({
                async: false,
                dataType: "json",
                url: url,
                success: function (result) {
                    res = result;
                },
                error: function (result) {
                    console.log(result);
                }
            });
            return res;
        }
        $scope.users = $scope.get_all_users();
    })

