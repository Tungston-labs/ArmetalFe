from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle
from reportlab.lib import colors

def generate_payslip_pdf(employee, record):
    buffer = BytesIO()
    c = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 40

    # Header
    c.setFont("Helvetica-Bold", 14)
    c.drawString(200, y, f"Payslip - {record.month}/{record.year}")
    y -= 30

    c.setFont("Helvetica", 11)
    c.drawString(40, y, f"Employee Name: {employee.name}")
    c.drawString(300, y, f"Employee ID: {employee.employee_id}")
    y -= 20
    c.drawString(40, y, f"Designation: {employee.designation}")
    c.drawString(300, y, f"Department: {getattr(employee, 'department', 'N/A')}")
    y -= 40

    # Calculations
    gross = (record.basic_salary or 0) + (record.salary_increment or 0) + (record.housing_allowance or 0) + (record.transportation or 0)
    deductions = record.tds_deduction_amount or 0
    net = gross - deductions

    # Summary Table
    summary_data = [
        ["Label", "Amount"],
        ["Basic Salary", str(record.basic_salary)],
        ["Salary Increment", str(record.salary_increment or 0)],
        ["Housing Allowance", str(record.housing_allowance)],
        ["Transportation", str(record.transportation)],
        ["Gross Earnings", str(gross)],
        ["Total Deductions", str(deductions)],
        ["Net Pay", str(net)],
        ["Payment Mode", record.payment_mode or "N/A"],
        ["Account Number", f"****{str(record.account_number)[-4:]}" if record.account_number else "XXXX"],
    ]

    summary_table = Table(summary_data, colWidths=[220, 200])
    summary_table.setStyle(TableStyle([
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('BACKGROUND', (0, 0), (-1, 0), colors.lightgrey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (1, 1), (-1, -1), 'RIGHT'),
    ]))
    summary_table.wrapOn(c, width, height)
    summary_table.drawOn(c, 40, y - 260)

    # Footer note
    c.setFont("Helvetica-Bold", 10)
    c.drawString(40, 60, "Note: This is a computer-generated payslip and does not require a signature.")

    c.showPage()
    c.save()
    buffer.seek(0)
    return buffer.getvalue()
