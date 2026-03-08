from django.db import models
from django.contrib.auth.models import AbstractUser



class User(AbstractUser):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('doctor', 'Doctor'),
        ('patient', 'Patient'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    specialization = models.CharField(max_length=100, blank=True, null=True)
    experience = models.IntegerField(blank=True, null=True)


    


class Doctor(models.Model):

    user = models.OneToOneField(User, on_delete=models.CASCADE)

    specialization = models.CharField(max_length=100)

    experience = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username


class Appointment(models.Model):

    patient = models.ForeignKey(User, on_delete=models.CASCADE)

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    date = models.DateField()

    time = models.TimeField()

    reason = models.TextField()

    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Approved', 'Approved'),
        ('Rejected', 'Rejected'),
        ('Cancelled', 'Cancelled'),
    ]

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')

    created_at = models.DateTimeField(auto_now_add=True)


class Availability(models.Model):

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)

    day = models.CharField(max_length=20)

    start_time = models.TimeField()

    end_time = models.TimeField()

    def __str__(self):
        return f"{self.doctor} - {self.day}"
    

class Availability(models.Model):

    doctor = models.ForeignKey(User, on_delete=models.CASCADE)

    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday=models.BooleanField(default=False)
    sunday=models.BooleanField(default=False)

    start_time = models.TimeField()
    end_time = models.TimeField()    