#!/usr/bin/env python
import os
import sys
import argparse
import colorama
from colorama import Fore, Style

def main():
    # Initialize colorama for cross-platform colored terminal output
    colorama.init()
    
    # Create argument parser
    parser = argparse.ArgumentParser(description='Run Django Task Manager API tests')
    parser.add_argument('--app', choices=['all', 'auth', 'tasks'], default='all',
                      help='Which app to test (default: all)')
    parser.add_argument('--verbosity', type=int, choices=[0, 1, 2, 3], default=1,
                      help='Verbosity level (0-3, default: 1)')
    parser.add_argument('--failfast', action='store_true',
                      help='Stop tests on first failure')
    
    args = parser.parse_args()
    
    # Set Django settings
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "django_taskmanager_api.settings")
    from django.core.management import execute_from_command_line
    
    # Prepare test command
    test_command = ["manage.py", "test", "--verbosity={}".format(args.verbosity)]
    
    # Add failfast if requested
    if args.failfast:
        test_command.append("--failfast")
    
    # Determine which apps to test
    if args.app == 'all':
        test_command.extend(["apps.authentication", "apps.tasks"])
        test_name = "all apps"
    elif args.app == 'auth':
        test_command.append("apps.authentication")
        test_name = "authentication app"
    else:  # tasks
        test_command.append("apps.tasks")
        test_name = "tasks app"
    
    # Print header
    print(f"\n{Fore.CYAN}===============================================")
    print(f"  Django Task Manager API - Running {test_name} tests")
    print(f"==============================================={Style.RESET_ALL}\n")
    
    try:
        # Execute test command
        execute_from_command_line(test_command)
        
        # If we get here, all tests passed
        print(f"\n{Fore.GREEN}✓ All tests passed successfully!{Style.RESET_ALL}\n")
        
    except SystemExit as e:
        # Test command exited with error
        if e.code != 0:
            print(f"\n{Fore.RED}✗ Some tests failed. See above for details.{Style.RESET_ALL}\n")
            sys.exit(e.code)

if __name__ == "__main__":
    main() 