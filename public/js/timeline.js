      function drawChart(touchpoint_array, chartDivId, chartTitleDivId ) {
	    var chart = new google.visualization.PieChart(document.getElementById(chartDivId));
	  	var total_touchpoints = 0;
	  	
		// setup the new map and its variables
        var map = new google.visualization.DataTable();
			map.addRows(touchpoint_array.length);  // length gives us the number of results in our returned data
            map.addColumn('string', 'Touchpoint Type');
            map.addColumn('number', 'Number of touchpoints');
 
		 // now we need to build the map data, loop over each result
		 $.each(touchpoint_array, function(i,v) {
			 // set the values for both the name and the population
			 if(typeof v != 'undefined'){

				 map.setValue(i, 0, v.desc);
				 map.setValue(i, 1, v.number);
				 total_touchpoints += parseInt(v.number);
			 }
			 
		 });

        var options = {
          pieHole: 0.4,
          pieSliceText: "none",
          width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0) /6,
          height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) /7
        };

        chart.draw(map, options);
        $("#"+chartTitleDivId).text(total_touchpoints);
      }
      
      function drawCanvas(canvasId, height, width,imageIndicator){
	      var canvas = document.getElementById(canvasId);
	      canvas.height = height;
	      canvas.width = width;
	
	      var context = canvas.getContext('2d');
	      var canvasColor = getColor(color_counter++);
	      
	      var x = canvas.width / 2 ;
	      var y = canvas.height / 1.37;
	      var radius = canvas.height / 4.42;
	      var y_increment = canvas.height / 12;
	      var startAngle = 0;
	      var endAngle = 360;
	      var counterClockwise = false;
	
	      context.beginPath();
	      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	      context.lineWidth = canvas.height / 11.4;
	
	      context.strokeStyle = canvasColor;
	      context.stroke();
	      
	      if('FIRST' === imageIndicator){
	
			for(i=1; i<4 ; i++){
			  context.beginPath();
			  context.moveTo(x,0+ y_increment*(i-1) + (y_increment / ( (i * 10) / 3)));
			  context.lineTo(x,y_increment*i);
			  context.stroke();
			}
			
	          context.beginPath();
		      context.moveTo(x, y_increment*(3) + (y_increment/8));
		      context.lineTo(x,canvas.height/2);
		      context.stroke();
	      }else{
		      context.beginPath();
		      context.moveTo(x,0);
		      context.lineTo(x,canvas.height/2);
		      context.stroke();
		  }
		  
	      context.beginPath();
	      radius = canvas.height / 80;
	      context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
	      context.lineWidth = canvas.height / 40;
	      context.stroke();
	
	      context.beginPath();
	
	      if('LEFT' === imageIndicator){
	      	  context.moveTo(x,y);
		      context.lineTo(0,y);
	      }
	      else if('RIGHT' === imageIndicator){
	      	  context.moveTo(x,y);
	    	  context.lineTo(canvas.width,y);
	      }
	      else if('FIRST' === imageIndicator){
	      	  context.moveTo(0,y);
	    	  context.lineTo(canvas.width,y);
	      }
	      
	      context.stroke();
	  };

	function getColor(index){
		var colors = [
            "blue",
            "blueviolet",
            "brown",
            "burlywood",
            "cadetblue",
            "chartreuse",
            "chocolate",
            "coral",
            "cornflowerblue",
            "cornsilk",
            "crimson",
            "cyan",
            "darkblue",
            "darkcyan",
            "darkgoldenrod",
            "darkgray",
            "darkgreen",
            "darkkhaki",
            "darkmagenta",
            "darkolivegreen",
            "darkorange",
            "darkorchid",
            "darkred",
            "darksalmon",
            "darkseagreen",
            "darkslateblue",
            "darkslategray",
            "darkturquoise",
            "darkviolet",
            "deeppink",
            "deepskyblue",
            "dimgray",
            "dodgerblue",
            "firebrick",
            "floralwhite",
            "forestgreen",
            "fuchsia",
            "gainsboro",
            "ghostwhite",
            "gold",
            "goldenrod",
            "gray",
            "green",
            "greenyellow",
            "honeydew",
            "hotpink",
            "indianred",
            "indigo",
            "ivory",
            "khaki",
            "lavender",
            "lavenderblush",
            "lawngreen",
            "lemonchiffon",
            "lightblue",
            "lightcoral",
            "lightcyan",
            "lightgoldenrodyellow",
            "lightgray",            // IE6 breaks on this color
            "lightgreen",
            "lightpink",
            "lightsalmon",
            "lightseagreen",
            "lightskyblue",
            "lightslategray",
            "lightsteelblue",
            "lightyellow",
            "lime",
            "limegreen",
            "linen",
            "magenta",
            "maroon",
            "mediumaquamarine",
            "mediumblue",
            "mediumorchid",
            "mediumpurple",
            "mediumseagreen",
            "mediumslateblue",
            "mediumspringgreen",
            "mediumturquoise",
            "mediumvioletred",
            "midnightblue",
            "mintcream",
            "mistyrose",
            "moccasin",
            "navajowhite",
            "navy",
            "oldlace",
            "olive",
            "olivedrab",
            "orange",
            "orangered",
            "orchid",
            "palegoldenrod",
            "palegreen",
            "paleturquoise",
            "palevioletred",
            "papayawhip",
            "peachpuff",
            "peru",
            "pink",
            "plum",
            "powderblue",
            "purple",
            "red",
            "rosybrown",
            "royalblue",
            "saddlebrown",
            "salmon",
            "sandybrown",
            "seagreen",
            "seashell",
            "sienna",
            "silver",
            "skyblue",
            "slateblue",
            "slategray",
            "snow",
            "springgreen",
            "steelblue",
            "tan",
            "teal",
            "thistle",
            "tomato",
            "turquoise",
            "violet",
            "wheat",
            "white",
            "whitesmoke",
            "yellow",
            "yellowgreen"
        ];
        
        return colors[index];
	};