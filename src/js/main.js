var app = angular.module("app", []);

app.controller("appCtrl", function ($scope, $http, $timeout) {

    var maxSearchResults      = 1000;
    var numSearchResInTable   = 10;
    var input                 = document.querySelector(".input-query");
    var searchBlock           = document.querySelector(".search-block");
    $scope.sort               = "name";
    
    // Ñheck input form filling
    $scope.checkInputForm = function(query, page) {
        if ( !input.value ) {
            alert( "Enter your query" );
            return;
        } else {
            $scope.sendingQuery(query, page);
        }
    } 
   
    // Sending a search request
    $scope.sendingQuery = function(query, page) {
        $scope.userQuery = query;
        $scope.currentPage = page;
        
        $http.get("https://api.github.com/search/repositories?q=" + $scope.userQuery + "in:name" + "&per_page=" + numSearchResInTable + "&page=" + $scope.currentPage)
            .then(function(res){
                console.log(res);
                $scope.myData       = res.data.items;
                $scope.totalData    = res.data.total_count;
                $scope.checkingQueryResults($scope.totalData);
            }, function(res) {
                alert("ERROR!\n\rTry again");
                window.location.reload(true);
            });
    }
    
    // Checking received query results
    $scope.checkingQueryResults = function(receivedData) {
        if (receivedData > 0) {
            $scope.processingQueryResults(receivedData);
        } else {
            getResHidden();
            input.value = "";
            alert("Nothing found on your request");
        }
    }
    
    // Processing received query results
    $scope.processingQueryResults = function(receivedData) {
        if (receivedData > maxSearchResults) {
            $scope.totalData = maxSearchResults;
        }
        $scope.numberBtnPagination = Math.ceil($scope.totalData / numSearchResInTable);
        $scope.createNumberingBtnPagination($scope.numberBtnPagination);
        getResVisible();
    }
    
    // Display the results table
    function getResVisible() {
        var hiddenBlocks = document.querySelectorAll(".hidden");
        $timeout( function(){    
            for (var i = 0; i < hiddenBlocks.length; i++) {
                hiddenBlocks[i].style.display = "block";
            }
        },1000);
        toTopSearchBlock();
    }
    
    // Hidden the results table
    function getResHidden() {
        var hiddenBlocks = document.querySelectorAll(".hidden");
        for (var i = 0; i < hiddenBlocks.length; i++) {
            hiddenBlocks[i].style.display = "none";
        }
    }
    
    // Create numbered buttons of pagination 
    $scope.createNumberingBtnPagination = function(numderBtn) {
        $scope.btnArr = [];
        for (var i = 1; i <= numderBtn; i++) {
            $scope.btnArr.push({ i });
        }
    };
    
    // Display query results by clicking on the pagination-button
    $scope.getCurrentPage = function(query, page) {
        var currentPage = page + 1;
        $scope.sendingQuery(query, currentPage);
    }

    // States for active pagination-button in View
    $scope.states = {}; 
    $scope.states.activeItem = "1";
    
    // Search-block moving up
    function toTopSearchBlock() {
        searchBlock.style.top = "0";
    };    
});

// Directive that creates a hover effect for the pagination buttons
app.directive("userhover", function () {
    return {
        link: function ($scope, element, attrs) {

            element.bind("mouseenter", function () {
                element.css("color", "#FFA100");
                element.css("font-weight", "bold");
                element.css("cursor", "pointer");
            });
            
            element.bind("mouseleave", function () {
                element.css("color", "#fff");
                element.css("font-weight", "normal");
            });
        }
    }; 
});

// Filter for data conversion in a table graph "Private or Public"
app.filter("privateDateTransformation", function() {
    return function(x) {
        if (x === false) {
            return "Public";
        } else {
            return "Private";
        }
    };
}); 