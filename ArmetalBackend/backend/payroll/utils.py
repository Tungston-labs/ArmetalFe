# def generate_payslip_pdf(data):
#     from io import BytesIO
#     from reportlab.lib.pagesizes import A4
#     from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
#     from reportlab.lib.styles import getSampleStyleSheet
#     from reportlab.lib import colors


#     from reportlab.platypus import (
#     SimpleDocTemplate,
#     Paragraph,
#     Spacer,
#     Table,
#     TableStyle,
#     Image,
# )
#     from reportlab.lib.units import inch
#     from reportlab.lib.enums import TA_CENTER
#     from reportlab.lib.styles import ParagraphStyle
#     from io import BytesIO
#     import requests
        

#     buffer = BytesIO()
#     doc = SimpleDocTemplate(
#     buffer,
#     pagesize=A4,
#     leftMargin=20,
#     rightMargin=20,
#     topMargin=20,
#     bottomMargin=20,
# )
#     elements = []
#     styles = getSampleStyleSheet()

#     elements.append(Paragraph(f"<b>Payslip for {data['employee_name']}</b>", styles["Title"]))
#     elements.append(Paragraph(f"Month: {data['month']} / {data['year']}", styles["Normal"]))
#     elements.append(Spacer(1, 12))
#     company = data["company"]

#     logo = ""

#     if company.get("logo_url"):
#         try:
#             response = requests.get(company["logo_url"])

#             if response.status_code == 200:
#                 logo = Image(BytesIO(response.content))
#                 logo.drawWidth = 70
#                 logo.drawHeight = 70
#         except:
#             logo = ""

#         company_info = Paragraph(
#         f"""
#         <font size="18"><b>{company['name']}</b></font><br/>
#         {company['address']}<br/>
#         {company['email']}<br/>
#         {company['contact_number']}
#         """,
#         styles["Normal"],
#     )

#     header = Table(
#         [[company_info, logo]],
#         colWidths=[430,80]
#     )
#     header.setStyle(TableStyle([
#     ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#16213E")),
#     ("TEXTCOLOR",(0,0),(-1,-1),colors.white),
#     ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
#     ("BOTTOMPADDING",(0,0),(-1,-1),12),
#     ("TOPPADDING",(0,0),(-1,-1),12),
# ]))

#     # Employee details
#     emp_table = [
#         ["Employee ID", data["employee_id"]],
#         ["Department", data["department"]],
#         ["Designation", data["designation"]],
#         ["Email", data["email"]],
#     ]
#     elements.append(header)
#     elements.append(Spacer(1,20))
#     elements.append(Table(emp_table))
#     elements.append(Spacer(1, 12))

#     # Earnings
#     earnings_table = [["Earnings", "Amount ()"]]
#     for e in data["earnings"]:
#         earnings_table.append([e["label"], f"{e['amount']:.2f}"])
#     earnings_table.append(["Gross Earnings", f"{data['gross_earnings']:.2f}"])
#     elements.append(Table(earnings_table))
#     elements.append(Spacer(1, 12))

#     # Deductions
#     deductions_table = [["Deductions", "Amount ()"]]
#     for d in data["deductions"]:
#         deductions_table.append([d["label"], f"{d['value']:.2f}"])
#     deductions_table.append(["Total Deductions", f"{data['total_deductions']:.2f}"])
#     elements.append(Table(deductions_table))
#     elements.append(Spacer(1, 12))

#     # Summary
#     summary_table = [
#         ["Working Days", data["working_days"]],
#         ["Days Present", data["days_present"]],
#         ["LOP Days", data["lop_days"]],
#         ["LOP Amount", f"{data['lop_amount']:.2f}"],
#         ["Net Pay", f"{data['net_pay']:.2f}"],
#     ]
#     elements.append(Table(summary_table))

#     doc.build(elements)
#     pdf = buffer.getvalue()
#     buffer.close()
#     return pdf


from io import BytesIO
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

try:
    from reportlab.platypus import Image
except ImportError:
    Image = None

import os
import tempfile
import urllib.request


