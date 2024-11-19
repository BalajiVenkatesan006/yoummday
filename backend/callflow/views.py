from django.shortcuts import render
from rest_framework import viewsets
# Importing necessary modules from Django and DRF (Django Rest Framework).
# `render` is commonly used for rendering templates, but it's unused here as this is an API view.
# `viewsets` allows for creating views that implement CRUD operations with minimal boilerplate.

from .models import CallFlowConfig
# Importing the `CallFlowConfig` model from the current app's `models.py` file.

from rest_framework import serializers
# Importing serializers to handle the conversion between complex data types (e.g., model instances)
# and primitive data types (e.g., JSON), which are used in API responses.

class CallFlowConfigSerializer(serializers.ModelSerializer):
    """
    Serializer class for the `CallFlowConfig` model.
    It defines how the model's fields should be converted to JSON and vice versa.
    """
    class Meta:
        model = CallFlowConfig  # Specifies the model to serialize.
        fields = ['id', 'created_at', 'modified_at', 'flow_data', 'name']
        # Lists the fields to include in the serialized output.
        # These fields will be visible in API responses.

class CallFlowConfigViewSet(viewsets.ModelViewSet):
    """
    A viewset for the `CallFlowConfig` model.
    This viewset provides CRUD functionality and is tightly integrated with the serializer.
    """
    queryset = CallFlowConfig.objects.all()
    # Defines the queryset that this viewset will operate on, which includes all `CallFlowConfig` records.

    serializer_class = CallFlowConfigSerializer
    # Specifies the serializer class that defines how data is serialized and deserialized.

    filterset_fields = ["name"]
    # Adds filtering capability by the "name" field.
    # For example, clients can filter data using queries like `?name=<value>`.