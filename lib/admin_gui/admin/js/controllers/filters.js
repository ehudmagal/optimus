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

});