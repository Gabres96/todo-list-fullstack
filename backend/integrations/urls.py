from django.urls import path
from .views import DailyAdviceView

urlpatterns = [
    path('daily-advice/', DailyAdviceView.as_view(), name='daily-advice'),
]