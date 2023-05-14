from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from . models import *
from . serializer import *

# Create your views here.
class UserView(APIView):
	def get(self, request):
		output = [{"guid": output.guid, "username": output.username, "portfolio": output.portfolio, "created": output.created}
			for output in User.objects.all]
		return Response(output)

	def post(self, request):
		serializer = UserSerializer(data=request.data)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data)
