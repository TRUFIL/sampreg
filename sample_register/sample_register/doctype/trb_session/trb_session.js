// Copyright (c) 2016, indictrans and contributors
// For license information, please see license.txt
frappe.provide("sample_register.sample_register");
cur_frm.fields_dict.lab_equipment_details.grid.get_field("item_code").get_query = function(doc,cdt,cdn) {
	var d  = locals[cdt][cdn];
		return {
			filters: {
                       "is_asset_item": 1
               }
		}
}
cur_frm.fields_dict.lab_equipment_details.grid.get_field("fixed_asset_serial_number").get_query = function(doc,cdt,cdn) {
	var d  = locals[cdt][cdn];
	if(d.item_code){
		return {
			filters: [
                       ['Fixed Asset Serial Number','item_code','=',d.item_code],
                       ['Fixed Asset Serial Number','calibration_status','!=','Due for calibration']
               ]
		}
	}
}
cur_frm.cscript.trb_session_details_on_form_rendered = function(doc, cdt, cdn){   
    cur_frm.get_field("trb_session_details").grid.docfields[7].hidden = true;
	cur_frm.get_field("trb_session_details").grid.docfields[8].hidden = true;
	cur_frm.get_field("trb_session_details").grid.docfields[10].hidden = true;
	cur_frm.get_field("trb_session_details").grid.docfields[11].hidden = true;
 
}
frappe.ui.form.on("TRB Session", {
	onload: function(frm) {
		cur_frm.set_value("test_type","Select")
	},
	refresh: function(frm) {
		frm.disable_save();
	},
	test_type: function(frm) {
		return frappe.call({
			method: "get_details",
			doc: frm.doc,
			callback: function(r, rt) {
				frm.refresh()
			}
		});
	},
	get_batch_entries: function(frm) {
		return frappe.call({
			method: "get_batch_entries",
			doc: frm.doc,
			callback: function(r, rt) {

				frm.refresh()

			}
		});
	},
	get_entry_for_run_two: function(frm) {
		return frappe.call({
			method: "get_entry_for_run_two",
			doc: frm.doc,
			callback: function(r, rt) {

				frm.refresh()

			}
		});
	},
	update_sample_entry: function(frm){
		return frappe.call({
			method: "update_sample_entry",
			doc: frm.doc,
			callback: function(r, rt){
				frm.refresh()
			}
		})
	},
	start_session: function(frm) {
		if(frm.doc.lab_equipment_details.length < 1){
			frappe.throw("Please select Lab Equipment");
		}
		var d = new frappe.prompt([
		    {'fieldname': 'test', 'fieldtype': 'HTML', 'label': 'test', 'reqd': 0},
			],
			function(values){
			    var c = d.get_values();
				var me = this;
		        var test_list = [];
				$(".frappe-control input:checkbox:checked").each ( function() {
					test_list.push($(this).attr("name"));
				});
			console.log("test_list",test_list);
		    frappe.call({
					method: "start_session",
					doc: frm.doc,
					 args: {
					 	"test_list":test_list,
					 },	
					callback: function(r) {

					}
			});
		},
		'Select Test to Create TRB Session',
		'Submit'
		);

		frappe.call({
			method: "get_details_from_child_table",
			doc: frm.doc,
			callback: function(r){
				if(r.message.get_items){   

				console.log("get itemsssss",r.message.get_items) 
					$('.frappe-control input:checkbox').removeAttr('checked');

				    html=""
				    html += "<div class='testCont'  style='max-height: 350px;overflow: auto;overflow-x: hidden;min-height:150px'>"
				    for (var i = 0; i<r.message.get_items.length; i=i+1) {
				    	html += "<label style='font-weight: normal;'><input type='checkbox' class='select' id='_select' name='"
				    	+r.message.get_items[i][0]
				    	+"' value='"+r.message.get_items[i][0]+"'> "
				    	+ r.message.get_items[i][1] +" ("
				    	+ r.message.get_items[i][2] +")"
						r.message.get_items[i][3] ? html += " ("
						+ r.message.get_items[i][3] +")":""
						r.message.get_items[i][4] ? html += " ("
						+ r.message.get_items[i][4] +")":""
				    	html += "</label><br>"
				    }
				   	html += '</div>'	
                  	var wrapper = d.fields_dict.test.$wrapper;
                  	wrapper.empty();
					wrapper.html(html);
				}
			}
		});
	},
	start_run_two: function(frm) {
		var d = new frappe.prompt([
		    {'fieldname': 'test', 'fieldtype': 'HTML', 'label': 'test', 'reqd': 0},
			],
			function(values){
			    var c = d.get_values();
				var me = this;
		        var test_list = [];
				$(".frappe-control input:checkbox:checked").each ( function() {
					test_list.push($(this).attr("name"));
				});
			console.log("test_list",test_list);
		    frappe.call({
					method: "start_run_two",
					doc: frm.doc,
					 args: {
					 	"test_list":test_list,
					 },	
					callback: function(r) {

					}
			});
		},
		'Select Test to Create TRB Session',
		'Submit'
		);

		frappe.call({
			method: "get_details_from_child_table",
			doc: frm.doc,
			callback: function(r){
				if(r.message.get_items){   

				console.log("get itemsssss",r.message.get_items) 
					$('.frappe-control input:checkbox').removeAttr('checked');

				    html=""
				    html += "<div class='testCont'  style='max-height: 350px;overflow: auto;overflow-x: hidden;min-height:150px'>"
				    for (var i = 0; i<r.message.get_items.length; i=i+1) {
				    	html += "<label style='font-weight: normal;'><input type='checkbox' class='select' id='_select' name='"
				    	+r.message.get_items[i][0]
				    	+"' value='"+r.message.get_items[i][0]+"'> "
				    	+ r.message.get_items[i][1] +" ("
				    	+ r.message.get_items[i][2] +")"
						r.message.get_items[i][3] ? html += " ("
						+ r.message.get_items[i][3] +")":""
				    	html += "</label><br>"
				    }
				   	html += '</div>'	
                  	var wrapper = d.fields_dict.test.$wrapper;
                  	wrapper.empty();
					wrapper.html(html);
				}
			}
		});
	},
});

sample_register.sample_register.TRBSession = frappe.ui.form.Controller.extend({
	onload: function() {
		this.setup_queries();
	},
	setup_queries: function(){
		var me = this;
		me.frm.set_query("test_type", "trb_session_details", function(doc, cdt, cdn) {
				return {
					filters: {"name": ["in", ["Dissolved Gas Analysis",
												"Water Content Test",
												"Neutralisation Value Test",
												"Flash point by Penskey Martin",
												"Interfacial Tension Test",
												"Furan Content"]]}
				}
		});
	}
});

cur_frm.script_manager.make(sample_register.sample_register.TRBSession);
