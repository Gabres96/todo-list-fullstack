from django.contrib import admin
from django.urls import include, path


urlpatterns = [
    path('admin/', admin.site.urls),

     path('api/users/', include('users.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/categories/', include('categories.urls')),
]