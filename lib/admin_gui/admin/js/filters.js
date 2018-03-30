materialAdmin
    .filter('bidsByUser', function () {


        return function (bids, user) {


            var result = [];

            if (user.type == 'Customer') {
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
                    if (!searchCriteria || searchCriteria == '') {
                        result.push(item);
                    } else {
                        var criteria_arr = searchCriteria.split('.');
                        var val = item;
                        for(var j = 0 ; j < criteria_arr.length ; j++){
                            var criteria = criteria_arr[j];
                            val = val[criteria];
                        }
                        if (val) {
                            if (val.toString().toLowerCase().indexOf(searchString) !== -1 && result.indexOf(item) === -1) {
                                result.push(item);
                            }
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
        return function (input, date, field_name, DaysBetweenFactory) {
            var res = [];
            if (!date || date == '') {
                res = input;
            } else {
                for (var i = 0; i < input.length; i++) {
                    var item = input[i];
                    var _date = new Date(item[field_name]);
                    var diff = DaysBetweenFactory.daysBetween(_date, date);
                    if (diff == 0) {
                        res.push(item);
                    }
                }
            }
            return res;
        };
    });