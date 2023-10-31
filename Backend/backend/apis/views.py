from django.shortcuts import render, HttpResponse, redirect
from .models import Post, BlogComment, PostLike, PostDislike, UserProfile, Following, Follower
from .serializer import PostSerializer, BlogCommentSerializer, UserSerializer , ProfileSerializer, FollowerSerializer, FollowingSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action,api_view
from rest_framework.response import Response
from rest_framework import permissions, generics
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.parsers import MultiPartParser, FormParser

# ____post add,update,delete,read operations
class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'slug'
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] 

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        if serializer.instance.author == self.request.user:
            serializer.save()
        else:
            return Response({'message': 'You are not the author of this post.'}, status=403)

# ____comment add,read operations
class BlogCommentViewSet(viewsets.ModelViewSet):
    queryset = BlogComment.objects.all()
    serializer_class = BlogCommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True, methods=['POST'])
    def post_comment(self, request, pk=None):
        if self.request.user.is_authenticated:
            comment = request.data.get('comment')
            user = self.request.user
            post = self.get_object()
            parent_sno = request.data.get('parent_sno', None)

            if parent_sno is None:
                comment_obj = BlogComment(comment=comment, user=user, post=post)
            else:
                parent = BlogComment.objects.get(sno=parent_sno)
                comment_obj = BlogComment(comment=comment, user=user, post=post, parent=parent)

            comment_obj.save()
            return Response({'message': 'Comment Posted Successfully'})
        else:
            return Response({'message': 'User is not authenticated'}, status=403)

# ___ refresh and access Tokent ViewSet
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# ___ User Registration viewset
class UserRegistrationViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']

            if User.objects.filter(username=username).exists():
                return Response({'message': 'Username already exists. Please choose another username.'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(
                username=username,
                password=serializer.validated_data['password'],
                email=serializer.validated_data.get('email', ''),
                first_name=serializer.validated_data.get('first_name', ''),
                last_name=serializer.validated_data.get('last_name', '')
            )
            return Response({'message': 'User registered Successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = ProfileSerializer
    parser_classes = (MultiPartParser, FormParser)

    @action(detail=True, methods=['get'], name='Get Profile Data')
    def get_profile_data(self, request, pk=None):
        try:
            profile = self.get_object()
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

    # @action(detail=True, methods=['post'])
    def create(self, request, *args, **kwargs):
        # Create a new profile
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['put'], name='Update Profile')
    def update_profile(self, request, pk=None):
        try:
            profile = self.get_object()
            if request.user == profile.user:
                serializer = self.get_serializer(profile, data=request.data, partial=True)

                if serializer.is_valid():
                    if 'image' in request.data:
                        profile.profileImage = request.data['image']
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"detail": "You do not have permission to update this profile."}, status=status.HTTP_403_FORBIDDEN)
        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        
# _____Follower User
class FollowerViewSet(viewsets.ModelViewSet):
    queryset = Follower.objects.all()
    serializer_class = FollowerSerializer

    def list(self, request, user_id=None):
        queryset = self.queryset.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
# ___Following USer
class FollowingViewSet(viewsets.ModelViewSet):
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer

    def list(self, request, user_id=None):
        queryset = self.queryset.all()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

        
# ___ Follow User
    serializer_class = FollowingSerializer

    def create(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        follower_id = request.data.get('follower_id')

        try:
            user = User.objects.get(id=user_id)
            follower = User.objects.get(id=follower_id)

            follower_obj, created = Follower.objects.get_or_create(user=user)
            if follower_obj.followers.filter(id=follower_id).exists():
                return Response({"message": "Already following"}, status=406)

            follower_obj.followers.add(follower)
            return Response({'detail': 'You are now following this user.'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class FollowUserView(generics.CreateAPIView):
    serializer_class = FollowingSerializer

    def create(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        following_id = request.data.get('following_id')

        try:
            user_to_follow = User.objects.get(id=user_id)
            following_user = User.objects.get(id=following_id)

            following_obj, created = Following.objects.get_or_create(user=user_to_follow)
            following_obj.following_user.add(following_user)
            
            user_follower, _ = Follower.objects.get_or_create(user=following_user)
            user_follower.followers.add(user_to_follow)

            return Response({'detail': 'You are now following this user.'}, status=status.HTTP_201_CREATED)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

class UnfollowUserView(generics.CreateAPIView):
    queryset = Following.objects.all()
    serializer_class = FollowingSerializer

    def create(self, request, *args, **kwargs):
        user_id = self.kwargs.get('user_id')
        following_id = request.data.get('following_id')

        try:
            user_to_unfollow = User.objects.get(id=user_id)
            following_user = User.objects.get(id=following_id)

            following_obj, _ = Following.objects.get_or_create(user=user_to_unfollow)
            following_obj.following_user.remove(following_user)

            user_follower, _ = Follower.objects.get_or_create(user=following_user)
            user_follower.followers.remove(user_to_unfollow)

            return Response({'detail': 'You have unfollowed this user.'}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token',
        '/api/token/refresh',
    ]

    return Response(routes)

# ___ Like on the Post
@api_view(['POST'])
def like_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        user = request.user

        if 'action' in request.data:
            action = request.data['action']
            if action == 'like':
                like, created = PostLike.objects.get_or_create(user=user, post=post)
                if created:
                    return Response({'message': 'Post liked successfully'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'You have already liked this post'}, status=status.HTTP_400_BAD_REQUEST)
            elif action == 'dislike':
                dislike, created = PostDislike.objects.get_or_create(user=user, post=post)
                if created:
                    return Response({'message': 'Post disliked successfully'}, status=status.HTTP_201_CREATED)
                else:
                    return Response({'message': 'You have already disliked this post'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'message': 'Invalid action'}, status=status.HTTP_400_BAD_REQUEST)

    except Post.DoesNotExist:
        return Response({'message': 'Post does not exist'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def get_like_dislike_count(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        like_count = PostLike.objects.filter(post=post).count()
        dislike_count = PostDislike.objects.filter(post=post).count()

        response_data = {
            'like_count':like_count,
            'dislike_count':dislike_count
        }

        return Response(response_data)
    except Post.DoesNotExist:
        return Response({'message': 'Post does not exist'}, status=status.HTTP_404_NOT_FOUND)

# ___ Reading post wise Comment
@api_view(['GET'])
def get_comments_for_post(request, post_id):
    try:
        post = Post.objects.get(pk=post_id)
        comment = BlogComment.objects.filter(post=post)
        serializer = BlogCommentSerializer(comment, many=True)
        return Response(serializer.data)
    except Post.DoesNotExist:
        return Response({'message':'Post does not exist'}, status=404)
    except BlogComment.DoesNotExist:
        return Response({'message':'No comments for this post'}, status=200)
