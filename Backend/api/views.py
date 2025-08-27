from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions,status
from .serializers import CommentsSerializer,UserUpdateSerializer,RegisterSerializer,LoginSerializer,addPostSerializer,allPostsSerializer,friendsSerializer,UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser,Post,Likes,Friends,Comments
from rest_framework_simplejwt.authentication import JWTAuthentication
class UserRegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                "message": "User Created",
                "data": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class userLoginView(APIView):
   def post(self,request):
       data=request.data
       username=data.get('username')
       password=data.get('password')
       user = authenticate(username=username, password=password)
       if user:
           user_data=CustomUser.objects.get(username=username)
           serializer=LoginSerializer(user_data)
           refresh=RefreshToken.for_user(user)
           return Response({
               "access_token":str(refresh.access_token),
               "refresh_token":str(refresh),
               "data":serializer.data
           },status=status.HTTP_200_OK)
       return Response({"error":"invalid credentials"},status=status.HTTP_400_BAD_REQUEST)

class addPost(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[permissions.IsAuthenticated]
    def post(self,request):
        serializer=addPostSerializer(data=request.data,context={'request':request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Successfully Posted"},status=status.HTTP_201_CREATED)
        return Response({"error":"Not Success"},status=status.HTTP_400_BAD_REQUEST)

from django.db.models import Exists, OuterRef

class allPosts(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        # Annotate whether this user has liked each post
        posts = Post.objects.annotate(
            liked=Exists(
                Likes.objects.filter(user=user, post=OuterRef("pk"))
            )
        ).order_by("liked", "-created_at")  # Unliked first, then newest

        serializer = allPostsSerializer(posts, many=True, context={'request': request})
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)
class Likedpostview(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes=[permissions.IsAuthenticated]
    def post(self,request,id):
        post=Post.objects.get(id=id)
        
       # Check if already liked
        liked = Likes.objects.filter(post=post, user=request.user).exists()
        if liked:
            Likes.objects.filter(post=post, user=request.user).delete()
            no_of_likes=Likes.objects.filter(post=post).count()
            return Response({"message": "Unliked","no_of_likes":no_of_likes}, status=status.HTTP_200_OK)

        # Create like
        Likes.objects.create(post=post, user=request.user)
        no_of_likes=Likes.objects.filter(post=post).count()
        return Response({"message": "Liked","no_of_likes":no_of_likes}, status=status.HTTP_200_OK)
    
class friendsView(APIView):
        authentication_classes = [JWTAuthentication]
        permission_classes=[permissions.IsAuthenticated]
        def get(self,request):
            current_user=request.user
  # Get all users that current user is following
            following_users = Friends.objects.filter(follower=current_user).values_list('followed', flat=True)

        # Get all users excluding the ones current user follows and themselves
            users_to_follow = CustomUser.objects.exclude(id__in=following_users).exclude(id=current_user.id)

            serializer=friendsSerializer(users_to_follow,many=True,context={'request':request})

            return Response({"message":"fetched users to be followed","data":serializer.data},status=status.HTTP_200_OK)
            # return Response({"error":"unable to fetch"},status=status.HTTP_400_BAD_REQUEST)

class addFriend(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated] 
    def post(self,request,id):
        follower=request.user
        followed=CustomUser.objects.get(id=id)

        if(Friends.objects.filter(follower=follower,followed=followed).exists()):
            Friends.objects.get(follower=follower,followed=followed).delete()
            return Response({"message":"deleted"},status=status.HTTP_200_OK)
        Friends.objects.create(follower=follower,followed=followed)
        return Response({"message":"created"},status=status.HTTP_200_OK)


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated] 
    def get(self, request, id):
        try:
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UserProfileSerializer(user, context={'request': request})
        return Response({"message": "success", "data": serializer.data}, status=status.HTTP_200_OK)

class FollowersView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]  
    def get(self, request, id):
        try:
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all users who follow this user
        follower_ids = Friends.objects.filter(followed=user).values_list('follower', flat=True)
        followers = CustomUser.objects.filter(id__in=follower_ids)

        serializer = friendsSerializer(followers, many=True, context={'request': request})
        return Response({"message": "Fetched followers", "data": serializer.data}, status=status.HTTP_200_OK)
class FollowingView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated] 
    def get(self, request, id):
        try:
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # Get all users this user follows
        following_ids = Friends.objects.filter(follower=user).values_list('followed', flat=True)
        following = CustomUser.objects.filter(id__in=following_ids)

        serializer = friendsSerializer(following, many=True, context={'request': request})
        return Response({"message": "Fetched following", "data": serializer.data}, status=status.HTTP_200_OK)

class EditProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user   # the logged-in user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            # ✅ Send back all updated details
            return Response({
                "message": "Profile updated successfully",
                "data": serializer.data
            }, status=status.HTTP_200_OK)
        return Response({"error":"unable to update"}, status=status.HTTP_400_BAD_REQUEST)
    


class CommentsView(APIView):
    def post(self, request, id):
        user = request.user
        post = Post.objects.get(id=id)
        text = request.data.get("text")   # ✅ works with JSON body

        if not text:
            return Response({"error": "Text is required"}, status=status.HTTP_400_BAD_REQUEST)

        comment = Comments.objects.create(user=user, post=post, text=text)
        serializer = CommentsSerializer(comment)

        return Response(
            {"message": "Comment added", "data": serializer.data},
            status=status.HTTP_201_CREATED,
        )

    def get(self, request, id):
        post_corresponding = Post.objects.get(id=id)
        comments = Comments.objects.filter(post=post_corresponding).order_by("-id")
        serializer = CommentsSerializer(comments, many=True)
        return Response(
            {"message": "Comments Retrieved", "data": serializer.data},
            status=status.HTTP_200_OK,
        )

class DeletePostView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, id):
        try:
            post = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # Only allow the author to delete
        if post.author != request.user:
            return Response({"error": "You can only delete your own posts"}, status=status.HTTP_403_FORBIDDEN)

        post.delete()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)