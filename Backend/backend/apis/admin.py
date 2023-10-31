from django.contrib import admin
from .models import Post, BlogComment,PostDislike,PostLike, UserProfile, Follower, Following

admin.site.register(Post)
admin.site.register(BlogComment)
admin.site.register(PostLike)
admin.site.register(PostDislike)
admin.site.register(UserProfile)
# admin.site.register(Following)?
