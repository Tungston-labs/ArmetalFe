def generate_payslip_pdf(data):
    from io import BytesIO
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors

    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4)
    elements = []
    styles = getSampleStyleSheet()

    elements.append(Paragraph(f"<b>Payslip for {data['employee_name']}</b>", styles["Title"]))
    elements.append(Paragraph(f"Month: {data['month']} / {data['year']}", styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Employee details
    emp_table = [
        ["Employee ID", data["employee_id"]],
        ["Department", data["department"]],
        ["Designation", data["designation"]],
        ["Email", data["email"]],
    ]
    elements.append(Table(emp_table))
    elements.append(Spacer(1, 12))

    # Earnings
    earnings_table = [["Earnings", "Amount (₹)"]]
    for e in data["earnings"]:
        earnings_table.append([e["label"], f"{e['amount']:.2f}"])
    earnings_table.append(["Gross Earnings", f"{data['gross_earnings']:.2f}"])
    elements.append(Table(earnings_table))
    elements.append(Spacer(1, 12))

    # Deductions
    deductions_table = [["Deductions", "Amount (₹)"]]
    for d in data["deductions"]:
        deductions_table.append([d["label"], f"{d['value']:.2f}"])
    deductions_table.append(["Total Deductions", f"{data['total_deductions']:.2f}"])
    elements.append(Table(deductions_table))
    elements.append(Spacer(1, 12))

    # Summary
    summary_table = [
        ["Working Days", data["working_days"]],
        ["Days Present", data["days_present"]],
        ["LOP Days", data["lop_days"]],
        ["LOP Amount", f"{data['lop_amount']:.2f}"],
        ["Net Pay", f"{data['net_pay']:.2f}"],
    ]
    elements.append(Table(summary_table))

    doc.build(elements)
    pdf = buffer.getvalue()
    buffer.close()
    return pdf
