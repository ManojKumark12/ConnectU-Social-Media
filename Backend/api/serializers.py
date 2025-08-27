from rest_framework import serializers
from .models import CustomUser,Post,Likes,Friends,Comments
import cloudinary.uploader
class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "password2", "profile_photo", "bio"]
        extra_kwargs = {"profile_photo": {"required": False}, "bio": {"required": False}}

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match")
        return data

    def create(self, validated_data):
        profile_photo = validated_data.pop("profile_photo", None)
        
        cloudinary_url = None
        if profile_photo:
            upload_result = cloudinary.uploader.upload(profile_photo, folder="profile")
            cloudinary_url = upload_result.get("secure_url")
        return CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            profile_photo=cloudinary_url,
            bio=validated_data.get('bio', "")
        )
class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields="__all__"
class addPostSerializer(serializers.ModelSerializer):
    class Meta:
        model=Post
        fields=["caption","image","text"]
    def create(self,validated_data):
        user=self.context['request'].user

        photo=validated_data["image"]
        upload_result = cloudinary.uploader.upload(photo, folder="posts")
        cloudinary_url = upload_result.get("secure_url")
        
        validated_data.pop("image")
        return Post.objects.create(author=user,**validated_data,image=cloudinary_url)
class UserSerializerforPosts(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "profile_photo", "bio"]  # only safe fields
class allPostsSerializer(serializers.ModelSerializer):
    author =UserSerializerforPosts(read_only=True)
    likes_count = serializers.SerializerMethodField()
    liked_or_not=serializers.SerializerMethodField()
    class Meta:
        model=Post
        fields=["caption","image","text","author","created_at","id","likes_count","liked_or_not"]
    def get_likes_count(self, obj):
        return Likes.objects.filter(post=obj).count()
    def get_liked_or_not(self,obj):
        user=self.context["request"].user
        if user and user.is_authenticated:
            return Likes.objects.filter(user=user, post=obj).exists()
        else:
            return False


class friendsSerializer(serializers.ModelSerializer):
    no_of_posts= serializers.SerializerMethodField()
    no_of_followers=serializers.SerializerMethodField()
    no_of_following=serializers.SerializerMethodField()
    is_following=serializers.SerializerMethodField()
    class Meta:
        model=CustomUser
        fields=["username","profile_photo","id","bio","no_of_posts","no_of_followers","no_of_following","is_following"]
    def get_no_of_posts(self,obj):
        return Post.objects.filter(author=obj).count()
    def get_no_of_followers(self,obj):
        return Friends.objects.filter(followed=obj).count()
    def get_no_of_following(self,obj):
        return Friends.objects.filter(follower=obj).count()
    def get_is_following(self,obj):
        user=self.context['request'].user
        return Friends.objects.filter(follower=user,followed=obj).exists()
        
class UserProfilePostSerializer(serializers.ModelSerializer):
    no_of_likes = serializers.SerializerMethodField()
    liked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ["id", "caption", "image", "text", "created_at", "no_of_likes", "liked_by_me"]

    def get_no_of_likes(self, obj):
        return Likes.objects.filter(post=obj).count()

    def get_liked_by_me(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return Likes.objects.filter(post=obj, user=request.user).exists()
        return False


class UserProfileSerializer(serializers.ModelSerializer):
    posts = UserProfilePostSerializer(many=True, read_only=True)  # ✅ uses related_name="posts"
    no_of_followers = serializers.SerializerMethodField()
    no_of_following = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ["id","username", "email", "profile_photo", "bio", "posts", "no_of_followers","is_following", "no_of_following"]

    def get_no_of_followers(self, obj):
        return Friends.objects.filter(followed=obj).count()

    def get_no_of_following(self, obj):
        return Friends.objects.filter(follower=obj).count()

    
    def get_is_following(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            # check if current logged-in user follows `obj`
            return Friends.objects.filter(follower=request.user, followed=obj).exists()
        return False


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "profile_photo", "bio"]
        extra_kwargs = {
            "profile_photo": {"required": False, "allow_null": True},
            "bio": {"required": False, "allow_blank": True},
        }

    def update(self, instance, validated_data):
        # Handle profile photo upload if provided
        profile_photo = validated_data.get("profile_photo")
        if profile_photo:
            upload_result = cloudinary.uploader.upload(profile_photo, folder="profile")
            instance.profile_photo = upload_result.get("secure_url")

        # Update other fields
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.bio = validated_data.get("bio", instance.bio)
        
        instance.save()
        return instance

class CommentsSerializer(serializers.ModelSerializer):
    user=UserSerializerforPosts(read_only=True)
    class Meta:
        model=Comments
        fields=["user","text","id"]
    # def create(self,validated_data):

