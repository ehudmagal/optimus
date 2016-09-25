app.filter('getRealLoggers', function () {


    return function (arr) {


        var result = [];


        // Using the forEach helper method to loop through the array
        angular.forEach(arr, function (item) {

            if (item.id < app.OP_SENSORS_MAX_ID && !item.sensor_id) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('getActiveProjects', function () {


    return function (arr) {


        var result = [];


        // Using the forEach helper method to loop through the array
        var now = new Date();
        angular.forEach(arr, function (item) {

            var project = item;
            var deactivation_date = new Date(project.deactivation_date);
            if ((now < deactivation_date) && (project.status != "archived")) {
                result.push(item);
            }

        });

        return result;
    };

});

app.filter('uniqueArrByAttribute', function () {


    return function (arr, attribute, GetObjectByAttributeFactory) {


        var result = [];
        
        angular.forEach(arr, function (item) {
            var item_exist = GetObjectByAttributeFactory.getObjectByAttribute(attribute,item[attribute],result);
            if (!item_exist) {
                result.push(item);
            }
        });

        return result;
    };

});