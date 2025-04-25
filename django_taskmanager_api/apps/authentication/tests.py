from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('authentication:register')
        self.login_url = reverse('authentication:login')
        self.logout_url = reverse('authentication:logout')
        self.profile_url = reverse('authentication:profile')
        
        # Create a test user
        self.test_user = User.objects.create_user(
            username='testuser',
            password='testpassword123',
            email='test@example.com',
            first_name='Test',
            last_name='User'
        )
        
        # Valid registration data
        self.valid_registration_data = {
            'username': 'newuser',
            'password': 'newpassword123',
            'password2': 'newpassword123',
            'email': 'new@example.com',
            'first_name': 'New',
            'last_name': 'User'
        }
        
        # Invalid registration data (passwords don't match)
        self.invalid_registration_data = {
            'username': 'baduser',
            'password': 'password123',
            'password2': 'differentpassword',
            'email': 'bad@example.com',
            'first_name': 'Bad',
            'last_name': 'User'
        }
        
        # Login data
        self.valid_login_data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        
        self.invalid_login_data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
    
    def test_user_registration_success(self):
        """Test successful user registration"""
        response = self.client.post(
            self.register_url, 
            self.valid_registration_data, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)  # Our test user + new user
        
    def test_user_registration_invalid_data(self):
        """Test registration with invalid data (passwords don't match)"""
        response = self.client.post(
            self.register_url, 
            self.invalid_registration_data, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(User.objects.count(), 1)  # Only our test user exists
        
    def test_user_login_success(self):
        """Test successful login"""
        response = self.client.post(
            self.login_url, 
            self.valid_login_data, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('user' in response.data)
        
    def test_user_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = self.client.post(
            self.login_url, 
            self.invalid_login_data, 
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_user_profile_authenticated(self):
        """Test accessing profile when authenticated"""
        self.client.force_authenticate(user=self.test_user)
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], self.test_user.username)
        
    def test_user_profile_unauthenticated(self):
        """Test accessing profile when not authenticated"""
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_user_logout(self):
        """Test user logout"""
        self.client.force_authenticate(user=self.test_user)
        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
