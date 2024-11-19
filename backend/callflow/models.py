from django.db import models
import uuid
from django.utils.timezone import now


# Create your models here.
class CallFlowConfig(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200,unique=True,default="widthCalibration")
    flow_data = models.JSONField(default=dict)
    created_at = models.DateTimeField(editable=False, default=now)
    modified_at = models.DateTimeField(default=now)
    