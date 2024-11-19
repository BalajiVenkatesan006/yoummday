from django.shortcuts import render
from rest_framework import viewsets
# Create your views here.
from .models import CallFlowConfig
from rest_framework import serializers
from .models import CallFlowConfig

class CallFlowConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = CallFlowConfig
        fields = ['id',
                  'created_at', 'modified_at','flow_data','name']
        
        
class CallFlowConfigViewSet(viewsets.ModelViewSet):
    queryset = CallFlowConfig.objects.all()
    serializer_class = CallFlowConfigSerializer
    filterset_fields = ["name"]
