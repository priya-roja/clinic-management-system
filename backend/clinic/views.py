from .models import User
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.core.mail import send_mail
from django.conf import settings
from .models import Availability

from .models import Appointment
from .serializers import RegisterSerializer, AppointmentSerializer

from .models import Doctor
from .serializers import DoctorSerializer
from django.shortcuts import render

def home(request):
    return render(request, "home.html")
@api_view(["POST"])
def register(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()
        return Response({"message": "User registered successfully"})

    print(serializer.errors)   # DEBUG LINE
    return Response(serializer.errors, status=400)


@api_view(['POST'])
def login(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(request, username=username, password=password)

    if user is None:
        return Response({"message": "Invalid username or password"}, status=400)

    token, created = Token.objects.get_or_create(user=user)

    return Response({
        "token": token.key,
        "role": user.role,
        "username": user.username
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):

    user = request.user

    return Response({
        "username": user.username,
        "email": user.email,
        "role":user.role
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):

    user = request.user

    doctor = Doctor.objects.filter(user=user).first()

    data = {
        "username": user.username,
        "email": user.email,
        "role": user.role,
        "specialization": doctor.specialization if doctor else "",
        "experience": doctor.experience if doctor else 0
    }

    return Response(data)

@api_view(['GET'])
def doctors(request):

    doctors = Doctor.objects.filter(user__role="doctor")

    data = []

    for doc in doctors:
        data.append({
            "id": doc.id,
            "name": doc.user.username,
            "specialization": doc.specialization
        })

    return Response(data)


@api_view(['PATCH'])
def update_doctor_profile(request, id):

    doctor = Doctor.objects.get(id=id)

    doctor.specialization = request.data.get("specialization", doctor.specialization)
    doctor.experience = request.data.get("experience", doctor.experience)

    doctor.save()

    return Response({
        "message": "Profile updated successfully"
    })

from datetime import datetime

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_patient_appointment(request):

    doctor_id = request.data.get("doctor")
    date = request.data.get("date")
    time = request.data.get("time")
    reason = request.data.get("reason")

    doctor = Doctor.objects.filter(id=doctor_id).first()

    if not doctor:
        return Response({"error": "Doctor not found"}, status=400)

    availability = Availability.objects.filter(doctor=doctor.user).first()

    if not availability:
        return Response({"error": "Doctor availability not set"}, status=400)
    appointment_date = datetime.strptime(date, "%Y-%m-%d")
    
    day = appointment_date.strftime("%A")
    appointment_time = datetime.strptime(time, "%H:%M").time()

    # Day check
    if day == "Monday" and not availability.monday:
        return Response({"error": "Doctor not available on Monday"}, status=400)

    if day == "Tuesday" and not availability.tuesday:
        return Response({"error": "Doctor not available on Tuesday"}, status=400)

    if day == "Wednesday" and not availability.wednesday:
        return Response({"error": "Doctor not available on Wednesday"}, status=400)

    if day == "Thursday" and not availability.thursday:
        return Response({"error": "Doctor not available on Thursday"}, status=400)

    if day == "Friday" and not availability.friday:
        return Response({"error": "Doctor not available on Friday"}, status=400)

    if day == "Saturday" and not availability.saturday:
        return Response({"error": "Doctor not available on Saturday"}, status=400)

    if day == "Sunday" and not availability.sunday:
        return Response({"error": "Doctor not available on Sunday"}, status=400)

    # Time check
    appointment_time = datetime.strptime(time, "%H:%M").time()

    if appointment_time < availability.start_time or appointment_time > availability.end_time:
        return Response({"error": "Doctor not available at this time"}, status=400)

    appointment = Appointment.objects.create(
        patient=request.user,
        doctor=doctor,
        date=date,
        time=time,
        reason=reason
    )

    return Response({"message": "Appointment created successfully"})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def patient_appointments(request):

    appointments = Appointment.objects.filter(patient=request.user)

    serializer = AppointmentSerializer(appointments, many=True)

    return Response(serializer.data)   


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def doctor_appointments(request):

    doctor = Doctor.objects.filter(user=request.user).first()

    appointments = Appointment.objects.filter(
        doctor=doctor
    ).exclude(status="Cancelled")

    serializer = AppointmentSerializer(appointments, many=True)

    return Response(serializer.data)






@api_view(['GET'])
def doctor_list(request):

    doctors = Doctor.objects.filter(user__role="doctor")

    serializer = DoctorSerializer(doctors, many=True)

    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_appointment(request):

    serializer = AppointmentSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(patient=request.user)
        return Response(serializer.data)

    return Response(serializer.errors)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_appointment_status(request, id):

    appointment = Appointment.objects.get(id=id)

    status = request.data.get("status")

    appointment.status = status
    appointment.save()

    return Response({"message": "Status updated"})
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, id):

    try:
        appointment = Appointment.objects.get(id=id, patient=request.user)

        appointment.status = "Cancelled"
        appointment.save()

        return Response({"message": "Appointment cancelled"})

    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def doctor_profile(request):
    doctor = request.user

    data = {
        "name": doctor.username,
        "email": doctor.email,
        "role": doctor.role,
        "specialization":doctor.specialization,
        "experience":doctor.experience
    }

    return Response(data)
    

@api_view(['GET'])
def admin_appointments(request):

    appointments = Appointment.objects.all().order_by('-created_at')

    data = []

    for a in appointments:
        data.append({
            "id": a.id,
            "patient": a.patient.username,
            "doctor": a.doctor.username,
            "date": a.date,
            "time": a.time,
            "status": a.status
        })

    return Response(data)



@api_view(['GET'])
def admin_stats(request):

    total_doctors = Doctor.objects.count()
    total_patients = User.objects.filter(groups__name="PATIENT").count()
    total_appointments = Appointment.objects.count()
    pending = Appointment.objects.filter(status="PENDING").count()

    return Response({
        "doctors": total_doctors,
        "patients": total_patients,
        "appointments": total_appointments,
        "pending": pending
    })

@api_view(['GET'])
def doctor_availability(request, doctor_id):

    slots = Availability.objects.filter(doctor_id=doctor_id)

    data = []

    for s in slots:
        data.append({
            "day": s.day,
            "start": s.start_time,
            "end": s.end_time
        })

    return Response(data)

@api_view(["GET"])
def admin_stats(request):

    doctors = Doctor.objects.count()
    patients = User.objects.count()
    appointments = Appointment.objects.count()
    pending = Appointment.objects.filter(status="PENDING").count()

    return Response({
        "total_doctors": doctors,
        "total_patients": patients,
        "total_appointments": appointments,
        "pending_appointments": pending
    })




@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def cancel_appointment(request, id):

    try:
        appointment = Appointment.objects.get(id=id, patient=request.user)

        appointment.status = "Cancelled"
        appointment.save()

        return Response({"message": "Appointment cancelled"})

    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)
    


from django.contrib.auth.hashers import check_password

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):

    user = request.user

    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")

    if not check_password(old_password, user.password):
        return Response({"error": "Old password incorrect"}, status=400)

    user.set_password(new_password)
    user.save()

    return Response({"message": "Password updated successfully"})    



@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def cancel_patient_appointment(request, id):

    try:
        appointment = Appointment.objects.get(id=id, patient=request.user)

        appointment.status = "Cancelled"
        appointment.save()

        return Response({"message": "Appointment cancelled successfully"})

    except Appointment.DoesNotExist:
        return Response({"error": "Appointment not found"}, status=404)


