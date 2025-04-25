from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import Task
import datetime

class TaskTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tasks_url = '/api/tasks/'
        
        # Create test users
        self.user1 = User.objects.create_user(
            username='testuser1',
            password='password123',
            email='test1@example.com'
        )
        
        self.user2 = User.objects.create_user(
            username='testuser2',
            password='password123',
            email='test2@example.com'
        )
        
        # Create test tasks
        self.task1 = Task.objects.create(
            title='Test Task 1',
            description='Description for test task 1',
            status='pending',
            user=self.user1
        )
        
        self.task2 = Task.objects.create(
            title='Test Task 2',
            description='Description for test task 2',
            status='in_progress',
            user=self.user1
        )
        
        self.task3 = Task.objects.create(
            title='Test Task 3',
            description='Description for test task 3',
            status='completed',
            user=self.user2
        )
        
        # Task data for creation
        self.task_data = {
            'title': 'New Task',
            'description': 'Description for new task',
            'status': 'pending',
            'due_date': datetime.datetime.now().isoformat()
        }
        
        # Task data for update
        self.task_update_data = {
            'title': 'Updated Task',
            'description': 'Updated description',
            'status': 'in_progress'
        }
    
    def test_get_all_tasks_authenticated(self):
        """Test getting all tasks when authenticated"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.tasks_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # User1 should only see their 2 tasks
        self.assertEqual(len(response.data['results']), 2)
    
    def test_get_all_tasks_unauthenticated(self):
        """Test getting all tasks when unauthenticated"""
        response = self.client.get(self.tasks_url)
        # Django REST Framework uses 403 instead of 401 for authentication failures by default
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
    
    def test_create_task(self):
        """Test creating a task"""
        self.client.force_authenticate(user=self.user1)
        response = self.client.post(self.tasks_url, self.task_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.count(), 4)
        self.assertEqual(Task.objects.filter(user=self.user1).count(), 3)
        
    def test_create_task_unauthenticated(self):
        """Test creating a task when unauthenticated"""
        response = self.client.post(self.tasks_url, self.task_data, format='json')
        # Django REST Framework uses 403 instead of 401 for authentication failures by default
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_get_single_task_owner(self):
        """Test getting a single task as the owner"""
        self.client.force_authenticate(user=self.user1)
        # Update URL path to include task ID correctly
        response = self.client.get(f"{self.tasks_url}{self.task1.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.task1.id)
        
    def test_get_single_task_not_owner(self):
        """Test getting a single task as a non-owner"""
        self.client.force_authenticate(user=self.user2)
        # Update URL path to include task ID correctly
        response = self.client.get(f"{self.tasks_url}{self.task1.id}/")
        # Should return 404 since the task is not in this user's queryset
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_update_task_owner(self):
        """Test updating a task as the owner"""
        self.client.force_authenticate(user=self.user1)
        # Update URL path to include task ID correctly
        response = self.client.put(
            f"{self.tasks_url}{self.task1.id}/",
            self.task_update_data,
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Get the updated task from the database
        updated_task = Task.objects.get(id=self.task1.id)
        self.assertEqual(updated_task.title, 'Updated Task')
        self.assertEqual(updated_task.status, 'in_progress')
        
    def test_update_task_not_owner(self):
        """Test updating a task as a non-owner"""
        self.client.force_authenticate(user=self.user2)
        # Update URL path to include task ID correctly
        response = self.client.put(
            f"{self.tasks_url}{self.task1.id}/",
            self.task_update_data,
            format='json'
        )
        # Should return 404 since the task is not in this user's queryset
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
    def test_delete_task_owner(self):
        """Test deleting a task as the owner"""
        self.client.force_authenticate(user=self.user1)
        # Update URL path to include task ID correctly
        response = self.client.delete(f"{self.tasks_url}{self.task1.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Check that the task was actually deleted
        self.assertEqual(Task.objects.filter(id=self.task1.id).count(), 0)
        
    def test_delete_task_not_owner(self):
        """Test deleting a task as a non-owner"""
        self.client.force_authenticate(user=self.user2)
        # Update URL path to include task ID correctly
        response = self.client.delete(f"{self.tasks_url}{self.task1.id}/")
        # Should return 404 since the task is not in this user's queryset
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Check that the task was not deleted
        self.assertEqual(Task.objects.filter(id=self.task1.id).count(), 1)
