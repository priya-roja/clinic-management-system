from django.urls import path
from .views import register, login, profile, doctors, create_patient_appointment, patient_appointments, doctor_appointments,update_appointment_status
from clinic.views import home
from .views import doctor_list
from .views import create_appointment, cancel_appointment, doctor_profile, update_doctor_profile, admin_appointments, admin_stats, doctor_availability
from .import views


urlpatterns = [
    
    path("doctors/<int:doctor_id>/availability/", doctor_availability),
    path("admin/stats/", admin_stats),

    path("register/", register),
    path("login/", login),
    path("profile/", profile),

    path("doctors/", doctors),

    path("patient/appointments/", create_patient_appointment),
    path("patient/appointments/list/", patient_appointments),

    path("doctor/appointments/", doctor_appointments),
    path('doctors/', doctor_list),
    
    path('doctors/', doctor_list),

    path('appointments/create/', create_appointment),

    path('appointments/my/', patient_appointments),
    path('doctor/appointments/<int:id>/', update_appointment_status),
    path('', home),
    
    path("doctors/<int:pk>/profile/",doctor_profile),
    path("doctors/<int:id>/update/", update_doctor_profile),
    path("admin/appointments/", admin_appointments),
    path("change-password/", views.change_password),
    path("patient/appointments/<int:id>/cancel/",views.cancel_patient_appointment),
    path("patient/appointments/<int:id>/cancel/",views.cancel_appointment),
    path("profile/", views.get_profile),
    path("doctor/profile/", views.doctor_profile),


]


