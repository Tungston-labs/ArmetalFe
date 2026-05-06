# utils/exception_handler.py

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

from django.db import IntegrityError
from django.core.exceptions import ValidationError

import traceback


def custom_exception_handler(exc, context):

    # Keep default DRF response structure
    response = exception_handler(exc, context)

    if response is not None:
        return response

    # =====================================================
    # DATABASE ERRORS
    # =====================================================

    if isinstance(exc, IntegrityError):

        error_message = str(exc)

        if "email" in error_message.lower():
            message = {
                "email": ["Email already exists."]
            }

        elif "employee_id" in error_message.lower():
            message = {
                "employee_id": ["Employee ID already exists."]
            }

        else:
            message = {
                "detail": "Database integrity error."
            }

        return Response(
            message,
            status=status.HTTP_400_BAD_REQUEST
        )

    # =====================================================
    # DJANGO VALIDATION
    # =====================================================

    if isinstance(exc, ValidationError):

        return Response(
            {
                "detail": str(exc)
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # =====================================================
    # UNKNOWN ERRORS
    # =====================================================

    print("❌ SERVER ERROR")
    traceback.print_exc()

    return Response(
        {
            "detail": "Something went wrong."
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )