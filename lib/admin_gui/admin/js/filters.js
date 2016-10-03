materialAdmin
.filter('bidsByUser', function () {


    return function (bids, user) {


        var result = [];

        if(user.role == 'customer'){
            return bids;
        }
        // Using the forEach helper method to loop through the array
        angular.forEach(bids, function (item) {

            if (item.user_id == user.id) {
                result.push(item);
            }

        });

        return result;
    };

})
.filter('searchAnything', function () {

    // All filters must return a function. The first parameter
    // is the data that is to be filtered, and the second is an
    // argument that may be passed with a colon (searchFor:searchString)

    return function (arr, searchString, searchCriterias) {

        if (!searchString) {
            return arr;
        }

        var result = [];

        searchString = searchString.toLowerCase();

        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            for (var i = 0; i < searchCriterias.length; i++) {
                var searchCriteria = searchCriterias[i];
                if (item[searchCriteria]) {
                    if (item[searchCriteria].toString().toLowerCase().indexOf(searchString) !== -1 && result.indexOf(item) === -1) {
                        result.push(item);
                    }
                }

            }


        });

        return result;
    };

})

.filter('pagination', function () {
    return function (input, start) {
        var res = [];
        start = +start;
        if (input) {
            res = input.slice(start);
        }
        return res;
    };
})

.filter('searchDate', function () {
    return function (input, date,field_name) {
        var res = [];
        if(!date || date == ''){
            res = input;
        }else{
         for(var i = 0 ; i < input.length;i++){
             var item = input[i];
             var _date = new Date(item);
             if(_date == date){
                 res.push(item);
             }
         }
        }
        return res;
    };
});