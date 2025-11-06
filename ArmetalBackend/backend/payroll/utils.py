def generate_payslip_pdf(data):
    from io import BytesIO
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas

    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)

    c.setFont("Helvetica-Bold", 14)
    c.drawString(200, 800, f"Payslip - {data['month']}/{data['year']}")

    c.setFont("Helvetica", 11)
    c.drawString(50, 770, f"Employee Name: {data['employee_name']}")
    c.drawString(50, 755, f"Employee ID: {data['employee_id']}")
    c.drawString(50, 740, f"Department: {data['department']}")
    c.drawString(50, 725, f"Designation: {data['designation']}")
    c.drawString(50, 710, f"Email: {data['email']}")

    y = 680
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Earnings:")
    c.setFont("Helvetica", 11)
    for e in data.get("earnings", []):
        y -= 15
        c.drawString(70, y, f"{e['label']}: ₹{e['amount']}")

    y -= 30
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Deductions:")
    c.setFont("Helvetica", 11)
    for d in data.get("deductions", []):
        y -= 15
        c.drawString(70, y, f"{d['label']}: ₹{d['value']}")

    y -= 40
    c.setFont("Helvetica", 11)
    c.drawString(50, y, f"Working Days: {data['working_days']}")
    y -= 15
    c.drawString(50, y, f"Days Present: {data['days_present']}")
    y -= 15
    c.drawString(50, y, f"LOP Days: {data['lop_days']}")
    y -= 15
    c.drawString(50, y, f"Unswiped Days: {data['unswiped_days']}")
    y -= 15
    c.drawString(50, y, f"Gross Earnings: ₹{data['gross_earnings']}")
    y -= 15
    c.drawString(50, y, f"Total Deductions: ₹{data['total_deductions']}")
    y -= 20
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, f"Net Pay: ₹{data['net_pay']}")

    c.showPage()
    c.save()
    pdf = buffer.getvalue()
    buffer.close()
    return pdf
