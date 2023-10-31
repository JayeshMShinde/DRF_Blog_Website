from django.db import models
from django.contrib.auth.models import User,Group,Permission
from django.utils.timezone import now
from django.contrib.auth.models import AbstractUser
   

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # followers = models.ManyToManyField(User, related_name="follows", blank=True, symmetrical=False)
    bio = models.TextField(max_length=200, blank=True, default="Bio")
    website = models.URLField(max_length=200, blank=True)
    image = models.ImageField(default='default.png',upload_to='profile_pics/')

    def __str__(self):
        return self.user.username
    

class Post(models.Model):
    sno = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    slug = models.CharField(max_length=100)
    timestamp= models.DateTimeField(default=now)
    content = models.TextField()
    like_user = models.ManyToManyField(User, through='PostLike' ,related_name='liked_post')
    dislikes = models.ManyToManyField(User, through='PostDislike', related_name='disliked_posts')


    def __str__(self) -> str:
        return self.title + " " + self.author


class BlogComment(models.Model):
    sno = models.AutoField(primary_key=True)
    comment=models.TextField()
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    post=models.ForeignKey(Post, on_delete=models.CASCADE)
    parent=models.ForeignKey('self',on_delete=models.CASCADE, null=True )
    timestamp= models.DateTimeField(default=now)

    def __str__(self):
        return self.comment[0:13] + "..." + "by" + " " + self.user.username
    

class PostLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class PostDislike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

class Follower(models.Model):
    user = models.OneToOneField(User,related_name="followers", verbose_name=("User"), on_delete=models.CASCADE)
    followers = models.ManyToManyField(User, verbose_name=("Followers"),related_name='follows')

class Following(models.Model):
    user = models.OneToOneField(User, related_name="following",unique=False, verbose_name=("User"), on_delete=models.CASCADE)
    following_user = models.ManyToManyField(User, verbose_name=("Following"), related_name='following_user')

    
