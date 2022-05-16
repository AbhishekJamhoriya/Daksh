from .serializers import PostSerializer, StatusSerializer,RoleSerializer
from .models import User
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes

@permission_classes((AllowAny, ))
class username(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        serializer = StatusSerializer(request.user)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        print(request.data)
        if(request.data["username"]):
            username = request.data["username"]
            user = User.objects.filter(username=username)[0]
            user.is_root = request.data["is_root"]
            user.is_admin = request.data["is_admin"]
            user.is_manager = request.data["is_manager"]
            user.is_approved = request.data["is_approved"]
            user.is_staff = request.data["is_staff"]
            user.parent_name = request.data["parent_name"]
            user.save()

            return Response("user status changed", status=status.HTTP_201_CREATED)
        else:
            return Response("send valid data", status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class userview(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = PostSerializer(users, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):

        posts_serializer = PostSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()
            print("hello loli",posts_serializer.data)
            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class addparent(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        username = self.kwargs['username']
        users = User.objects.filter(username=username)

        serializer = StatusSerializer(users, many=True)

        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        posts_serializer = PostSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()

            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class userstatus(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        users = User.objects.all()
        serializer = PostSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        posts_serializer = PostSerializer(data=request.data)
        if posts_serializer.is_valid():
            posts_serializer.save()

            return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', posts_serializer.errors)
            return Response(posts_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@permission_classes((AllowAny, ))
class userapproval(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def get(self, request, *args, **kwargs):
        users = User.objects.filter(is_staff=True, is_approved=False)
        serializer = StatusSerializer(users, many=True)
        return Response(serializer.data)


@permission_classes((AllowAny, ))
class userapprove(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        data = request.data["key"]
        test = 0
        username = self.kwargs['username']
        user = User.objects.filter(username=username)[0]
        if user.is_approved == False:
            if data == "False":
                user.delete()
                test = 1
            else:
                user.is_approved = True
                user.save()
                test = 1

        if test == 1:
            return Response("change is done")
        else:
            print('error on userapprove')
            return Response("error as the mentioned user not found")


@permission_classes((AllowAny, ))
class UserRoleUpdateView(APIView):
    serializer_class = RoleSerializer
    def post(self, request,format=None):
        
        serializer = self.serializer_class(data = request.data)
        print("this is data", request.data)
        
        if serializer.is_valid():
            print("this is data", request.data)
            username = serializer.data.get('username')
            print("username", username)
            is_admin = serializer.data.get('is_admin')
            is_manager = serializer.data.get('is_manager')
            is_staff = serializer.data.get('is_staff')
            queryset = User.objects.filter(username=username)
            print("query",queryset)
            if queryset.exists():
                user = queryset[0]
                user.is_admin = is_admin
                user.is_manager = is_manager
                user.is_staff = is_staff
                user.save(update_fields=['is_admin','is_manager','is_staff'])
                return Response({},status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({'bad request':'user note found'},status=status.HTTP_400_BAD_REQUEST)
        return Response({"no content":"invalid req"},status=status.HTTP_404_NOT_FOUND)

@permission_classes((AllowAny, ))
class GetUserView(APIView):
    serializer_class = PostSerializer
    def get(self, request, form=None):
        users = User.objects.all()
        arr=[]
        for i in range(len(users)):
            user_dict={'name':None,'email':None}
            data = PostSerializer(users[i]).data
            user_dict['name'] = data['username']
            user_dict['email'] = data['email']
            arr.append(user_dict)
        

        return Response({"list":arr},status=status.HTTP_200_OK)