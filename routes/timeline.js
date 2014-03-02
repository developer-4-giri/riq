var swig = require('swig');

exports.drawtimeline = function(req, res){
	
		swig.setFilter('isObject', function(element) {
		  return typeof element == "string";
		});

	  res.render("timeline.html", { page_title: 'Client Timeline - TimelineIQ' , 
		  							client_summary: { 
		  								client_details: { client_name: "Joe Smith", client_type: "Client (Individual)", introduced_on: "10-Sept-2012", client_since: "10-Dec-2012" }, 
		  								acquisition: { time_to_acquire: "90 days", acruired_through: "Mr Allreferral (Referral)", record_owner: "Jonny HardWorking" }, 
		  								services:{ services_bought: "Private Banking, OurProd_1, DMAT"}, 
		  								revenue: { cust_life_value: "$500,000", revenue_contr: "3%" }, 
		  								touchpoint_stats: {touchpoint_1:{ "touchpoint_desc": "Email", "no_of_touchpoints": 20 }, touchpoint_2:{ "touchpoint_desc": "Tasks", "no_of_touchpoints": 10 }}, 
		  								event_stats: { event_1:{ "event_id": 1, "event_date": "10-Sep-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" }, event_2:{ "event_id": 2, "event_date": "20-Sept-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" },event_3:{ "event_id": 1, "event_date": "10-Sep-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" }, event_4:{ "event_id": 2, "event_date": "20-Sept-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" },event_5:{ "event_id": 1, "event_date": "10-Sep-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" }, event_6:{ "event_id": 2, "event_date": "20-Sept-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" },event_7:{ "event_id": 1, "event_date": "10-Sep-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" }, event_8:{ "event_id": 2, "event_date": "20-Sept-2012", "event_type": "First introduction", "event_details": "Some details about this event _ its detailed", "event_summary": "One liner about the event. Consider this a header of the detail" }}
		  							}
	  							  });
};