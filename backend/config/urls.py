from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.admin_site.urls if hasattr(admin, 'admin_site') else admin.site.urls),
    
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('api/users/', include('users.urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/integrations/', include('integrations.urls')),
    path('api/categories/', include('categories.urls')),
]