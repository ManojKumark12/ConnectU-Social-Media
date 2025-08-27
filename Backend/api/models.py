from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    profile_photo = models.ImageField(upload_to='socialmedia/', null=True, blank=True)
    bio = models.TextField(blank=True)
class Post(models.Model):
    caption = models.CharField(max_length=255)
    image = models.ImageField(upload_to="posts/")
    text = models.TextField()
    author = models.ForeignKey(
        CustomUser,               # related model
        on_delete=models.CASCADE,  # what happens if the user is deleted
        related_name="posts"       # reverse lookup name
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.caption} by {self.author.username}"
class Likes(models.Model):
    post=models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="likes"
    )
    user=models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE
    )
class Friends(models.Model):
    follower = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="following"   # user.following.all()
    )
    followed = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="followers"   # user.followers.all()
    )
# related_name = the name you use to access the relationship from the other side.
    class Meta:
        unique_together = ("follower", "followed")  # prevent duplicates

    def __str__(self):
        return f"{self.follower.username} → {self.followed.username}"

class Comments(models.Model):
    post=models.ForeignKey(
               Post,
               on_delete=models.CASCADE,
        related_name="post_comments" 
    )
    user=models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="my_comments" 
    )
    text=models.CharField(max_length=30)