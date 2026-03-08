from rest_framework import serializers
from .models import User, Appointment, Doctor
class RegisterSerializer(serializers.Serializer):

    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    role = serializers.CharField()

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )

        user.role = validated_data["role"]
        user.save()

        return user


class AppointmentSerializer(serializers.ModelSerializer):

    doctor_name = serializers.CharField(source="doctor.user.username", read_only=True)
    patient_name = serializers.CharField(source="patient.username", read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"
        read_only_fields = ["patient"]


class DoctorSerializer(serializers.ModelSerializer):

    class Meta:
        model = Doctor
        fields = ["id", "user", "specialization"]