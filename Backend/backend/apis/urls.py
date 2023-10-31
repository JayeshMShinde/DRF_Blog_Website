from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'post',views.PostViewSet)
router.register(r'comment',views.BlogCommentViewSet)
router.register(r'register',views.UserRegistrationViewSet)
router.register(r'profile',views.UserProfileViewSet)
router.register(r'followers', views.FollowerViewSet, basename='follower')
router.register(r'following', views.FollowingViewSet, basename='following')

urlpatterns = [
    path('',include(router.urls)),
    path('blog-like/<int:post_id>/', views.like_post, name="like_post"),
    path('blog-like-count/<int:post_id>/', views.get_like_dislike_count, name="get_like_dislike_count"),
    path('blog-wise-comment/<int:post_id>/', views.get_comments_for_post, name="get_comments"),

    path('follow/<int:user_id>/', views.FollowUserView.as_view(), name='follow-user'),
    path('unfollow/<int:user_id>/', views.UnfollowUserView.as_view(), name='unfollow-user'),

    path('token/',views.MyTokenObtainPairView.as_view(), name='tokenObtainPair'),
    path('token/refresh/',TokenRefreshView.as_view(), name='refreshToken')

]  