def generate_payslip_pdf(data):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=25,
        leftMargin=25,
        topMargin=25,
        bottomMargin=25,
    )

    styles = getSampleStyleSheet()
    title = styles["Heading1"]
    title.alignment = TA_CENTER
    normal = styles["BodyText"]

    elements = []

    company = data.get("company", {})

    # Logo
    logo = None
    if Image and company.get("logo_url"):
        try:
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".png")
            urllib.request.urlretrieve(company["logo_url"], tmp.name)
            logo = Image(tmp.name, width=60, height=60)
        except Exception:
            logo = None

    company_text = Paragraph(
        f"<b>{company.get('name','Company')}</b><br/>"
        f"{company.get('address','')}<br/>"
        f"{company.get('email','')}<br/>"
        f"{company.get('contact_number','')}",
        normal,
    )

    if logo:
        header = Table([[company_text, logo]], colWidths=[420,80])
    else:
        header = Table([[company_text]])

    header.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#13213A")),
        ("TEXTCOLOR",(0,0),(-1,-1),colors.white),
        ("BOX",(0,0),(-1,-1),1,colors.HexColor("#13213A")),
        ("BOTTOMPADDING",(0,0),(-1,-1),12),
        ("TOPPADDING",(0,0),(-1,-1),12),
    ]))

    elements.append(header)
    elements.append(Spacer(1,20))
    elements.append(Paragraph(
        f"Payslip - {data['month']} {data['year']}",
        title
    ))
    elements.append(Spacer(1,15))

    emp = Table([
        ["Employee Name",data["employee_name"],
         "Employee ID",data["employee_id"]],
        ["Department",data["department"],
         "Designation",data["designation"]],
        ["Email",data["email"],
         "Joining Date",str(data.get("joining_date","-"))],
    ], colWidths=[110,170,110,170])

    emp.setStyle(TableStyle([
        ("GRID",(0,0),(-1,-1),0.4,colors.grey),
        ("BACKGROUND",(0,0),(-1,-1),colors.whitesmoke),
        ("BOTTOMPADDING",(0,0),(-1,-1),8),
    ]))
    elements.append(emp)
    elements.append(Spacer(1,15))

    earnings=[["Earnings","Amount"]]
    for e in data["earnings"]:
        earnings.append([e["label"],f"{e['amount']:.2f}"])
    earnings.append(["Gross Earnings",f"{data['gross_earnings']:.2f}"])

    deductions=[["Deductions","Amount"]]
    for d in data["deductions"]:
        deductions.append([d["label"],f"{d['value']:.2f}"])
    deductions.append(["Total Deductions",f"{data['total_deductions']:.2f}"])

    et=Table(earnings)
    dt=Table(deductions)

    for t in (et,dt):
        t.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#13213A")),
            ("TEXTCOLOR",(0,0),(-1,0),colors.white),
            ("GRID",(0,0),(-1,-1),0.3,colors.grey),
            ("BOTTOMPADDING",(0,0),(-1,-1),7),
        ]))

    elements.append(Table([[et,dt]],colWidths=[260,260]))
    elements.append(Spacer(1,20))

    summary=Table([
        ["Working Days",data["working_days"]],
        ["Days Present",data["days_present"]],
        ["LOP Days",data["lop_days"]],
        ["LOP Amount",f"{data['lop_amount']:.2f}"],
        ["Net Pay",f"{data['net_pay']:.2f}"],
    ])

    summary.setStyle(TableStyle([
        ("BACKGROUND",(0,4),(-1,4),colors.HexColor("#13213A")),
        ("TEXTCOLOR",(0,4),(-1,4),colors.white),
        ("GRID",(0,0),(-1,-1),0.3,colors.grey),
    ]))

    elements.append(summary)
    elements.append(Spacer(1,20))
    elements.append(Paragraph(
        "<font size=9 color='grey'>This is a computer generated payslip.</font>",
        normal
    ))

    doc.build(elements)

    if logo:
        try:
            os.unlink(tmp.name)
        except Exception:
            pass

    pdf=buffer.getvalue()
    buffer.close()
    return pdf
