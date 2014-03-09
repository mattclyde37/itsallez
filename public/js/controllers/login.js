/* global angular, alert */

angular.module('ezApp')
	.controller('LoginCtrl', function ($scope, $firebase, $state, Auth) {
        'use strict';

        $scope.mainText = "Hello there!";



        $scope.login = function(){
            Auth.login('password', {
              email: $scope.email,
              password: $scope.password
            });
          };
          $scope.register = function(){
            Auth.createUser($scope.email, $scope.password, function (error, user) {
              if (!error)
                alert('Account Created for: ' + user.email);
            });
          };


        /*
        $scope.textChanged = function(text){
            var chars = text.toUpperCase().split('');
            var keyValues = {};
            var keys = [];
            for (var i = 0; i < chars.length; ++i){
                if (!keyValues[chars[i]] && chars[i] !== ' ')
                {
                    keyValues[chars[i]] = 1;
                    keys.push(chars[i]);
                }
                else
                    keyValues[chars[i]] += 1;
            }

            var data = [];
            for (var i = 0; i < keys.length; ++i){
                data.push({letter: keys[i], frequency:keyValues[keys[i]]});
            }
            updateChart(data);
        };

       

        var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(10);

        var svg = d3.select("body").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 3)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Frequency");

        function updateChart(data){

                x.domain(data.map(function(d) { return d.letter; }));
                y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

                var bars = svg.selectAll(".bar").data(data);

                bars.transition()
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.frequency); })
                    .attr("height", function(d) { return height - y(d.frequency); });

                bars.enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(d.letter); })
                    .attr("width", x.rangeBand())
                    .attr("y", function(d) { return y(d.frequency); })
                    .attr("height", function(d) { return height - y(d.frequency); });


                bars.exit()
                    .remove();

            svg.selectAll("g.y.axis")
                .call(yAxis);

            svg.selectAll("g.x.axis")
                .call(xAxis);

        };


        function type(d) {
            d.frequency = +d.frequency;
            return d;
        }
        */


});