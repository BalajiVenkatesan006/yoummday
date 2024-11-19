from rest_framework.routers import DefaultRouter
from django.urls import path,include
from .views import CallFlowConfigViewSet


router = DefaultRouter();
router.register('callflow/configs',CallFlowConfigViewSet,basename='callflowviewset')


urlpatterns = [
    path('api/',include(router.urls)),
]