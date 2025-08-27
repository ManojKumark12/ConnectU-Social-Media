from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import DeletePostView,CommentsView,EditProfileView,FollowersView,FollowingView,UserRegisterView,userLoginView,addPost,allPosts,Likedpostview,friendsView,addFriend,UserProfileView
urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   path('register/', UserRegisterView.as_view(), name='register'),
   path('login/',userLoginView.as_view(),name="login"),
   path('addpost/',addPost.as_view(),name="addpost"),
   path('allfeeds/',allPosts.as_view(),name="allposts"),
   path('liked/<int:id>',Likedpostview.as_view()),
   path('allusers/',friendsView.as_view()),
   path('addFriend/<int:id>',addFriend.as_view()),
   path('userProfileview/<int:id>/',UserProfileView.as_view()),
   path('followers/<int:id>',FollowersView.as_view()),
   path('following/<int:id>',FollowingView.as_view()),
   path('editprofile/',EditProfileView.as_view()),
   path('comment/<int:id>/',CommentsView.as_view()),
   path("deletePost/<int:id>/", DeletePostView.as_view(), name="delete-post"),
]
