# -*- coding: utf-8 -*-
# Copyright (c) 2015, indictrans and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document
from frappe.model.naming import make_autoname
from datetime import datetime, timedelta

class FixedAssetSerialNumber(Document):
	def autoname(self):
		if self.fixed_asset_serial_number:	
			self.name = make_autoname(self.fixed_asset_serial_number+'.###')
		else:
			self.name = make_autoname('Asset'+'.###')

@frappe.whitelist()
def make_new_asset(doc, method):
	if doc.purpose == "Material Receipt":
		for i, ele in enumerate (doc.items):
			item  = frappe.get_doc("Item", ele.item_code)
			if item.fixed_asset_serial_number and item.is_asset_item:
				for qty in range(int(ele.qty)):
					asset_doc = frappe.new_doc("Fixed Asset Serial Number")
					asset_doc.item_code = item.item_code
					asset_doc.fixed_asset_serial_number = item.fixed_asset_serial_number
					asset_doc.save(ignore_permissions=True)

@frappe.whitelist()
def new_fixed_asset(doc, method):
	if doc.items:
		for i, ele in enumerate (doc.items):
			item  = frappe.get_doc("Item", ele.item_code)
			if item.fixed_asset_serial_number and item.is_asset_item:
				for qty in range(int(ele.qty)):
					asset_doc = frappe.new_doc("Fixed Asset Serial Number")
					asset_doc.item_code = item.item_code
					asset_doc.fixed_asset_serial_number = item.fixed_asset_serial_number
					asset_doc.save(ignore_permissions=True)

@frappe.whitelist()
def material_reject_mail(doc_name, owner):
	frappe.reload_doctype("Comment")
	comment_data = frappe.db.sql("""select comment_by_fullname, comment from `tabComment` where comment_docname = %s""",doc_name, as_dict=1)
	subject = "Material Request Detils"
	message = """<p>Hello ,</p><p>Material Request No : %s </p><p>Details given below :</p>"""%(doc_name)
	for i in range(len(comment_data)):		
		message_row = """<p> %s : %s, </p>"""%(comment_data[i]['comment_by_fullname'], comment_data[i]['comment'])
		message = message + message_row   
	frappe.sendmail(recipients=owner, subject=subject, message =message)
	
	return frappe.session.user

@frappe.whitelist()
def material_request_mail(doc_name, owner):

	subject = "Material Request"
	message = """<p>Hello ,</p><p>Material Request  : %s </p>
	<p>owner : %s </p>
	<p>Send for Approval By : %s </p>"""%(doc_name, owner, frappe.session.user)

	purchase_manager = frappe.db.sql("""select t1.email from `tabUser` t1 join `tabUserRole` t2  on t2.parent = t1.name and t2.role = 'Purchase Manager';""", as_list=1)
	for manager in purchase_manager:
		print manager[0]
		frappe.sendmail(recipients=manager[0], subject=subject, message =message)	


@frappe.whitelist()
def trufil_id(doc, method):
	if not doc.trufil_id:	
		doc.trufil_id = make_autoname('.####')
	else:
		doc.trufil_id = doc.trufil_id