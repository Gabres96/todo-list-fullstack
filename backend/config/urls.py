from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.admin_site.urls if hasattr(admin, 'admin_site') else admin.site.urls),
    
    path('api/users/', include('users.urls')),
    path('api/tasks/', include('tasks.urls')),
    
    path('api/integrations/', include('integrations.urls')),
]