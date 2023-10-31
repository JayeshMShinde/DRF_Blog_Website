from rest_framework.serializers import ModelSerializer
from .models import Post, BlogComment,UserProfile,Follower, Following
from django.utils import timezone
from rest_framework.serializers import ModelSerializer
from .models import Post
from rest_framework import serializers
from django.contrib.auth.models import User
# 
# ___Add, Update, Delete, Read The blog Post
class PostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = ('pk','title','slug', 'content','author','timestamp','like_user','dislikes')

    def create(self, validated_data):
        user = self.context['request'].user

        validated_data['author'] = user
        validated_data['timestamp'] = timezone.now()  
        post = Post.objects.create(**validated_data)
        return post

# ___Blog Comment 
class BlogCommentSerializer(ModelSerializer):
    class Meta:
        model=BlogComment
        fields = "__all__"


# ____User Registration
class UserSerializer(ModelSerializer):
    password = serializers.CharField(write_only = True)

    class Meta:
        model = User
        fields = ['id','username','password','email','first_name','last_name']



class FollowerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follower
        fields = '__all__'

class FollowingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Following
        fields = '__all__'


class  ProfileSerializer(serializers.ModelSerializer):
    # follower_count = serializers.SerializerMethodField() ,'follower-count'

    class Meta:
        model = UserProfile
        fields = ('id','user','image','bio','website')


# class followUserseializer(serializers.ModelSerializer):
#     class Meta:
#         model  = UserProfile
#         fields = ('id','userProfile_id','user_id')
# # class ProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Profile
#         fields = ('id', 'username', 'following', 'bio', 'website', 'groups', 'user_permissions')

