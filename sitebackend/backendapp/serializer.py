from rest_framework import serializers
from . models import *

class UserSerializer(serializer.ModelSerializer):
	class Meta:
		model = User
		fields = [guid, username, portfolio, created] 