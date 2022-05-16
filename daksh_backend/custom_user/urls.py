from django.urls import path, re_path
from . import views

urlpatterns = [
    path('users/', views.userview.as_view(), name='users_list'),
    path('name/', views.username.as_view(), name='username'),
    path('role/',views.UserRoleUpdateView.as_view()),
    path('getusers/',views.GetUserView.as_view()),
    path('approval/', views.userapproval.as_view(), name='approved users'),
    re_path('approval/(?P<username>.+)/$',
            views.userapprove.as_view(), name='approve users'),
]