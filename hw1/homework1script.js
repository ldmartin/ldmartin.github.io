 var string_input = decodeURI(window.location.search);

  // var printed_input = string_input.replace(/[^\w\s]|_/g, "").replace(/\s+/g, " ");
  var printed_input = string_input.slice(1,string_input.length);

  var SearchTextBox = document.getElementById('user-field-input');
  SearchTextBox.value = printed_input;

  if (printed_input.length < 1){
      string_input = 'test me out!'
      printed_input = 'test me out!'
      var error = true;
    }

  if (error === true){
      var errormessage = d3.select(".error-message").text('Please enter a valid search query, like this one!');
      SearchTextBox.value = "Test me out!";
  }

  var title = d3.select(".chart-title").text('Letter frequencies in "' + printed_input + '"');

  function reload_page(){
      var userInput = document.getElementById('user-field-input');
      var fullString = userInput.value;
      // localStorage.setItem("userSearchInput", fullString);

      location.href = "http://ldmartin.github.io/MSAN622/hw1/?" + fullString;
  }

  function addtext(){
      var TheTextBox = document.getElementById('user-field-input');
      TheTextBox.value = "TEST!";
  }

  // var userSearchInput = localStorage.getItem("userSearchInput");


  // function search_box_input(){
  //     var userInput = document.getElementById('user-field-input');
  //     var fullString = userInput.value;
  //     // location.href = "http://ldmartin.github.io/MSAN622/hw1/?" + fullString;
  //     return fullString
  // }


	function get_user_input(string_input){
		  // var user_input_stripped = string_input.replace(/\W/g, '').replace(/[0-9]/g, '').toLowerCase();
      var user_input_stripped = string_input.replace(/[^A-Za-z]/g, '').toLowerCase();
      var input = user_input_stripped.split("").sort();
      return input
	}


	function get_letter_frequency(input){
		var letter_dic = {};
    for (var i = 0; i < input.length; i++) {
        var letter = input[i];
        if (!(letter in letter_dic)){letter_dic[letter] = 0}
        letter_dic[letter] += 1;
    }

    return letter_dic
	}

  var colors = {
      "grey":   "#bbbbbb",
      "blue":   "#377eb8",
      "purple": "#984ea3",
      "green":  "#4daf4a",
      "orange": "#ff7f00",
      "lightpink": "#fec0ff",
      "lightteal": "#b7fbf6",
      "black": "#000000",
      "darkpurple": "#6a5acd",
      "lavender": "#e6e6fa",
      "redorange": "#ff4500"
  };

	var input = get_user_input(string_input);

	var letter_freq = get_letter_frequency(input);

	console.log(letter_freq);
	// var data = d3.entries(letter_freq);

    // create lists of letters and counts from dictionary to use for bar chart:
    // these will be in alphabetical order, I think
    letters = [];
    counts = [];
    for (letter in letter_freq){ 
        letters.push(letter);
        counts.push(letter_freq[letter]);
        }

    var num_letters = letters.length;

    // var data = [letter_freq];
    var data = d3.entries(letter_freq);

    // var title = d3.select(".chart-title").text('Letter frequencies in "' + printed_input + '"');

    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1)
        .domain(data.map(function(d) { return d.key; }));

    var y = d3.scale.linear()
        .range([height, 0])
        .domain([0, d3.max(data, function(d) { return d.value; })]);

    var formatAxis = d3.format('.0f');

    var num_ticks = d3.max(data, function(d) { return d.value; })

    function make_y_axis(num_ticks, formatAxis) {        
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        // .tickFormat(formatxAxis)
        .ticks(num_ticks)
    }

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatAxis)
        .ticks(num_ticks)
        .tickSize(-width)
        // .style("fill", colors.grey)
        ;

    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return "<strong>Count:</strong> <span style='color:white'>" + d.value + "</span>";
        })

    var svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("text")      // text label for the x axis
        .attr("x", width / 2 )
        .attr("y",  height + margin.bottom + 0.2)
        .style("text-anchor", "middle")
        .text("Letter");

    svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            ;

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Count");

    var maxval = d3.max(data, function(d) { return d.value }); 

    bars = svg.selectAll(".bar")
          .data(data)
          .enter().append("rect")
          .style("fill", colors.lavender);
          // .attr("opacity", function(d) {return (d.value)/maxval})
          // .style("fill-opacity", function(d) {return (d.value)/maxval});
          // .filter(function(d) { return d.value === maxval } 
          //   .classed("max", true)
          //   .attr("fill", colors.lightteal)
          

    // bars.selectAll("rect").filter(function(d) { return d.value === maxval } 
    //     .classed("max", true)
    //     .attr("fill", colors.lightteal);

    bars.attr("class", "bar")
          .attr("x", function(d) { return x(d.key); })
          .attr("width", x.rangeBand())
          .attr("y", height)
          .attr("height", 0)  // change this to the line above if you dont want bars to grow:
          .transition()
            // make the whole function take only 700. This means the whole transition is done by 2500 (when sorting starts)
            .delay(function(d, i) { return (i/num_letters) * (700.0); })
            .duration(1800)
            .ease("bounce")
            .attr('y', function(d) { return y(d.value); })
            .attr('height', function(d) { return height - y(d.value); })
            .each("end", function(){
                d3.select(this).transition()
                .duration(500)
                .style("fill-opacity", function(d) {return (d.value)/maxval});
              })
            ;


    d3.select("#check-input").on("change", change);

    var sortTimeout = setTimeout(function() {
        d3.select("#check-input").property("checked", true).each(change);
      }, 2500);

    function change() {
        clearTimeout(sortTimeout);

        // Copy-on-write since tweens are evaluated after a delay.
        var x0 = x.domain(data.sort(this.checked
            ? function(a, b) { return b.value - a.value; }
            : function(a, b) { return d3.ascending(a.key, b.key); })
            .map(function(d) { return d.key; }))
            .copy();

        svg.selectAll(".bar")
            .sort(function(a, b) { return x0(a.key) - x0(b.key); });

        var transition = svg.transition().duration(750),
            delay = function(d, i) { return i * 50; };

        transition.selectAll(".bar")
            .delay(delay)
            .attr("x", function(d) { return x0(d.key) });

        transition.select(".x.axis")
            .call(xAxis)
          .selectAll("g")
            .delay(delay);
      }


      svg.selectAll(".bar")
        .on('mouseover.highlight', function(){
              d3.select(this)
              .transition()
              .style("fill", colors.darkpurple)
              .style("fill-opacity", function(d) {return (d.value)/maxval});
        })
        .on('mouseout.highlight', function(){
              d3.select(this)
              .transition()
              .delay(500) 
              .duration(2000)
              .style("fill", colors.black)
              .style("fill-opacity", 1);
        })
        .on('click.bars', function(){
              d3.select(this)
              .transition()
              .style("fill", colors.redorange)
              .style("fill-opacity", 1);
        })
        .on('mouseover.tip', tip.show)
        .on('mouseout.tip', tip.hide)
        ;
  


    // d3.selectAll(".chart")
    //   .on('mouseover.show', function(){
    //       d3.select(this)
    //       .transition()
    //       .style("fill", colors.white)
    //   })
    //   .on('mouseout.show', function(){
    //       d3.select(this)
    //       .transition()
    //       .style("fill", colors.white)
    //   })




